"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, LogOut, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSceneStore } from "@/lib/store";

const NAV = [
  { label: "Про нас", href: "#about" },
  { label: "Послуги", href: "#services" },
  { label: "Порядок роботи", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакти", href: "#contacts" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openCallModal = useSceneStore((s) => s.openCallModal);
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-violet/10 bg-base-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-tight">OBU TECH</span>
          <span className="rounded border border-violet/20 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            OBUKHIV PC
          </span>
        </div>

        <nav className="hidden gap-7 text-sm text-slate-300 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="glow-ring rounded hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => openCallModal()}
            className="glow-ring rounded-lg bg-gradient-to-r from-violet to-magenta px-4 py-2 text-sm font-medium text-white shadow-glow-violet transition-transform hover:scale-[1.02]"
          >
            Викликати майстра
          </button>

          {status === "authenticated" && session?.user ? (
            <div className="group relative">
              <button className="glow-ring flex items-center gap-2 rounded-full border border-violet/20 py-1 pl-1 pr-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "Профіль"}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                )}
                <span className="text-xs text-slate-300">{session.user.name?.split(" ")[0]}</span>
              </button>
              <div className="invisible absolute right-0 top-full mt-2 w-44 rounded-xl border border-violet/20 bg-base-900/95 p-2 opacity-0 shadow-glass backdrop-blur-md transition-all group-hover:visible group-hover:opacity-100">
                {session.user.isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-200 hover:bg-white/5"
                  >
                    <ShieldCheck size={14} /> Панель адміністратора
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-200 hover:bg-white/5"
                >
                  <LogOut size={14} /> Вийти
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="glow-ring rounded-lg border border-violet/25 px-4 py-2 text-sm text-slate-200 hover:border-violet/50"
            >
              Увійти через Google
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Меню">
          <Menu size={22} />
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-violet/10 px-5 py-3 text-sm text-slate-300 md:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="py-2" onClick={() => setMenuOpen(false)}>
              {n.label}
            </a>
          ))}
          <button
            onClick={() => openCallModal()}
            className="mt-2 rounded-lg bg-gradient-to-r from-violet to-magenta py-2 text-center font-medium text-white"
          >
            Викликати майстра
          </button>
          {status === "authenticated" && session?.user ? (
            <>
              {session.user.isAdmin && (
                <Link href="/admin" className="py-2 text-slate-300">
                  Панель адміністратора
                </Link>
              )}
              <button onClick={() => signOut()} className="py-2 text-left text-slate-300">
                Вийти
              </button>
            </>
          ) : (
            <button onClick={() => signIn("google")} className="py-2 text-left text-slate-300">
              Увійти через Google
            </button>
          )}
        </div>
      )}
    </header>
  );
}
