export type ProductOption = {
  id: number
  size: string
  sku: string
}

export type Product = {
  id: number
  name: string
  slug: string
  sku: string
  description: string
  image: string | null
  unit: string
  options: ProductOption[]
}