import { notFound } from "next/navigation"
import ProductsSection from "@/components/products/ProductsSection"
import { Category } from "@/types/category"

type Props = {
  params: { slug: string }
}

async function getCategory(slug: string): Promise<Category | null> {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/`)
  if (!res.ok) return null
  return res.json()
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params

  const category = await getCategory(slug) // возвращает одну категорию

  if (!category) return notFound()

  return (
    <div>
      <ProductsSection />
    </div>
  )
}