import Header from "@/components/layout/Header";
import FooterLight from "@/components/layout/FooterLight";

export default function PersonalDataLayout({
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