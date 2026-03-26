import "./globals.css";
import { Bebas_Neue, League_Spartan } from "next/font/google"
import PageTransition from "@/components/animation/PageTransition";
import { CartProvider } from "@/context/CartContext";
import CartForm from "@/components/order/CartForm";

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
         <CartProvider>
        <div className="relative min-h-screen">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
         <CartForm />
      </CartProvider>
      </body>
    </html>
  )
}



