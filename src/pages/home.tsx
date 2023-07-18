import React, { useEffect, useState } from "react";
import {
  Page,
  Link,
  Toolbar,
  Block,
  Panel,
} from "framework7-react";
import Map from "../components/map";
import WikipediaEntry from "../components/wiki";
import { Address } from "../js/address";

const HomePage = () => {
  const [wikiSearchTerm, setWikiSearchTerm] = useState<string | null>(null);
  const defaultLocation: [number, number] = [47.665628, 9.447467];
  const [mapHeight, setMapHeight] = useState("100vh");
  const panelLinkRef = React.useRef<{ el: HTMLElement | null, f7SmartSelect: () => any }>({ el: null, f7SmartSelect: () => {} });

  const handleResize = () => {
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    
    const calculatedMapHeight = `${vh}px`;
    setMapHeight(calculatedMapHeight);
  };

  useEffect(() => {
    setTimeout(handleResize, 0); // delay the initial call
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMarkerAddress = (address: Address) => {
    if (address.village) {
      setWikiSearchTerm(address.village);
    } else if (address.town) {
      setWikiSearchTerm(address.town);
    } else if (address.city) {
      setWikiSearchTerm(address.city);
    } else {
      setWikiSearchTerm(null);
    }
  };

  return (
    <Page name="home">
      {/* Since Framework7 has unfortunatly no API way to open existing paneles
          programmatically, we have to do a hacky workaround with the Link component
          therefor the link and the toolbar are hidden
      */}
      <Toolbar bottom className="hidden-link">
        <Link panelOpen="right" className="hidden-link" ref={panelLinkRef}>
          Left Link
        </Link>
      </Toolbar>
      {/* Page content */}
      <Block style={{ height: "200px", padding: 0, margin: 0 }}>
        <Map
          mapHeight={mapHeight}
          startGeoData={defaultLocation}
          markerAddressCallback={handleMarkerAddress}
          panelLinkRef={panelLinkRef}
        />
      </Block>
      <Panel right cover swipe swipeOnlyClose style={{ padding: "5px" }}>
        <h2>{wikiSearchTerm}</h2>
        {wikiSearchTerm !== null ? (
          <WikipediaEntry searchTerm={wikiSearchTerm}></WikipediaEntry>
        ) : (
          <p>No Wikipedia entry found!</p>
        )}
      </Panel>
    </Page>
  );
};
export default HomePage;
