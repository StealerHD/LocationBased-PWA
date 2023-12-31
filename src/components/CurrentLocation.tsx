import { useEffect, useRef } from "react";
import { f7 } from "framework7-react";
import { useMap } from "react-leaflet";

type CurrentLocationProps = {
  setStartPoint: (pos: Position) => void;
  addMarker: (pos: Position, id?: string) => Promise<void>;
};

const CurrentLocation: React.FC<CurrentLocationProps> = ({
  setStartPoint,
  addMarker,
}) => {
  const map = useMap();
  const didRun = useRef(false);
  const startPointMarkerId: string = "startPointMarker";

  useEffect(() => {
    if (didRun.current) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setStartPoint(pos);

        /**
         * To prevent the start point marker from being deleted
         * whe set a fixed id for it.
         */
        addMarker(pos, startPointMarkerId).then(() => {
          map.flyTo([pos.lat, pos.lng], 14);
        });
      });
    } else {
      /**
       * To have more the feel of a native app we use a toast 
       * for error messages.
       */
      const toastLargeMessage = f7.toast.create({
        text: "Geolocation is not supported by this browser.",
        closeTimeout: 2000,
        horizontalPosition: "center",
        destroyOnClose: true,
        cssClass: "error-toast"
      });

      if (toastLargeMessage) {
        toastLargeMessage.open();
      } else {
        console.error("Failed to create toast.");
      }

      console.log("Geolocation is not supported by this browser.");
    }

    didRun.current = true;
  }, [map, setStartPoint, addMarker]);

  return null;
};

export default CurrentLocation;
