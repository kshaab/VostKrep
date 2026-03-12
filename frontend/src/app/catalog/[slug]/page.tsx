import { notFound } from "next/navigation"
import ProductsSection from "@/components/products/ProductsSection"
import { Category } from "@/types/category"
import { endpoints } from "@/lib/api"

type Props = {
  params: { slug: string }
}

// ✅ Исправлено: API возвращает объект, а не массив
async function getCategory(slug: string): Promise<Category | null> {
  const res = await fetch(endpoints.categoryBySlug(slug))
  if (!res.ok) return null

  const data: Category = await res.json() // объект
  return data ?? null
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params

  const category = await getCategory(slug)
  if (!category) return notFound()

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <ProductsSection categorySlug={slug} />
    </div>
  )
}