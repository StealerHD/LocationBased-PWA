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
import { v4 as uuidv4 } from 'uuid';
import { Position } from "../js/position";
import RoutingMachineWrapper from "./mapRoutingWrapper";
import { NominatimResponse } from "../js/nominatimResponse";
import { MapMarker } from "../js/mapMarker";
import { MapProperties } from "../js/mapProperties";
import { mapPositionToLatLng } from "../js/utils";
import SimpleMarkers from "./SimpleMarkers";
import CurrentLocation from "./CurrentLocation";

export default function Map(props: MapProperties) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [startPoint, setStartPoint] = useState<Position>({ lat: 0, lng: 0 });
  const [endPoint, setEndPoint] = useState<Position | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const startPointMarkerId: string = 'startPointMarker';

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

  async function addMarker(position: Position, id?: string) {
    let response = await reverseGeocode(position);
    const markerId = id || uuidv4();

    const newMarker: MapMarker = {
      id: markerId,
      position,
      address: response,
      leafLetMarker: new L.Marker(mapPositionToLatLng(position) as L.LatLng),
    };

    // setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    props.markerAddressCallback(newMarker.address.address);
    // setEndPoint(position);
  }

  function deleteMarkerFromMap(id: string) {
    if (!deleteMode) return;
    if (id === startPointMarkerId) return;

    setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== id));
  }

  function EnableAddMode() {
    if (addMode) {
      useMapEvents({
        click(e: any) {
          addMarker(e.latlng);
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
      <CurrentLocation 
      setStartPoint={setStartPoint} 
      addMarker={addMarker} />
      <SimpleMarkers
        add_control={true}
        delete_control={true}
        refAddMode={setAddMode}
        refDeleteMode={setDeleteMode}
      />
      <EnableAddMode />
      {markers.map((marker: MapMarker) => {
        return (
          <Marker 
          key={marker.id}
           position={marker.position}
           eventHandlers={{
            click: () => {
              if (deleteMode) {
                deleteMarkerFromMap(marker.id);
              }
            },
          }}>
            <Popup>
              <div>
                <p>Adresse: {marker.address.display_name}</p>
                <p>Position: {marker.position.toString()}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
      {endPoint && (
        <RoutingMachineWrapper
          start={startPoint}
          end={endPoint}
        />
      )}
    </MapContainer>
  );
}
