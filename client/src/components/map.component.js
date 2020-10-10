import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from "react-google-autocomplete";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY);
Geocode.enableDebug();

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
        onClick={this.props.onMapClicked}
      >
        {/*Marker*/}
        <Marker
          google={this.props.google}
          name={"Dolores park"}
          draggable={true}
          onDragEnd={this.props.onMarkerDragEnd}
          position={{
            lat: this.props.markerPosition.lat,
            lng: this.props.markerPosition.lng,
          }}
        />

        {/* InfoWindow on top of marker */}
        <InfoWindow
          position={{
            lat: this.props.markerPosition.lat + 0.0018,
            lng: this.props.markerPosition.lng,
          }}
        >
          <div>
            <span style={{ padding: 0, margin: 0 }}>{this.props.address}</span>
          </div>
        </InfoWindow>
        {/* For Auto complete Search Box */}
        <Autocomplete
          style={{
            width: "100%",
            height: "40px",
            paddingLeft: "16px",
            marginTop: "2px",
            marginBottom: "100px",
          }}
          onPlaceSelected={this.props.onPlaceSelected}
          types={["geocode", "establishment"]}
          placeholder="Search for a location"
        />
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

export default Map;
