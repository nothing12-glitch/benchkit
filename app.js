/* Benchkit — маршрути, мови, запуск. Інтерфейс говорить двома мовами, код однаковий для всіх. */

const MONACO_CDN = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";
const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
const RUN_TIMEOUT = 8000;
const WANDBOX_API = "https://wandbox.org/api/compile.json";
const WANDBOX_WAIT = 150000;
const STORE = "benchkit:v2";

const LANGS = [
  {
    id: "python", glyph: "py", tone: "primary", monaco: "python", runner: "py", file: "script.py",
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
    projects: [
      {
        name: "proj.pyGuess",
        code: `# Гра «вгадай число»: комп'ютер загадав, перевіряємо свої спроби.
import random

taemne = random.randint(1, 20)
sproby = [10, 15, 18, 3, 7, 12, 20, 1]

print("Загадано число від 1 до 20. Перевіряємо спроби:")

for nomer, tryh in enumerate(sproby, start=1):
    if tryh == taemne:
        print("Вгадав на спробі", nomer)
        break
    elif tryh < taemne:
        print(tryh, "-> більше")
    else:
        print(tryh, "-> менше")
else:
    print("Спроби скінчились. Було число", taemne)`,
      },
      {
        name: "proj.pyGrades",
        code: `# Журнал оцінок: рахуємо середнє та найкращого учня.
otsinky = {
    "Оля": [12, 11, 10],
    "Максим": [9, 10, 8],
    "Соня": [12, 12, 11],
}

for imia, spysok in otsinky.items():
    serednye = sum(spysok) / len(spysok)
    print(imia, "->", round(serednye, 1))

lukhshyi = max(otsinky, key=lambda k: sum(otsinky[k]) / len(otsinky[k]))
print("Найкращий результат у:", lukhshyi)`,
      },
    ],
  },
  {
    id: "javascript", glyph: "js", tone: "quaternary", monaco: "javascript", runner: "js", file: "script.js",
    sample: `// JavaScript виконується ізольовано в браузері.
const tasks = [{ name: "Позичити книгу", done: true }, { name: "Погуляти з собакою", done: false }];

for (const t of tasks) {
  console.log(\`\${t.done ? "[✓]" : "[ ]"} \${t.name}\`);
}

const left = tasks.filter(t => !t.done).length;
console.log("Лишилось справ:", left);`,
    projects: [
      {
        name: "proj.jsTimer",
        code: `// Скільки секунд потрібно, щоб порахувати до 5 (умовно).
// setInterval тут не використовуємо — пісочниця вимкнула б цикл.
let elapsed = 0;
for (let sec = 1; sec <= 5; sec++) {
  elapsed += sec;
  console.log("Секунда " + sec + ", сума досі: " + elapsed);
}
console.log("Готово. Разом " + elapsed + " секунд.");`,
      },
      {
        name: "proj.jsWords",
        code: `// Аналіз речення: скільки слів, яка літера найчастіша.
const ridnennya = "мама мила раму милою водою";
const slova = ridnennya.split(" ");
console.log("Слів:", slova.length);

const lehery = {};
for (const litera of ridnennya.replace(/ /g, "")) {
  lehery[litera] = (lehery[litera] || 0) + 1;
}

let naycastisha = "";
let yak = 0;
for (const [leh, kilka] of Object.entries(lehery)) {
  if (kilka > yak) { naycastisha = leh; yak = kilka; }
}
console.log("Найчастіша літера:", naycastisha, "-" + yak + " разів");`,
      },
    ],
  },
  {
    id: "html", glyph: "<>", tone: "secondary", monaco: "html", runner: "html", file: "page.html",
    sample: `<!doctype html>
<html lang="uk">
<meta charset="utf-8">
<style>
  body { font-family: system-ui; background: #0f172a; color: #e2e8f0; padding: 32px; }
  .card { background: #1e293b; border-radius: 14px; padding: 20px; max-width: 420px; }
  button { background: #54dbc2; border: 0; padding: 10px 16px; border-radius: 999px; font-weight: 700; }
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
    projects: [
      {
        name: "proj.htmlCard",
        code: `<!doctype html>
<html lang="uk">
<meta charset="utf-8">
<style>
  body { font-family: system-ui; background: #101a17; color: #e6f4ef; display: grid; place-items: center; min-height: 90vh; }
  .kartka { background: #17251f; padding: 26px; border-radius: 32px; width: 300px; text-align: center; border: 1px solid #2b4038; }
  .kolo { width: 84px; height: 84px; margin: 0 auto 14px; border-radius: 50%; background: linear-gradient(135deg, #54dbc2, #b4f46a); }
  h2 { margin: 0 0 6px; }
  p { margin: 0 0 16px; color: #9db5ab; }
  button { background: #54dbc2; color: #06231c; border: 0; padding: 12px 22px; border-radius: 999px; font-weight: 700; }
</style>

<div class="kartka">
  <div class="kolo"></div>
  <h2>Софія Кравець</h2>
  <p>Другий рік вчу Python і малюю піксель-арт.</p>
  <button id="knopka">Поставити зірочку</button>
</div>

<script>
  let ziri = 0;
  knopka.onclick = () => {
    ziri++;
    knopka.textContent = "Зірок: " + ziri;
  };
<\/script>
</html>`,
      },
      {
        name: "proj.htmlQuiz",
        code: `<!doctype html>
<html lang="uk">
<meta charset="utf-8">
<style>
  body { font-family: system-ui; background: #0f1512; color: #e8f3ee; padding: 28px; }
  . pytannya { background: #1a231e; border-radius: 24px; padding: 18px; margin-bottom: 14px; max-width: 460px; }
  button { margin: 4px 6px 0 0; padding: 9px 16px; border-radius: 999px; border: 1px solid #3a4a42; background: transparent; color: inherit; }
  .pravylno { background: #2f8b62; border-color: #54dbc2; }
  .pomylka { background: #5c2b2b; border-color: #ff9a94; }
  #rahunok { font-weight: 700; }
</style>

<h1>Міні-вікторина</h1>
<div id="rahunok">Правильних: 0</div>

<div class="pytannya">
  <p>Скільки буде 7 × 6?</p>
  <button data-ok="0">42</button>
  <button data-ok="1">36</button>
  <button data-ok="0">48</button>
</div>

<div class="pytannya">
  <p>Яка мова живе в браузері?</p>
  <button data-ok="0">Python</button>
  <button data-ok="1">JavaScript</button>
  <button data-ok="0">C++</button>
</div>

<script>
  let baly = 0;
  document.querySelectorAll("button").forEach(k => {
    k.onclick = () => {
      if (k.classList.contains("pravylno") || k.classList.contains("pomylka")) return;
      k.classList.add(k.dataset.ok === "1" ? "pravylno" : "pomylka");
      if (k.dataset.ok === "1") {
        baly++;
        rahunok.textContent = "Правильних: " + baly;
      }
    };
  });
<\/script>
</html>`,
      },
    ],
  },
  {
    id: "css", glyph: "{}", tone: "tertiary", monaco: "css", runner: "css", file: "styles.css",
    sample: `/* Твій CSS одразу застосовується до тестової картки праворуч. */
body { font-family: system-ui, sans-serif; padding: 24px; background: #fafafa; }

.card {
  max-width: 360px;
  padding: 18px 20px;
  border-radius: 28px;
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  color: white;
  box-shadow: 0 12px 30px rgba(35, 42, 91, .25);
}

.card:hover { transform: translateY(-6px) rotate(-1.5deg); transition: .3s cubic-bezier(.5,1.75,.75,1); }`,
    projects: [
      {
        name: "proj.cssNeon",
        code: `/* Неонова картка: світиться і підстрибує при наведенні. */
body { background: #0b0f14; padding: 40px; font-family: system-ui; }

.card {
  max-width: 340px;
  padding: 24px;
  border-radius: 30px;
  color: #eaf6ff;
  background: #101822;
  border: 2px solid #54dbc2;
  box-shadow: 0 0 0 rgba(84, 219, 194, 0);
  transition: box-shadow .35s ease, transform .35s cubic-bezier(.5, 1.75, .75, 1);
}

.card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 0 34px rgba(84, 219, 194, .55), inset 0 0 20px rgba(84, 219, 194, .18);
}

.card h2 { margin: 0 0 8px; letter-spacing: .5px; }
.card p { margin: 0; color: #8fa3b0; }`,
      },
      {
        name: "proj.cssLoader",
        code: `/* Анімований завантажувач із трьох кульок. */
body { background: #0d1310; display: grid; place-items: center; min-height: 80vh; margin: 0; }

.culky { display: flex; gap: 14px; }

.culky span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #54dbc2;
  animation: stribok 1s infinite ease-in-out;
}

.culky span:nth-child(2) { background: #f2748c; animation-delay: .15s; }
.culky span:nth-child(3) { background: #b4f46a; animation-delay: .3s; }

@keyframes stribok {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-22px) scale(1.15); }
}`,
      },
    ],
  },
  { id: "blocks", glyph: "▣", tone: "tertiary", monaco: "javascript", runner: "edit", file: "blocks.json", plan: "plan.blocks" },
  { id: "sql", glyph: "SQL", tone: "quaternary", monaco: "sql", runner: "edit", file: "query.sql", plan: "plan.sql" },
  {
    id: "cpp", glyph: "C+", tone: "secondary", monaco: "cpp", runner: "wandbox", file: "main.cpp",
    wb: { compiler: "gcc-13.2.0", label: "GCC 13.2" },
    sample: `// C++ компілює справжній GCC десь у хмарі. Потрібен інтернет.
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> kroky = {1, 1, 2, 3, 5, 8, 13};
    int suma = 0;

    for (int k : kroky) {
        suma += k;
    }

    cout << "кроки: ";
    for (int k : kroky) {
        cout << k << " ";
    }
    cout << endl;
    cout << "сума: " << suma << endl;

    return 0;
}`,
    projects: [
      {
        name: "proj.cppSum",
        stdin: "12 30",
        code: `// Програма читає числа з поля «Вхідні дані» зверху.
#include <iostream>
using namespace std;

int main() {
    int a = 0, b = 0;
    cin >> a >> b;

    cout << "сума: " << a + b << endl;
    cout << "добуток: " << a * b << endl;

    return 0;
}`,
      },
    ],
  },
  {
    id: "java", glyph: "J", tone: "primary", monaco: "java", runner: "wandbox", file: "Main.java",
    wb: { compiler: "openjdk-jdk-21+35", label: "OpenJDK 21" },
    sample: `// Java компілює OpenJDK 21 у хмарі. Клас називається Main і без слова public.
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

class Main {
    public static void main(String[] args) {
        // Щоб кирилиця не перетворилась на «???», виводимо у UTF-8.
        System.setOut(new PrintStream(new FileOutputStream(FileDescriptor.out), true, StandardCharsets.UTF_8));

        Map<String, Integer> baly = new TreeMap<>();
        baly.put("Оля", 12);
        baly.put("Макс", 9);
        baly.put("Соня", 11);

        int suma = 0;
        for (int v : baly.values()) {
            suma += v;
        }

        for (var para : baly.entrySet()) {
            System.out.println(para.getKey() + " -> " + para.getValue());
        }
        System.out.println("разом балів: " + suma);
    }
}`,
    projects: [
      {
        name: "proj.javaAvg",
        stdin: "12 9 11 10",
        code: `// Беремо всі числа з поля «Вхідні дані» й рахуємо середнє.
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

class Main {
    public static void main(String[] args) {
        System.setOut(new PrintStream(new FileOutputStream(FileDescriptor.out), true, StandardCharsets.UTF_8));

        Scanner skaner = new Scanner(System.in, StandardCharsets.UTF_8);
        int kilka = 0;
        int suma = 0;

        while (skaner.hasNextInt()) {
            suma += skaner.nextInt();
            kilka++;
        }

        if (kilka == 0) {
            System.out.println("Порожньо — впиши числа в поле «Вхідні дані».");
        } else {
            System.out.println("Чисел: " + kilka);
            System.out.println("Середнє: " + Math.round((double) suma / kilka * 10) / 10.0);
        }
    }
}`,
      },
    ],
  },
  {
    id: "rust", glyph: "rs", tone: "tertiary", monaco: "rust", runner: "wandbox", file: "main.rs",
    wb: { compiler: "rust-1.82.0", label: "rustc 1.82" },
    sample: `// Rust компілює справжній rustc у хмарі. Він суворий, але чесно пояснює чому.
use std::collections::HashMap;

fn main() {
    let slova = vec!["сонце", "дощ", "сонце", "хмара", "дощ", "сонце"];
    let mut kin: HashMap<&str, i32> = HashMap::new();

    for s in slova {
        let counter = kin.entry(s).or_insert(0);
        *counter += 1;
    }

    let mut lista: Vec<(&str, i32)> = kin.into_iter().collect();
    lista.sort_by(|a, b| a.0.cmp(b.0));

    for (nazva, kilka) in lista {
        println!("{} — {} шт.", nazva, kilka);
    }
}`,
    projects: [
      {
        name: "proj.rustCount",
        stdin: "мама мила раму милою водою",
        code: `// Рахуємо слова з поля «Вхідні дані».
use std::io::Read;

fn main() {
    let mut rid = String::new();
    std::io::stdin().read_to_string(&mut rid).unwrap();

    let slova: Vec<&str> = rid.split_whitespace().collect();
    println!("слів: {}", slova.len());

    for (nomer, slovo) in slova.iter().enumerate() {
        println!("{} — {} (довжина {})", nomer + 1, slovo, slovo.chars().count());
    }
}`,
      },
    ],
  },
  {
    id: "go", glyph: "go", tone: "secondary", monaco: "go", runner: "wandbox", file: "main.go",
    wb: { compiler: "go-1.23.2", label: "Go 1.23" },
    sample: `// Go компілює справжній Go у хмарі — швидко й без зайвих слів.
package main

import (
    "fmt"
    "sort"
)

func main() {
    ochky := []int{12, 9, 11, 7, 12}
    suma := 0

    for _, o := range ochky {
        suma += o
    }

    sort.Ints(ochky)
    fmt.Println("відсортовано:", ochky)
    fmt.Println("середнє:", float64(suma)/float64(len(ochky)))
}`,
    projects: [
      {
        name: "proj.goRev",
        stdin: "мама мила раму",
        code: `// Переворачуємо порядок слів із поля «Вхідні дані».
package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func main() {
    rid := ""
    skaner := bufio.NewScanner(os.Stdin)
    for skaner.Scan() {
        if rid != "" {
            rid += " "
        }
        rid += skaner.Text()
    }

    slova := strings.Fields(rid)
    for i, j := 0, len(slova)-1; i < j; i, j = i+1, j-1 {
        slova[i], slova[j] = slova[j], slova[i]
    }

    fmt.Println("навпаки:", strings.Join(slova, " "))
    fmt.Println("слів:", len(slova))
}`,
      },
    ],
  },
];

const CSS_DEMO_BODY = `
<div class="card">
  <h3>Заголовок картки</h3>
  <p>Абзац тексту, щоб було видно шрифт, відступи та колір.</p>
  <button>Кнопка</button>
</div>
<ul><li>Перший пункт</li><li>Другий пункт</li></ul>
<div class="culky"><span></span><span></span><span></span></div>`;

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
  window.onerror = (msg, src, line) => post("error", msg + " (рядок " + line + ")");
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

let monacoEditor = null;
let monacoReady = false;
let monacoFailed = false;
let activeLang = null;
let pyodide = null;
let watchdog = null;
let wbAbort = null;
let longWait = null;
let saveTimer = null;
let els = {};
let lessonContext = null;
let runOutput = [];
let wantCheck = false;

/* ---------- допоміжне ---------- */

const findLang = (id) => LANGS.find((l) => l.id === id);

const esc = (txt) =>
  String(txt).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function skeleton(lang) {
  return `// ${lang.glyph} — ${t("badge.soon")}\n`;
}

function codeKey() {
  return lessonContext
    ? STORE + ":task:" + lessonContext.lesson.id
    : STORE + ":code:" + activeLang.id;
}

function savedCode(lang) {
  const stored = localStorage.getItem(codeKey());
  if (stored !== null && !/^\/\/ \S+ — (?:незабаром|coming soon)\n$/.test(stored)) return stored;
  if (lessonContext) return lessonContext.lesson.starter;
  const legacy = localStorage.getItem("benchkit:1.0.0:code:" + lang.id);
  if (legacy !== null) return legacy;
  return lang.runner === "edit" ? skeleton(lang) : lang.sample;
}

function storeCode() {
  if (monacoEditor && activeLang) {
    localStorage.setItem(codeKey(), monacoEditor.getValue());
  }
}

function stdinValue() {
  return els.stdinInput && !els.stdinBox?.classList.contains("hidden") ? els.stdinInput.value : "";
}

function storeStdin() {
  if (els.stdinInput && activeLang) {
    localStorage.setItem(STORE + ":stdin:" + activeLang.id, els.stdinInput.value);
  }
}

function fillStdin(text) {
  if (!els.stdinInput) return;
  els.stdinInput.value = text || "";
  storeStdin();
}

function snack(text) {
  const box = document.getElementById("snack");
  box.textContent = text;
  box.classList.add("show");
  clearTimeout(snack.timer);
  snack.timer = setTimeout(() => box.classList.remove("show"), 2600);
}

function openDialog(title, bodyHtml) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = bodyHtml;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function setStatus(kind, text) {
  els.status.className = "status " + kind;
  els.status.textContent = text;
}

function print(text, kind) {
  const line = document.createElement("span");
  line.className = "line " + (kind || "log");
  line.textContent = text;
  els.console.appendChild(line);
  els.console.scrollTop = els.console.scrollHeight;
  if (!kind || kind === "log") runOutput.push(text);
}

function printDivider(label) {
  print("─".repeat(26) + " " + label, "divider");
}

function printBlock(text, kind) {
  String(text)
    .replace(/\n+$/, "")
    .split("\n")
    .forEach((line) => print(line, kind));
}

function printError(raw) {
  const text = String((raw && raw.message) || raw);
  print(lastErrorLine(text), "error");

  const info = explainError(text);
  if (info) {
    const box = document.createElement("div");
    box.className = "explain";

    const what = document.createElement("p");
    what.className = "explain-what";
    what.textContent = t("err.plain") + " " + info.what;
    box.appendChild(what);

    info.try.forEach((tip) => {
      const li = document.createElement("p");
      li.className = "explain-tip";
      li.textContent = "→ " + tip;
      box.appendChild(li);
    });

    els.console.appendChild(box);
    els.console.scrollTop = els.console.scrollHeight;
  }

  if (text.includes("\n") && text.trim() !== lastErrorLine(text).trim()) {
    const det = document.createElement("details");
    det.className = "trace";
    const sum = document.createElement("summary");
    sum.textContent = t("err.details");
    const pre = document.createElement("pre");
    pre.textContent = text;
    det.appendChild(sum);
    det.appendChild(pre);
    els.console.appendChild(det);
    els.console.scrollTop = els.console.scrollHeight;
  }
}

/* ---------- вивід: консоль чи перегляд ---------- */

function showConsole() {
  els.console.classList.remove("hidden");
  els.preview.classList.add("hidden");
  els.tabConsole.classList.add("active");
  els.tabPreview.classList.remove("active");
}

function showPreview() {
  els.console.classList.add("hidden");
  els.preview.classList.remove("hidden");
  els.tabPreview.classList.add("active");
  els.tabConsole.classList.remove("active");
}

/* ---------- запуск ---------- */

function setRunEnabled(on) {
  els.run.disabled = !on;
  els.runTop.disabled = !on;
  if (els.check) els.check.disabled = !on;
}

function canRun() {
  return !!monacoEditor && activeLang.runner !== "edit";
}

function endRun(seconds) {
  clearTimeout(watchdog);
  watchdog = null;
  if (seconds === null) {
    setStatus("bad", t("play.stopped"));
    printDivider(t("play.stopped"));
  } else if (typeof seconds === "number") {
    setStatus("ok", t("play.done"));
    printDivider(seconds.toFixed(3) + " c");
  }
  setRunEnabled(canRun());
  takeCheck();
}

function fail(err) {
  clearTimeout(watchdog);
  watchdog = null;
  setStatus("bad", t("play.error"));
  printError(err);
  printDivider(t("play.error"));
  setRunEnabled(canRun());
  takeCheck();
}

function takeCheck() {
  if (!wantCheck) return;
  wantCheck = false;
  verifyLesson();
}

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
    } else if (data.level === "error") {
      printError(data.text);
    } else {
      print(data.text, data.level);
    }
  };

  window.addEventListener("message", onMessage);
  watchdog = setTimeout(() => {
    window.removeEventListener("message", onMessage);
    frame.removeAttribute("srcdoc");
    endRun(null);
    print(t("play.loopStopped"), "error");
  }, RUN_TIMEOUT);

  frame.srcdoc = SANDBOX_DOC;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = src;
    tag.onload = resolve;
    tag.onerror = () => reject(new Error("CDN не відповідає — перевірте інтернет."));
    document.head.appendChild(tag);
  });
}

async function ensurePyodide() {
  if (pyodide) return pyodide;
  setStatus("busy", t("play.running"));
  print(t("play.loadingPython"), "sys");
  await loadScript(PYODIDE_CDN + "pyodide.js");
  pyodide = await loadPyodide({
    indexURL: PYODIDE_CDN,
    stdout: (line) => print(line, "log"),
    stderr: (line) => print(line, "error"),
  });
  const version = await pyodide.runPythonAsync("import sys; sys.version.split()[0]");
  print(t("play.pythonReady") + " " + version, "sys");
  return pyodide;
}

async function runPython(code) {
  const started = performance.now();
  const vm = await ensurePyodide();
  await vm.runPythonAsync(code);
  endRun((performance.now() - started) / 1000);
}

function runHtml(code) {
  els.preview.srcdoc = code;
  showPreview();
  print(t("play.previewOpened"), "sys");
  endRun();
  setStatus("ok", t("play.ready"));
}

function runCss(code) {
  els.preview.srcdoc = `<!doctype html><meta charset="utf-8"><style>` + code + `</style><body>` + CSS_DEMO_BODY + `</body>`;
  showPreview();
  print(t("play.cssApplied"), "sys");
  endRun();
  setStatus("ok", t("play.ready"));
}

function showCompileResult(data, seconds) {
  if (data.compiler_message) printBlock(data.compiler_message, "sys");
  if (data.compiler_error) printError(data.compiler_error);
  if (data.program_message) printBlock(data.program_message, "log");
  if (data.program_error) printError(data.program_error);

  const crashed = String(data.status) !== "0" || !!data.signal;
  if (!crashed) {
    endRun(seconds);
    return;
  }

  if (!data.compiler_error && !data.program_error) {
    const why = data.signal ? data.signal : "status " + data.status;
    print(t("play.crashed") + " (" + why + ")", "error");
  }
  setStatus("bad", t("play.error"));
  printDivider(t("play.error"));
  setRunEnabled(canRun());
  takeCheck();
}

function cancelWandbox(message) {
  if (!wbAbort) return;
  const controller = wbAbort;
  wbAbort = null;
  controller.abort();
  setStatus("bad", t("play.stopped"));
  printDivider(t("play.stopped"));
  print(message || t("play.cancelled"), "error");
  setRunEnabled(canRun());
  takeCheck();
}

async function runWandbox(code) {
  const started = performance.now();
  wbAbort = new AbortController();
  const ceiling = setTimeout(() => cancelWandbox(t("play.tooLong")), WANDBOX_WAIT);

  els.cancel.disabled = false;
  els.cancel.classList.remove("hidden");
  setStatus("busy", t("play.compiling"));
  print(t("play.compilingHint") + " — " + activeLang.wb.label, "sys");
  longWait = setTimeout(() => print(t("play.stillWaiting"), "sys"), 40000);


  try {
    const resp = await fetch(WANDBOX_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compiler: activeLang.wb.compiler, code, stdin: stdinValue() }),
      signal: wbAbort.signal,
    });
    if (!resp.ok) throw new Error(t("play.serverFailed") + " (" + resp.status + ")");
    const data = await resp.json();
    if (!wbAbort) return;
    showCompileResult(data, (performance.now() - started) / 1000);
  } catch (err) {
    if (err.name === "AbortError" || !wbAbort) return;
    fail(err);
  } finally {
    clearTimeout(ceiling);
    clearTimeout(longWait);
    longWait = null;
    wbAbort = null;
    els.cancel.classList.add("hidden");
  }
}

async function runCurrent() {
  if (!canRun() || wbAbort) {
    wantCheck = false;
    return;
  }
  const code = monacoEditor.getValue();
  storeCode();
  els.run.disabled = true;
  els.runTop.disabled = true;
  if (els.check) els.check.disabled = true;
  setStatus("busy", t("play.running"));

  if (activeLang.runner === "html") return runHtml(code);
  if (activeLang.runner === "css") return runCss(code);

  els.console.textContent = "";
  runOutput = [];
  showConsole();

  if (activeLang.runner === "js") {
    runJavaScript(code);
    return;
  }
  try {
    if (activeLang.runner === "wandbox") {
      await runWandbox(code);
      return;
    }
    await runPython(code);
  } catch (err) {
    fail(err);
  }
}

function downloadCurrent() {
  if (!monacoEditor) return;
  const url = URL.createObjectURL(new Blob([monacoEditor.getValue()], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = activeLang.file;
  a.click();
  URL.revokeObjectURL(url);
}

function fontSizeNow() {
  return Number(localStorage.getItem(STORE + ":fontSize")) || 14;
}

function changeFontSize(step) {
  const next = Math.min(22, Math.max(12, fontSizeNow() + step));
  if (next === fontSizeNow()) return;
  localStorage.setItem(STORE + ":fontSize", String(next));
  if (monacoEditor) monacoEditor.updateOptions({ fontSize: next, lineHeight: Math.round(next * 1.55) });
  snack(t(step > 0 ? "font.bigger" : "font.smaller") + ": " + next + "px");
}

function openProjects() {
  const list = activeLang.projects;
  if (!list || !monacoEditor) return;

  openDialog(t("projects.title"), `<p class="caption">${t("projects.hint")}</p><div class="proj-list"></div>`);
  const box = document.querySelector("#modalBody .proj-list");
  list.forEach((project) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn tonal";
    b.textContent = t(project.name);
    b.onclick = () => {
      closeModal();
      monacoEditor.setValue(project.code);
      storeCode();
      if (project.stdin !== undefined) {
        fillStdin(project.stdin);
        if (els.stdinBox) els.stdinBox.open = true;
      }
      snack(t("projects.loaded"));
      runCurrent();
    };
    box.appendChild(b);
  });
}

function resetCode() {
  if (!monacoEditor) return;
  localStorage.removeItem(codeKey());
  const fresh = lessonContext
    ? lessonContext.lesson.starter
    : activeLang.runner === "edit" ? skeleton(activeLang) : activeLang.sample;
  monacoEditor.setValue(fresh);
  snack(t("play.resetDone"));
}

/* ---------- головна ---------- */

function mountHome() {
  const view = document.getElementById("view");
  view.textContent = "";
  view.appendChild(document.getElementById("tpl-home").content.cloneNode(true));

  const tiles = document.getElementById("tiles");
  LANGS.forEach((lang, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile" + (lang.runner === "edit" ? " soon" : "");
    btn.dataset.tone = lang.tone;
    btn.style.animationDelay = Math.min(i * 45, 400) + "ms";

    const glyph = document.createElement("span");
    glyph.className = "tile-glyph";
    glyph.textContent = lang.glyph;

    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = t("lang." + lang.id);

    const desc = document.createElement("span");
    desc.className = "tile-desc";
    desc.textContent = t("lang." + lang.id + ".desc");

    const badge = document.createElement("span");
    badge.className = "badge" + (lang.runner === "edit" ? " soon" : "");
    badge.textContent = t(lang.runner === "edit" ? "badge.soon" : "badge.now");

    btn.append(glyph, name, desc, badge);
    btn.onclick = () => {
      if (lang.runner === "edit") {
        openDialog(t("lang." + lang.id), `<p>${t(lang.plan)}</p><p><a class="btn text" href="#/play/${lang.id}">${t("soon.openEditor")}</a></p>`);
      } else {
        location.hash = "#/play/" + lang.id;
      }
    };
    tiles.appendChild(btn);
  });

  document.getElementById("statLangs").textContent = LANGS.length;
  document.getElementById("statRun").textContent = LANGS.filter((l) => l.runner !== "edit").length;
}

/* ---------- пісочниця ---------- */

function mountPlay(langId) {
  const lang = findLang(langId) || LANGS[0];
  if (wbAbort) cancelWandbox(t("play.stopped"));
  activeLang = lang;

  const view = document.getElementById("view");
  view.textContent = "";
  view.appendChild(document.getElementById("tpl-play").content.cloneNode(true));

  els = {
    playTitle: document.getElementById("playTitle"),
    playChip: document.getElementById("playChip"),
    editor: document.getElementById("editor"),
    console: document.getElementById("console"),
    preview: document.getElementById("preview"),
    sandbox: document.getElementById("js-sandbox"),
    run: document.getElementById("runBtn"),
    runTop: document.getElementById("runBtnTop"),
    status: document.getElementById("status"),
    tabConsole: document.getElementById("tabConsole"),
    tabPreview: document.getElementById("tabPreview"),
    stdinBox: document.getElementById("stdinBox"),
    stdinInput: document.getElementById("stdinInput"),
    cancel: document.getElementById("cancelBtn"),
  };

  els.playTitle.textContent = t("lang." + lang.id);
  els.playChip.textContent = t(lang.runner === "edit" ? "badge.soon" : "badge.now");
  els.playChip.className = "chip" + (lang.runner === "edit" ? "" : " live");

  const cloud = lang.runner === "wandbox";
  els.stdinBox?.classList.toggle("hidden", !cloud);
  if (els.stdinInput) els.stdinInput.value = localStorage.getItem(STORE + ":stdin:" + lang.id) || "";
  els.cancel?.classList.add("hidden");

  document.getElementById("resetBtn").onclick = resetCode;
  document.getElementById("downloadBtn").onclick = downloadCurrent;
  const projectsBtn = document.getElementById("projectsBtn");
  projectsBtn.onclick = openProjects;
  projectsBtn.classList.toggle("hidden", !lang.projects);
  document.getElementById("fontDown").onclick = () => changeFontSize(-1);
  document.getElementById("fontUp").onclick = () => changeFontSize(1);
  els.run.onclick = runCurrent;
  els.runTop.onclick = runCurrent;
  els.cancel.onclick = () => cancelWandbox();
  els.stdinInput.oninput = storeStdin;
  els.tabConsole.onclick = showConsole;
  els.tabPreview.onclick = showPreview;

  if (lessonContext) mountTaskBanner();

  setStatus("idle", lang.runner === "edit" ? t("play.editorOnly") : t("play.ready"));
  setRunEnabled(lang.runner !== "edit" && !monacoFailed);

  if (monacoFailed) {
    els.editor.innerHTML = '<p style="padding:16px;color:var(--md-error)">' + t("play.editorFailed") + "</p>";
    return;
  }
  if (!monacoReady) {
    els.editor.innerHTML = '<p style="padding:16px;color:var(--md-on-surface-variant)">…</p>';
    whenMonacoReady(() => createEditor(lang));
    return;
  }
  createEditor(lang);
}

function createEditor(lang) {
  if (monacoEditor) {
    monacoEditor.dispose();
    monacoEditor = null;
  }
  els.editor.textContent = "";
  monacoEditor = monaco.editor.create(els.editor, {
    value: savedCode(lang),
    language: lang.monaco,
    theme: isDarkNow() ? "vs-dark" : "vs",
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: fontSizeNow(),
    lineHeight: Math.round(fontSizeNow() * 1.55),
    scrollBeyondLastLine: false,
    tabSize: 2,
    padding: { top: 12 },
    wordWrap: "on",
    autoIndent: "full",
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    matchBrackets: "always",
    bracketPairColorization: { enabled: true },
    renderLineHighlight: "all",
    fixedOverflowWidgets: true,
    scrollbar: { verticalScrollbarSize: 9, horizontalScrollbarSize: 9 },
  });

  monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCurrent);
  monacoEditor.onDidChangeModelContent(() => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(storeCode, 400);
  });

  if (lang.runner === "edit") {
    els.console.textContent = "";
    print(t(lang.plan), "sys");
  }
}

function whenMonacoReady(then) {
  if (whenMonacoReady.queue) {
    whenMonacoReady.queue.push(then);
    return;
  }
  whenMonacoReady.queue = [then];

  require.config({ paths: { vs: MONACO_CDN + "/vs" } });
  window.MonacoEnvironment = {
    getWorkerUrl() {
      const proxy = `self.MonacoEnvironment={baseUrl:"${MONACO_CDN}/"};importScripts("${MONACO_CDN}/vs/base/worker/workerMain.js");`;
      return URL.createObjectURL(new Blob([proxy], { type: "text/javascript" }));
    },
  };

  require(["vs/editor/editor.main"], () => {
    monacoReady = true;
    const waiting = whenMonacoReady.queue;
    whenMonacoReady.queue = null;
    waiting.forEach((fn) => fn());
  }, () => {
    monacoFailed = true;
    whenMonacoReady.queue = null;
    if (els.run) {
      els.editor.innerHTML = '<p style="padding:16px;color:var(--md-error)">' + t("play.editorFailed") + "</p>";
      setRunEnabled(false);
    }
  });
}

/* ---------- школа ---------- */

function firstOpenLesson(done) {
  for (const level of SCHOOL_LEVELS) {
    const found = level.lessons.find((lesson) => !done.includes(lesson.id));
    if (found) return found;
  }
  return null;
}

function lessonLabel(lesson, index) {
  const name = schoolText(lesson.title);
  return lesson.boss ? name : t("school.lessonWord") + " " + (index + 1) + " · " + name;
}

function lessonRow(lesson, index, solved) {
  const det = document.createElement("details");
  det.className = "lesson" + (lesson.boss ? " boss" : "") + (solved ? " solved" : "");
  det.innerHTML = `
    <summary>
      <span class="lesson-mark">${solved ? "✓" : lesson.boss ? "👑" : index + 1}</span>
      <span class="lesson-title">${esc(lessonLabel(lesson, index))}</span>
      <span class="lesson-pts">${lesson.points}</span>
      <span class="lesson-chev">›</span>
    </summary>
    <div class="lesson-body">
      <p class="lesson-rule">${esc(schoolText(lesson.rule))}</p>
      <p class="lesson-task">${esc(t("school.taskLabel"))}: ${esc(schoolText(lesson.task))}</p>
      <pre class="lesson-code">${esc(lesson.example)}</pre>
      <a class="btn ${solved ? "outlined" : ""} sm" href="#/task/${lesson.id}">${esc(t(solved ? "school.reopen" : "school.open"))}</a>
    </div>`;
  return det;
}

function mountSchool() {
  const view = document.getElementById("view");
  view.textContent = "";
  view.appendChild(document.getElementById("tpl-school").content.cloneNode(true));

  const host = view.querySelector(".school");
  const sum = schoolSummary();
  const done = sum.state.done;
  const pct = Math.round((sum.points / SCHOOL_MAX_POINTS) * 100);
  const nextUp = firstOpenLesson(done);

  host.innerHTML = `
    <div class="school-head">
      <div class="school-intro">
        <h1 class="headline">${esc(t("school.title"))}</h1>
        <p class="body">${esc(t("school.body"))}</p>
        <div class="school-cta">
          ${
            nextUp
              ? `<a class="btn big" href="#/task/${nextUp.id}">🎯 ${esc(t(done.length ? "school.continue" : "school.start"))}</a>`
              : `<span class="badge big-done">${esc(t("school.allDone"))}</span>`
          }
        </div>
      </div>
      <div class="score-card">
        <div class="score-rank"><span class="rank-emoji">${sum.rank.emoji}</span><b>${esc(schoolText(sum.rank))}</b></div>
        <div class="progress"><span style="width:${pct}%"></span></div>
        <div class="score-nums"><b>${sum.points}</b><small> / ${SCHOOL_MAX_POINTS} ${esc(t("school.pointsUnit"))}</small></div>
        <div class="score-sub">${esc(t("school.clearedLabel"))}: ${sum.cleared} / ${sum.total}</div>
      </div>
    </div>
    <div class="levels"></div>`;

  const levels = host.querySelector(".levels");
  SCHOOL_LEVELS.forEach((level, li) => {
    const cleared = level.lessons.filter((l) => done.includes(l.id)).length;
    const card = document.createElement("article");
    card.className = "level-card";
    card.style.animationDelay = Math.min(li * 70, 350) + "ms";
    card.innerHTML = `
      <header class="level-head">
        <span class="level-ico">${level.icon}</span>
        <div class="level-name">
          <h2 class="title">${esc(t("school.levelWord"))} ${li + 1} — ${esc(schoolText(level.title))}</h2>
          <p class="caption">${esc(schoolText(level.blurb))}</p>
        </div>
        <span class="chip">${esc(t("lang." + level.lang))} · ${cleared}/${level.lessons.length}</span>
      </header>
      <ol class="lessons"></ol>
      <p class="caption level-note">👑 ${esc(t("school.bossHint"))}</p>`;
    const list = card.querySelector(".lessons");
    level.lessons.forEach((lesson, i) => list.appendChild(lessonRow(lesson, i, done.includes(lesson.id))));
    levels.appendChild(card);
  });
}

function mountTaskBanner() {
  const ctx = lessonContext;
  const bar = document.querySelector("#view .play-bar");
  if (!bar) return;
  const solved = schoolState().done.includes(ctx.lesson.id);

  const box = document.createElement("div");
  const ordinal = ctx.level.lessons.indexOf(ctx.lesson) + 1;
  box.className = "task-bar" + (solved ? " solved" : "");
  box.innerHTML = `
    <div class="task-top">
      <span class="chip task-badge">${
        solved
          ? esc(t("school.solvedBadge"))
          : (ctx.lesson.boss ? "👑 " + esc(t("school.bossWord")) : "📘 " + esc(t("school.lessonWord")) + " " + ordinal) + " · +" + ctx.lesson.points
      }</span>
      <b class="task-title">${esc(schoolText(ctx.lesson.title))}</b>
      <span class="caption">${esc(t("school.levelWord"))} ${SCHOOL_LEVELS.indexOf(ctx.level) + 1} — ${esc(schoolText(ctx.level.title))}</span>
    </div>
    <p class="task-rule">💡 ${esc(schoolText(ctx.lesson.rule))}</p>
    <p class="task-what">${esc(t("school.taskLabel"))}: ${esc(schoolText(ctx.lesson.task))}</p>
    <div class="task-actions">
      <button class="btn" id="checkBtn" type="button">✅ ${esc(t("school.check"))}</button>
      <button class="btn outlined sm" id="exampleBtn" type="button" data-i18n-title="school.insertExample">💡 <span class="ex-label">${esc(t("school.insertExample"))}</span></button>
      <a class="btn text sm" href="#/school">‹ ${esc(t("school.back"))}</a>
      <span class="task-next" id="taskNext"></span>
    </div>
    <div class="task-state" id="taskState"></div>`;

  bar.after(box);

  els.check = box.querySelector("#checkBtn");
  els.check.onclick = checkLessonNow;
  box.querySelector("#exampleBtn").onclick = () => {
    if (!monacoEditor) return;
    monacoEditor.setValue(ctx.lesson.example);
    storeCode();
    runCurrent();
  };
  if (solved) markTaskNext(box);
}

function checkLessonNow() {
  if (!lessonContext || !monacoEditor || watchdog || wbAbort) return;
  wantCheck = true;
  runCurrent();
}

function taskState(kind, lines) {
  const box = document.getElementById("taskState");
  if (!box) return;
  box.className = "task-state show " + kind;
  box.textContent = "";
  lines.forEach((txt) => {
    const p = document.createElement("p");
    p.textContent = txt;
    box.appendChild(p);
  });
}

function markTaskNext(box) {
  const slot = box.querySelector("#taskNext");
  if (!slot || !lessonContext) return;
  const next = firstOpenLesson(schoolState().done);
  slot.textContent = "";
  if (!next) {
    slot.textContent = t("school.allDone");
    return;
  }
  const a = document.createElement("a");
  a.className = "btn tonal sm";
  a.href = "#/task/" + next.id;
  a.textContent = t("school.next") + " →";
  slot.appendChild(a);
}

function verifyLesson() {
  const ctx = lessonContext;
  if (!ctx || !monacoEditor) return;

  const result = checkLesson(ctx.lesson, monacoEditor.getValue(), runOutput.join("\n"));
  if (!result.ok) {
    taskState("bad", [t("school.notYet")].concat(result.missing));
    snack(t("school.almost"));
    return;
  }

  const before = schoolSummary().rank;
  const award = schoolComplete(ctx.lesson);
  refreshScore();

  const lines = [];
  if (award.already) lines.push(t("school.repeat"));
  else {
    lines.push(t("school.solved") + " +" + ctx.lesson.points + " " + t("school.pointsUnit"));
    if (award.rank !== before) {
      lines.push(t("school.rankUp") + " " + award.rank.emoji + " " + schoolText(award.rank));
    }
  }
  taskState("ok", lines);
  snack(t("school.solved") + " · " + award.points + " / " + SCHOOL_MAX_POINTS);

  const box = document.querySelector(".task-bar");
  if (box) {
    box.classList.add("solved");
    box.querySelector(".task-badge").textContent = t("school.solvedBadge");
    markTaskNext(box);
  }
}

function refreshScore() {
  const chip = document.getElementById("scoreChip");
  if (!chip) return;
  const sum = schoolSummary();
  chip.textContent = sum.rank.emoji + " " + sum.points;
  chip.title = t("school.pointsHint") + " — " + schoolText(sum.rank) + " · " + sum.points + "/" + SCHOOL_MAX_POINTS;
}

/* ---------- маршрутизація ---------- */

function markNav(name) {
  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === name);
  });
}

