"use client";
import { createContext, useContext } from "react";

type FormContextType = {
  openModal: () => void;
};

export const FormContext = createContext<FormContextType>({
  openModal: () => {},
});

export const useModal = () => useContext(FormContext);