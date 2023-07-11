import React, { useEffect, useRef, useState } from "react";
import L, { LeafletMouseEvent } from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";
import { mapPositionToLatLng } from "../js/utils";
import { Position } from "../js/position";
import { MapMarker } from "../js/mapMarker";

type SimpleMarkersProps = {
  add_control: boolean;
  delete_control: boolean;
  allow_popup?: boolean;
  marker_icon?: L.Icon;
  marker_draggable?: boolean;
  onAddMarker?: (marker: L.Marker) => void;
  onDeleteMarker?: (marker: L.Marker) => void;
  addMarker: (position: Position) => void;
  refAddMode?: React.Dispatch<boolean>;
  refDeleteMode?: React.Dispatch<boolean>;
  // markerList: MapMarker[];
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
  refAddMode = undefined,
  refDeleteMode = undefined,
}) => {
  const map = useMap();
  const addDivRef = useRef<HTMLDivElement | null>(null);
  const deleteDivRef = useRef<HTMLDivElement | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const markerControlDiv = L.control({ position: "topleft" });
    markerControlDiv.onAdd = () => {
      const containerDiv = L.DomUtil.create("div", "marker-controls");

      const addDiv = L.DomUtil.create(
        "div",
        "add_marker_control",
        containerDiv
      );
      addDiv.style.backgroundColor = addMode ? "green" : "";
      addDivRef.current = addDiv;

      const deleteDiv = L.DomUtil.create(
        "div",
        "del_marker_control",
        containerDiv
      );
      deleteDiv.style.backgroundColor = deleteMode ? "red" : "";
      deleteDivRef.current = deleteDiv;

      return containerDiv;
    };

    map.addControl(markerControlDiv);
  }, [map]);

  useEffect(() => {
    if (addDivRef.current) {
      addDivRef.current.onclick = () => {
        setAddMode(!addMode);
        refAddMode && refAddMode(!addMode);
        refDeleteMode && refDeleteMode(false);
      };
      addDivRef.current.style.backgroundColor = addMode ? "green" : "";
    }
    if (deleteDivRef.current) {
      deleteDivRef.current.onclick = () => {
        setDeleteMode(!deleteMode);
        refDeleteMode && refDeleteMode(!deleteMode);
        refAddMode && refAddMode(false);
        // setDeleteControl(!delete_control);
      };
      deleteDivRef.current.style.backgroundColor = deleteMode ? "red" : "";
    }
  }, [addMode, deleteMode]);

  return null;
};

export default SimpleMarkers;
