"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

{/* Светлая шапка */}
export default function HeaderLight() {
  const { openCart, items } = useCart();
  return (
    <header className="bg-[#F2F3F4]">
      <div className="mx-auto max-w-6xl bg-[#F2F3F4] h-20">
        <nav
          className="
            flex h-full
            font-heading
            font-semibold
            text-[#003399]
            text-3xl
            tracking-[0.04em]
          "
        >
         <Link
            href="/"
            className="flex-1 flex items-center justify-center hover:bg-[#F0660A] hover:text-[#F2F3F4]"
          >
            КАТАЛОГ
          </Link>

           <Link
            href="/delivery"
            className="flex-1 flex items-center justify-center hover:bg-[#F0660A] hover:text-[#F2F3F4]"
          >
            ДОСТАВКА
          </Link>

          <button
            className="flex-1 flex items-center justify-center hover:bg-[#F0660A] hover:text-[#F2F3F4]"
          >
            WHATSAPP
          </button>

          {/* КОРЗИНА */}
          <button
            onClick={openCart}
            className="flex-1 flex items-center justify-center hover:bg-[#F0660A] hover:text-[#F2F3F4] relative"
          >
            КОРЗИНА

            {items.length > 0 && (
              <span className="absolute top-2 right-10 bg-[#F0660A] text-[#F2F3F4] text-sm rounded-full px-2">
                {items.length}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}