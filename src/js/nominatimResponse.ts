import { Address } from "./address";

export type NominatimResponse = { 
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address: Address
    boundingbox: string[];
};