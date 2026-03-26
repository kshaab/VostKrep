"use client";

import { createPortal } from "react-dom";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { endpoints } from "@/lib/api";
import { IMaskInput } from "react-imask";
import { getCSRFToken } from "@/lib/csrf";
import styles from "@/styles/cart.module.css";

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
    if (saved) setForm(JSON.parse(saved));
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
      headers: { "X-CSRFToken": csrfToken || "" },
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={closeCart} className={styles.closeButton}>
          ✕
        </button>

        <h2 className={styles.title}>Корзина</h2>

        {items.length === 0 ? (
          <p className={styles.emptyText}>Корзина пуста</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                name="name"
                type="text"
                placeholder="Имя"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.input}
              />

              <IMaskInput
                name="phone"
                mask="+7 (000) 000-00-00"
                value={form.phone}
                onAccept={(value: string) => setForm({ ...form, phone: value })}
                overwrite
                className={styles.maskedInput}
                placeholder="+7 (999) 999-99-99"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={styles.input}
              />

              <textarea
                name="address"
                placeholder="Адрес доставки"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={styles.textarea}
              />

              <textarea
                name="comment"
                placeholder="Комментарий"
                className={styles.textarea}
              />

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? "Отправка..." : "Отправить"}
              </button>
            </form>

            <div className={styles.itemsContainer}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className="min-w-0">
                    <p className={styles.itemName}>{item.name}</p>
                  </div>

                  <div className="w-full flex justify-end items-start">
                    <div className={styles.quantityContainer}>
                      <button
                        type="button"
                        onClick={() => decrease(item.id)}
                        className={styles.quantityControl}
                      >
                        −
                      </button>

                      <span className={styles.quantityValue}>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => increase(item.id)}
                        className={styles.quantityControl}
                      >
                        +
                      </button>

                      <span className={styles.unit}>{item.unit}</span>
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