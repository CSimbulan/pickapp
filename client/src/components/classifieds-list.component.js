/*
Component for the list of all the classifieds.
*/
import React, { Component } from "react";
import axios from "axios";
import Classified from "./classified.component";
import LargeMap from "./large-map.component";

export default class ClassifiedsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classifieds: [],
      isOpen: false,
      currentId: "",
      currentScroll: "",
      mapPosition: { lat: 43.6548, lng: -79.3882  },
      sort: "sooner",
    };

    const redirectfrom = this.props.location.redirectfrom;
    if (redirectfrom === "login") {
      window.location.reload();
    }
  }

  /*
  When the component mounts, send a get request to receive all classifieds sorted by date.
  */
  componentDidMount() {

    axios
    .get(`/classifieds/query`, {
      params: {
        sport: "All",
        sort: "sooner",
      },
    })
      .then((response) => {
        this.setState({ classifieds: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /*
  This function sends a delete request to delete a classified with a given id.
  */
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

  /*
  This function creates the rows for the table containing the classifieds.
  Maps each classified in the state to a row.
  */
  classifiedList() {
    this.state.classifieds.forEach((currentclassified) => {
      this[currentclassified._id] = React.createRef();
    });

    return this.state.classifieds.map((currentclassified) => {
      return (
        <tr
          ref={this[currentclassified._id]}
          key={currentclassified._id}
          className={this.getRowClassName(currentclassified)}
        >
          <Classified
            classified={currentclassified}
            deleteClassified={this.deleteClassified}
            findOnMap={this.findOnMap}
            key={currentclassified._id}
          />
        </tr>
      );
    });
  }

  /*
  Changes the position coordinates in the state to the classified selected from the list.
  */
  findOnMap = (location, id) => {
    this.setState({mapPosition:location.mapPosition, currentScroll:id,      isOpen: true,
      currentId: id,
      })
  }

  /*
  Changes the state when an info box for a classified marker is open.
  The state will track which classified and where on the map.
  */
  handleToggleOpen = (id, coords) => {
    this.setState({
      isOpen: true,
      currentId: id,
      mapPosition: coords,
    });
  };

  /*
  Changes the state when an info box for a classified marker is closed.
  */
  handleToggleClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  /*
  This function will scroll the table down to a specific classified when its info box button is clicked.
  */
  onMoreInfoClick = () => {
    this.setState({ currentScroll: this.state.currentId });
    this[this.state.currentId].current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /*
  Returns the correct className for <tr> element based on whether it is to be highlighted or not.
  */
  getRowClassName = (classified) => {
    return classified._id === this.state.currentScroll ? "highlighted-row" : "";
  };

  /*
  Compare function for if one date is earlier than another.
  */
  sooner = (a, b) => {
    return a.startdate > b.startdate ? 1 : -1;
  };

  /*
  Compare function for if one date is later than another.
  */
  later = (a, b) => {
    return a.startdate < b.startdate ? 1 : -1;
  };

  /*
  Compare function for if one sport starts with an earlier letter than another.
  */
  sportaz = (a, b) => {
    return a.sport > b.sport ? 1 : -1;
  };

  /*
  Compare function for if one sport starts with later letter than another.
  */
  sportza = (a, b) => {
    return a.sport < b.sport ? 1 : -1;
  };

  /*
  This function updates the state when the user changes how they want to sort the table of classifieds.
  */
  onSortChange = (e) => {
    const sort = e.target.value;
    this.sortClassifieds(sort);
    this.setState({ sort: sort });
  };

  /*
  This function will sort the array of classifieds based on which option is selected.
  */
  sortClassifieds = (sort) => {
    switch (sort) {
      case "sooner":
        this.state.classifieds.sort(this.sooner);
        break;
      case "later":
        this.state.classifieds.sort(this.later);
        break;
      case "sportaz":
        this.state.classifieds.sort(this.sportaz);
        break;
      case "sportza":
        this.state.classifieds.sort(this.sportza);
        break;
      default:
        this.state.classifieds.sort(this.sooner);
        break;
    }
  };

  /*
  When the filter option is changed, send a get request with a query containing the options selected.
  */
  onFilterChange = (e) => {
    const filter = e.target.value;
    const sort = this.state.sort;
    axios
      .get(`/classifieds/query`, {
        params: {
          sport: filter,
          sort: sort,
        },
      })
      .then((response) => {
        this.setState({ classifieds: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <div style={{ width: "100%" }}>
          <LargeMap
            google={this.props.google}
            center={this.state.mapPosition}
            height="40vh"
            zoom={13}
            mapPosition={this.state.mapPosition}
            markerPosition={this.state.mapPosition}
            classifieds={this.state.classifieds}
            isOpen={this.state.isOpen}
            currentId={this.state.currentId}
            handleToggleClose={this.handleToggleClose}
            handleToggleOpen={this.handleToggleOpen}
            onMoreInfoClick={this.onMoreInfoClick}
          />
        </div>
        <br></br>
        <div className="header-container">
          <div className="header-splitter header-left">
            <h3 className="rsp-h3">Postings:</h3>
          </div>
          <div className="header-splitter header-right">
            <div className="header-filter">
              <select className="form-control" onChange={this.onFilterChange}>
                <option value="All">All Sports</option>
                <option value="Basketball">Basketball</option>
                <option value="Soccer">Soccer</option>
                <option value="Football">Football</option>
                <option value="Running">Running</option>
                <option value="Ice Hockey">Ice Hockey</option>
                <option value="Ball Hockey">Ball Hockey</option>
                <option value="Tennis">Tennis</option>
                <option value="Baseball">Baseball</option>
                <option value="Boxing">Boxing</option>
                <option value="Skateboarding">Skateboarding</option>
                <option value="Bowling">Bowling</option>
              </select>
            </div>
            <div className="header-sort">
              <select className="form-control" onChange={this.onSortChange}>
                <option value="sooner">Date: Sooner</option>
                <option value="later">Date: Later</option>
                <option value="sportaz">Sport: A-Z</option>
                <option value="sportza">Sport: Z-A</option>
              </select>
            </div>
          </div>
        </div>
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
            <tbody>{this.classifiedList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
