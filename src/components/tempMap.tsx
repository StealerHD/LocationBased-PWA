import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet-routing-machine";
import { Position } from "../js/position";
import { NominatimResponse } from "../js/nominatimResponse";
import { MapMarker } from "../js/mapMarker";
import { MapProperties } from "../js/mapProperties";
import { mapPositionToLatLng } from "../js/utils";
import '../js/simpleMarkers'
import RoutingMachineWrapper from "./mapRoutingWrapper";

export default function Map(props: MapProperties) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [startPoint, setStartPoint] = useState<Position>({ lat: 0, lng: 0 });
  const [endPoint, setEndPoint] = useState<Position | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      getLocationAndSetMarker();

      // Initializing the map
      const mapInstance = L.map(mapRef.current).setView(props.startGeoData, 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      const simpleMarkers = new (L.Control as any).SimpleMarkers({ add_control: true, delete_control: true }).addTo(mapInstance);

      // mapInstance.on('click', function(e) {
      //   const position: Position = e.latlng;
      //   addMarker(position);
      // });

      // Save the map to the state
      setMap(mapInstance);
    }
  }, []);

  useEffect(() => {
    if (map) {
      map.on('simplemarkers:markeradded', async (e: any) => {
        const markerEvent = e as { marker: L.Marker };
        let position: Position = {
          lat: markerEvent.marker.getLatLng().lat,
          lng: markerEvent.marker.getLatLng().lng
        };
        let response = await reverseGeocode(position)
        let marmkerToAdd: MapMarker = {
          id: Date.now(),
          position: position,
          address: response,
          leafLetMarker: markerEvent.marker
        };
        setMarkers((markers) => [...markers, marmkerToAdd]);
        props.markerAddressCallback(marmkerToAdd.address.address);
        // setEndPoint(position);
      });
      map.on('simplemarkers:markerremoved', (e: any) => {
        const markerEvent = e as { marker: L.Marker };
        let marmkerToRemove: MapMarker = {
          id: Date.now(),
          position: {
            lat: markerEvent.marker.getLatLng().lat,
            lng: markerEvent.marker.getLatLng().lng
          } as Position,
          address: {} as NominatimResponse,
          leafLetMarker: markerEvent.marker
        };
        setMarkers((markers) => markers.filter((marker) => marker.id !== marmkerToRemove.id));
      });
  
      // Remove event listeners when the component is unmounted
      return () => {
        map.off('simplemarkers:markeradded');
        map.off('simplemarkers:markerremoved');
      };
    }
  }, [map]);
  
  
  

  async function getLocationAndSetMarker() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos: Position = { lat: position.coords.latitude, lng: position.coords.longitude };
        setStartPoint(pos);
        addMarker(pos);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  async function reverseGeocode(position: Position): Promise<NominatimResponse> {
    try {
      const response = await axios.get<NominatimResponse>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
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
      leafLetMarker: new L.Marker(mapPositionToLatLng(position) as L.LatLng)
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    props.markerAddressCallback(newMarker.address.address);
    // setEndPoint(position);

    if (map) {
      L.marker(position).addTo(map).bindPopup(`
        <div>
          <p>Adresse: ${newMarker.address.display_name}</p>
          <p>Position: ${newMarker.position.toString()}</p>
        </div>
      `);
    }
  }

  useEffect(() => {
    if (map && startPoint && endPoint) {
      L.Routing.control({
        waypoints: [
          L.latLng(startPoint),
          L.latLng(endPoint)
        ],
        routeWhileDragging: true
      }).addTo(map);
    }
  }, [map, startPoint, endPoint]);

  return <div id="map" ref={mapRef} style={{ height: props.mapHeight }}>
  </div>;
}
