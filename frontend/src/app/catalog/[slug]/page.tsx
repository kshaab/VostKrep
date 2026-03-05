import { categories } from "@/data/categories"
import { notFound } from "next/navigation"
import ProductsSection from "@/components/products/ProductsSection"


type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = categories.find(
    (c) => c.slug === slug
  )

  if (!category) return notFound()

  return (
    <div>
      <ProductsSection />
    </div>
  )
}