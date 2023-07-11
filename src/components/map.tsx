import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { Position } from "../js/position";
import RoutingMachineWrapper from "./mapRoutingWrapper";
import { NominatimResponse } from "../js/nominatimResponse";
import { MapMarker } from "../js/mapMarker";
import { MapProperties } from "../js/mapProperties";
import { mapPositionToLatLng } from "../js/utils";
import SimpleMarkers from "./SimpleMarkers";
import MapEffect from "./MapEffect";

export default function Map(props: MapProperties) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [startPoint, setStartPoint] = useState<Position>({ lat: 0, lng: 0 });
  const [endPoint, setEndPoint] = useState<Position | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const markerListRef = useRef<L.Marker[]>([]);

  console.log("Map Height:", props.mapHeight);

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

  async function addMarker(position: Position) {
    let response = await reverseGeocode(position);

    const newMarker: MapMarker = {
      id: Date.now(),
      position,
      address: response,
      leafLetMarker: new L.Marker(mapPositionToLatLng(position) as L.LatLng),
    };

    // setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    props.markerAddressCallback(newMarker.address.address);
    // setEndPoint(position);
  }

  async function deleteMarkerFromMap(e: any) {
    if (!deleteMode) return;
    console.log("deleteMarkerFromMap", e);
    const marker = markers.find((m) =>
      (mapPositionToLatLng(m.position) as L.LatLng).equals(e.latlng)
    );
    console.log('marker: ', marker);
    if (marker) {
      setMarkers(markers.filter((m) => m !== marker));
      console.log('markers: ', markers);
    }
  }

  function EnableAddMode() {
    if (addMode) {
      useMapEvents({
        click(e: any) {
          addMarker(e.latlng);
        },
      });

      // map.on('click', addMarkerToMap);
    }
    return null;
  }

  function EnableDeleteMode() {
    console.log("EnableDeleteMode", deleteMode);
    if (deleteMode) {
      useMapEvents({
        click(e: any) {
          deleteMarkerFromMap(e.latlng);
        },
      });
    }

    return null;
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
      <MapEffect setStartPoint={setStartPoint} addMarker={addMarker} />
      <SimpleMarkers
        add_control={true}
        delete_control={true}
        addMarker={addMarker}
        refAddMode={setAddMode}
        refDeleteMode={setDeleteMode}
      />
      <EnableAddMode />
      <EnableDeleteMode />
      {markers.map((marker: MapMarker) => {
        console.log("marker.position: ", marker.position); // <- add this line
        return (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div>
                <p>Adresse: {marker.address.display_name}</p>
                <p>Position: {marker.position.toString()}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
      {/* {endPoint && (
        <RoutingMachineWrapper
          start={startPoint}
          end={endPoint}
        />
      )} */}
    </MapContainer>
  );
}
