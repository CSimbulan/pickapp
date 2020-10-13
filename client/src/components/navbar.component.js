/*
Navigation bar component appearing at the top of the site.
*/
import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "js-cookie";

export default class Navbar extends Component {

  /*
  Remove cookie and user data from local storage.
  */
  logOut = () => {
    cookie.remove("token", {
      expires: 1,
    });
    localStorage.removeItem("user");
  };

  /*
  Return links to login and register if there is no user logged in.
  */
  loginRegLink = () => {
    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            <svg
              viewBox="0 0 16 16"
              className="bi bi-arrow-right-circle profile-img"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                fillRule="evenodd"
                d="M4 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5A.5.5 0 0 0 4 8z"
              />
            </svg>
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            <svg
              viewBox="0 0 16 16"
              className="bi bi-person-plus-fill profile-img-lg"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
              />
            </svg>
            Register
          </Link>
        </li>
      </ul>
    );
  };

  /*
  Return links to profile page and logout if a user is logged in.
  */
  userLink = () => {
    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/profile" className="nav-link">
            <svg
              viewBox="0 0 16 16"
              className="bi bi-person-circle profile-img"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
              <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path
                fillRule="evenodd"
                d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"
              />
            </svg>
            {JSON.parse(localStorage.getItem("user")).name}
          </Link>
        </li>
        <li className="nav-item">
          <a href="/" onClick={this.logOut} className="nav-link">
            <svg
              className="bi bi-person-circle profile-img-lg"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
              />
            </svg>
            Logout
          </a>
        </li>
      </ul>
    );
  };

  render() {
    return (
      <nav className="navbar navbar-dark navbar-expand-lg bg-navy">
        <img
          src={process.env.PUBLIC_URL + "/icons/main.png"}
          alt="logo"
          height="45px"
          width="45px"
        ></img>
        <span className="navbar-brand"> PickApp</span>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="navbar-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/create" className="nav-link">
                Create Post
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {localStorage.user ? this.userLink() : this.loginRegLink()}
          </ul>
        </div>
      </nav>
    );
  }
}
