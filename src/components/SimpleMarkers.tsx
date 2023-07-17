/**
 * Inspired by https://github.com/jdomingu/Leaflet.SimpleMarkers/blob/master/lib/Control.SimpleMarkers.js
 */
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

type SimpleMarkersProps = {
  add_control: boolean;
  delete_control: boolean;
  allow_popup?: boolean;
  marker_icon?: L.Icon;
  marker_draggable?: boolean;
  refAddMode?: React.Dispatch<React.SetStateAction<boolean>>;
  refDeleteMode?: React.Dispatch<React.SetStateAction<boolean>>;
};

const SimpleMarkers: React.FC<SimpleMarkersProps> = ({
  add_control = true,
  delete_control = true,
  allow_popup = true,
  marker_icon = undefined,
  marker_draggable = false,
  refAddMode = undefined,
  refDeleteMode = undefined,
}) => {
  const map = useMap();
  const addDivRef = useRef<HTMLDivElement | null>(null);
  const deleteDivRef = useRef<HTMLDivElement | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const addModeRef = useRef(addMode);
  const deleteModeRef = useRef(deleteMode);

  useEffect(() => {
    addModeRef.current = addMode;
  }, [addMode]);

  useEffect(() => {
    deleteModeRef.current = deleteMode;
  }, [deleteMode]);

  useEffect(() => {
    const markerControlDiv = L.control({ position: "topleft" });

    markerControlDiv.onAdd = () => {
      const containerDiv = L.DomUtil.create("div", "marker-controls");

      const addDiv = L.DomUtil.create(
        "div",
        "add_marker_control",
        containerDiv
      );
      addDiv.dataset.selected = addModeRef.current ? "true" : "false";
      addDivRef.current = addDiv;

      const deleteDiv = L.DomUtil.create(
        "div",
        "del_marker_control",
        containerDiv
      );
      deleteDiv.dataset.selected = deleteModeRef.current ? "true" : "false";
      deleteDivRef.current = deleteDiv;

      return containerDiv;
    };

    map.addControl(markerControlDiv);

    return () => {
      map.removeControl(markerControlDiv);
    };
  }, [map, addMode, deleteMode]);

  useEffect(() => {
    if (addDivRef.current) {
      addDivRef.current.onclick = (event) => {
        event.stopPropagation();
        setTimeout(() => {
          setAddMode(!addMode);
          refAddMode && refAddMode(!addMode);
        }, 25);
        setDeleteMode(false);
        refDeleteMode && refDeleteMode(false);
        addDivRef.current!.dataset.selected = addMode ? "true" : "false";
      };
    }
    if (deleteDivRef.current) {
      deleteDivRef.current.onclick = (event) => {
        event.stopPropagation(); 
        setDeleteMode(!deleteMode);
        refDeleteMode && refDeleteMode(!deleteMode);
        setAddMode(false);
        refAddMode && refAddMode(false);
        deleteDivRef.current!.dataset.selected = deleteMode ? "true" : "false";
      };
    }
  }, [addMode, deleteMode]);

  return null;
};

export default SimpleMarkers;
