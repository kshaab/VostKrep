export interface DeliveryItem {
  id: number
  text: string
}

export interface DeliveryPage {
  title: string
  content: string
  items: DeliveryItem[]
}