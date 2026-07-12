# Канбан-доска — проект курса WebDev Advanced

Сквозной учебный проект курса: канбан-доска, которую ты дорабатываешь от семинара к семинару. Сейчас это клиент на React; по ходу курса к нему добавятся сервер, база данных и авторизация.

## Стек

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- CSS Modules — стили компонентов
- [TanStack Query (React Query)](https://tanstack.com/query/latest) — серверное состояние
- [Zustand](https://zustand.docs.pmnd.rs/) — клиентское состояние
- [json-server](https://github.com/typicode/json-server) — мок-сервер (пока не появится настоящий backend)

## Запуск

```bash
npm install        # один раз после клонирования
npm run dev        # dev-сервер Vite → http://localhost:5173
npm run server     # мок-сервер API → http://localhost:3001
```

Для заданий, где нужен сервер, запусти обе команды в двух терминалах. Запросы клиента к `/api/*` автоматически проксируются на мок-сервер: `fetch("/api/cards")` вернёт содержимое коллекции `cards` из [db.json](db.json).

Прочие команды:

```bash
npm run build      # сборка + проверка типов (должна проходить перед сдачей!)
npm run lint       # ESLint
```

## Структура

```
src/
  main.tsx                  # точка входа, здесь подключён QueryClientProvider
  App.tsx                   # корневой компонент: шапка + доска
  index.css                 # глобальные стили и CSS-переменные темы
  types/
    card.ts                 # тип Card
  api/
    cards.ts                # готовые функции запросов к серверу
  components/
    BoardHeader/            # шапка страницы
    BoardColumn/            # колонка с карточками
    BoardCard/              # карточка задачи
    NewCardForm/            # форма добавления карточки
db.json                     # данные мок-сервера
```

Каждый компонент лежит в своей папке вместе со своим CSS-модулем (`*.module.css`).

## Как работать с проектом

- Установка, работа с Git без командной строки, сдача и приёмка заданий — [docs/COURSE-SETUP.md](docs/COURSE-SETUP.md);
- План курса по темам — [docs/COURSE-PLAN.md](docs/COURSE-PLAN.md);
- Лекции и задания семинаров — `docs/<N>-<Тема>/`.

Коротко о главном: `main` не трогаем, на каждое задание — своя ветка, коммиты мелкие и осмысленные, сдача оценочных заданий — через merge request в своей копии.
