import FooterDark from "@/components/layout/FooterDark"
import HeaderLight from "@/components/layout/HeaderLight";

export default function PersonalDataLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderLight />
      {children}
      <FooterDark />
    </>
  )
}