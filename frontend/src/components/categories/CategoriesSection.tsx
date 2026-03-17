"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import CategoryCard from "./CategoryCard"
import { Category } from "@/types/category"
import { endpoints } from "@/lib/api"

export default function CategoriesSection() {
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    let isMounted = true

    const loadAllCategories = async () => {
      try {
        let url = endpoints.categories
        let allCategories: Category[] = []

        while (url && isMounted) {
          const res = await fetch(url)
          const data = await res.json()
          allCategories = allCategories.concat(data.results ?? [])
          url = data.next // DRF пагинация
        }

        if (isMounted) {
          setCategories(allCategories)
        }
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error)
        if (isMounted) setCategories([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadAllCategories()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="font-sans bg-[#F2F3F4] text-[#003399] py-12">
      <div className="max-w-6xl mx-auto py-6">
        <div className="relative">
          <div
            className={`
              overflow-hidden transition-all duration-700 relative
              ${expanded ? "max-h-[2000px]" : "max-h-[500px]"}
            `}
          >
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-9"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } }
              }}
            >
              {categories.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <CategoryCard category={item} />
                </motion.div>
              ))}
            </motion.div>

            {!expanded && (
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F2F3F4] via-[#F2F3F4]/80 to-transparent pointer-events-none" />
            )}
          </div>
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
  )
}