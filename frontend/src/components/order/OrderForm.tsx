"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import {endpoints} from "@/lib/api";
import { IMaskInput } from "react-imask";
import { getCSRFToken } from "@/lib/csrf"
import { useRef } from "react";


{/* Форма заявки */}
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderForm({ isOpen, onClose }: Props) {
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
  name: "",
  phone: "",
  email: "",
  address: "",
});
  useEffect(() => {
  if (typeof window === "undefined") return;

  const saved = localStorage.getItem("orderForm");

  if (saved) {
    setForm(JSON.parse(saved));
  }
}, []);

  useEffect(() => {
  if (typeof window === "undefined") return;

  localStorage.setItem("orderForm", JSON.stringify(form));
}, [form]);

  if (!isOpen || typeof window === "undefined") return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  formData.append("items", "[]");

  setLoading(true);

  type ApiResponse = {
    success?: boolean;
    message?: string;
  };

  try {
    const csrfToken = getCSRFToken();

    const res = await fetch(endpoints.orders, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrfToken || "",
      },
      credentials: "include",
    });

    let data: ApiResponse | null = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

   if (res.ok) {
  alert(data?.message ?? "Заявка отправлена!");
  setFileName("");
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
  onClose();
} else {

  if (data && typeof data === "object") {
    const errors = Object.values(data)
      .flat()
      .join("\n");

    alert(errors || "Ошибка отправки");
  } else {
    alert("Ошибка отправки");
  }
}

  } catch (error) {
    console.error(error);
    alert("Проблема с соединением");
  } finally {
    setLoading(false);
  }
};


  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#F2F3F4] text-[#003399] w-full max-w-2xl p-8 rounded-2xl relative max-h-[90vh] overflow-y-auto">

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-[#F0660A]"
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
            placeholder="Имя"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
          />


          <IMaskInput
            name="phone"
            mask="+7 (000) 000-00-00"
            value={form.phone}
            onAccept={(value: string) => setForm({ ...form, phone: value })}
            overwrite
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] font-sans text-[#003399]"
            placeholder="+7 (999) 999-99-99"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
          />

          <textarea
            name="address"
            placeholder="Адрес доставки"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
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
                ref={fileInputRef}
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
              <div className="flex-1 flex items-center justify-between bg-[#F2F3F4] px-3 py-2 rounded-lg text-sm font-sans">
                <span className="truncate">
                  {fileName || "Файл не выбран"}
                </span>

                {fileName && (
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      setFileName("");
                    }}
                    className="ml-2 text-[#F0660A] hover:scale-110 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003399] text-[#F2F3F4]
            py-3 rounded-lg font-semibold hover:bg-[#F0660A]
            transition-colors font-heading tracking-[0.04em] text-2xl
            hover:text-[#003399] disabled:opacity-50"
          >
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}