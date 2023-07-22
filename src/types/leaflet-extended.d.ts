import 'leaflet';

declare module 'leaflet' {
    function control(options?: ControlOptions): ExtendedControl;

    interface ControlOptions {
        position?: ControlPosition;
    }

    type ControlPosition = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

    class ExtendedControl extends Control {
        options: ControlOptions;
        _div: any;
        update: () => void;
        onAdd: (map: Map) => HTMLElement;
        getPosition(): ControlPosition;
        setPosition(position: ControlPosition): this;
        getContainer(): HTMLElement;
        addTo(map: Map): this;
        remove(): this;
    }
}
