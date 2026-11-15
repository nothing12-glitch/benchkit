/* Benchkit — браузерна пісочниця для коду. Усі запуски ізольовані, жодного сервера. */

const VERSION = "1.0.0";
const MONACO_CDN = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";
const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
const RUN_TIMEOUT = 8000;
const STORE = "benchkit:" + VERSION;

const LANGS = [
  {
    id: "javascript",
    label: "JavaScript",
    file: "script.js",
    monaco: "javascript",
    runner: "js",
    sample: `// JavaScript виконується ізольовано в браузері.
const tasks = [{ name: "Позичити книгу", done: true }, { name: "Погуляти з собакою", done: false }];

for (const t of tasks) {
  console.log(\`\${t.done ? "[✓]" : "[ ]"} \${t.name}\`);
}

const left = tasks.filter(t => !t.done).length;
console.log("Лишилось справ:", left);`,
  },
  {
    id: "python",
    label: "Python",
    file: "script.py",
    monaco: "python",
    runner: "py",
    sample: `# Python працює через Pyodide — справжній Python у вкладці браузера.
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fibonacci(i) for i in range(12)])

import statistics
scores = [78, 92, 64, 88, 71]
print("середнє:", round(statistics.mean(scores), 1))`,
  },
  {
    id: "html",
    label: "HTML",
    file: "page.html",
    monaco: "html",
    runner: "html",
    sample: `<!doctype html>
<html lang="uk">
<meta charset="utf-8">
<style>
  body { font-family: system-ui; background: #0f172a; color: #e2e8f0; padding: 32px; }
  .card { background: #1e293b; border-radius: 14px; padding: 20px; max-width: 420px; }
  button { background: #4ade80; border: 0; padding: 10px 16px; border-radius: 8px; font-weight: 700; }
</style>

<div class="card">
  <h2 id="title">Мій перший уламок</h2>
  <button id="btn">Натисни мене</button>
</div>

<script>
  let n = 0;
  btn.onclick = () => title.textContent = "Натискань: " + (++n);
<\/script>
</html>`,
  },
  {
    id: "css",
    label: "CSS",
    file: "styles.css",
    monaco: "css",
    runner: "css",
    sample: `/* CSS застосовується до тестової сторінки праворуч — правіть і бачите результат. */
body { font-family: system-ui, sans-serif; padding: 24px; background: #fafafa; }

.card {
  max-width: 360px;
  padding: 18px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  color: white;
  box-shadow: 0 12px 30px rgba(35, 42, 91, .25);
}

.card:hover { transform: translateY(-4px) rotate(-1deg); transition: .25s; }`,
  },
  { id: "typescript", label: "TypeScript", file: "main.ts", monaco: "typescript", runner: "edit", hint: "Підсвітка та редагування. Запуск у браузері з'явиться пізніше." },
  { id: "sql", label: "SQL", file: "query.sql", monaco: "sql", runner: "edit", hint: "Підсвітка синтаксису. Виконання потребує бази даних на сервері." },
  { id: "c", label: "C", file: "main.c", monaco: "c", runner: "edit", hint: "Потрібен компілятор — розширюємо через зовнішній API." },
  { id: "cpp", label: "C++", file: "main.cpp", monaco: "cpp", runner: "edit", hint: "Потрібен компілятор — розширюємо через зовнішній API." },
  { id: "java", label: "Java", file: "Main.java", monaco: "java", runner: "edit", hint: "Потрібна JVM — розширюємо через зовнішній API." },
  { id: "go", label: "Go", file: "main.go", monaco: "go", runner: "edit", hint: "Потрібний компілятор Go — розширюємо через зовнішній API." },
  { id: "rust", label: "Rust", file: "main.rs", monaco: "rust", runner: "edit", hint: "Потрібен компілятор Rust — розширюємо через зовнішній API." },
  { id: "php", label: "PHP", file: "index.php", monaco: "php", runner: "edit", hint: "Потрібен інтерпретатор PHP на сервері." },
  { id: "ruby", label: "Ruby", file: "app.rb", monaco: "ruby", runner: "edit", hint: "Потрібен інтерпретатор Ruby на сервері." },
  { id: "bash", label: "Bash", file: "run.sh", monaco: "shell", runner: "edit", hint: "Потрібна оболонка на сервері." },
];

