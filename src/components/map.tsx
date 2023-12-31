import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import RoutingMachineWrapper from "./mapRoutingWrapper";
import SimpleMarkers from "./SimpleMarkers";
import CurrentLocation from "./CurrentLocation";
import Search from "./Search";
import { useStore } from './Store';

const Map: React.FC<MapProperties> = ({ mapHeight, markerAddressCallback, startGeoData, panelLinkRef }) => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [startPoint, setStartPoint] = useState<Position>({ lat: 0, lng: 0 });
  const [endPoint, setEndPoint] = useState<Position | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const startPointMarkerId: string = "startPointMarker";
  const { state, dispatch } = useStore();

  async function reverseGeocode(
    position: Position
  ): Promise<NominatimResponse> {

    const cacheKey = `${position.lat},${position.lng}`;
    const cachedResponse = state.nominatimCache[cacheKey];

    if (cachedResponse) {
      console.log("Using cached response:", cachedResponse);
      return cachedResponse;
    }

    try {
      const response = await axios.get<NominatimResponse>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
      dispatch({ type: 'addToNominatimCache', payload: { key: cacheKey, value: response.data } });
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
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  }

  function deleteMarkerFromMap(id: string) {
    if (!deleteMode) return;
    if (id === startPointMarkerId) return;
  
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== id)
    );
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
      center={startGeoData}
      zoom={14}
      style={{ height: mapHeight }}
      id="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CurrentLocation setStartPoint={setStartPoint} addMarker={addMarker} />
      <SimpleMarkers
        add_control={true}
        delete_control={true}
        refAddMode={setAddMode}
        refDeleteMode={setDeleteMode}
      />
      <EnableAddMode />
      <Search />
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
            }}
          >
            <Popup>
              <div>
                <p>
                  Address:
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (marker.address) {
                        markerAddressCallback(marker.address.address);
                      }

                      if (panelLinkRef.current && marker.address.address) {
                        panelLinkRef.current.el?.click();
                      }
                    }}
                  >
                    {marker.address.display_name}
                  </a>
                </p>
                {marker.id !== startPointMarkerId && (
                  <button
                    className="routing-button"
                    onClick={() => setEndPoint(marker.position)}>
                    Calculate route to this position
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
      {endPoint && <RoutingMachineWrapper start={startPoint} end={endPoint} />}
    </MapContainer>
  );
}

export default Map;
