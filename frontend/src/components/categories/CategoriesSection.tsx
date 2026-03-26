"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import CategoryCard from "./CategoryCard"
import { Category } from "@/types/category"
import { endpoints } from "@/lib/api"
import styles from "@/styles/categories_section.module.css"

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
          url = data.next
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
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div
            className={`${styles.content} ${
              expanded ? styles.expanded : styles.collapsed
            }`}
          >
            <motion.div
              className={styles.grid}
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

            {!expanded && <div className={styles.fade} />}
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <button
            onClick={() => setExpanded(!expanded)}
            className={styles.button}
          >
            {expanded ? "СВЕРНУТЬ" : "ПОКАЗАТЬ ЕЩЁ"}
          </button>
        </div>
      </div>
    </section>
  )
}