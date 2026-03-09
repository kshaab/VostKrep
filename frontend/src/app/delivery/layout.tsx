import FooterDark from "@/components/layout/FooterDark"
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
      <FooterDark />
    </>
  )
}