function route() {
  storeCode();
  closeModal();
  const raw = location.hash.replace(/^#/, "");

  // Якір всередині сторінки (#languages) — гортаємо, а не перебудовуємо вигляд.
  if (raw && !raw.startsWith("/")) {
    if (!document.getElementById("tiles")) {
      mountHome();
      markNav("home");
      applyI18n();
    }
    const target = document.getElementById(raw);
    if (target) {
      document.body.classList.remove("fit");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      return;
    }
  }

  const parts = raw.split("/").filter(Boolean);
  document.body.classList.toggle("fit", parts[0] === "play");

  if (parts[0] === "play") {
    lessonContext = null;
    mountPlay(parts[1]);
    markNav("play");
  } else if (parts[0] === "school") {
    lessonContext = null;
    mountSchool();
    markNav("school");
  } else if (parts[0] === "task") {
    const found = findLesson(decodeURIComponent(parts[1] || ""));
    lessonContext = found;
    if (found) mountPlay(found.level.lang);
    else mountSchool();
    markNav("school");
  } else {
    mountHome();
    markNav("home");
  }

  applyI18n();
  refreshScore();
  document.getElementById("view").scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ---------- панель зверху ---------- */

function refreshThemeButton() {
  const info = nextThemeLabel();
  const btn = document.getElementById("themeBtn");
  btn.textContent = info.icon;
  btn.title = info.label;
  btn.dataset.next = info.next;
}

function initChrome() {
  applyTheme();
  refreshThemeButton();

  document.getElementById("themeBtn").onclick = () => {
    themeMode = document.getElementById("themeBtn").dataset.next;
    localStorage.setItem(STORE + ":theme", themeMode);
    applyTheme();
    refreshThemeButton();
    if (monacoEditor) {
      monaco.editor.setTheme(isDarkNow() ? "vs-dark" : "vs");
    }
  };

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (themeMode !== "auto" || !monacoEditor) return;
    monaco.editor.setTheme(isDarkNow() ? "vs-dark" : "vs");
  });

  document.getElementById("langBtn").onclick = () => {
    storeCode();
    locale = locale === "uk" ? "en" : "uk";
    localStorage.setItem(STORE + ":locale", locale);
    document.title = "Benchkit — " + t("app.tagline");
    refreshThemeButton();
    route();
  };

  document.getElementById("signinBtn").onclick = () => {
    openDialog(t("soon.title"), `<p>${t("soon.body")}</p><p class="caption">GitHub · ${t("action.signin")}</p>`);
  };

  document.getElementById("modalOk").onclick = closeModal;
  document.getElementById("modal").onclick = (e) => {
    if (e.target.id === "modal") closeModal();
  };
}

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (activeLang && monacoEditor) downloadCurrent();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    runCurrent();
  }
  if (e.key === "Escape") closeModal();
});

window.addEventListener("hashchange", route);

initChrome();
route();
