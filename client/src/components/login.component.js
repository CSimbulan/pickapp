/*
Component for log in page.
*/
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { authenticate, isAuth } from "../helpers/auth";
import { Link, Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    textChange: "Sign In",
  });

  const { email, password1 } = formData;

  /*
  Change the form data when the field changes.
  */
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };


  /*
  Send post request for google login.
  */
  const sendGoogleToken = (tokenId) => {
    axios
      .post(`/api/googlelogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        console.log(res.data);
        informParent(res);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  /*
  Set cookie and local storage with authenticate function.
  Redirect to home page.
  */
  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push({ pathname: "/", redirectfrom: "login" });
      //window.location.reload();
    });
  };

  /*
  Send post request for facebook login.
  */
  const sendFacebookToken = (userID, accessToken) => {
    axios
      .post(`/api/facebooklogin`, {
        userID,
        accessToken,
      })
      .then((res) => {
        console.log(res.data);
        informParent(res);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  /*
  Get response from google login.
  */
  const responseGoogle = (response) => {
    console.log(response);
    sendGoogleToken(response.tokenId);
  };

  /*
  Get response from facebook login.
  */
  const responseFacebook = (response) => {
    console.log(response);
    sendFacebookToken(response.userID, response.accessToken);
  };

  /*
  If all fields are filled, send a post request to try to login.
  If successful, redirect to home page and reload the page.
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password1) {
      setFormData({ ...formData, textChange: "Submitting" });
      axios
        .post(`/api/login`, {
          email,
          password: password1,
        })
        .then((res) => {
          authenticate(res, () => {
            setFormData({
              ...formData,
              email: "",
              password1: "",
              textChange: "Submitted",
            });
            toast.success(`Login Successful!`);

            isAuth() && isAuth().role === "admin"
              ? history.push("/")
              : history.push({ pathname: "/", redirectfrom: "login" });
            window.location.reload();
          });
        })
        .catch((err) => {
          setFormData({
            ...formData,
            email: "",
            password1: "",
            textChange: "Sign In",
          });
          console.log(err.response);
          toast.error(err.response.data.errors);
        });
    } else {
      toast.error("Please fill all fields");
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 flex justify-center min-h-screen">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Sign In to PickApp
            </h1>
            <div className="w-full flex-1 mt-8 text-indigo-500">
              <form
                className="mx-auto max-w-xs relative"
                onSubmit={handleSubmit}
              >
                <input
                  className="form-control"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange("email")}
                  value={email}
                />
                <br></br>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password1")}
                  value={password1}
                />
                <br></br>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                  <span> Sign In</span>
                </button>
                <Link
                  to="/users/password/forget"
                  className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0  mt-2"
                >
                  Forgot password?
                </Link>
              </form>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign in with social login:
                </div>
              </div>
              <div className="flex flex-col items-center">
                <GoogleLogin
                  clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className="btn-social btn-google"
                    >
                      <div className="button-container">
                        <div className="svg-container">
                          <svg
                            width="18"
                            height="18"
                            xmlns="http://www.w3.org/2000/svg"
                            className="svg-icon"
                          >
                            <g fill="#000" fillRule="evenodd">
                              <path
                                d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"
                                fill="#EA4335"
                              ></path>
                              <path
                                d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
                                fill="#4285F4"
                              ></path>
                              <path
                                d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z"
                                fill="#FBBC05"
                              ></path>
                              <path
                                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"
                                fill="#34A853"
                              ></path>
                              <path fill="none" d="M0 0h18v18H0z"></path>
                            </g>
                          </svg>
                        </div>

                        <span className="testa2">Sign in with Google</span>
                      </div>
                    </button>
                  )}
                ></GoogleLogin>

                <FacebookLogin
                  appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                  autoLoad={false}
                  callback={responseFacebook}
                  disableMobileRedirect={true}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className="btn-social btn-facebook"
                    >
                      <i className="fab fa-facebook" />

                      <span className="ml-4">Sign In with Facebook</span>
                    </button>
                  )}
                />
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Don't Have an Account?
                </div>
              </div>
              <div className="flex flex-col items-center">
                <a
                  className="btn btn-outline-primary"
                  href="/register"
                  target="_self"
                >
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                  <span> Register</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray text-center hidden lg:flex brd-btm-white">
          <div
            className="w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL + "/assets/tennis.jpg"
                })`,
            }}
          >
            <div className="photo-creds">
              <span>
                Photo by{" "}
                <a href="https://www.pexels.com/@wendywei" target="_blank" rel="noopener noreferrer">Wendy Wei</a> on{" "}
                <a href="https://www.pexels.com/photo/women-s-white-v-neck-shirt-and-blue-miniskirt-2820810/" target="_blank" rel="noopener noreferrer">
                  Pexels
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
