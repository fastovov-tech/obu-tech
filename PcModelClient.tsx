"use client";

import dynamic from "next/dynamic";

const PcModel = dynamic(() => import("./PcModel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-sm text-slate-300">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet border-t-transparent" />
        <span className="font-mono">Завантаження 3D-моделі OBU TECH...</span>
      </div>
    </div>
  ),
});

export default function PcModelClient() {
  return <PcModel />;
}
