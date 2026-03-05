import FooterLight from "@/components/layout/FooterLight"
import Header from "@/components/layout/Header";

export default function CatalogLayout({
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