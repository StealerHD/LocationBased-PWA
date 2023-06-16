import React, { useState } from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  NavTitleLarge,
  Link,
  Toolbar,
  Block, Panel,
} from 'framework7-react';
import Map from '../components/map';
import WikipediaEntry from "../components/wiki";


const HomePage = () => {
  const [wikiSearchTerm, setWikiSearchTerm]: any = useState(null)

  const defaultLocation: [number, number] = [47.665628,9.447467]

  const handleMarkerAddress = (address: any) => {
    if (address.village != null) {
      setWikiSearchTerm(address.village)
    } else if (address.town != null) {
      setWikiSearchTerm(address.town)
    } else if (address.city !=null) {
      setWikiSearchTerm(address.city)
    }
    else {
      setWikiSearchTerm("")
    }
    console.log(wikiSearchTerm)
  }

  return (
  <Page name="home">
    {/* Top Navbar */}
    <Navbar>
      <NavTitle>f7-testing</NavTitle>
    </Navbar>
    {/* Toolbar */}
    <Toolbar bottom>
      <Link panelOpen="right">Left Link</Link>
      <Link>Right Link</Link>
    </Toolbar>
    {/* Page content */}
    <Block>
      <Map
      startGeoData={defaultLocation}
      markerAddressCallback={handleMarkerAddress}/>
    </Block>
    <Panel right cover style={{padding: "5px"}}>
      <h2>{wikiSearchTerm}</h2>
      {
        (wikiSearchTerm !== "") ? <WikipediaEntry searchTerm={wikiSearchTerm}></WikipediaEntry> : <p>No Wikipedia entry found!</p>
      }
    </Panel>

  </Page>
  );
};
export default HomePage;