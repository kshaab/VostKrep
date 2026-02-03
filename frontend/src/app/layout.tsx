import "./globals.css";
import Header from "@/components/header"
import { Bebas_Neue, League_Spartan } from "next/font/google"
// Пример использования шапки и подвала, должны быть тут!!!!!
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// export default function RootLayout({ children }) {
//   return (
//     <html lang="ru">
//       <body>
//         <Header />
//         <main>{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const spartan = League_Spartan({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-spartan',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body
      className={`
          ${bebas.variable}
          ${spartan.variable}
        `}
      >
        <Header />
      {children}
      </body>
    </html>
  )
}



