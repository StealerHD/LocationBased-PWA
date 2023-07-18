import { NominatimResponse } from "./nominatimResponse";
import { Position } from "./position";

export type MapMarker  = {
  id: string;
  position: Position;
  address: NominatimResponse;
};
