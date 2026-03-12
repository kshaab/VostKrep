export interface DeliveryItem {
  id: number
  title: string
  text: string
}

export interface DeliveryPage {
  title: string
  content: string
  items: DeliveryItem[]
}