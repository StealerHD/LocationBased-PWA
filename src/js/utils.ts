import { Position } from "./position";
import L from "leaflet";

export function mapPositionToLatLng(
  position: Position | undefined
): L.LatLng | undefined {
  if (position) {
    return new L.LatLng(position.lat, position.lng);
  }

  return undefined;
}
