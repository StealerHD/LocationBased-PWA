import { NominatimResponse } from "./nominatimResponse";
import { Position } from "./position";
import L from 'leaflet';


export type MapMarker  = {
  id: string;
  position: Position;
  address: NominatimResponse;
  leafLetMarker: L.Marker;
};
