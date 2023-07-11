import { LeafletEvent } from "leaflet";

declare module "leaflet" {
  interface MarkerAddedEvent extends LeafletEvent {
    marker: any;
  }

  interface MarkerRemovedEvent extends LeafletEvent {
    marker: any;
  }
}
