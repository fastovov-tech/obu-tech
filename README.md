# OBU TECH (OBUKHIV PC)

Виїзна комп'ютерна допомога в Обухові — production-ready сайт на Next.js 14 + React Three Fiber,
з входом через Google та панеллю адміністратора.

## Швидкий старт

```bash
npm install
cp .env.example .env.local   # заповніть значення, див. нижче
npm run dev
```

Відкрийте http://localhost:3000

## Налаштування Google Auth

1. У [Google Cloud Console](https://console.cloud.google.com/apis/credentials) створіть OAuth
   Client ID типу "Web application".
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   (на продакшені — `https://ваш-домен/api/auth/callback/google`).
3. Скопіюйте Client ID та Client Secret у `.env.local`.
4. Згенеруйте `NEXTAUTH_SECRET`: `openssl rand -base64 32`.
5. У `ADMIN_EMAILS` вкажіть Google-пошти, яким дозволено заходити у `/admin`. Усі інші
   користувачі, що увійшли через Google, бачать звичайний сайт без адмін-функцій.

## Панель адміністратора

`/admin` захищений `middleware.ts` — доступ мають лише сесії з `isAdmin: true`
(перевіряється по email зі списку `ADMIN_EMAILS`). У панелі:

- список заявок зі статусами **Нова / В роботі / Завершена**;
- редагування переліку послуг і цін;
- редагування FAQ.

## Дані заявок і контенту

`lib/data-store.ts` — це **in-memory сховище для демо/скаффолду**. Воно скидається при
перезапуску сервера і не працює коректно на serverless-платформах із кількома інстансами
(Vercel тощо). Для реального продакшену замініть функції в цьому файлі на звернення до
справжньої бази даних з такою ж структурою — підійде Supabase, Postgres через Prisma, або
PlanetScale. API-роути (`app/api/requests/route.ts`, `app/api/content/route.ts`) не потребують
змін ззовні — досить підмінити реалізацію `getStore()`.

## Структура проєкту

- `app/page.tsx` — головна сторінка (усі секції)
- `app/admin/page.tsx` — панель адміністратора
- `app/api/auth/[...nextauth]/route.ts` — NextAuth (Google)
- `app/api/requests/route.ts` — заявки (створення — публічне, перегляд/зміна статусу — адмін)
- `app/api/content/route.ts` — послуги і FAQ (перегляд — публічний, редагування — адмін)
- `middleware.ts` — захист `/admin`
- `components/3d/PcModel.tsx` — 3D-модель ПК (Three.js / R3F): фіолетове RGB-освітлення,
  неонові частинки, набличення камери до hotspot-у при кліку
- `components/Header.tsx` — навігація + Google-автентифікація (аватар, вихід, посилання на
  адмінку)
- `components/FloatingChat.tsx` — плаваюча кнопка зв'язку (Telegram + швидкий виклик майстра)
- `components/AccordionFAQ.tsx` — розгортний список питань (Radix Accordion)
- `lib/store.ts` — Zustand-стор для 3D-сцени (активний hotspot, стан модалки виклику майстра)
- `lib/data-store.ts` — сховище даних (див. вище)

## Кольорова палітра (Deep Cyber Purple)

Задана в `tailwind.config.ts`: фон `#0A051B` / `#0F0826`, акценти `#8B5CF6`, `#A855F7`,
`#D946EF`, `#6366F1`. Скляні картки — `.glass-card` у `app/globals.css`.

## Перед публікацією

- Додайте реальне зображення `public/og-cover.jpg` (1200×630) для Open Graph — зараз шлях
  прописаний у метаданих `app/layout.tsx`, але файл потрібно покласти самостійно.
- Перевірте `metadataBase` у `app/layout.tsx` — замініть на ваш реальний домен.
- Замініть `@obukhivpctech_bot`, якщо зміниться юзернейм Telegram-бота (зустрічається в
  `page.tsx`, `CallMasterModal.tsx`, `FloatingChat.tsx`).
