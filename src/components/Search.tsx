import React, { useState, useEffect, useRef } from "react";
import {
    useMap
  } from "react-leaflet";
  import L from "leaflet";
import axios from "axios";
import { Position } from "../js/position";
import { NominatimResponse } from "../js/nominatimResponse";

type SearchProps = {

};

const Search: React.FC<SearchProps> = ({ 

}) => {   
    const map = useMap();
    const serachContainerRef = useRef<HTMLDivElement | null>(null);
    const searchboxWrapperRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const searchButtonRef = useRef<HTMLButtonElement | null>(null);
    const autocompletionRef = useRef<HTMLUListElement | null>(null);

    const [collapsed, setCollapsed] = useState(false);


    useEffect(() => {
        const searchControlDiv = L.control({ position: "topright" });

        searchControlDiv.onAdd = () => {
            const containerDiv = L.DomUtil.create('div', 'leaflet-control leaflet-searchbox-container');
            const searchBoxWrapper = L.DomUtil.create('div', 'leaflet-searchbox-wrapper', containerDiv);
            const searchInput = L.DomUtil.create('input', 'leaflet-searchbox leaflet-searchbox-left', searchBoxWrapper);
            searchInput.type = 'text';
            searchInput.placeholder = 'Search...';
            searchInput.id = "searchInput";

            const searchButton = L.DomUtil.create('button', 'leaflet-searchbox-button leaflet-searchbox-button-right', searchBoxWrapper);
            searchButton.type = 'button';
            const searchIcon = L.DomUtil.create('img', 'leaflet-searchbox-icon', searchButton);
            searchIcon.src = "/search_icon.png";

            const autoComplete = L.DomUtil.create('ul', 'leaflet-searchbox-autocomplete', containerDiv);

            searchInputRef.current = searchInput;
            searchButtonRef.current = searchButton;
            searchboxWrapperRef.current = searchBoxWrapper;
            autocompletionRef.current = autoComplete;
            serachContainerRef.current = containerDiv;

            return containerDiv;
        };

        map.addControl(searchControlDiv);

        return () => {
            map.removeControl(searchControlDiv);
        };

    }, [map]);


    useEffect(() => {
        if (collapsed && serachContainerRef.current) {
            serachContainerRef.current?.classList.add('collapsed');
            if (searchInputRef.current) {
                searchInputRef.current.blur();
            }

            if (searchButtonRef.current) {
                searchButtonRef.current.blur();
            }

            setTimeout(() => {
                setCollapsed(true);
            }, 600);
        } else {
            serachContainerRef.current?.classList.remove('collapsed');
            setTimeout(() => {
                setCollapsed(false);
            }, 600);
        }
    }, [collapsed]);

    useEffect(() => {
        if (searchButtonRef.current && searchInputRef.current) {
            searchButtonRef.current.addEventListener('click', () => {
                const searchValue = searchInputRef.current?.value;
                if (searchValue) {
                    axios.get<NominatimResponse>(`https://nominatim.openstreetmap.org/search?format=json&q=${searchValue}`)
                    .then(response => {
                        const nominatimResponse: any = response.data;
                        if (nominatimResponse.length > 0) {
                            const firstResult = nominatimResponse[0];
                            const position: Position = {
                                lat: parseFloat(firstResult.lat),
                                lng: parseFloat(firstResult.lon)
                            };
                            map.setView(position, 15);
                        }

                        searchInputRef.current!.value = '';
                    })
                    .catch(error => {
                        console.error(error);
                    });
                }
            });
        }
    }, []);

    return null;
};

export default Search;