import { create } from "zustand";

export type HotspotId = "cooler" | "gpu" | "ssd" | null;

export const hotspotContent: Record<
  Exclude<HotspotId, null>,
  { title: string; description: string }
> = {
  cooler: {
    title: "Чищення і захист від перегріву",
    description:
      "Чистимо систему охолодження від пилу, міняємо термопасту, перевіряємо температури під навантаженням.",
  },
  gpu: {
    title: "Модернізація та заміна комплектуючих",
    description:
      "Підбираємо сумісні відеокарти, ОЗУ та блоки живлення під ваші задачі та бюджет.",
  },
  ssd: {
    title: "Встановлення Windows зі збереженням даних",
    description:
      "Переносимо систему на SSD, налаштовуємо Windows і драйвери, дбайливо зберігаємо ваші файли.",
  },
};

interface SceneState {
  activeHotspot: HotspotId;
  setActiveHotspot: (id: HotspotId) => void;
  isCallModalOpen: boolean;
  openCallModal: (preset?: string) => void;
  closeCallModal: () => void;
  presetProblem: string | null;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeHotspot: null,
  setActiveHotspot: (id) => set({ activeHotspot: id }),
  isCallModalOpen: false,
  presetProblem: null,
  openCallModal: (preset) =>
    set({ isCallModalOpen: true, presetProblem: preset ?? null }),
  closeCallModal: () => set({ isCallModalOpen: false, presetProblem: null }),
}));
