import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
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
  
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = undefined;
    }
  
    if (endPoint) {
      const plan = L.Routing.plan([
        startPoint,
        endPoint,
      ], {
        draggableWaypoints: true
      });
  
      routingControlRef.current = L.Routing.control({
        waypoints: [
          startPoint,
          endPoint,
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
    }
  
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end]);
  

  return null;
}

export default RoutingMachine;
