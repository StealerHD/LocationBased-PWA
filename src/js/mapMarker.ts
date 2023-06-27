import { NominatimResponse } from "./nominatimResponse";
import { Position } from "./position";

export type MapMarker  = {
  id: number;
  position: Position;
  address: NominatimResponse;
};
