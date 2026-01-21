export default function Home() {
  return (
    <div className="min-h-screen bg-blue-900 text-white flex flex-col">

      {/* HEADER */}
      <header className="bg-white text-black py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">

          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="flex items-center space-x-4 text-xs sm:text-sm md:text-base">
            <div className="bg-blue-700 text-white px-3 py-2 font-bold whitespace-nowrap">
              ВОСТКРЕП
            </div>

            <nav className="hidden sm:flex space-x-4 font-semibold">
              <span>КАТАЛОГ</span>
              <span>ДОСТАВКА</span>
              <span>WHATSAPP</span>
            </nav>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div className="bg-orange-500 text-white px-4 sm:px-5 py-2 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
            КОРЗИНА
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex justify-center py-10 sm:py-16 px-4">
        <div className="
          w-full max-w-6xl
          bg-white text-black
          p-6 sm:p-10
          grid grid-cols-1 md:grid-cols-2
          gap-6 sm:gap-10
        ">

          {/* ЛЕВЫЙ БЛОК */}
          <div className="text-center md:text-left">
            <h1 className="
              text-2xl sm:text-3xl md:text-4xl
              font-bold
              leading-snug
            ">
              НЕ КЛАДЕМ БОЛТ <br /> НА НАШИХ КЛИЕНТОВ
            </h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bolt.png"
              alt="bolt"
              className="w-32 sm:w-40 md:w-48 mx-auto md:mx-0 mt-6"
            />
          </div>

          {/* ПРАВЫЙ БЛОК */}
          <div className="text-sm sm:text-base md:text-lg leading-relaxed">
            <p>
              Широкий ассортимент высококачественных крепёжных изделий
              по выгодным оптовым ценам.
            </p>

            <p className="mt-4">
              Главные приоритеты — надёжность поставок, качество продукции
              и индивидуальный подход к каждому клиенту.
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <div className="bg-blue-800 py-6 flex justify-center">
        <button className="
          bg-white text-blue-800
          px-8 sm:px-10
          py-3 sm:py-4
          font-bold text-sm sm:text-lg
        ">
          ОСТАВИТЬ ЗАЯВКУ
        </button>
      </div>

    </div>
  );
}