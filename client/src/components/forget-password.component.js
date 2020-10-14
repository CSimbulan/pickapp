/*
Component for the forgot password page.
*/
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ForgetPassword = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    textChange: "Submit",
  });

  const { email } = formData;

  /*
  Change the form data depending on the text given.
  */
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  /*
  Send a put request with the email entered.
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setFormData({ ...formData, textChange: "Submitting" });
      axios
        .put(`/api/forgotpassword`, {
          email,
        })
        .then((res) => {
          setFormData({
            ...formData,
            email: "",
          });
          toast.success(`Password reset link has been sent to your email.`);
        })
        .catch((err) => {
          console.log(err.response);
          toast.error(err.response.data.error);
        });
    } else {
      toast.error("Please fill all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Forgot Password?
            </h1>
            <div className="w-full flex-1 mt-8 text-indigo-500">
              <form
                className="mx-auto max-w-xs relative "
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
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                  <span>Submit</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray text-center hidden lg:flex brd-btm-white">
          <div
            className="w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                process.env.PUBLIC_URL + "/assets/soccer.jpg"
              })`,
            }}
          >
            {" "}
            <div className="photo-creds gold-link">
              <span>
                Photo by{" "}
                <a href="https://unsplash.com/@markusspiske?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                  Markus Spiske
                </a>{" "}
                on{" "}
                <a href="https://unsplash.com/s/photos/soccer?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                  Unsplash
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
