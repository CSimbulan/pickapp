/*
Controllers for user authentication.
*/

const User2 = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandling");
const mailgun = require("mailgun-js");
const DOMAIN = "mg.mewtwo.sale";
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

/*
Register controller. Check if email is already registered.
If not, sign a token using the given name, email and password.
Send an email using mailgun api with activation link.
*/
exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User2.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          errors: "Email is taken",
        });
      }

      const token = jwt.sign(
        {
          name,
          email,
          password,
        },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: "5m",
        }
      );
      const emailData = {
        from: "noreply@pickapp.fit",
        to: email,
        subject: "Account Activation Link",
        html:
          `<h1>Please use the following to activate your account:</h1>` +
          `<p>${process.env.CLIENT_URL}/users/activate/${token}</p><hr><p>This link will expire in five minutes.</p><p>${process.env.CLIENT_URL}</p>`,
      };

      mg.messages().send(emailData, function (error, body) {
        console.log(body);
        return res.json({
          message: "Email has been sent. Please activate your account.",
        });
      });
    });
  }
};

/*
Activation controller. Verify the token in the activation link.
Decode the token and create a user with the email name and password.
Save the user to the database.
*/
exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log("Activation error");
        return res.status(401).json({
          errors: "Expired link. Signup again",
        });
      } else {
        const { name, email, password } = jwt.decode(token);

        const user = new User2({
          name,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            console.log("Save error", errorHandler(err));
            return res.status(401).json({
              errors: "Expired link or account already activated.",
            });
          } else {
            return res.json({
              success: true,
              message: user,
              message: "Signup success. Proceed to login.",
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

/*
Login controller. Check if the fields are valid.
Then check if a user exists with the email.
If user exists, generate a token with the user id and log in.
*/
exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User2.findOne({
      email,
    }).select('+hashed_password').exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: "Email and password do not match",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    });
  }
};

/*
Admin middleware
*/
/*
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // req.user._id
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({
    _id: req.user._id,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied.",
      });
    }

    req.profile = user;
    next();
  });
};
*/

/*
Forget password controller. Check if user with given email exists.
If user exists, sign a token with the user id and send an email with password reset link.
Add the password reset link to the user's data.
*/
exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // Check if a user exists with the given email, throw an error if it doesn't.
    User2.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        // If a user exists, create a token and send an email to reset the password.
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
        );

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Password Reset Link`,
          html: `
                    <h1>Please use the following link within 10 minutes to reset your password:</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log("RESET PASSWORD LINK ERROR", err);
              return res.status(400).json({
                error:
                  "Database connection error on user password forgot request",
              });
            } else {
              mg.messages()
                .send(emailData)
                .then((sent) => {
                  // console.log('SIGNUP EMAIL SENT', sent)
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                  });
                })
                .catch((err) => {
                  // console.log('SIGNUP EMAIL SENT ERROR', err)
                  return res.json({
                    message: err.message,
                  });
                });
            }
          }
        );
      }
    );
  }
};

/*
Password reset controller. If the passwords are valid decode the token from the reset link.
Find user in the database with the reset link, then update the password.
*/
exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
        err,
        decoded
      ) {
        if (err) {
          return res.status(400).json({
            errors: "Expired link. Try again",
          });
        }

        User2.findOne({
          resetPasswordLink,
        }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              errors:
                "Something went wrong. Invalid link or password already reset.",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Error resetting user password!",
              });
            }
            res.json({
              message: "Password successfully changed!",
            });
          });
        });
      });
    }
  }
};

/*
Google login controller. Check if user exists with gmail used.
If user exists, sign a token with the user id and login.
If user doesn't exist, create a new one using the email and the gmail account name.
Generate a password with the email and secret environment variable.
*/
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

exports.googleController = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      // Check if email is verified
      if (email_verified) {
        User2.findOne({ email }).exec((err, user) => {
          // Check if user with this email already exists
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            // If user does not exists, create a new one with a generated password
            let password = email + process.env.JWT_SECRET;
            user = new User2({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};

/*
Facebook login controller. Check if user exists with email linked to the facebook account used.
If user exists, sign a token with the user id and login.
If user doesn't exist, create a new one using the email and the facebook account name.
Generate a password with the email and secret environment variable.
*/
exports.facebookController = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        const { email, name } = response;
        User2.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User2({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};
