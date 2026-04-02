"use client";

import YandexMap from "./YandexMap";
import { useEffect, useState } from "react";
import { endpoints } from "@/lib/api";


interface Zone {
  color: string;
  text: string;
}

export function Map() {
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    fetch(endpoints.delivery)
      .then(res => res.json())
      .then(data => setZones(data.zones))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-[#F2F3F4] py-8">
      <div className="mx-auto max-w-6xl w-full">

        {/* Карта */}
        <div className="w-[360px] h-[500px] md:w-[1155px] md:h-[600px] overflow-hidden rounded-2xl mx-auto">
          <YandexMap />
        </div>

        {/* Зоны */}
        <div className="mt-6 space-y-3">
          {zones?.map((zone, index) => (
            <div
              key={index}
              className="w-[360px] md:w-[1155px] rounded-lg px-4 py-3 font-sans text-[#F2F3F4] text-sm md:text-xl font-bold text-center mx-auto"
              style={{ backgroundColor: zone.color }}
            >
              {zone.text}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}