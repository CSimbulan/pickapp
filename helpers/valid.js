const { check } = require("express-validator");

/*
Check if all the fields are valid before registering an account.
Name field must not be empty and from 4 to 16 characters long.
Check if email address is valid.
Password should be minimum 6 characters and contain a number.
*/
exports.validRegister = [
  check("name", "Name is required")
    .notEmpty()
    .isLength({
      min: 4,
      max: 16,
    })
    .withMessage("Name must be between 3 to 16 characters."),
  check("email").isEmail().withMessage("Must be a valid email address."),
  check("password", "password is required.").notEmpty(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters.")
    .matches(/\d/)
    .withMessage("Password must contain a number."),
];

/*
Check if all the fields are valid before loging in.
Check if email address is valid.
Password should be minimum 6 characters and contain a number.
*/
exports.validLogin = [
  check("email").isEmail().withMessage("Must be a valid email address."),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters.")
    .matches(/\d/)
    .withMessage("Password must contain a number."),
];

/*
Check if email address provided is valid for resetting password.
*/
exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Must be a valid email address."),
];

/*
Check if new password is valid, containing at least 6 characters and a number.
*/
exports.resetPasswordValidator = [
  check("newPassword", "password is required").notEmpty(),
  check("newPassword")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters.")
    .matches(/\d/)
    .withMessage("Password must contain a number."),
];
