import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="font-heading text-3xl w-full bg-[#003399] text-[#F2F3F4]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr_1.5fr_1fr]">

        {/* ЛОГОТИП */}
        <div className="bg-[#F2F3F4] flex items-center justify-center p-4 border-2 border-[#003399]">
          <Image
            src="/logo.png"
            alt="Восткреп"
            width={320}
            height={120}
            className="object-contain"
            priority
          />
        </div>

        <div className="p-10 space-y-4">
          <Link href="#" className="block hover:text-[#F0660A]">
            ДОСТАВКА
          </Link>
          <Link href="#" className="block hover:text-[#F0660A]">
            ОПЛАТА
          </Link>
          <Link href="#" className="block hover:text-[#F0660A]">
            О НАС
          </Link>
        </div>

        <div className="p-10 space-y-4">
          <Link href="#" className="block hover:text-[#F0660A] ">
            ПОЛИТИКА
            КОНФИДЕНЦИАЛЬНОСТИ
          </Link>
          <Link href="#" className="block hover:text-[#F0660A]">
            СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ
          </Link>
        </div>

        {/* Контакты */}
        <div className="p-10 space-y-4">
          <div className="flex items-center gap-3 hover:text-[#F0660A]">
            <MessageCircle size={20} />
            <span>WhatsApp</span>
          </div>

          <div className="flex items-center gap-3 hover:text-[#F0660A]">
            <Phone size={20} />
            <a href="tel:+74957992359" className="hover:opacity-80">
              +7 (495) 799-23-59
            </a>
          </div>

          <div className="flex items-center gap-3 hover:text-[#F0660A]">
            <Mail size={20} />
            <a
              href="mailto:zakaz@vostkrep.ru"
              className="hover:opacity-80"
            >
              zakaz@vostkrep.ru
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}