import React, { useEffect, useRef } from 'react';
import L, { LeafletMouseEvent } from 'leaflet';
import { useMap } from 'react-leaflet';

type SimpleMarkersProps = {
  add_control: boolean;
  setAddControl: (value: boolean) => void;
  delete_control: boolean;
  setDeleteControl: (value: boolean) => void;
  allow_popup?: boolean;
  marker_icon?: L.Icon;
  marker_draggable?: boolean;
  onAddMarker?: (marker: L.Marker) => void;
  onDeleteMarker?: (marker: L.Marker) => void;
  addMarker: (latLng: L.LatLng) => void;  // added this line
};

const SimpleMarkers: React.FC<SimpleMarkersProps> = ({
  add_control,
  setAddControl,
  delete_control,
  setDeleteControl,
  allow_popup = true,
  marker_icon = undefined,
  marker_draggable = false,
  onAddMarker = undefined,
  onDeleteMarker = undefined,
  addMarker,  // added this line
}) => {
  const map = useMap();
  const markerListRef = useRef<L.Marker[]>([]);
  const addDivRef = useRef<HTMLDivElement | null>(null);
  const deleteDivRef = useRef<HTMLDivElement | null>(null);

  const addMarkerToMap = (e: LeafletMouseEvent) => {
    if (!add_control) {
      return;
    }

    addMarker(e.latlng);  // updated this line

    const marker = L.marker(e.latlng, { draggable: marker_draggable, icon: marker_icon });
    marker.addTo(map);
    if (allow_popup) {
      const popupContent = "You clicked on the map at " + e.latlng.toString();
      const thePopup = L.popup({ maxWidth: 160, closeButton: false });
      thePopup.setContent(popupContent);
      marker.bindPopup(thePopup).openPopup();
    }
    if (onAddMarker) {
      onAddMarker(marker);
    }
    markerListRef.current.push(marker);
    setAddControl(false);
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
    setDeleteControl(false);
  };

  useEffect(() => {
    if (add_control) {
      map.on('click', addMarkerToMap);
    } else {
      map.off('click', addMarkerToMap);
    }
  }, [add_control]);

  useEffect(() => {
    if (delete_control) {
      map.on('click', deleteMarkerFromMap);
    } else {
      map.off('click', deleteMarkerFromMap);
    }
  }, [delete_control]);

  useEffect(() => {
    const markerControlDiv = L.control({ position: 'topleft' });
    markerControlDiv.onAdd = () => {
      const containerDiv = L.DomUtil.create('div', 'marker-controls');

      const addDiv = L.DomUtil.create('div', 'add_marker_control', containerDiv);
      addDiv.style.backgroundColor = add_control ? 'green' : '';
      addDivRef.current = addDiv;

      const deleteDiv = L.DomUtil.create('div', 'del_marker_control', containerDiv);
      deleteDiv.style.backgroundColor = delete_control ? 'red' : '';
      deleteDivRef.current = deleteDiv;

      return containerDiv;
    };

    map.addControl(markerControlDiv);
  }, [map]);

  useEffect(() => {
    if (addDivRef.current) {
      addDivRef.current.onclick = () => {
        setAddControl(!add_control);
      };
      addDivRef.current.style.backgroundColor = add_control ? 'green' : '';
    }
    if (deleteDivRef.current) {
      deleteDivRef.current.onclick = () => {
        setDeleteControl(!delete_control);
      };
      deleteDivRef.current.style.backgroundColor = delete_control ? 'red' : '';
    }
  }, [add_control, delete_control]);

  return null;
};

export default SimpleMarkers;
