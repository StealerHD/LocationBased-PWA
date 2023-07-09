import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { RoutingConfig } from '../js/routingConfig';
import { mapPositionToLatLng } from '../js/utils';

function RoutingMachine({ start, end }: RoutingConfig) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control>();

  useEffect(() => {
    const startPoint = mapPositionToLatLng(start);
    const endPoint = mapPositionToLatLng(end);

    if (!startPoint) {
      return;
    }

    const plan = L.Routing.plan([
      startPoint,
      endPoint || startPoint,
    ], {
      draggableWaypoints: true
    });

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [
        startPoint,
        endPoint || startPoint,
      ],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 1
      },
      plan: plan,
      show: false,
      addWaypoints: false,
      routeWhileDragging: true,
      fitSelectedRoutes: true,
      showAlternatives: false
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end]);

  return null;
}

export default RoutingMachine;
