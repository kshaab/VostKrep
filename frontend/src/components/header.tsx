{/* HEADER */}
export default function Header() {
  return (
    <header className="bg-[#003399]">
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
          {['КАТАЛОГ', 'ДОСТАВКА', 'WHATSAPP', 'КОРЗИНА'].map((item) => (
            <button
              key={item}
              className="
                flex-1
                flex items-center justify-center
                transition-colors
                hover:bg-[#F0660A]
                hover:text-[#F2F3F4]
              "
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}



