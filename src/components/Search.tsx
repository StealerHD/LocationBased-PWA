/** Inspired by https://github.com/luka1199/Leaflet.AnimatedSearchBox */
import React, { useState, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { Position } from "../js/position";
import { NominatimResponse } from "../js/nominatimResponse";
import { useStore } from "./store";

type SearchProps = {};

const Search: React.FC<SearchProps> = ({}) => {
  const map = useMap();
  const serachContainerRef = useRef<HTMLDivElement | null>(null);
  const searchboxWrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const { state, dispatch } = useStore();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const searchControlDiv = L.control({ position: "topright" });

    searchControlDiv.onAdd = () => {
      const containerDiv = L.DomUtil.create(
        "div",
        "leaflet-control leaflet-searchbox-container"
      );
      const searchBoxWrapper = L.DomUtil.create(
        "div",
        "leaflet-searchbox-wrapper",
        containerDiv
      );
      const searchInput = L.DomUtil.create(
        "input",
        "leaflet-searchbox leaflet-searchbox-left",
        searchBoxWrapper
      );
      searchInput.type = "text";
      searchInput.placeholder = "Search...";
      searchInput.id = "searchInput";

      const searchButton = L.DomUtil.create(
        "button",
        "leaflet-searchbox-button leaflet-searchbox-button-right",
        searchBoxWrapper
      );
      searchButton.type = "button";
      const searchIcon = L.DomUtil.create(
        "img",
        "leaflet-searchbox-icon",
        searchButton
      );
      searchIcon.src = "/search_icon.png";

      searchInputRef.current = searchInput;
      searchButtonRef.current = searchButton;
      searchboxWrapperRef.current = searchBoxWrapper;
      serachContainerRef.current = containerDiv;

      if (collapsed) {
        hide();
      }

      return containerDiv;
    };

    map.addControl(searchControlDiv);

    return () => {
      map.removeControl(searchControlDiv);
    };
  }, [map]);

  function show() {
    serachContainerRef.current?.classList.remove("collapsed");
    searchInputRef.current?.focus();
    setTimeout(() => {
      setCollapsed(false);
    }, 600);
  }

  function hide() {
    serachContainerRef.current?.classList.add("collapsed");
    if (searchInputRef.current) {
      searchInputRef.current.blur();
      searchInputRef.current!.value = "";
    }

    if (searchButtonRef.current) {
      searchButtonRef.current.blur();
    }

    setTimeout(() => {
      setCollapsed(true);
    }, 600);
  }

  useEffect(() => {
    if (searchButtonRef.current) {
      searchButtonRef.current.addEventListener("click", () => {
        if (collapsed) {
          show();
        } else {
          hide();
        }
      });
    }
  }, [collapsed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const searchValue = searchInputRef.current?.value;
        if (searchValue) {
          const cachedResponse = state.nominatimCache[searchValue];

          if (cachedResponse) {
            console.log("Using cached search response");
            const position: Position = {
              lat: parseFloat(cachedResponse.lat),
              lng: parseFloat(cachedResponse.lon),
            };
            setTimeout(hide, 35);
            map.flyTo(position, 16);
            searchInputRef.current!.value = "";
          } else {
            axios
              .get<NominatimResponse>(
                `https://nominatim.openstreetmap.org/search?format=json&q=${searchValue}`
              )
              .then((response) => {
                const nominatimResponse: any = response.data;
                if (nominatimResponse.length > 0) {
                  const firstResult = nominatimResponse[0];
                  const position: Position = {
                    lat: parseFloat(firstResult.lat),
                    lng: parseFloat(firstResult.lon),
                  };
                  dispatch({ type: 'addToNominatimCache', payload: { key: searchValue, value: firstResult } });
                  setTimeout(hide, 35);
                  map.flyTo(position, 16);
                }

                searchInputRef.current!.value = "";
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }
      }
    };

    if (searchInputRef.current) {
      searchInputRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (searchInputRef.current) {
        searchInputRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [state]);

  return null;
};

export default Search;