const CSS_DEMO_BODY = `
<div class="card">
  <h3>Заголовок картки</h3>
  <p>Абзац тексту, щоб було видно шрифт, відступи та колір.</p>
  <button>Кнопка</button>
</div>
<ul><li>Перший пункт</li><li>Другий пункт</li></ul>`;

const $ = (sel) => document.querySelector(sel);

const els = {
  tabs: $("#langTabs"),
  editor: $("#editor"),
  console: $("#console"),
  preview: $("#preview"),
  sandbox: $("#js-sandbox"),
  run: $("#runBtn"),
  status: $("#status"),
  currentLang: $("#currentLang"),
  tabConsole: $("#tabConsole"),
  tabPreview: $("#tabPreview"),
  modal: $("#modal"),
};

let monacoEditor = null;
let active = findLang(localStorage.getItem(STORE + ":active")) || LANGS[0];
let pyodide = null;
let watchdog = null;

function findLang(id) {
  return LANGS.find((l) => l.id === id);
}

/* ---------- збережений код ---------- */

function savedCode(lang) {
  const stored = localStorage.getItem(STORE + ":code:" + lang.id);
  if (stored !== null) return stored;
  return lang.runner === "edit" ? `// ${lang.label}: ${lang.hint}\n` : lang.sample;
}

function storeCode() {
  localStorage.setItem(STORE + ":code:" + active.id, monacoEditor.getValue());
}

/* ---------- вивід ---------- */

function print(text, kind = "log") {
  const line = document.createElement("span");
  line.className = "line " + kind;
  line.textContent = text;
  els.console.appendChild(line);
  els.console.scrollTop = els.console.scrollHeight;
}

function printDivider(label) {
  print("─".repeat(28) + " " + label, "divider");
}

function setStatus(kind, text) {
  els.status.className = "status " + kind;
  els.status.textContent = text;
}

function showConsole() {
  localStorage.setItem(STORE + ":view", "console");
  els.console.classList.remove("hidden");
  els.preview.classList.add("hidden");
  els.tabConsole.classList.add("active");
  els.tabPreview.classList.remove("active");
}

function showPreview() {
  localStorage.setItem(STORE + ":view", "preview");
  els.console.classList.add("hidden");
  els.preview.classList.remove("hidden");
  els.tabPreview.classList.add("active");
  els.tabConsole.classList.remove("active");
}

function endRun(seconds) {
  clearTimeout(watchdog);
  watchdog = null;
  if (seconds === null) {
    setStatus("bad", "зупинено");
    printDivider("зупинено");
  } else if (typeof seconds === "number") {
    setStatus("ok", "виконано");
    printDivider(seconds.toFixed(3) + " c");
  }
  els.run.disabled = active.runner === "edit";
}

function fail(err) {
  clearTimeout(watchdog);
  watchdog = null;
  setStatus("bad", "помилка");
  print(String((err && err.stack) || err), "error");
  printDivider("помилка");
  els.run.disabled = active.runner === "edit";
}

/* ---------- вкладка мови ---------- */

function renderTabs() {
  els.tabs.textContent = "";
  for (const lang of LANGS) {
    const btn = document.createElement("button");
    btn.className = "tab" + (lang.id === active.id ? " active" : "") + (lang.runner === "edit" ? " soon" : "");
    btn.title = lang.runner === "edit" ? lang.hint : "Запускається прямо в браузері";
    const dot = document.createElement("span");
    dot.className = "dot";
    btn.append(dot, document.createTextNode(lang.label));
    btn.onclick = () => selectLang(lang.id);
    els.tabs.appendChild(btn);
  }
}

function applyLang(lang) {
  active = lang;
  localStorage.setItem(STORE + ":active", lang.id);
  renderTabs();
  els.currentLang.textContent = lang.label;
  monacoEditor.setValue(savedCode(lang));
  monaco.editor.setModelLanguage(monacoEditor.getModel(), lang.monaco);
  els.run.disabled = lang.runner === "edit";
  els.console.textContent = "";

  if (lang.runner === "edit") {
    showConsole();
    print(lang.hint, "sys");
    print("Файл можна завантажити кнопкою «Завантажити».", "sys");
    setStatus("idle", "лише редактор");
  } else {
    setStatus("idle", "готово");
  }
}

function selectLang(id) {
  const lang = findLang(id);
  if (!lang || lang.id === active.id) return;
  storeCode();
  applyLang(lang);
  monacoEditor.focus();
}

