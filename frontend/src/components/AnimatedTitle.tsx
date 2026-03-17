"use client"

import { motion } from "framer-motion"

export default function AnimatedTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h1
      className="text-3xl font-bold tracking-[0.04em] font-heading md:text-6xl text-[#003399]"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.h1>
  )
}