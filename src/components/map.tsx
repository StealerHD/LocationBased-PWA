import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import { Position } from "../js/position";
import RoutingMachineWrapper from "./mapRoutingWrapper";

export default function Map(props: any) {
  const [markers, setMarkers]: any = useState([]);
  const [startPoint, setStartPoint] = useState<Position >({ lat: 0, lng: 0});
  const [endPoint, setEndPoint] = useState<Position | null>(null);
  // Options for the marker
  const markerOptions = {
    clickable: true,
    draggable: true,
    opacity: 0.7,
  };

  console.log('Map Height:', props.mapHeight);

  useEffect(() => {
    getLocationAndSetMarker();
  }, []);

  function getLocationAndSetMarker() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setStartPoint({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        addMarker({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  async function reverseGeocode(position: Position) {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
      const data = {
        addressJSON: response.data.address,
        addressString: response.data.display_name,
      };
      console.log(data);
      return data;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }

    return "";
  }

  async function addMarker(position: Position) {
    let address = await reverseGeocode(position);

    const newMarker: any = {
      id: Date.now(),
      position,
      address,
    };

    // setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setMarkers(() => [newMarker]);
    props.markerAddressCallback(newMarker.address.addressJSON);
    setEndPoint(position);
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
      style={{ height: props.mapHeight }}
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
       {endPoint && (
        <RoutingMachineWrapper
          start={startPoint}
          end={endPoint}
        />
      )}
    </MapContainer>
  );
}
