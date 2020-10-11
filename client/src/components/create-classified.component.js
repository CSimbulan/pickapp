import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Map from "./map.component";
import Geocode from "react-geocode";
import { isAuth } from "../helpers/auth";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default class CreateClassified extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      userid: "",
      sport: "Basketball",
      description: "",
      startdate: new Date(),
      enddate: new Date(),
      badenddate: false,
      locationInfo: {
        address: "",
        mapPosition: {
          lat: 43.6548, lng: -79.3882 
        },
        markerPosition: {
          lat: 43.6548, lng: -79.3882 
        },
      },
    };
  }

  componentDidMount() {
    axios
      .get(`/api/users/query`, {
        params: {
          email: this.getEmail(),
        },
      })
      .then((response) => {
        this.setState({
          userid: response.data[0]._id,
          username: response.data[0].name,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    Geocode.fromLatLng(
      this.state.locationInfo.mapPosition.lat,
      this.state.locationInfo.mapPosition.lng
    ).then(
      (response) => {
        const address = response.results[0].formatted_address;

        this.setState({
          locationInfo: {
            address: address ? address : "",

            mapPosition: {
              lat: 43.6548, lng: -79.3882 
            },
            markerPosition: {
              lat: 43.6548, lng: -79.3882 
            },
          },
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getEmail = () => {
    return isAuth() ? JSON.parse(localStorage.getItem("user")).email : "";
  };

  onChangeSport = (e) => {
    this.setState({ sport: e.target.value });
  };

  onChangeDescription = (e) => {
    this.setState({ description: e.target.value });
  };

  onChangeStartDate = (date) => {
    this.setState({ startdate: date });
  };

  onChangeEndDate = (date) => {
    this.setState({ enddate: date });
  };

  onChangeLocation = (e) => {
    this.setState({ location: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.enddate >= this.state.startdate) {
      const classified = {
        username: this.state.username,
        userid: this.state.userid,
        sport: this.state.sport,
        description: this.state.description,
        startdate: this.state.startdate,
        enddate: this.state.enddate,
        location: this.state.locationInfo,
      };

      axios
        .post(`/classifieds/add`, classified)
        .then((res) => console.log(res.data));

      window.location = "/";
    } else {
      this.setState({ badenddate: true });
      toast.error("End time must be after the start time.");
    }
  };

  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   *
   * @param event
   */
  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();
    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let markerPosition = Object.assign({}, this.state.markerPosition); //creating copy of object

        markerPosition.lat = newLat;

        markerPosition.lng = newLng;
        this.setState({
          locationInfo: {
            address: address ? address : "",
            markerPosition,
            mapPosition: {
              lat: newLat,
              lng: newLng,
            },
          },
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = (place) => {
    const address = place.formatted_address,
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();

    // Set these values in the state.
    this.setState({
      locationInfo: {
        address: address ? address : "",
        markerPosition: {
          lat: latValue,
          lng: lngValue,
        },
        mapPosition: {
          lat: latValue,
          lng: lngValue,
        },
      },
    });
  };

  onMapClicked = (e) => {
    let newLat = e.latLng.lat(),
      newLng = e.latLng.lng();
    Geocode.fromLatLng(newLat, newLng).then((response) => {
      const address = response.results[0].formatted_address;

      this.setState({
        locationInfo: {
          address: address,
          mapPosition: {
            lat: newLat,
            lng: newLng,
          },
          markerPosition: {
            lat: newLat,
            lng: newLng,
          },
        },
      });
    });
  };

  getEndDateClass = () => {
    return !this.state.badenddate ? "datepicker" : "baddatepicker";
  };

  render() {
    return (
      <div>
        <ToastContainer></ToastContainer>
        {!isAuth() ? <Redirect to="/login" /> : null}
        <h3>Create New Post</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Sport: </label>
            <select
              ref="userInput"
              required
              className="form-control"
              value={this.state.sport}
              onChange={this.onChangeSport}
            >
              <option key="basketball" value="Basketball">
                Basketball
              </option>
              <option key="soccer" value="Soccer">
                Soccer
              </option>
              <option key="ice_hockey" value="Ice Hockey">
                Ice Hockey
              </option>
              <option key="tennis" value="Tennis">
                Tennis
              </option>
              <option key="running" value="Running">
                Running
              </option>
              <option key="volleyball" value="Volleyball">
                Volleyball
              </option>
              <option key="football" value="Football">
                Football
              </option>
              <option key="ball_hockey" value="Ball Hockey">
                Ball Hockey
              </option>
              <option key="baseball" value="Baseball">
                Baseball
              </option>
              <option key="boxing" value="Boxing">
                Boxing
              </option>
              <option key="skateboarding" value="Skateboarding">
                Skateboarding
              </option>
              <option key="bowling" value="Bowling">
                Bowling
              </option>
            </select>
          </div>
          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
            />
          </div>
          <div className="form-group">
            <div className="date-container">
              <div className="date-box">
                <label>Start Time:</label>
                <br></br>
                <DatePicker
                  selected={this.state.startdate}
                  onChange={this.onChangeStartDate}
                  showTimeSelect
                  dateFormat="Pp"
                  className="datepicker"
                />
              </div>
              <div className="date-box">
                <label>End Time:</label>
                <br></br>
                <DatePicker
                  selected={this.state.enddate}
                  onChange={this.onChangeEndDate}
                  showTimeSelect
                  dateFormat="Pp"
                  className={this.getEndDateClass()}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Location: </label>
            <input
              type="text"
              readOnly="readOnly"
              required
              className="form-control"
              value={this.state.locationInfo.address}
              onChange={this.onChangeDuration}
            />
          </div>
          <div className="form-group">
            <div style={{ width: "100%" }}>
              <Map
                google={this.props.google}
                center={{ lat: 43.734011, lng: -79.4933035 }}
                height="20vw"
                zoom={13}
                address={this.state.locationInfo.address}
                mapPosition={this.state.locationInfo.mapPosition}
                markerPosition={this.state.locationInfo.markerPosition}
                onMarkerDragEnd={this.onMarkerDragEnd}
                onPlaceSelected={this.onPlaceSelected}
                onMapClicked={this.onMapClicked}
              />
            </div>
          </div>
          <br></br>
          <br></br>
          <div className="form-group">
            <input
              type="submit"
              value="Create New Post"
              className="btn btn-primary"
            ></input>
          </div>
        </form>
      </div>
    );
  }
}
