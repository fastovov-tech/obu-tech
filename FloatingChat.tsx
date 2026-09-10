"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Circle } from "lucide-react";
import { useSceneStore } from "@/lib/store";

const TELEGRAM = "https://t.me/obukhivpctech_bot";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const openCallModal = useSceneStore((s) => s.openCallModal);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <div className="glass-card mb-3 w-72 rounded-2xl p-4 shadow-glow-violet">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <Circle className="h-2.5 w-2.5 fill-violet-soft text-violet-soft animate-pulseGlow" />
              </span>
              <p className="text-sm font-medium text-white">Майстер на зв&apos;язку</p>
            </div>
            <button onClick={() => setOpen(false)} className="glow-ring rounded p-1 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Оберіть, як зручніше зв&apos;язатись — відповідаємо, як правило, протягом кількох хвилин.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-ring flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet to-magenta py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.01]"
            >
              <Send size={15} /> Написати в Telegram
            </a>
            <button
              onClick={() => {
                setOpen(false);
                openCallModal();
              }}
              className="glow-ring rounded-lg border border-violet/30 py-2.5 text-sm text-slate-200 hover:border-violet/60"
            >
              Швидкий виклик майстра
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Відкрити чат"
        className="glow-ring flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet to-magenta text-white shadow-glow-violet transition-transform hover:scale-105"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
