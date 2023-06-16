import React, { SetStateAction, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import RoutingMachine from "./mapRouting";

export interface MapConfig {
    center: any,
    zoom: number,
    style: any
}

export default function Map(props: any) {
  const [markers, setMarkers]: any = useState([]);
  // Options for the marker
  const markerOptions = {
    clickable: true,
    draggable: true,
    opacity: 0.7,
  };

  async function reverseGeocode(position: any) {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
      const data = {
        addressJSON: response.data.address,
        addressString: response.data.display_name
      }
      console.log(data);
      return data
	
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }

    return "";
  }

  async function addMarker(position: any) {
    var address = await reverseGeocode(position);

    const newMarker: any = {
      id: Date.now(),
      position,
      address,
    };

    // setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setMarkers(() => [newMarker]);
    props.markerAddressCallback(newMarker.address.addressJSON)
  }

  function AddMarkerOnClick() {
    const map = useMapEvents({
      click(e: any) {
        addMarker(e.latlng);
      },
    });

    return null;
  }

  return (
    <MapContainer
      center={props.startGeoData}
      zoom={14}
      // style={{ height: "75vh" }}
      id="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AddMarkerOnClick />

      {markers.map((marker: any) => (
        <Marker key={marker.id} position={marker.position}>
          <Popup>
            <div>
              <p>Adresse: {marker.address.addressString}</p>
              <p>Position: {marker.position.toString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <RoutingMachine/>
    </MapContainer>
  );
}
