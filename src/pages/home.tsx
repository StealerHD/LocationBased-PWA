import React, { useEffect, useRef, useState } from 'react';
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
import Dom7 from 'dom7';

const $$ = Dom7;

const HomePage = () => {
  const [wikiSearchTerm, setWikiSearchTerm]: any = useState(null)

  const defaultLocation: [number, number] = [47.665628,9.447467]

  const [mapHeight, setMapHeight] = useState('86vh');

  const handleResize = () => {
    const navbar = $$('.navbar');
    const toolbar = $$('.toolbar');
  
    console.log('Navbar:', navbar); // Check if the element is found
    console.log('Toolbar:', toolbar);
  
    const navbarHeight = navbar.height() || 0;
    const toolbarHeight = toolbar.height() || 0;
  
    console.log('Navbar Height:', navbarHeight); // Check if the height is properly calculated
    console.log('Toolbar Height:', toolbarHeight);
  
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    console.log('vh:', vh);
    const calculatedMapHeight = `${vh - navbarHeight - toolbarHeight}px`;
    console.log('calculatedMapHeight:', calculatedMapHeight);
    setMapHeight(calculatedMapHeight);
  };
  

  useEffect(() => {
    setTimeout(handleResize, 0); // delay the initial call
    window.addEventListener('resize', handleResize);
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  

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
    <Block style={{ height: "200px" }}>
      <Map
      mapHeight={mapHeight}
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