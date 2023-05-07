import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

export const apiKey = "AIzaSyAjCwFvVD_a2cmMG5orpYS4LlOaqxNkfJc";

function Map({ location }) {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        id="marker-example"
        mapContainerStyle={containerStyle}
        center={location.center}
        zoom={18}
      >
        <Marker position={location.position} />
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(Map);
