import FooterLight from "@/components/layout/FooterLight"
import Header from "@/components/layout/Header";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <FooterLight />
    </>
  )
}