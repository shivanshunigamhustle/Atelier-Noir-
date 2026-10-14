"use client";

import { WhatsappLogo } from "@phosphor-icons/react";

const WHATSAPP_NUMBER = "919506372917";

export function WhatsappButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <WhatsappLogo size={28} weight="fill" />
    </a>
  );
}
