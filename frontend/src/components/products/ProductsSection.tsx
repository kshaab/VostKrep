"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Product } from "@/types/product"
import ProductCard from "./ProductCard"

type Props = {
  categorySlug?: string
}

export default function ProductsSection({ categorySlug }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

 useEffect(() => {
  let isMounted = true
  const fetchAllProducts = async () => {
    let url = categorySlug
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/products/?category=${categorySlug}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/products/products/`

    let allProducts: Product[] = []

    while (url && isMounted) {
      const res = await fetch(url)
      const data = await res.json()
      allProducts = allProducts.concat(data.results ?? [])
      url = data.next
    }

    if (isMounted) {
      setProducts(allProducts)
    }
  }

  fetchAllProducts()

  return () => { isMounted = false }
}, [categorySlug])

  return (
    <motion.section
      className="font-sans bg-[#F2F3F4] text-[#003399] py-12"
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9 }}
    >
      <div className="max-w-6xl mx-auto py-2">

        <div className="relative">

          <div
            className={`
              overflow-hidden
              transition-all
              duration-700
              ${expanded ? "max-h-[2000px]" : "max-h-[400px]"}
            `}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-9">
              {products.map((item) => (
                <ProductCard
                  key={item.slug}
                  product={item}
                />
              ))}
            </div>
          </div>

          {!expanded && (
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F2F3F4] via-[#F2F3F4]/80 to-transparent pointer-events-none" />
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
    </motion.section>
  )
}