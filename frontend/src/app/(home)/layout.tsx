"use client";

import { useState, useEffect } from "react";
import { FormContext } from "@/context/FormContext";
import Header from "@/components/layout/Header";
import FooterDark from "@/components/layout/FooterDark";
import OrderForm from "@/components/order/OrderForm";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <FormContext.Provider value={{ openModal: () => setIsOpen(true) }}>

      <Header />
      {children}
      <FooterDark />

      <OrderForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

    </FormContext.Provider>
  );
}