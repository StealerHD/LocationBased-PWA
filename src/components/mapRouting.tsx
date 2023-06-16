import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props: any) => {

    const plan =  L.Routing.plan([
        L.latLng(57.74, 11.94),
        L.latLng(57.6792, 11.949)
      ], {
        draggableWaypoints: true
      });

  const instance = L.Routing.control({
    waypoints: [
      L.latLng(47.665628, 9.447467),
      L.latLng(47.665828, 9.447367)
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
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
