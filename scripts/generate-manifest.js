import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basePath = process.env.BASE_PATH || "/";

const manifest = {
  name: "LocationBased-PWA",
  short_name: "LocationBased-PWA",
  description: "LocationBased-PWA",
  lang: "en-US",
  start_url: `${basePath}`,
  display: "standalone",
  background_color: "#EE350F",
  theme_color: "#EE350F",
  icons: [
    {
      "src": `${basePath}icons/128x128.png`,
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": `${basePath}icons/144x144.png`,
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": `${basePath}icons/152x152.png`,
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": `${basePath}icons/192x192.png`,
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": `${basePath}icons/256x256.png`,
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      src: `${basePath}icons/512x512.png`,
      sizes: "512x512",
      type: "image/png",
    },
  ],
};

fs.writeFileSync(
  path.resolve(__dirname, "..", "src", "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
