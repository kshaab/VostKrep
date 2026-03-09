"use client";

import YandexMap from "./YandexMap";

export default function Map() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        backgroundColor: "#F2F3F4"
      }}
    >
      <div
        style={{
          width: "900px",
          height: "500px",
        }}
      >
        <YandexMap />
      </div>
    </div>
  );
}