// NOTE: This is an in-memory store for demo/scaffold purposes.
// It resets on server restart and is NOT shared across serverless instances.
// For production, replace these functions with calls to a real database
// (e.g. Supabase, Postgres via Prisma, PlanetScale) using the same shape.

export type RequestStatus = "Нова" | "В роботі" | "Завершена";

export interface RepairRequest {
  id: string;
  problems: string[];
  address: string;
  contact: string;
  status: RequestStatus;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Store {
  requests: RepairRequest[];
  services: ServiceItem[];
  faq: FaqItem[];
}

const globalForStore = globalThis as unknown as { __obuStore?: Store };

function seed(): Store {
  return {
    requests: [],
    services: [
      { id: "diag", title: "Діагностика", description: "Визначення причини несправності та стану основних компонентів.", price: "від 150 грн" },
      { id: "clean", title: "Чистка / термопаста", description: "Чистка від пилу, заміна термопасти, перевірка температур.", price: "від 350 грн" },
      { id: "windows", title: "Переустановка Windows", description: "Встановлення та налаштування Windows, драйверів і оновлень.", price: "від 500 грн" },
      { id: "build", title: "Збірка ПК", description: "Підбір комплектуючих і збірка нового ПК під ваш бюджет.", price: "від 800 грн" },
      { id: "parts", title: "Заміна деталей", description: "Встановлення SSD, HDD, ОЗУ, відеокарт, блоків живлення.", price: "від 250 грн" },
      { id: "upgrade", title: "Модернізація", description: "Підбір сумісних комплектуючих і збалансований апгрейд.", price: "індивідуально" },
    ],
    faq: [
      { id: "f1", question: "Скільки коштує виїзд?", answer: "По Обухову — від 200 грн. За межі міста ціна узгоджується окремо, залежно від відстані." },
      { id: "f2", question: "Чи збережуться мої файли при переустановці Windows?", answer: "Так, ми вживаємо всіх заходів для збереження фото і документів перед перевстановленням, і завжди попереджаємо заздалегідь, якщо є ризик." },
      { id: "f3", question: "Коли я дізнаюсь фінальну ціну?", answer: "Вартість фіксується одразу після діагностики, до початку будь-яких робіт. Без прихованих доплат." },
      { id: "f4", question: "Що робити, якщо ПК зовсім не вмикається?", answer: "Опишіть у заявці, що відбувається (немає світла на корпусі, чути звук вентиляторів, тощо) — це допоможе швидше визначити несправність ще до виїзду майстра." },
      { id: "f5", question: "Скільки триває стандартний виїзд?", answer: "Діагностика і більшість дрібних ремонтів займають 30-90 хвилин. Для складніших робіт майстер попередить про орієнтовний час заздалегідь." },
      { id: "f6", question: "Чи можна викликати майстра у вихідні?", answer: "Так, працюємо щодня. Уточнюйте зручний час у Telegram-боті при оформленні заявки." },
    ],
  };
}

export function getStore(): Store {
  if (!globalForStore.__obuStore) {
    globalForStore.__obuStore = seed();
  }
  return globalForStore.__obuStore;
}
