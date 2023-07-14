import React, { useEffect, useState } from "react";
import {
  Page,
  Navbar,
  NavTitle,
  Link,
  Toolbar,
  Block,
  Panel,
} from "framework7-react";
import Map from "../components/map";
import WikipediaEntry from "../components/wiki";
import Dom7 from "dom7";
import { Address } from "../js/address";

const $$ = Dom7;

const HomePage = () => {
  const [wikiSearchTerm, setWikiSearchTerm] = useState<string>("");
  const defaultLocation: [number, number] = [47.665628, 9.447467];
  const [mapHeight, setMapHeight] = useState("100vh");
  const panelLinkRef = React.useRef<{ el: HTMLElement | null, f7SmartSelect: () => any }>({ el: null, f7SmartSelect: () => {} });

  const handleResize = () => {
    // const navbar = $$(".navbar");
    const toolbar = $$(".toolbar");

    // console.log("Navbar:", navbar); // Check if the element is found
    console.log("Toolbar:", toolbar);

    // const navbarHeight = navbar.height() || 0;
    const toolbarHeight = toolbar.height() || 0;

    // console.log("Navbar Height:", navbarHeight); // Check if the height is properly calculated
    console.log("Toolbar Height:", toolbarHeight);

    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    console.log("vh:", vh);
    const calculatedMapHeight = `${vh - toolbarHeight}px`;
    console.log("calculatedMapHeight:", calculatedMapHeight);
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
      setWikiSearchTerm("");
    }
    console.log(wikiSearchTerm);
  };

  return (
    <Page name="home">
      {/* Top Navbar */}
      {/* <Navbar>
        <NavTitle>f7-testing</NavTitle>
      </Navbar> */}
      {/* Toolbar */}
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
        {wikiSearchTerm !== "" ? (
          <WikipediaEntry searchTerm={wikiSearchTerm}></WikipediaEntry>
        ) : (
          <p>No Wikipedia entry found!</p>
        )}
      </Panel>
    </Page>
  );
};
export default HomePage;
