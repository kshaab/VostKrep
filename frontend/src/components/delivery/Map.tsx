"use client";

import YandexMap from "./YandexMap";

export function Map() {
    return (
        <div className="bg-[#F2F3F4] py-8">
            <div className="mx-auto max-w-6xl w-full">
                <div className="w-[1155px] h-[600px]">
                    <YandexMap/>
                </div>
            </div>
        </div>
    );
}