# Benchkit

Пісочниця для коду в браузері: редактор із підсвіткою, запуск і живий перегляд — без сервера й без встановлення.

## Що запускається прямо в браузері

| Мова | Як працює |
| --- | |
| JavaScript | ізольований `<iframe sandbox>`, консоль перекидається в Benchkit |
| Python | справжній CPython через [Pyodide](https://pyodide.org) (~10 МБ при першому запуску) |
| HTML | живий перегляд у пісочниці |
| CSS | перегляд на тестовій розмітці |

TypeScript, SQL, C, C++, Java, Go, Rust, PHP, Ruby, Bash доступні як редактор із підсвіткою та кнопкою «Завантажити». Для їхнього запуску потрібен компілятор чи інтерпретатор на сервері — наступний крок, наприклад через [Piston API](https://piston.readthedocs.io).

## Файли

```
index.html   розмітка й кнопки
styles.css   тема інтерфейсу
app.js       мови, запуск, збереження коду
.nojekyll    щоб GitHub Pages не ігнорував файл із підкресленням
```

Жодних залежностей у репозиторії: Monaco Editor і Pyodide підвантажуються з CDN.

## Локально

Відкрити `index.html` у браузері, або:

```
python -m http.server 8000
```

і зайти на http://localhost:8000

## Ваш код нікуди не надсилається

Усе зберігається лише в `localStorage` вашого браузера. Кнопка «Завантажити» зберігає файл на комп'ютер.

## Публікація на GitHub Pages

1. Створити репозиторій `benchkit` на github.com (кнопка **New repository**).
2. Завантажити в нього чотири файли (кнопка **Add files → Upload files**).
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`, **Save**.
4. Через хвилипу сайт доступний за адресою `https://<ваш-акаунт>.github.io/benchkit/`.

## Гарячі клавіші

- `Ctrl` / `⌘` + `Enter` — запустити
- `Ctrl` / `⌘` + `S` — завантажити файл
