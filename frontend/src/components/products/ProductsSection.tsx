"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Product } from "@/types/product"
import ProductCard from "./ProductCard"
import { endpoints } from "@/lib/api"
import styles from "@/styles/products_section.module.css"

type Props = {
  categorySlug?: string
}

export default function ProductsSection({ categorySlug }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let isMounted = true

    const fetchAllProducts = async () => {
      try {
        let url = categorySlug
          ? endpoints.productsByCategory(categorySlug)
          : endpoints.products

        let allProducts: Product[] = []

        while (url && isMounted) {
          const res = await fetch(url)
          if (!res.ok) break
          const data = await res.json()
          allProducts = allProducts.concat(data.results ?? [])
          url = data.next
        }

        if (isMounted) setProducts(allProducts)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    fetchAllProducts()
    return () => { isMounted = false }
  }, [categorySlug])

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

          <div className={`${styles.content} ${expanded ? styles.expanded : styles.collapsed}`}>
            <div className={styles.grid}>
              {products.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>

          {!expanded && <div className={styles.fade} />}

        </div>

        <div className={styles.buttonWrapper}>
          <button onClick={() => setExpanded(!expanded)} className={styles.button}>
            {expanded ? "СВЕРНУТЬ" : "ПОКАЗАТЬ ЕЩЁ"}
          </button>
        </div>

      </div>
    </motion.section>
  )
}