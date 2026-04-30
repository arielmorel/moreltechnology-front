"use client";

import { WhatsAppDropdown } from "./whatsapp-dropdown";
import { WhatsApp } from "./icons";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function FloatingWhatsApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Tooltip hint */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="bg-card border border-border/50 px-4 py-2 rounded-2xl shadow-xl text-xs font-bold whitespace-nowrap mb-1 hidden md:block"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          ¡Estamos en línea!
        </span>
      </motion.div>

      <WhatsAppDropdown 
        className="h-16 w-16 rounded-full p-0 flex items-center justify-center shadow-2xl shadow-green-600/40 hover:scale-110 active:scale-95 transition-transform"
        showIcon={false}
        side="top"
        align="end"
      >
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Pulsing effect */}
          <span className="absolute inset-0 rounded-full bg-green-600/30 animate-ping" />
          <WhatsApp size={32} className="text-white relative z-10" />
        </div>
      </WhatsAppDropdown>
    </div>
  );
}
