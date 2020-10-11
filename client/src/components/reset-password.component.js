import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ResetPassword = ({ match, history }) => {
  const [formData, setFormData] = useState({
    password1: "",
    password2: "",
    token: "",
    textChange: "Submit",
  });
  const { password1, password2, textChange, token } = formData;

  useEffect(() => {
    let token = match.params.token;
    if (token) {
      setFormData({ ...formData, token });
    }
  }, []);

  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password1 === password2 && password1 && password2) {
      setFormData({ ...formData, textChange: "Submitting" });
      axios
        .put(`/api/resetpassword`, {
          newPassword: password1,
          resetPasswordLink: token,
        })
        .then((res) => {
          console.log(res.data.message);
          setFormData({
            ...formData,
            password1: "",
            password2: "",
          });
          toast.success(res.data.message);
        })
        .catch((err) => {
          setFormData({
            ...formData,
            password1: "",
            password2: "",
          });
          console.log(err.response.data.errors);
          toast.error(err.response.data.errors);
        });
    } else {
      toast.error("Passwords don't matches");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Reset Your Password
            </h1>
            <div className="w-full flex-1 mt-8 text-indigo-500">
              <form
                className="mx-auto max-w-xs relative "
                onSubmit={handleSubmit}
              >
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password1")}
                  value={password1}
                />
                <br></br>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange("password2")}
                  value={password2}
                />
                <br></br>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                  <span>Submit</span>
                </button>
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Move to sign in page?
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <a
                    className="btn btn-outline-primary btn-lg"
                    href="/login"
                    target="_self"
                  >
                    <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                    <span> Sign In</span>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-green text-center hidden lg:flex">
          <div
            className="w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                process.env.PUBLIC_URL + "/assets/baseball.jpg"
              })`,
            }}
          >
            <div className="photo-creds text-black">
              <span>
                Photo by <a href="https://www.pexels.com/@pixabay">Pixabay</a>{" "}
                on{" "}
                <a href="https://www.pexels.com/photo/woman-holding-baseball-bat-159563/">
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

export default ResetPassword;
