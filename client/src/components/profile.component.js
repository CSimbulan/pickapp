import React, { Component } from "react";
import axios from "axios";
import Classified from "./classified.component";
import { isAuth } from "../helpers/auth";
import { Redirect } from "react-router-dom";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userid: "",
      name: "",
      email: "",
      role: "",
      classifieds: [],
    };
  }

  componentDidMount() {
    axios
      .get(`/classifieds/query`, {
        params: {
          userid: this.getUserId(),
        },
      })
      .then((response) => {
        this.setState({ classifieds: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUserId = () => {
    return isAuth() ? JSON.parse(localStorage.getItem("user"))._id : "";
  };

  getName = () => {
    return isAuth() ? JSON.parse(localStorage.getItem("user")).name : "";
  };

  getEmail = () => {
    return isAuth() ? JSON.parse(localStorage.getItem("user")).email : "";
  };

  getAccountType = () => {
    return isAuth() ? JSON.parse(localStorage.getItem("user")).role : "";
  };

  deleteClassified = (id) => {
    axios
      .delete(`/classifieds/` + id)
      .then((response) => {
        console.log(response.data);
      });

    this.setState({
      classifieds: this.state.classifieds.filter((el) => el._id !== id),
    });
  };

  exerciseList() {
    this.state.classifieds.forEach((currentclassified) => {
      this[currentclassified._id] = React.createRef();
    });

    return this.state.classifieds.map((currentclassified) => {
      return (
        <tr ref={this[currentclassified._id]} key={currentclassified._id}>
          <Classified
            classified={currentclassified}
            deleteClassified={this.deleteClassified}
            key={currentclassified._id}
            isProfile={true}
          />
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        {!isAuth() ? <Redirect to="/login" /> : null}
        <h1>
          <svg
            viewBox="0 0 16 16"
            className="bi bi-person-circle profile-page-svg"
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
          Profile Page
        </h1>
        <br></br>
        <h2>Name:</h2>
        <h4>{this.getName()}</h4>
        <br></br>
        <h2>Email:</h2>
        <h4>{this.getEmail()}</h4>
        <br></br>
        <h2>Account Type:</h2>
        <h4>{this.getAccountType()}</h4>
        <br></br>
        <h2>Your Posts:</h2>
        <div className="classifieds-table">
          <table className="table">
            <thead className="thead-navy thead-fixed bg-nayv">
              <tr>
                <th>Sport</th>
                <th>Username</th>
                <th>Description</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.exerciseList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
