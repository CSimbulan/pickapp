import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY);
Geocode.enableDebug();

class LargeMap extends React.Component {
  getMarkers = () => {
    return this.props.classifieds.map((currentclassified) => {
      return (
        <Marker
          key={currentclassified._id}
          onClick={() =>
            this.props.handleToggleOpen(
              currentclassified._id,
              currentclassified.location.markerPosition
            )
          }
          position={currentclassified.location.markerPosition}
          icon={{
            url: this.getMarkerIcon(currentclassified.sport),
            scaledSize: new window.google.maps.Size(45, 45),
            origin: new window.google.maps.Point(0, 0),
          }}
        >
          {this.props.isOpen && this.props.currentId === currentclassified._id && (
            <InfoWindow onCloseClick={this.props.handleToggleClose}>
              <div>
                {currentclassified.description}
                <br></br>
                <br></br>
                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  onClick={this.props.onMoreInfoClick}
                >
                  More Info
                </button>
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    });
  };

  getMarkerIcon = (sport) => {
    const s = sport.split(" ").join("_").toLowerCase();
    return process.env.PUBLIC_URL + "/icons/" + s + ".png";
  };

  AsyncMap = withScriptjs(

    withGoogleMap((props) => (
      <GoogleMap
        google={this.props.google}
        defaultZoom={this.props.zoom}
        defaultCenter={{
          lat: this.props.mapPosition.lat,
          lng: this.props.mapPosition.lng,
        }}
        center={{
          lat: this.props.mapPosition.lat,
          lng: this.props.mapPosition.lng,
        }}
        onLoad={map => this.handleOnLoad(map)}
      >
        {this.getMarkers()}
        <div className="credits">
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {" and "}
          <a
            href="https://www.flaticon.com/authors/dinosoftlabs"
            title="DinosoftLabs"
          >
            DinosoftLabs
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </GoogleMap>
    ))
  );

  render() {
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          <this.AsyncMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: this.props.height }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}

export default LargeMap;
