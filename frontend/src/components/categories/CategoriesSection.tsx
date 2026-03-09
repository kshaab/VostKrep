"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import CategoryCard from "./CategoryCard"
import { Category } from "@/types/category"
import { endpoints} from "@/lib/api"

export default function CategoriesSection() {
  const [expanded, setExpanded] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch(endpoints.categories)
      .then((res) => res.json())
      .then((data) => setCategories(data))
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.9 }}
    >
      <section className="font-sans bg-[#F2F3F4] text-[#003399] py-12">
        <div className="max-w-6xl mx-auto py-6">
          <div className="relative">

            <div
              className={`
                overflow-hidden
                transition-all
                duration-700
                ${expanded ? "max-h-[2000px]" : "max-h-[700px]"}
              `}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-9">
                {categories.map((item) => (
                  <CategoryCard key={item.id} category={item} />
                ))}
              </div>
            </div>

            {!expanded && (
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F2F3F4] via-[#F2F3F4]/80 to-transparent pointer-events-none"/>
            )}
          </div>

          <div className="font-heading max-w-4xl mx-auto py-14 px-6 tracking-[0.04em]">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full bg-[#003399] text-[#F2F3F4] py-4 text-3xl font-semibold hover:bg-[#F0660A] hover:text-[#003399] transition-colors duration-300"
            >
              {expanded ? "СВЕРНУТЬ" : "ПОКАЗАТЬ ЕЩЁ"}
            </button>
          </div>

        </div>
      </section>
    </motion.section>
  )
}