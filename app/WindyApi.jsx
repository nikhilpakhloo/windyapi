"use client";

import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import { coordinates } from "./Coordinates";

const WeatherMap = () => {
  const mapInstanceRef = useRef(null);

  const windyApiScript = document.createElement("script");
  windyApiScript.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
  windyApiScript.async = true;
  document.body.appendChild(windyApiScript);

  useEffect(() => {
    const initializeMap = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_WINDY_MAP_API_KEY,
        overlay: "currentsTide",
        zoom: 4,
        lat:42.33913318,
        lon:3.245751858
      };

      if (!mapInstanceRef.current && window.windyInit) {
        window.windyInit(options, (windyAPI) => {
          const { map } = windyAPI;

          mapInstanceRef.current = map;

          coordinates.forEach((location) => {
            if (map) {
              const circleSVG = `<svg height="50" width="50">
              <circle cx="25" cy="25" r="25" stroke="red" stroke-width="2" fill="none" />
              <circle cx="25" cy="25" r="5" fill="blue" />
                                  </svg>`;

              const marker = L.marker(location.coords, {
                icon: L.divIcon({
                  html: `<div class="circle-marker">${circleSVG}</div>`,
                  className: "custom-marker",
                  iconSize: [50, 50],
                  iconAnchor: [25, 25],
                }),
              }).addTo(map);

              marker.bindPopup(location.name, {});
            }
          });
        });
      } else {
        console.error("Windy API initialization function not found");
      }
    };

    windyApiScript.onload = initializeMap;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <>
      <div id="windy" className="w-full h-[600px] "></div>
    </>
  );
};

export default WeatherMap;
