"use client";

import { useEffect, useRef } from "react";

export default function YandexMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      // @ts-ignore
      window.ymaps.ready(() => {
        if (!mapInstance.current && mapRef.current) {
          // @ts-ignore
          mapInstance.current = new window.ymaps.Map(mapRef.current, {
            center: [55.751244, 37.618423],
            zoom: 7,
            controls: ["zoomControl"],
          });

          // @ts-ignore
          const placemark = new window.ymaps.Placemark([55.751244, 37.618423]);

          mapInstance.current.geoObjects.add(placemark);
        }
      });
    };

    // @ts-ignore
    if (window.ymaps) {
      initMap();
      return;
    }

    if (!document.querySelector("#yandex-maps-script")) {
      const script = document.createElement("script");
      script.id = "yandex-maps-script";
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}