export interface StaticPageItem {
  id: number
  title: string
  text: string
}

export interface StaticPageSection {
  id: number
  title: string
  subtitle: string
  items: StaticPageItem[]
}

export interface StaticPage {
  title: string
  seo_title: string
  seo_description: string
  sections: StaticPageSection[]
}