"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { categories } from "@/data/categories"
import CategoryCard from "./CategoryCard"

{/* Страница категорий */}
export default function CategoriesSection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.section
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <section className="font-sans bg-[#F2F3F4] text-[#003399] py-12">
        <div className="max-w-6xl mx-auto py-6">
          <div className="relative">

            {/* Контейнер с ограничением */}
            <div
              className={`
                overflow-hidden
                transition-all
                duration-700
                ${expanded ? "max-h-[2000px]" : "max-h-[700px]"}
              `}
            >
              {/* СЕТКА */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-9">
                {categories.map((item) => (
                  <CategoryCard
                    key={item.slug}
                    category={item}
                  />
                ))}
              </div>
            </div>

            {/* Градиент */}
            {!expanded && (
              <div className="
                absolute bottom-0 left-0 w-full h-32
                bg-gradient-to-t
                from-[#F2F3F4]
                via-[#F2F3F4]/80
                to-transparent
                pointer-events-none
              " />
            )}
          </div>

          {/* Кнопка */}
          <div className="font-heading max-w-4xl mx-auto py-14 px-6 tracking-[0.04em]">
            <button
              onClick={() => setExpanded(!expanded)}
              className="
                w-full bg-[#003399] text-[#F2F3F4]
                py-4 text-3xl font-semibold
                hover:bg-[#F0660A] hover:text-[#003399]
                transition-colors duration-300
              "
            >
              {expanded ? "СВЕРНУТЬ" : "ПОКАЗАТЬ ЕЩЁ"}
            </button>
          </div>

        </div>
      </section>
    </motion.section>
  )
}