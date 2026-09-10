"use client";

import { motion } from "framer-motion";
import {
  Wind,
  MonitorCog,
  HardDrive,
  Gauge,
  Cpu,
  Truck,
  ShieldCheck,
  Lock,
  MessageCircle,
  MapPin,
  Award,
  Users,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import PcModelClient from "@/components/3d/PcModelClient";
import CallMasterModal from "@/components/CallMasterModal";
import FloatingChat from "@/components/FloatingChat";
import Header from "@/components/Header";
import AccordionFAQ from "@/components/AccordionFAQ";
import { useSceneStore, hotspotContent } from "@/lib/store";
import type { ServiceItem, FaqItem } from "@/lib/data-store";

const TELEGRAM = "https://t.me/obukhivpctech_bot";

const serviceIcons: Record<string, React.ElementType> = {
  diag: Gauge,
  clean: Wind,
  windows: MonitorCog,
  build: Cpu,
  parts: HardDrive,
  upgrade: Cpu,
};

const steps = [
  { n: "01", title: "Заявка", desc: "Описуєте проблему через бота або по телефону." },
  { n: "02", title: "Діагностика", desc: "Визначаємо причину та обсяг робіт." },
  { n: "03", title: "Узгодження", desc: "Фіксуємо вартість ДО початку робіт." },
  { n: "04", title: "Виконання", desc: "Якісний ремонт або обслуговування." },
  { n: "05", title: "Перевірка", desc: "Фінальний тест системи разом із клієнтом." },
];

const aboutStats = [
  { icon: Award, label: "Років на ринку", value: "5+" },
  { icon: Users, label: "Клієнтів обслуговано", value: "800+" },
  { icon: Clock, label: "Середній час виїзду", value: "~40 хв" },
];

const problemOptions = ["Чищення / термопаста", "Не вмикається", "Потрібна Windows", "Апгрейд"];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

export default function Home() {
  const openCallModal = useSceneStore((s) => s.openCallModal);
  const activeHotspot = useSceneStore((s) => s.activeHotspot);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [calcSelected, setCalcSelected] = useState<string[]>([]);
  const [calcAddress, setCalcAddress] = useState("");
  const [calcContact, setCalcContact] = useState("");
  const [calcSubmitting, setCalcSubmitting] = useState(false);
  const [calcSent, setCalcSent] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setServices(data.services);
        setFaq(data.faq);
      })
      .catch(() => {
        // Content API unavailable — sections relying on it render empty until retried.
      });
  }, []);

  function toggleCalc(p: string) {
    setCalcSelected((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function submitCalc() {
    if (!calcContact.trim()) return;
    setCalcSubmitting(true);
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problems: calcSelected, address: calcAddress, contact: calcContact }),
      });
    } catch {
      // Non-blocking
    }
    const text = encodeURIComponent(
      `Заявка з сайту OBU TECH\nПроблема: ${calcSelected.join(", ") || "не вказано"}\nАдреса/район: ${calcAddress || "не вказано"}\nКонтакт: ${calcContact}`
    );
    window.open(`${TELEGRAM}?text=${text}`, "_blank");
    setCalcSubmitting(false);
    setCalcSent(true);
  }

  return (
    <main className="relative overflow-x-hidden bg-base-950 text-white">
      <Header />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-16 pt-14 md:grid-cols-2 md:pt-20">
        <motion.div {...fadeUp(0)}>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-violet-soft">
            Комп&apos;ютерна допомога в Обухові
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] md:text-5xl">
            Ваш ПК працює повільно, перегрівається або не вмикається?
          </h1>
          <p className="mt-5 max-w-md text-slate-300">
            Виїзна діагностика, обслуговування, ремонт та апгрейд прямо у вас удома.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet/20 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <Truck size={16} className="text-violet-soft" />
            Виїзд по Обухову від 200 грн
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => openCallModal()}
              className="glow-ring rounded-lg bg-gradient-to-r from-violet to-magenta px-6 py-3 text-sm font-medium text-white shadow-glow-violet transition-transform hover:scale-[1.02]"
            >
              Замовити виїзд
            </button>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-ring flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/30"
            >
              <MessageCircle size={16} />
              Зв&apos;язатись у Telegram
            </a>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.15)} className="relative h-[380px] w-full md:h-[480px]">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet/10 to-magenta/10 blur-3xl" />
          <div className="relative h-full w-full">
            <PcModelClient />
          </div>
          {!activeHotspot && (
            <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-center font-mono text-[11px] text-slate-500">
              Наведіть курсор — модель обертається за рухом миші. Клікніть на точку.
            </p>
          )}
          {activeHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card absolute bottom-2 left-1/2 w-64 -translate-x-1/2 rounded-xl p-4"
            >
              <p className="font-display text-sm text-violet-soft">
                {hotspotContent[activeHotspot].title}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {hotspotContent[activeHotspot].description}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <motion.div {...fadeUp(0)}>
            <h2 className="font-display text-3xl font-semibold">Про нас</h2>
            <p className="mt-4 text-slate-300">
              OBU TECH — це виїзна комп&apos;ютерна допомога в Обухові та найближчих районах.
              Ми почали з простих виїздів на чистку та діагностику, а зараз щотижня допомагаємо
              десяткам мешканців міста — від відновлення ПК, що не вмикається, до збірки нових
              систем під конкретні задачі.
            </p>
            <p className="mt-3 text-slate-300">
              Нам довіряють, тому що ми називаємо ціну до початку робіт, дбайливо ставимось до
              особистих даних клієнтів і завжди пояснюємо, що саме та чому робимо з технікою.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-3 gap-3">
            {aboutStats.map((s) => (
              <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
                <s.icon className="mx-auto text-violet-soft" size={22} />
                <p className="mt-2 font-display text-xl font-semibold">{s.value}</p>
                <p className="mt-1 text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICES + PRICING */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-20">
        <motion.h2 {...fadeUp(0)} className="font-display text-3xl font-semibold">
          Послуги і ціни
        </motion.h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.id] ?? Cpu;
            return (
              <motion.div
                key={s.id}
                {...fadeUp(i * 0.05)}
                className="glass-card group flex flex-col rounded-2xl p-6 transition-colors hover:border-violet/40"
              >
                <Icon className="mb-4 text-violet-soft" size={26} />
                <h3 className="font-display text-lg font-medium">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-400">{s.description}</p>
                <p className="mt-4 font-mono text-sm text-magenta">{s.price}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="mx-auto max-w-7xl px-5 py-20">
        <motion.h2 {...fadeUp(0)} className="font-display text-3xl font-semibold">
          Порядок роботи
        </motion.h2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <motion.div key={s.n} {...fadeUp(i * 0.07)} className="glass-card rounded-2xl p-5">
              <span className="font-mono text-2xl text-ultra">{s.n}</span>
              <h3 className="mt-3 font-display text-base font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.div {...fadeUp(0)} className="glass-card rounded-2xl p-6">
            <Truck className="mb-3 text-violet-soft" size={24} />
            <h3 className="font-display text-lg font-medium">Умови виїзду</h3>
            <p className="mt-2 text-sm text-slate-400">
              Обухів — від 200 грн. Виїзд за межі міста — за домовленістю.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.08)} className="glass-card rounded-2xl p-6">
            <Lock className="mb-3 text-magenta" size={24} />
            <h3 className="font-display text-lg font-medium">Безпека даних</h3>
            <p className="mt-2 text-sm text-slate-400">
              Особисті файли не передаються третім особам. Під час перевстановлення Windows
              вживаємо всіх заходів для збереження ваших фото й документів.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.16)} className="glass-card rounded-2xl p-6">
            <ShieldCheck className="mb-3 text-violet-soft" size={24} />
            <h3 className="font-display text-lg font-medium">Гарантія</h3>
            <p className="mt-2 text-sm text-slate-400">
              Гарантія на виконані роботи. На деталі діє офіційна гарантія виробника.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="mx-auto max-w-7xl px-5 py-20">
        <motion.div {...fadeUp(0)} className="glass-card mx-auto max-w-2xl rounded-3xl p-8">
          <h2 className="font-display text-2xl font-semibold">Швидка заявка</h2>
          <p className="mt-1 text-sm text-slate-400">
            Оберіть проблему і надішліть заявку прямо в Telegram-бот.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {problemOptions.map((p) => (
              <button
                key={p}
                onClick={() => toggleCalc(p)}
                className={`glow-ring rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  calcSelected.includes(p)
                    ? "border-violet bg-violet/10 text-violet-soft"
                    : "border-white/10 text-slate-300 hover:border-white/20"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              value={calcAddress}
              onChange={(e) => setCalcAddress(e.target.value)}
              placeholder="Адреса / район в Обухові"
              className="glow-ring rounded-lg border border-white/10 bg-base-950/60 px-4 py-3 text-sm placeholder:text-slate-500"
            />
            <input
              value={calcContact}
              onChange={(e) => setCalcContact(e.target.value)}
              placeholder="Telegram або телефон"
              className="glow-ring rounded-lg border border-white/10 bg-base-950/60 px-4 py-3 text-sm placeholder:text-slate-500"
            />
          </div>

          <button
            onClick={submitCalc}
            disabled={calcSubmitting}
            className="glow-ring mt-6 w-full rounded-lg bg-gradient-to-r from-violet to-magenta py-3 text-sm font-medium text-white shadow-glow-violet transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {calcSubmitting ? "Надсилаємо..." : "Розрахувати та надіслати в Telegram"}
          </button>
          {calcSent && (
            <p className="mt-3 text-center text-xs text-violet-soft">
              Заявку відправлено. Ми відповімо найближчим часом у Telegram.
            </p>
          )}
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-5 py-20">
        <motion.h2 {...fadeUp(0)} className="font-display text-3xl font-semibold">
          Часті запитання
        </motion.h2>
        <div className="mt-8">
          <AccordionFAQ items={faq} />
        </div>
      </section>

      {/* CONTACTS + MAP */}
      <section id="contacts" className="mx-auto max-w-7xl px-5 py-20">
        <motion.h2 {...fadeUp(0)} className="font-display text-3xl font-semibold">
          Контакти і зона виїзду
        </motion.h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div {...fadeUp(0)} className="glass-card rounded-2xl p-6">
            <p className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin size={16} className="text-violet-soft" /> Обухів і найближчі райони
              (Київська область)
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Основна зона виїзду — місто Обухів. Виїзд у сусідні населені пункти узгоджується
              індивідуально залежно від відстані.
            </p>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-ring mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm hover:border-white/30"
            >
              <MessageCircle size={16} /> @obukhivpctech_bot
            </a>
          </motion.div>
          <motion.div
            {...fadeUp(0.1)}
            className="glass-card flex min-h-[220px] items-center justify-center rounded-2xl p-6 text-center"
          >
            <div>
              <MapPin className="mx-auto text-violet-soft" size={28} />
              <p className="mt-3 text-sm text-slate-400">
                Обухів, Київська область — зона виїзду охоплює все місто та найближчі села.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-violet/10 px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="font-display text-lg font-semibold">OBU TECH</span>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <MapPin size={14} /> Обухів і найближчі райони
            </p>
          </div>
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-ring flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm hover:border-white/30"
          >
            <MessageCircle size={16} /> @obukhivpctech_bot
          </a>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-slate-500">
          Інформація на сторінці може оновлюватись. Актуальна вартість уточнюється перед
          замовленням.
        </p>
      </footer>

      <CallMasterModal />
      <FloatingChat />
    </main>
  );
}