/* ---------- JavaScript: ізольований iframe ---------- */

const SANDBOX_DOC = `<!doctype html><meta charset="utf-8"><script>
(function () {
  const post = (level, text) => parent.postMessage({ benchkit: 1, level, text }, "*");
  const show = (v) => {
    if (typeof v === "string") return v;
    if (v instanceof Error) return v.name + ": " + v.message;
    try { return JSON.stringify(v, (k, val) => (typeof val === "function" ? "[Function]" : val), 1) || String(v); }
    catch (e) { return String(v); }
  };
  for (const kind of ["log", "info", "warn", "error"]) {
    console[kind] = (...args) => post(kind, args.map(show).join(" "));
  }
  window.onerror = (msg, src, line, col, err) => post("error", err ? show(err) : msg + " (рядок " + line + ")");
  window.addEventListener("unhandledrejection", (e) => post("error", "Упущений проміс: " + show(e.reason)));
  window.addEventListener("message", (ev) => {
    const data = ev.data || {};
    if (!data.benchkitRun) return;
    const started = Date.now();
    const report = (err) => { post("error", show(err)); post("done", (Date.now() - started) / 1000); };
    try {
      const body = new Function('"use strict"; return (async () => {\\n' + data.benchkitRun + "\\n})();")();
      Promise.resolve(body).then(() => post("done", (Date.now() - started) / 1000), report);
    } catch (err) {
      report(err);
    }
  });
  parent.postMessage({ benchkit: 1, level: "ready" }, "*");
})();
<\/script>`;

function runJavaScript(code) {
  const frame = els.sandbox;
  const onMessage = (ev) => {
    const data = ev.data || {};
    if (data.benchkit !== 1 || ev.source !== frame.contentWindow) return;
    if (data.level === "ready") {
      frame.contentWindow.postMessage({ benchkitRun: code }, "*");
    } else if (data.level === "done") {
      window.removeEventListener("message", onMessage);
      endRun(data.text);
    } else {
      print(data.text, data.level);
    }
  };

  window.addEventListener("message", onMessage);
  watchdog = setTimeout(() => {
    window.removeEventListener("message", onMessage);
    frame.removeAttribute("srcdoc");
    endRun(null);
    print("Зупинено: код не завершився за 8 секунд (можливо, нескінченний цикл).", "error");
  }, RUN_TIMEOUT);

  frame.srcdoc = SANDBOX_DOC;
}

/* ---------- Python: Pyodide ---------- */

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = src;
    tag.onload = resolve;
    tag.onerror = () => reject(new Error("Не вдалося завантажити " + src + " — перевірте з'єднання."));
    document.head.appendChild(tag);
  });
}

async function ensurePyodide() {
  if (pyodide) return pyodide;
  setStatus("busy", "Python: перший запуск…");
  print("Завантажую Pyodide (справжній Python, ~10 МБ). Це одноразово — далі буде швидше.", "sys");
  await loadScript(PYODIDE_CDN + "pyodide.js");
  pyodide = await loadPyodide({
    indexURL: PYODIDE_CDN,
    stdout: (line) => print(line, "log"),
    stderr: (line) => print(line, "error"),
  });
  const version = await pyodide.runPythonAsync("import sys; sys.version.split()[0]");
  print("Python " + version + " готовий.", "sys");
  return pyodide;
}

async function runPython(code) {
  const started = performance.now();
  const vm = await ensurePyodide();
  await vm.runPythonAsync(code);
  endRun((performance.now() - started) / 1000);
}

/* ---------- HTML / CSS: живий перегляд ---------- */

function runHtml(code) {
  els.preview.srcdoc = code;
  showPreview();
  print("Сторінку відкрито в «Попередньому перегляді».", "sys");
  print("Console самої сторінки — у розробницьких інструментах браузера (F12).", "sys");
  endRun();
  setStatus("ok", "готово");
}

function runCss(code) {
  els.preview.srcdoc =
    `<!doctype html><meta charset="utf-8"><style>` + code + `</style><body>` + CSS_DEMO_BODY + `</body>`;
  showPreview();
  print("Ваш CSS застосовано до тестової розмітки в «Попередньому перегляді».", "sys");
  endRun();
  setStatus("ok", "готово");
}

/* ---------- запуск ---------- */

