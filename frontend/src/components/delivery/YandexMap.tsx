"use client";

import { useEffect, useRef } from "react";

export default function YandexMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const script = document.createElement("script");
    script.src =
      "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Af252b485c161491100139315ebdb30208ed68ee723afff6d0d0da06857f74b7b&amp;lang=ru_RU&amp;scroll=true";
    script.async = true;

    mapRef.current.appendChild(script);

    return () => {
      if (mapRef.current) mapRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "600px",
        display: "flex",
        justifyContent: "center"
      }}
    />
  );
}