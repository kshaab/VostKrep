"use client";

import { useEffect, useRef } from "react";

{/* Яндекс карта */}
export default function YandexMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      ymaps.ready(() => {
        // @ts-ignore
        const map = new ymaps.Map(mapRef.current, {
          center: [55.751244, 37.618423],
          zoom: 7,
          controls: ["zoomControl"],
        });

        // маркер
        // @ts-ignore
        const placemark = new ymaps.Placemark([55.751244, 37.618423]);

        map.geoObjects.add(placemark);
      });
    };

    document.body.appendChild(script);
  }, []);

  return <div ref={mapRef} style={{ width: "50%", height: "50%" }} />;
}