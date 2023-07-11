import React, { useEffect, useRef, useState } from 'react';
import L, { LeafletMouseEvent } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { mapPositionToLatLng } from "../js/utils";
import { Position } from '../js/position';
import { MapMarker } from '../js/mapMarker';

type SimpleMarkersProps = {
  add_control: boolean;
  delete_control: boolean;
  allow_popup?: boolean;
  marker_icon?: L.Icon;
  marker_draggable?: boolean;
  onAddMarker?: (marker: L.Marker) => void;
  onDeleteMarker?: (marker: L.Marker) => void;
  addMarker: (position: Position) => void;
  markerList: MapMarker[];
};

const SimpleMarkers: React.FC<SimpleMarkersProps> = ({
  add_control = true,
  delete_control = true,
  allow_popup = true,
  marker_icon = undefined,
  marker_draggable = false,
  onAddMarker = undefined,
  onDeleteMarker = undefined,
  addMarker,
  markerList = [] 
}) => {
  const map = useMap();
  const markerListRef = useRef<L.Marker[]>([]);
  const addDivRef = useRef<HTMLDivElement | null>(null);
  const deleteDivRef = useRef<HTMLDivElement | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  function EnableAddMode() {
    if (addMode) {
      useMapEvents({
        click(e: any) {
          addMarkerToMap(e);
        }
      });


      // map.on('click', addMarkerToMap);
    } else {
      map.off('click', addMarkerToMap);
    }
  }

  function EnableDeleteMode() {
    if (deleteMode) {
      useMapEvents({
        click(e: any) {
          deleteMarkerFromMap(e);
        }
      });
      // map.on('click', deleteMarkerFromMap);
    } else {
      map.off('click', deleteMarkerFromMap);
    }
  }

  function latLngToPosition(latLng: L.LatLng): Position {
    return { lat: latLng.lat, lng: latLng.lng };
  }

  const addMarkerToMap = (e: LeafletMouseEvent) => {
    if (addMode) {
      return;
    }

     addMarker(latLngToPosition(e.latlng));
    markerListRef.current.push(markerList[markerList.length - 1].leafLetMarker);
    // const marker = L.marker(e.latlng, { draggable: marker_draggable, icon: marker_icon });
    // marker.addTo(map);
    // if (allow_popup) {
    //   const popupContent = "You clicked on the map at " + e.latlng.toString();
    //   const thePopup = L.popup({ maxWidth: 160, closeButton: false });
    //   thePopup.setContent(popupContent);
    //   marker.bindPopup(thePopup).openPopup();
    // }
    // if (onAddMarker) {
    //   onAddMarker(marker);
    // }
    // markerListRef.current.push(marker);
    // setAddMode(false);
    //setAddControl(false);
  };

  const deleteMarkerFromMap = (e: LeafletMouseEvent) => {
    const marker = markerListRef.current.find(m => m.getLatLng().equals(e.latlng));
    if (marker) {
      if (onDeleteMarker) {
        onDeleteMarker(marker);
      }
      map.removeLayer(marker);
      markerListRef.current = markerListRef.current.filter(m => m !== marker);
    }
    setDeleteMode(false);
    // setDeleteControl(false);
  };

  // useEffect(() => {
  //   if (addMode) {
  //     useMapEvent('click', addMarkerToMap);


  //     // map.on('click', addMarkerToMap);
  //   } else {
  //     map.off('click', addMarkerToMap);
  //   }
  // }, [addMode]);

  // useEffect(() => {
  //   if (deleteMode) {
  //     useMapEvent('click', deleteMarkerFromMap);
  //     // map.on('click', deleteMarkerFromMap);
  //   } else {
  //     map.off('click', deleteMarkerFromMap);
  //   }
  // }, [deleteMode]);

  useEffect(() => {
    const markerControlDiv = L.control({ position: 'topleft' });
    markerControlDiv.onAdd = () => {
      const containerDiv = L.DomUtil.create('div', 'marker-controls');

      const addDiv = L.DomUtil.create('div', 'add_marker_control', containerDiv);
      addDiv.style.backgroundColor = addMode ? 'green' : '';
      addDivRef.current = addDiv;

      const deleteDiv = L.DomUtil.create('div', 'del_marker_control', containerDiv);
      deleteDiv.style.backgroundColor = deleteMode ? 'red' : '';
      deleteDivRef.current = deleteDiv;

      return containerDiv;
    };

    map.addControl(markerControlDiv);
  }, [map]);

  useEffect(() => {
    if (addDivRef.current) {
      addDivRef.current.onclick = () => {
        setAddMode(!addMode);
        // setAddControl(!add_control);
      };
      addDivRef.current.style.backgroundColor = addMode ? 'green' : '';
    }
    if (deleteDivRef.current) {
      deleteDivRef.current.onclick = () => {
        setDeleteMode(!deleteMode);
        // setDeleteControl(!delete_control);
      };
      deleteDivRef.current.style.backgroundColor = deleteMode ? 'red' : '';
    }
  }, [addMode, deleteMode]);

  return null;
};

export default SimpleMarkers;
