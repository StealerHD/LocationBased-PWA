import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { Position } from "../js/position";

type MapEffectProps = {
  setStartPoint: (pos: Position) => void;
  addMarker: (pos: Position) => Promise<void>;
};

const MapEffect: React.FC<MapEffectProps> = ({ setStartPoint, addMarker }) => {
  const map = useMap();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setStartPoint(pos);
        addMarker(pos).then(() => {
          map.flyTo([pos.lat, pos.lng], 14);
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      console.log("Geolocation is not supported by this browser.");
    }

    didRun.current = true;
  }, [map, setStartPoint, addMarker]);

  return null;
};

export default MapEffect;
