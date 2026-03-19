"use client";

import { createPortal } from "react-dom";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { endpoints} from "@/lib/api";
import { IMaskInput } from "react-imask";
import { getCSRFToken } from "@/lib/csrf"

{/* Форма корзины  */}
export default function CartForm() {
  const { items, isOpen, closeCart, increase, decrease, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
  name: "",
  phone: "",
  email: "",
  address: "",
});

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

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

  if (items.length === 0) {
    alert("Корзина пуста");
    return;
  }

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("phone", form.phone);
  formData.append("email", form.email);
  formData.append("address", form.address);

  const comment = (e.currentTarget.elements.namedItem("comment") as HTMLTextAreaElement)?.value || "";
  formData.append("comment", comment);

  formData.append(
    "items",
    JSON.stringify(
      items.map((item) => ({
        name: item.name,
        option_id: item.option_id,
        option: item.option || "",
        quantity: item.quantity,
        unit: item.unit || "",
      }))
    )
  );

  setLoading(true);

  const csrfToken = getCSRFToken();

  const res = await fetch(endpoints.orders, {
    method: "POST",
    body: formData,
    headers: {
      "X-CSRFToken": csrfToken || "",
    },
    credentials: "include",
  });

  setLoading(false);

  if (res.ok) {
    alert("Заказ отправлен!");
    clearCart();
    closeCart();
  } else {
    alert("Ошибка отправки");
  }
};

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#F2F3F4] w-full max-w-2xl p-8 rounded-2xl relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={closeCart}
          className="absolute top-4 right-4 text-2xl text-[#F0660A]"
        >
          ✕
        </button>

        <h2 className="text-4xl font-bold mb-6 text-[#003399] font-heading tracking-[0.04em]">
          Корзина
        </h2>

        {items.length === 0 ? (
          <p className="text-xl font-bold mb-6 text-[#003399] font-sans" >
            Корзина пуста
          </p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
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
            className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
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
            <div className="space-y-4 mb-6 mt-6 text-[#003399] font-sans">
              {items.map(item => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_160px] items-start border p-3 rounded-lg gap-4"
                >
                  <div className="min-w-0">
                  <p className="font-semibold break-words leading-snug">
                    {item.name}
                  </p>
                </div>

                 <div className="w-full flex justify-end items-start">
                  <div className="grid grid-cols-[32px_22px_32px_auto] items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decrease(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
                  >
                    −
                  </button>

                  <span className="w-6 text-center">{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => increase(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
                  >
                    +
                  </button>

                  <span className="whitespace-nowrap text-left">
                  {item.unit}
                </span>
                </div>
                </div>
               </div>

              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}