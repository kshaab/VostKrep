import { notFound } from "next/navigation"
import ProductsSection from "@/components/products/ProductsSection"
import { Category } from "@/types/category"
import { endpoints } from "@/lib/api"
import AnimatedTitle from "@/components/animation/AnimatedTitle"
import BackButton from "@/components/icons/BackButton";

type Props = {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string): Promise<Category | null> {
  const res = await fetch(endpoints.categoryBySlug(slug), {
    cache: "no-store",
  })

  if (!res.ok) return null

  const data: Category = await res.json()
  return data
}

export default async function CategoryPage({ params }: Props) {

  const { slug } = await params

  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="bg-[#F2F3F4] min-h-screen">
      <div className="max-w-6xl mx-auto py-16 bg-[#F2F3F4] px-4 md:px-0">

      <div className="flex items-center gap-4 md:gap-14 mb-8">
          <BackButton />
          <AnimatedTitle>{category.name}</AnimatedTitle>
        </div>

        <ProductsSection categorySlug={slug} />
      </div>
    </div>
  )
}