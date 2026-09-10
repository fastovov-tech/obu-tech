"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Save, Trash2, Plus } from "lucide-react";
import type { RepairRequest, RequestStatus, ServiceItem, FaqItem } from "@/lib/data-store";

const STATUSES: RequestStatus[] = ["Нова", "В роботі", "Завершена"];

export default function AdminPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingContent, setSavingContent] = useState(false);

  useEffect(() => {
    async function load() {
      const [reqRes, contentRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/content"),
      ]);
      if (reqRes.ok) setRequests(await reqRes.json());
      if (contentRes.ok) {
        const data = await contentRes.json();
        setServices(data.services);
        setFaq(data.faq);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id: string, status: RequestStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch("/api/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  function updateService(id: string, field: keyof ServiceItem, value: string) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function addService() {
    setServices((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "Нова послуга", description: "", price: "" },
    ]);
  }

  function removeService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function updateFaq(id: string, field: keyof FaqItem, value: string) {
    setFaq((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  }

  function addFaq() {
    setFaq((prev) => [...prev, { id: crypto.randomUUID(), question: "Нове питання", answer: "" }]);
  }

  function removeFaq(id: string) {
    setFaq((prev) => prev.filter((f) => f.id !== id));
  }

  async function saveContent() {
    setSavingContent(true);
    await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services, faq }),
    });
    setSavingContent(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-950 text-slate-400">
        Завантаження панелі...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Панель адміністратора</h1>
            <p className="mt-1 text-sm text-slate-400">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="glow-ring flex items-center gap-2 rounded-lg border border-violet/25 px-4 py-2 text-sm text-slate-200 hover:border-violet/50"
          >
            <LogOut size={15} /> Вийти
          </button>
        </div>

        {/* Requests */}
        <section className="mb-12">
          <h2 className="font-display text-lg font-medium">Заявки</h2>
          <div className="mt-4 space-y-3">
            {requests.length === 0 && (
              <p className="text-sm text-slate-500">Поки що немає жодної заявки.</p>
            )}
            {requests.map((r) => (
              <div key={r.id} className="glass-card rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {r.problems.length ? r.problems.join(", ") : "Без опису проблеми"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {r.address || "Адреса не вказана"} · {r.contact}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {new Date(r.createdAt).toLocaleString("uk-UA")}
                    </p>
                  </div>
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as RequestStatus)}
                    className="glow-ring rounded-lg border border-white/10 bg-base-950/60 px-3 py-2 text-xs text-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium">Послуги і ціни</h2>
            <button
              onClick={addService}
              className="glow-ring flex items-center gap-1 rounded-lg border border-violet/25 px-3 py-1.5 text-xs text-slate-200 hover:border-violet/50"
            >
              <Plus size={14} /> Додати
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {services.map((s) => (
              <div key={s.id} className="glass-card grid grid-cols-1 gap-2 rounded-xl p-4 sm:grid-cols-[1fr_2fr_1fr_auto]">
                <input
                  value={s.title}
                  onChange={(e) => updateService(s.id, "title", e.target.value)}
                  className="glow-ring rounded-lg border border-white/10 bg-base-950/60 px-3 py-2 text-sm"
                  placeholder="Назва"
                />
                <input
                  value={s.description}
                  onChange={(e) => updateService(s.id, "description", e.target.value)}
                  className="glow-ring rounded-lg border border-white/10 bg-base-950/60 px-3 py-2 text-sm"
                  placeholder="Опис"
                />
                <input
                  value={s.price}
                  onChange={(e) => updateService(s.id, "price", e.target.value)}
                  className="glow-ring rounded-lg border border-white/10 bg-base-950/60 px-3 py-2 text-sm"
                  placeholder="Ціна"
                />
                <button
                  onClick={() => removeService(s.id)}
                  className="glow-ring flex items-center justify-center rounded-lg border border-white/10 px-3 text-slate-400 hover:text-magenta"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium">FAQ</h2>
            <button
              onClick={addFaq}
              className="glow-ring flex items-center gap-1 rounded-lg border border-violet/25 px-3 py-1.5 text-xs text-slate-200 hover:border-violet/50"
            >
              <Plus size={14} /> Додати
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {faq.map((f) => (
              <div key={f.id} className="glass-card space-y-2 rounded-xl p-4">
                <div className="flex gap-2">
                  <input
                    value={f.question}
                    onChange={(e) => updateFaq(f.id, "question", e.target.value)}
                    className="glow-ring flex-1 rounded-lg border border-white/10 bg-base-950/60 px-3 py-2 text-sm"
                    placeholder="Питання"
                  />
                  <button
                    onClick={() => removeFaq(f.id)}
                    className="glow-ring flex items-center justify-center rounded-lg border border-white/10 px-3 text-slate-400 hover:text-magenta"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <textarea
                  value={f.answer}
                  onChange={(e) => updateFaq(f.id, "answer", e.target.value)}
                  className="glow-ring w-full rounded-lg border border-white/10 bg-base-950/60 px-3 py-2 text-sm"
                  placeholder="Відповідь"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={saveContent}
          disabled={savingContent}
          className="glow-ring flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet to-magenta px-5 py-3 text-sm font-medium text-white shadow-glow-violet disabled:opacity-60"
        >
          <Save size={16} /> {savingContent ? "Зберігаємо..." : "Зберегти зміни"}
        </button>
      </div>
    </main>
  );
}
