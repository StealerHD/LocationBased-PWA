/** Inspired by https://github.com/luka1199/Leaflet.AnimatedSearchBox */
import { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import axios, { AxiosError } from "axios";
import { useStore } from "./Store";
import { useQuery } from "@tanstack/react-query";

const Search = () => {
  const map = useMap();
  const serachContainerRef = useRef<HTMLDivElement | null>(null);
  const searchboxWrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const { state, dispatch } = useStore();
  const [collapsed, setCollapsed] = useState(true);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  /**
   * Since AnimatedSearchBox is a leaflet plugin that is not written in React,
   * we tried to replicate the plugin's functionality in React. 
   */
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
      searchIcon.src = "search_icon.png";
      searchIcon.alt = "Search";
      searchIcon.width = 48;
      searchIcon.height = 48;

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

  /**
   * We use react-query here to have better control over the request and
   * have better error handling.
   */
  useQuery<NominatimResponse[], AxiosError>({
    queryKey: ['nominatim', searchValue],
    queryFn: async () => {
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchValue}`);
      return data as NominatimResponse[];
    },
    enabled: !!searchValue,  // Only run the query when searchValue is not null
    retry: false,
    onSuccess: (data: NominatimResponse[]) => {
      if (data.length > 0) {
        const firstResult = data[0];
        const position: Position = {
          lat: parseFloat(firstResult.lat),
          lng: parseFloat(firstResult.lon),
        };
        dispatch({ type: 'addToNominatimCache', payload: { key: searchValue!, value: firstResult } });
        setTimeout(hide, 35);
        map.flyTo(position, 16);
      }
      setSearchValue(null);
      searchInputRef.current!.value = "";
    },
    onError: (error: AxiosError) => {
      console.error(error);
    },
  });

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
            setSearchValue(searchValue);
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


  useEffect(() => {
    const handleClickOrTouchOutside = (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (
        searchboxWrapperRef.current &&
        !searchboxWrapperRef.current.contains(event.target as Node)
      ) {
        hide();
      }
    };

    document.addEventListener("mousedown", handleClickOrTouchOutside);
    document.addEventListener("touchstart", handleClickOrTouchOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOrTouchOutside);
      document.removeEventListener("touchstart", handleClickOrTouchOutside);
    };
  }, []);



  return null;
};

export default Search;