async function runCurrent() {
  const code = monacoEditor.getValue();
  storeCode();
  els.run.disabled = true;
  setStatus("busy", "виконую…");

  if (active.runner === "html") return runHtml(code);
  if (active.runner === "css") return runCss(code);

  els.console.textContent = "";
  showConsole();

  if (active.runner === "js") {
    runJavaScript(code);
    return;
  }
  try {
    await runPython(code);
  } catch (err) {
    fail(err);
  }
}

/* ---------- модалка «Як це працює» ---------- */

const ABOUT_HTML = `
  <h3>Що запускається прямо в браузері</h3>
  <div class="lang-grid">
    <div class="lang-cell runnable"><b>JavaScript</b><span>в ізольованій пісочниці, без доступу до ваших файлів</span></div>
    <div class="lang-cell runnable"><b>Python</b><span>справжній CPython через Pyodide</span></div>
    <div class="lang-cell runnable"><b>HTML</b><span>живий перегляд сторінки</span></div>
    <div class="lang-cell runnable"><b>CSS</b><span>перегляд на тестовій розмітці</span></div>
  </div>
  <h3>Інші мови</h3>
  <p>TypeScript, SQL, C, C++, Java, Go, Rust, PHP, Ruby, Bash можна писати з підсвіткою та завантажувати як файли. Їхній запуск потребує компілятора чи інтерпретатора на сервері — це наступний крок, коли з'явиться бекенд (наприклад <code>Piston</code> API).</p>
  <h3>Куди зникає код</h3>
  <p>Нікуди. Усе зберігається лише у цьому браузері (<code>localStorage</code>), ми нічого нікому не надсилаємо. Кнопка «Завантажити» зберігає файл на комп'ютер.</p>
  <h3>Гарячі клавіші</h3>
  <ul>
    <li><code>Ctrl / ⌘ + Enter</code> — запустити</li>
    <li><code>Ctrl / ⌘ + S</code> — завантажити файл</li>
  </ul>`;

function openModal(title, bodyHtml) {
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = bodyHtml;
  els.modal.classList.remove("hidden");
}

function closeModal() {
  els.modal.classList.add("hidden");
}

function downloadCurrent() {
  const url = URL.createObjectURL(new Blob([monacoEditor.getValue()], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = active.file;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- ініціалізація ---------- */

function boot() {
  require.config({ paths: { vs: MONACO_CDN + "/vs" } });
  window.MonacoEnvironment = {
    getWorkerUrl() {
      const proxy = `self.MonacoEnvironment={baseUrl:"${MONACO_CDN}/"};importScripts("${MONACO_CDN}/vs/base/worker/workerMain.js");`;
      return URL.createObjectURL(new Blob([proxy], { type: "text/javascript" }));
    },
  };

  require(
    ["vs/editor/editor.main"],
    () => {
      monacoEditor = monaco.editor.create(els.editor, {
        value: savedCode(active),
        language: active.monaco,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        tabSize: 2,
        padding: { top: 10 },
      });

      monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCurrent);

      let timer = null;
      monacoEditor.onDidChangeModelContent(() => {
        clearTimeout(timer);
        timer = setTimeout(storeCode, 400);
      });

      applyLang(active);
      if (localStorage.getItem(STORE + ":view") === "preview") showPreview();
      els.run.onclick = runCurrent;
    },
    () => {
      els.editor.innerHTML = '<p style="padding:16px;color:#f87171">Не вдалося завантажити редактор із CDN. Потрібен доступ до інтернету.</p>';
      els.run.disabled = true;
    }
  );
}

els.tabConsole.onclick = showConsole;
els.tabPreview.onclick = showPreview;
$("#aboutBtn").onclick = () => openModal("Benchkit " + VERSION, ABOUT_HTML);
$("#modalClose").onclick = closeModal;
$("#downloadBtn").onclick = downloadCurrent;
$("#resetBtn").onclick = () => {
  localStorage.removeItem(STORE + ":code:" + active.id);
  monacoEditor.setValue(active.sample || `// ${active.label}: ${active.hint}\n`);
  print("Повернено приклад для " + active.label + ".", "sys");
};
els.modal.onclick = (e) => {
  if (e.target === els.modal) closeModal();
};

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    downloadCurrent();
  }
  if (e.key === "Escape") closeModal();
});

boot();
