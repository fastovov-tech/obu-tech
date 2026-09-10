"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSceneStore } from "@/lib/store";

const PROBLEMS = [
  "Чищення / термопаста",
  "Не вмикається",
  "Потрібна Windows",
  "Апгрейд ПК",
];

const TELEGRAM_BOT = "https://t.me/obukhivpctech_bot";

export default function CallMasterModal() {
  const isOpen = useSceneStore((s) => s.isCallModalOpen);
  const close = useSceneStore((s) => s.closeCallModal);
  const preset = useSceneStore((s) => s.presetProblem);

  const [selected, setSelected] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preset) setSelected([preset]);
  }, [preset]);

  function toggle(problem: string) {
    setSelected((prev) =>
      prev.includes(problem) ? prev.filter((p) => p !== problem) : [...prev, problem]
    );
  }

  async function handleSubmit() {
    if (!contact.trim()) {
      setError("Вкажіть Telegram або телефон для зв'язку");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problems: selected, address, contact }),
      });
    } catch {
      // Non-blocking: still route the person to Telegram even if logging fails
    } finally {
      setSubmitting(false);
    }

    const text = encodeURIComponent(
      `Заявка з сайту OBU TECH\nПроблема: ${selected.join(", ") || "не вказано"}\nАдреса/район: ${address || "не вказано"}\nКонтакт: ${contact}`
    );
    window.open(`${TELEGRAM_BOT}?text=${text}`, "_blank");
    close();
    setSelected([]);
    setAddress("");
    setContact("");
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(v) => !v && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-violet/20 bg-base-900/95 p-6 shadow-glass">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-display text-lg text-white">
              Викликати майстра
            </Dialog.Title>
            <Dialog.Close className="glow-ring rounded-md p-1 text-slate-400 hover:text-white">
              <X size={18} />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs text-slate-400">Що трапилось?</p>
              <div className="grid grid-cols-2 gap-2">
                {PROBLEMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => toggle(p)}
                    className={`glow-ring rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                      selected.includes(p)
                        ? "border-violet bg-violet/10 text-violet-soft"
                        : "border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">
                Адреса / район в Обухові
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Напр. вул. Каштанова"
                className="glow-ring w-full rounded-lg border border-white/10 bg-base-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">
                Telegram або телефон
              </label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="@username або +380..."
                className="glow-ring w-full rounded-lg border border-white/10 bg-base-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
              {error && <p className="mt-1 text-xs text-magenta">{error}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="glow-ring w-full rounded-lg bg-gradient-to-r from-violet to-magenta py-3 text-sm font-medium text-white shadow-glow-violet transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {submitting ? "Надсилаємо..." : "Надіслати в Telegram"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
