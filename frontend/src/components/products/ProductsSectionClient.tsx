"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import ProductCard from "./ProductCard"
import styles from "@/styles/products_section.module.css"
import type { Product } from "@/types/product"

type Props = {
  products: Product[]
}

export default function ProductsSectionClient({ products }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const extraSpace = 60
      setHeight(contentRef.current.scrollHeight + extraSpace)
    }
  }, [products, expanded])

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9 }}
    >
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div
            className={styles.content}
            style={{ maxHeight: expanded ? height : 500 }}
          >
            <div ref={contentRef}>
              <div className={styles.grid}>
                {products.map((item) => (
                  <ProductCard key={item.slug} product={item} />
                ))}
              </div>
            </div>
          </div>
          {!expanded && <div className={styles.fade} />}
        </div>
        {products.length > 4 && (
          <div className={styles.buttonWrapper}>
            <button
              onClick={() => setExpanded(!expanded)}
              className={styles.button}
            >
              {expanded ? "СВЕРНУТЬ" : "ПОКАЗАТЬ ЕЩЁ"}
            </button>
          </div>
        )}
      </div>
    </motion.section>
  )
}