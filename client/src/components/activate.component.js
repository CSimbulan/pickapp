/*
Component for account activation.
*/
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import jwt from "jsonwebtoken";
import { isAuth } from "../helpers/auth";
import { Redirect } from "react-router-dom";

const Activate = ({ match }) => {
  const [formData, setFormData] = useState({
    name: "",
    token: "",
    show: true,
  });

  /*
  Decode the token.
  */
  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, name, token });
    }

  }, [match.params]);
  const { name, token, show } = formData;

  /*
  Send post request with token to activate the account.
  */
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`/api/activate`, {
        token,
      })
      .then((res) => {
        setFormData({
          ...formData,
          show: false,
        });

        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.errors);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Welcome {name}
            </h1>

            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-royal">
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                  <span className=""> Activate Your Account</span>
                </button>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Proceed to login:
                </div>
              </div>
              <div className="flex flex-col items-center">
                <a className="btn btn-primary" href="/login" target="_self">
                  <i className="fas fa-sign-in-alt fa 1x w-6 -ml-2" />
                  <span className=""> Sign In</span>
                </a>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign up again:
                </div>
              </div>
              <div className="flex flex-col items-center">
                <a
                  className="btn btn-outline-primary"
                  href="/register"
                  target="_self"
                >
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                  <span className=""> Register</span>
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-gray text-center hidden lg:flex">
          <div
            className="w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                process.env.PUBLIC_URL + "/assets/football.jpg"
              })`,
            }}
          >
            <div className="photo-creds text-black">
              <span>
                Photo by <a href="https://www.pexels.com/@pixabay">Pixabay</a>{" "}
                on{" "}
                <a href="https://www.pexels.com/photo/action-adult-american-football-athletes-274520/">
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

export default Activate;
