import Image from "next/image";
import Categories from "@/components/categories";
{/* MAIN */}
export default function Home() {
  return (
    <div className="bg-[#003399] text-[#F2F3F4]">
      <section className="bg-[#003399] py-10">
        <div className="mx-auto px-6">
          <h1 className=" font-heading text-5xl md:text-7xl leading-none tracking-[0.04em] font-bold mx-auto max-w-6xl">
            ВОСТОЧНЫЙ КРЕПЕЖ
          </h1>
        </div>
      </section>

      {/* БЕЛЫЙ БЛОК */}
      <section className="bg-[#F2F3F4] text-[#003399] py-12 relative h-[450px] overflow-visible mx-auto max-w-6xl">
        <div className="max-w-8xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="grid place-items-center">
            <Image
              src="/homepic.png"
              alt="logo_home"
              width={600}
              height={600}
              className="absolute w-[700px] h-auto translate-y-[-40px] translate-x-[-100px]"
            />
          </div>
          {/* ПРАВАЯ ЧАСТЬ */}
          <div className="font-sans text-2xl leading-relaxed font-semibold translate-y-[40px] translate-x-[20px]">
            <p>
              Широкий ассортимент высококачественных крепёжных изделий
              по выгодным оптовым ценам.
            </p>
            <p className="mt-12">
              Главные приоритеты — надёжность поставок, качество продукции
              и индивидуальный подход к каждому клиенту.
            </p>
          </div>

        </div>
      </section>
      {/* КНОПКА */}
      <section className="bg-[#003399] py-14">
        <div className="max-w-4xl mx-auto px-6 tracking-[0.04em]">
          <button className="
            w-full
            bg-[#F2F3F4]
            text-[#003399]
            py-4
            text-3xl
            font-heading
            font-semibold
            hover:bg-[#F0660A]
            hover:text-[#F2F3F4]
            transition-colors
          ">
            ОСТАВИТЬ ЗАЯВКУ
          </button>

        </div>
      </section>
      <Categories />3
    </div>
  )
}
