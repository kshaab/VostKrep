"use client";

import { createPortal } from "react-dom";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { endpoints} from "@/lib/api";
import InputMask from "react-input-mask";

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

    const formData = new FormData(e.currentTarget);

    const orderData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      comment: formData.get("comment"),
      items: items.map((item) => ({
        option_id: item.option_id,
        quantity: item.quantity,
      })),
    };

    setLoading(true);

    const res = await fetch(endpoints.orders, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    setLoading(false);

    if (res.ok) {
      alert("Заказ отправлен!");
      const comment = e.currentTarget.elements.namedItem("comment") as HTMLTextAreaElement;
      if (comment) comment.value = "";
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
          className="absolute top-4 right-4 text-2xl text-[#003399]"
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
            <div className="space-y-4 mb-6 text-[#003399] font-sans">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border p-3 rounded-lg font-sans"
                >
                  <div>
                    <p className="font-semibold font-sans">{item.name}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decrease(item.id)}
                      className="px-3 py-1 bg-gray-200 rounded font-sans"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increase(item.id)}
                      className="px-3 py-1 bg-gray-200 rounded font-sans"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                name="name"
                type="text"
                placeholder="ФИО"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
              />

              <InputMask
                mask="+7 (999) 999-99-99"
                maskChar=""
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    name="phone"
                    type="tel"
                    required
                    placeholder="Телефон"
                    className="w-full border p-3 rounded-lg bg-[#F2F3F4] placeholder:text-[#003399] font-sans"
                  />
                )}
              </InputMask>

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
          </>
        )}
      </div>
    </div>,
    document.body
  );
}