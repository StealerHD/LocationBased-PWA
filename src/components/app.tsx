import React from "react";
import { StoreProvider } from "./store";

import { f7, f7ready, App, View } from "framework7-react";

import routes from "../js/routes";
import store from "../js/store";

const MyApp = () => {
  const getSWPath = () => {
    const { pathname } = window.location;
    const paths = pathname.split("/");
    const subDir = paths[1]; // 0 will be empty string as pathname starts with '/'
    return `/${subDir}/service-worker.js`;
  };


  // Framework7 Parameters
  const f7params = {
    name: "LocationBasedApp", // App name
    theme: "auto", // Automatic theme detection

    darkMode: true,

    // App store
    store: store,
    // App routes
    routes: routes,

    // Register service worker (only on production build)
    serviceWorker:
      process.env.NODE_ENV === "production"
        ? {
            path: getSWPath(),
          }
        : {},
  };

  f7ready(() => {
    // Call F7 APIs here
  });

  return (
    <StoreProvider>
      <App {...f7params}>
        {/* Your main view, should have "view-main" class */}
        <View main className="safe-areas" url="/" />
      </App>
    </StoreProvider>
  );
};
export default MyApp;
