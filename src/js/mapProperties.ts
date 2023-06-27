import { Address } from "./address";
export type MapProperties = {
    mapHeight: string;
    startGeoData: [number, number];
    markerAddressCallback: (addressInfo: Address) => void;
};