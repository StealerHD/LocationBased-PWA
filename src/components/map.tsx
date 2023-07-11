import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { Position } from "../js/position";
import RoutingMachineWrapper from "./mapRoutingWrapper";
import { NominatimResponse } from "../js/nominatimResponse";
import { MapMarker } from "../js/mapMarker";
import { MapProperties } from "../js/mapProperties";
import SimpleMarkers from "./SimpleMarkers";
import { mapPositionToLatLng } from "../js/utils";

export default function Map(props: MapProperties) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [startPoint, setStartPoint] = useState<Position>({ lat: 0, lng: 0 });
  const [endPoint, setEndPoint] = useState<Position | null>(null);

  console.log("Map Height:", props.mapHeight);

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

  async function reverseGeocode(
    position: Position
  ): Promise<NominatimResponse> {
    try {
      const response = await axios.get<NominatimResponse>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw error;
    }
  }

  function latLngToPosition(latLng: L.LatLng): Position {
    return { lat: latLng.lat, lng: latLng.lng };
  }

  async function addMarker(position: Position) {
    // if (addControl || firstMarker) {
      let response = await reverseGeocode(position);

      const newMarker: MapMarker = {
        id: Date.now(),
        position,
        address: response,
        leafLetMarker: new L.Marker(
          mapPositionToLatLng(position) as L.LatLngExpression
        ),
      };

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      props.markerAddressCallback(newMarker.address.address);
      setEndPoint(position);
    // }
  }

  async function deleteMarker(marker: L.Marker) {
    const markerToDelete = markers.find((m) => m.leafLetMarker === marker);
    if (markerToDelete) {
      setMarkers(markers.filter((m) => m.id !== markerToDelete.id));
    }
  }

  return (
    <MapContainer
      center={props.startGeoData}
      zoom={14}
      style={{ height: props.mapHeight }}
      id="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SimpleMarkers
        add_control={true}
        delete_control={true}
        onAddMarker={(marker) => {
          addMarker(latLngToPosition(marker.getLatLng()));
        }}
        onDeleteMarker={deleteMarker}
        addMarker={addMarker}
        markerList={markers}
      />

      {markers.map((marker: MapMarker) => (
        <Marker key={marker.id} position={marker.position}>
          <Popup>
            <div>
              <p>Adresse: {marker.address.display_name}</p>
              <p>Position: {marker.position.toString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {endPoint && <RoutingMachineWrapper start={startPoint} end={endPoint} />}
    </MapContainer>
  );
}
