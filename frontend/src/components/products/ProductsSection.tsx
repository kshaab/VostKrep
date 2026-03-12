"use client"

import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import { Product } from "@/types/product"
import { endpoints } from "@/lib/api"

type Props = {
  categorySlug: string
}

export default function ProductsSection({ categorySlug }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categorySlug) return

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(endpoints.products(categorySlug), { cache: "no-store" })
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : data.results ?? [])
      } catch (e) {
        console.error(e)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categorySlug])

  if (loading) return <div>Загрузка продуктов...</div>
  if (!products.length) return <div>Продукты не найдены</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  )
}