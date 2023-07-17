import React from "react";
import { StoreProvider } from "./Store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {f7, App, View } from "framework7-react";
import routes from "../js/routes";

const MyApp = () => {
  const queryClient = new QueryClient();
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

  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <App {...f7params}>
          {/* Your main view, should have "view-main" class */}
          <View main className="safe-areas" url="/" />
        </App>
      </QueryClientProvider>
    </StoreProvider>
  );
};
export default MyApp;
