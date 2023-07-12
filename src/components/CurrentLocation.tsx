import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { Position } from "../js/position";

type CurrentLocationProps = {
  setStartPoint: (pos: Position) => void;
  addMarker: (pos: Position, id?: string) => Promise<void>;
};

const CurrentLocation: React.FC<CurrentLocationProps> = ({ setStartPoint, addMarker }) => {
  const map = useMap();
  const didRun = useRef(false);
  const startPointMarkerId: string = 'startPointMarker';

  useEffect(() => {
    if (didRun.current) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setStartPoint(pos);
        addMarker(pos, startPointMarkerId).then(() => {
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

export default CurrentLocation;
