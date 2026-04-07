"use client"

import { motion } from "framer-motion"
import CategoryCard from "./CategoryCard"
import styles from "@/styles/categories_section.module.css"
import type { Category } from "@/types/category"

type Props = {
  categories: Category[]
}

export default function CategoriesSectionClient({ categories }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <motion.div
              className={styles.grid}
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              {categories.map((item) => (
                <motion.div
                  key={item.slug}
                  variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <CategoryCard category={item} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}