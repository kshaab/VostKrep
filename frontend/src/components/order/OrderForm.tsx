"use client";

import { createPortal } from "react-dom";
import { useState } from "react";

{/* Форма заявки */}
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderForm({ isOpen, onClose }: Props) {
  const [fileName, setFileName] = useState<string>("");

  if (typeof window === "undefined") return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch("http://127.0.0.1:8000/order/", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Ваша заявка отправлена!");
      onClose();
    } else {
      alert("Ошибка отправки");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#F2F3F4] text-[#003399] w-full max-w-2xl p-8 rounded-2xl relative max-h-[90vh] overflow-y-auto">

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-[#003399]"
        >
          ✕
        </button>

        <h2 className="font-heading text-4xl font-bold mb-6 tracking-[0.04em]">
          Заявка
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <input
            name="name"
            type="text"
            placeholder="ФИО"
            required
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
          />

          <input
            name="phone"
            type="tel"
            placeholder="Телефон"
            required
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
          />

          <textarea
            name="address"
            placeholder="Адрес доставки"
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
          />

          <textarea
            name="comment"
            placeholder="Комментарий"
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
          />

          <div className="flex items-center gap-3">
              {/* Скрытый input */}
              <input
                id="file"
                name="file"
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFileName(e.target.files?.[0]?.name || "")
                }
              />

              {/* Кнопка */}
              <label
                htmlFor="file"
                className="bg-[#003399] text-[#F2F3F4]
                px-4 py-2 rounded-lg cursor-pointer
                hover:bg-[#F0660A] transition-colors whitespace-nowrap font-sans
                hover:text-[#003399]"
              >
                Выбрать
              </label>

              {/* Поле с названием */}
              <div className="flex-1 bg-[#F2F3F4] px-3 py-2 rounded-lg text-sm truncate font-sans">
                {fileName || "Файл не выбран"}
              </div>
            </div>


          <button
            type="submit"
            className="w-full bg-[#003399] text-[#F2F3F4]
            py-3 rounded-lg font-semibold hover:bg-[#F0660A]
            transition-colors font-heading tracking-[0.04em] text-2xl
            hover:text-[#003399]"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}