export interface StaticPageItem {
  id: number
  title: string
  text: string
  order: string
}

export interface StaticPageSection {
  id: number
  title: string
  subtitle: string
  items: StaticPageItem[]
  order: string
}

export interface StaticPage {
  title: string
  content: string
  seo_title: string
  seo_description: string
  sections: StaticPageSection[]
}