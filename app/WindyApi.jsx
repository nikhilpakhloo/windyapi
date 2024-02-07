"use client";

import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import { coordinates } from "./Coordinates";

const WeatherMap = () => {
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

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
        lat: -34.0026880174215,
        lon: 151.22563361947
      };

      if (!mapInstanceRef.current && window.windyInit) {
        window.windyInit(options, (windyAPI) => {
          const { map } = windyAPI;

          mapInstanceRef.current = map;
          layerGroupRef.current = L.layerGroup().addTo(map);

          coordinates.forEach((location) => {
            const { name, Latitude, Longitude } = location;

            if (map) {
              const circle = L.circle([Latitude, Longitude], {
                color: 'red',
                fillColor: 'blue',
                fillOpacity: 0.5,
                radius: 20000
              }).addTo(layerGroupRef.current);

              const customIcon = L.icon({
                iconUrl: '/assets/bluedot.png',
                iconSize: [20, 20],
                iconAnchor: [10, 10] 
              });

              const marker = L.marker([Latitude, Longitude], { icon: customIcon }).addTo(layerGroupRef.current);
              marker.bindPopup(name, {});
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
