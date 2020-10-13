/*
Component for individual classifieds.
*/
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isAuth } from "../helpers/auth";

export default class Classified extends Component {

  /*
  This function formats dates from a Date object to "Month Day, Year TT:TT".
  */
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

    /*
    Add a zero to the time if it's only a single digit.
    Example: 9:10 becomes 09:10.
    */
    function appendLeadingZeroes(n) {
      if (n <= 9) {
        return "0" + n;
      }
      return n;
    }

    /*
    Covert 24 hour time to 12 hour time and add AM or PM.
    */
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

    /*
    Create string for formatted date.
    */
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

  /*
  This function returns the destination for the "delete".
  The destination depends whether the user is on the home page or the profile page.
  */
  getHref = () => {
    return (this.props.isProfile ? "javascript:void(0);" : "/#");
  }

  /*
  Returns the possible actions for each classified.
  Depends on whether the user is on the home page or the profile page.
  Also depends on whether the classified is created by the user or a different one.
  */
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
