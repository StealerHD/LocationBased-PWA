import React from "react";
import { StoreProvider } from "./store";

import { f7, f7ready, App, View } from "framework7-react";

import routes from "../js/routes";
import store from "../js/store";

const MyApp = () => {
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
            path: "/service-worker.js",
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
