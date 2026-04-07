import { Product } from "@/types/product"
import { endpoints } from "@/lib/api"

export default async function ProductsSectionSSR(categorySlug?: string): Promise<Product[]> {
  let allProducts: Product[] = []
  let url = categorySlug
    ? endpoints.productsByCategory(categorySlug)
    : endpoints.products

  while (url) {
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) break
    const data = await res.json()
    allProducts = allProducts.concat(data.results ?? [])
    url = data.next
  }

  return allProducts
}