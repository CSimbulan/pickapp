import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isAuth } from "../helpers/auth";

export default class Classified extends Component {
  formatDate = (rawDate) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    function appendLeadingZeroes(n) {
      if (n <= 9) {
        return "0" + n;
      }
      return n;
    }

    function formatHour(n) {
      let c = n >= 12 ? "PM" : "AM";
      let x = n % 12;
      if (x === 0) {
        x += 12;
      }
      return [x, c];
    }

    let d = new Date(rawDate);
    let hour = formatHour(d.getHours());

    let formatted_date =
      months[d.getMonth()] +
      " " +
      d.getDate() +
      ", " +
      d.getFullYear() +
      " " +
      appendLeadingZeroes(hour[0]) +
      ":" +
      appendLeadingZeroes(d.getMinutes()) +
      " " +
      hour[1];
    return formatted_date;
  };

  getHref = () => {
    return (this.props.isProfile ? "javascript:void(0);" : "/#");
  }

  getActions = () => {
    return  (isAuth() && (JSON.parse(localStorage.getItem("user"))._id === this.props.classified.userid || JSON.parse(localStorage.getItem("user")).role === "Admin")
    ) ?
    <div>
      {this.props.isProfile ? "" : <><a href="/#" onClick={() => {this.props.findOnMap(this.props.classified.location, this.props.classified._id)}}><i className="fa fa-map-marked-alt" data-toggle="tooltip" data-placement="top" title="Find on Map"></i></a>{" | "}</>}
      <Link
      to={{
        pathname: "/edit/" + this.props.classified._id,
        state: { userid: this.props.classified.userid },
      }}
    >
      <i className="far fa-edit" data-toggle="tooltip" data-placement="top" title="Edit"></i>
    </Link>{" | "}<a
      href={this.getHref()}
      onClick={() => {
        this.props.deleteClassified(this.props.classified._id);
      }}
    >
      <i className="far fa-trash-alt" data-toggle="tooltip" data-placement="top" title="Delete"></i>
    </a>
    </div>
    : <a href="/#" onClick={() => {this.props.findOnMap(this.props.classified.location, this.props.classified._id)}}><i className="fas fa-map-marked-alt" data-toggle="tooltip" data-placement="top" title="Find on Map"></i></a>
    
    
  }

  render() {
    return (
      <>
        <td>{this.props.classified.sport}</td>
        <td>{this.props.classified.username}</td>
        <td>{this.props.classified.description}</td>
        <td>{this.formatDate(this.props.classified.startdate)}</td>
        <td>{this.formatDate(this.props.classified.enddate)}</td>
        <td>{this.props.classified.location.address}</td>
        <td>
          {this.getActions()}
        </td>
      </>
    );
  }
}
