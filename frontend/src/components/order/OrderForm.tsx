"use client";

import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { endpoints } from "@/lib/api";
import { IMaskInput } from "react-imask";
import { getCSRFToken } from "@/lib/csrf";
import styles from "@/styles/order.module.css";

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
    if (saved) setForm(JSON.parse(saved));
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

    type ApiResponse = { success?: boolean; message?: string };

    try {
      const csrfToken = getCSRFToken();
      const res = await fetch(endpoints.orders, {
        method: "POST",
        body: formData,
        headers: { "X-CSRFToken": csrfToken || "" },
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
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
      } else {
        if (data && typeof data === "object") {
          const errors = Object.values(data).flat().join("\n");
          alert(errors || "Ошибка отправки");
        } else alert("Ошибка отправки");
      }
    } catch (error) {
      console.error(error);
      alert("Проблема с соединением");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>✕</button>

        <h2 className={styles.title}>Заявка</h2>

        <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
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

          <div className={styles.fileWrapper}>
            <input
              ref={fileInputRef}
              id="file"
              name="file"
              type="file"
              className={styles.hiddenFileInput}
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            />

            <label htmlFor="file" className={styles.fileButton}>Выбрать</label>

            <div className={styles.fileNameContainer}>
              <span className={styles.fileNameText}>{fileName || "Файл не выбран"}</span>

              {fileName && (
                <button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setFileName("");
                  }}
                  className={styles.clearFileButton}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}