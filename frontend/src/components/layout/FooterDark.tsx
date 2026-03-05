"use client"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MessageCircle } from "lucide-react"

{/* Темный подвал */}
export default function FooterDark() {
  return (
    <footer className="w-full bg-[#123E9A] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16">

          <div className="flex items-start">
            <Image
              src="/logo-light.png"
              alt="Восткреп"
              width={420}
              height={120}
              className="w-[360px] md:w-[420px] h-auto translate-y-6 -translate-x-10"
              priority
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-16 text-3xl font-heading">

            {/* Колонка 1 */}
            <div className="space-y-6">
              <Link href="#" className="block hover:text-[#F0660A] transition-colors">
                ДОСТАВКА
              </Link>
              <Link href="#" className="block hover:text-[#F0660A] transition-colors">
                ОПЛАТА
              </Link>
              <Link href="#" className="block hover:text-[#F0660A] transition-colors">
                О НАС
              </Link>
            </div>

            {/* Колонка 2 */}
            <div className="space-y-6">
              <Link href="#" className="block hover:text-[#F0660A] transition-colors">
                ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
              </Link>
              <Link href="#" className="block hover:text-[#F0660A] transition-colors">
                СОГЛАСИЕ НА ОБРАБОТКУ ДАННЫХ
              </Link>
            </div>

            {/* Колонка 3 */}
            <div className="space-y-6">

              <div className="flex items-center gap-4 hover:text-[#F0660A] transition-colors">
                <MessageCircle size={26} />
                <span>WhatsApp</span>
              </div>

              <div className="flex items-center gap-4 hover:text-[#F0660A] transition-colors">
                <Phone size={26} />
                <a href="tel:+74957992359">
                  +7 (495) 799-23-59
                </a>
              </div>

              <div className="flex items-center gap-4 hover:text-[#F0660A] transition-colors">
                <Mail size={26} />
                <a href="mailto:zakaz@vostkrep.ru">
                  zakaz@vostkrep.ru
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </footer>
  )
}