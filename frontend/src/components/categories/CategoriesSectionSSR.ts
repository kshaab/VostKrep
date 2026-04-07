import { Category } from "@/types/category"
import { endpoints } from "@/lib/api"

export default async function CategoriesSectionSSR(): Promise<Category[]> {
  let allCategories: Category[] = []
  let url = endpoints.categories

  while (url) {
    const res = await fetch(url, { next: { revalidate: 60 } })
    const data = await res.json()
    allCategories = allCategories.concat(data.results ?? [])
    url = data.next
  }

  return allCategories
}