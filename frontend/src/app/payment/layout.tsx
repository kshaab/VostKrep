"use client";
import { useState, useEffect, ReactNode } from "react";
import { FormContext } from "@/context/FormContext";
import HeaderLight from "@/components/layout/HeaderLight";
import FooterDark from "@/components/layout/FooterDark";
import OrderForm from "@/components/order/OrderForm";

interface Props {
  children: ReactNode;
}

export default function PaymentLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <FormContext.Provider value={{ openModal: () => setIsOpen(true) }}>
      <HeaderLight />
      {children}
      <FooterDark />


      <OrderForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </FormContext.Provider>
  );
}