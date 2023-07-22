type MapProperties = {
    mapHeight: string;
    startGeoData: [number, number];
    markerAddressCallback: (addressInfo: Address) => void;
    panelLinkRef: React.RefObject<{ el: HTMLElement | null, f7SmartSelect: () => any }>;
};