/* Benchkit — школа: рівні, уроки, задачі-боси, бали. Дані й перевірка офлайн. */

const SCHOOL_LEVELS = [
  {
    id: "l1",
    lang: "python",
    icon: "🌱",
    title: { uk: "Перші кроки", en: "First steps" },
    blurb: { uk: "Надруковувати текст, зберігати числа, питати «а якщо?».", en: "Print text, keep numbers, ask “but what if?”." },
    lessons: [
      {
        id: "l1-1",
        title: { uk: "Перше слово", en: "First word" },
        rule: {
          uk: "print() показує щось у консолі. Текст завжди в лапках.",
          en: "print() shows something in the console. Text always sits inside quotes.",
        },
        example: 'print("Привіт")\nprint("Benchkit")',
        task: { uk: "Надрукуй один рядок: Привіт, Benchkit", en: "Print one line: Привіт, Benchkit" },
        starter: "# Напиши одне print(...)\n",
        check: { prints: ["Привіт, Benchkit"] },
        points: 10,
      },
      {
        id: "l1-2",
        title: { uk: "Змінна — це коробочка", en: "A variable is a box" },
        rule: {
          uk: "rik = 5 кладе число 5 у коробочку з імʼям rik. Далі коробочку можна використовувати замість числа.",
          en: "rik = 5 puts the number 5 into a box named rik. Later you can use the box instead of the number.",
        },
        example: "rik = 5\nprint(rik)\nprint(rik * 2)",
        task: { uk: "Зроби змінну rik = 7 і надрукуй її квадрат (49).", en: "Make a variable rik = 7 and print its square (49)." },
        starter: "rik = \nprint()",
        check: { prints: ["49"], use: ["rik\\s*=\\s*7"] },
        points: 10,
      },
      {
        id: "l1-3",
        title: { uk: "А якщо?", en: "What if?" },
        rule: {
          uk: "if перевіряє умову, else — що робити інакше. Після if і else рядки всередині відступаються на 4 пробіли.",
          en: "if checks a condition, else is what to do otherwise. Lines inside if and else are indented by 4 spaces.",
        },
        example: "y = 17\nif y > 10:\n    print('багато')\nelse:\n    print('мало')",
        task: { uk: "Візьми число 17. Якщо воно більше за 10 — надрукуй багато, інакше мало.", en: "Take the number 17. If it is bigger than 10 print багато, otherwise мало." },
        starter: "y = 17\nif y > 10:\n    # що друкувати тут?\nelse:\n    # а тут?",
        check: { prints: ["багато"], use: ["if", "else"] },
        points: 10,
      },
      {
        id: "l1-boss",
        boss: true,
        title: { uk: "Бос: середня оцінка", en: "Boss: average grade" },
        rule: {
          uk: "Сума ділена на кількість дає середнє. sum(список) і len(список) рахують це за тебе.",
          en: "A sum divided by a count gives an average. sum(list) and len(list) do the counting for you.",
        },
        example: "otsinky = [5, 4, 3]\nprint(sum(otsinky) / len(otsinky))",
        task: {
          uk: "Оцінки 4, 5, 5. Надрукуй рядок: Середнє: 4.67 (округли до 2 цифр).",
          en: "Grades 4, 5, 5. Print the line: Середнє: 4.67 (rounded to 2 digits).",
        },
        starter: "otsinky = [4, 5, 5]\nserednye = round(sum(otsinky) / len(otsinky), 2)\nprint()",
        check: { prints: ["Середнє: 4.67"], use: ["sum", "len"] },
        points: 25,
      },
    ],
  },
  {
    id: "l2",
    lang: "python",
    icon: "🔁",
    title: { uk: "Цикли", en: "Loops" },
    blurb: { uk: "Роби однакові речі багато разів, не переписуючи код.", en: "Do the same thing many times without rewriting the code." },
    lessons: [
      {
        id: "l2-1",
        title: { uk: "Рахуємо по порядку", en: "Counting along" },
        rule: {
          uk: "for i in range(5) дає i = 0, 1, 2, 3, 4. Зверни увагу: з нуля, і останнього числа (5) немає.",
          en: "for i in range(5) gives i = 0, 1, 2, 3, 4. Note: it starts at zero and never reaches 5.",
        },
        example: "for i in range(5):\n    print(i)",
        task: { uk: "Надрукуй числа від 0 до 4 по одному в рядку.", en: "Print the numbers 0 to 4, one per line." },
        starter: "for i in range():\n    print(i)",
        check: { prints: ["0", "1", "2", "3", "4"], use: ["for", "range"] },
        points: 10,
      },
      {
        id: "l2-2",
        title: { uk: "Складаємо суму", en: "Running total" },
        rule: {
          uk: "Спочатку sp = 0, потім у циклі sp = sp + i. Коробочка оновлюється кожен раз.",
          en: "Start with sp = 0, then in the loop sp = sp + i. The box updates every round.",
        },
        example: "sp = 0\nfor i in range(1, 6):\n    sp = sp + i\nprint(sp)",
        task: { uk: "Порахуй суму чисел від 1 до 10 і надрукуй 55.", en: "Add up the numbers 1 to 10 and print 55." },
        starter: "sp = 0\nfor i in range(1, 11):\n    sp = sp + i\nprint()",
        check: { prints: ["55"], use: ["for", "range"] },
        points: 10,
      },
      {
        id: "l2-3",
        title: { uk: "Таблиця множення", en: "Multiplication table" },
        rule: {
          uk: "У циклі можна друкувати щось складніше: print(i, '× 3 =', i * 3).",
          en: "Inside a loop you can print something richer: print(i, '× 3 =', i * 3).",
        },
        example: "for i in range(1, 4):\n    print(i, '× 3 =', i * 3)",
        task: { uk: "Надрукуй таблицю множення на 7 для 1, 2, 3 — числа 7, 14, 21 мають зʼявитись.", en: "Print the 7 times table for 1, 2, 3 — the numbers 7, 14, 21 must appear." },
        starter: "for i in range(1, 4):\n    print()",
        check: { prints: ["7", "14", "21"], use: ["for"] },
        points: 10,
      },
      {
        id: "l2-boss",
        boss: true,
        title: { uk: "Бос: піраміда", en: "Boss: pyramid" },
        rule: {
          uk: "Текст можна множити: '*' * 3 дає ***. Тому рядок n — це n зірочок.",
          en: "Text can be multiplied: '*' * 3 gives ***. So row n is n stars.",
        },
        example: "for n in range(1, 4):\n    print('*' * n)",
        task: { uk: "Надрукуй піраміду з 4 рядків: *, **, ***, ****", en: "Print a pyramid of 4 rows: *, **, ***, ****" },
        starter: "for n in range(1, 5):\n    print('*' * )",
        check: { prints: ["*", "**", "***", "****"], use: ["for", "\\*"] },
        points: 25,
      },
    ],
  },
  {
    id: "l3",
    lang: "python",
    icon: "📚",
    title: { uk: "Списки й словники", en: "Lists and dictionaries" },
    blurb: { uk: "Тут зберігаються цілі копилки даних.", en: "This is where whole jars of data live." },
    lessons: [
      {
        id: "l3-1",
        title: { uk: "Список і його розмір", en: "A list and its size" },
        rule: {
          uk: "spysok = [12, 7, 30]. len(spysok) — скільки елементів, max(spysok) — найбільший.",
          en: "spysok = [12, 7, 30]. len(spysok) is how many items, max(spysok) is the biggest.",
        },
        example: "spysok = [12, 7, 30]\nprint(len(spysok))\nprint(max(spysok))",
        task: { uk: "Для [12, 7, 30, 4] надрукуй кількість (4) і найбільше (30).", en: "For [12, 7, 30, 4] print the count (4) and the biggest (30)." },
        starter: "spysok = [12, 7, 30, 4]\nprint(len(spysok))\nprint()",
        check: { prints: ["4", "30"], use: ["len", "max"] },
        points: 10,
      },
      {
        id: "l3-2",
        title: { uk: "Фільтр", en: "Filter" },
        rule: {
          uk: "Цикл + if = вибираємо лише те, що підходить.",
          en: "A loop + if = pick only what fits.",
        },
        example: "dzv = [3, 11, 8, 20]\nfor k in dzv:\n    if k > 10:\n        print(k)",
        task: { uk: "З [3, 11, 8, 20] надрукуй лише числа більші за 10: 11 і 20.", en: "From [3, 11, 8, 20] print only numbers above 10: 11 and 20." },
        starter: "dzv = [3, 11, 8, 20]\nfor k in dzv:\n    if k > 10:\n        print()",
        check: { prints: ["11", "20"], use: ["for", "if"] },
        points: 10,
      },
      {
        id: "l3-3",
        title: { uk: "Словник", en: "Dictionary" },
        rule: {
          uk: "Словник зберігає пари «ключ → значення»: bal = {'Оля': 12}. bal['Оля'] дістає 12.",
          en: "A dictionary keeps pairs 'key → value': bal = {'Olya': 12}. bal['Olya'] gives 12.",
        },
        example: "bal = {'Оля': 12, 'Макс': 9}\nprint(bal['Оля'])",
        task: { uk: "У словнику {'Оля': 12, 'Макс': 9} надрукуй оцінку Макса (9).", en: "In {'Оля': 12, 'Макс': 9} print Max's grade (9)." },
        starter: "bal = {'Оля': 12, 'Макс': 9}\nprint()",
        check: { prints: ["9"], use: ["\\["] },
        points: 10,
      },
      {
        id: "l3-boss",
        boss: true,
        title: { uk: "Бос: класний журнал", en: "Boss: class register" },
        rule: {
          uk: "for imia, ots in bal.items() перебирає весь словник одразу парами.",
          en: "for imia, ots in bal.items() walks the whole dictionary in pairs.",
        },
        example: "bal = {'Оля': [10, 12], 'Макс': [7, 9]}\nfor imia, ots in bal.items():\n    print(imia, sum(ots) / len(ots))",
        task: {
          uk: "Для {'Оля': [10, 12], 'Макс': [7, 9]} надрукуй Оля з середнім 11.0 і Макс з середнім 8.0.",
          en: "For {'Оля': [10, 12], 'Макс': [7, 9]} print Оля with average 11.0 and Макс with average 8.0.",
        },
        starter: "bal = {'Оля': [10, 12], 'Макс': [7, 9]}\nfor imia, ots in bal.items():\n    print(imia, )",
        check: { prints: ["Оля 11.0", "Макс 8.0"], use: ["items"] },
        points: 25,
      },
    ],
  },
  {
    id: "l4",
    lang: "javascript",
    icon: "⚡",
    title: { uk: "JavaScript: рух", en: "JavaScript: it moves" },
    blurb: { uk: "Те саме, але в мові інтернету. console.log замість print.", en: "Same ideas, but in the language of the web. console.log instead of print." },
    lessons: [
      {
        id: "l4-1",
        title: { uk: "let і console.log", en: "let and console.log" },
        rule: {
          uk: "let a = 3 створює змінну, console.log(a) показує її. Крапка з комою в кінці — як крапка в реченні.",
          en: "let a = 3 makes a variable, console.log(a) shows it. The semicolon at the end is like a full stop.",
        },
        example: 'let a = 3;\nconsole.log("a =", a);',
        task: { uk: "Зроби let hvylyn = 12 і надрукуй її подвоєну (24).", en: "Make let hvylyn = 12 and print it doubled (24)." },
        starter: "let hvylyn = 12;\nconsole.log();",
        check: { prints: ["24"], use: ["let\\s+hvylyn\\s*=\\s*12"] },
        points: 10,
      },
      {
        id: "l4-2",
        title: { uk: "Масив по краплинах", en: "Array one by one" },
        rule: {
          uk: "for (let k of spysok) перебирає масив. Довжину каже spysok.length.",
          en: "for (let k of list) walks an array. list.length says how long it is.",
        },
        example: "const dzv = [4, 9, 2];\nfor (const k of dzv) console.log(k);\nconsole.log(dzv.length);",
        task: { uk: "Для [4, 9, 2] надрукуй кожне число і наприкінці кількість (3).", en: "For [4, 9, 2] print each number and at the end the count (3)." },
        starter: "const dzv = [4, 9, 2];\nfor (const k of dzv) console.log(k);\nconsole.log();",
        check: { prints: ["4", "9", "2", "3"], use: ["for", "length"] },
        points: 10,
      },
      {
        id: "l4-3",
        title: { uk: "Функція", en: "Function" },
        rule: {
          uk: "Функція — це названа машина: отримує вхід, видає результат через return.",
          en: "A function is a named machine: it takes input and hands back a result with return.",
        },
        example: "function plius(a, b) {\n  return a + b;\n}\nconsole.log(plius(2, 3));",
        task: { uk: "Напиши function kvadrat(n), що повертає n * n, і надрукуй kvadrat(6) — вийде 36.", en: "Write function kvadrat(n) returning n * n and print kvadrat(6) — it gives 36." },
        starter: "function kvadrat(n) {\n  return ;\n}\nconsole.log(kvadrat(6));",
        check: { prints: ["36"], use: ["function\\s+kvadrat", "return"] },
        points: 10,
      },
      {
        id: "l4-boss",
        boss: true,
        title: { uk: "Бос: найдовше слово", en: "Boss: longest word" },
        rule: {
          uk: "Можна перебирати й запамʼятовувати чемпіона: як знайшов більше — переписуй.",
          en: "Walk the list and keep a champion: when you find a longer one, replace it.",
        },
        example: "let chempion = \"\";\nfor (const slovo of [\"кіт\", \"слон\", \"миша\"]) {\n  if (slovo.length > chempion.length) chempion = slovo;\n}\nconsole.log(chempion);",
        task: { uk: "Із [\"кіт\", \"слон\", \"миша\"] надрукуй найдовше слово: слон.", en: "From [\"кіт\", \"слон\", \"миша\"] print the longest word: слон." },
        starter: "const slova = [\"кіт\", \"слон\", \"миша\"];\nlet chempion = \"\";\nfor (const s of slova) {\n  if (s.length > chempion.length) chempion = s;\n}\nconsole.log();",
        check: { prints: ["слон"], use: ["for", "length"] },
        points: 25,
      },
    ],
  },
];

const SCHOOL_MAX_POINTS = SCHOOL_LEVELS.reduce(
  (total, level) => total + level.lessons.reduce((sum, l) => sum + l.points, 0),
  0,
);

const SCHOOL_RANKS = [
  { at: 0, uk: "Новачок", en: "Rookie", emoji: "🐣" },
  { at: 0.25, uk: "Учень", en: "Learner", emoji: "📗" },
  { at: 0.5, uk: "Практик", en: "Practicer", emoji: "🛠️" },
  { at: 0.75, uk: "Майстер", en: "Master", emoji: "🥋" },
  { at: 1, uk: "Гуру", en: "Guru", emoji: "🧠" },
];

function schoolState() {
  let raw = null;
  try {
    raw = JSON.parse(localStorage.getItem(STORE + ":school"));
  } catch (e) {
    raw = null;
  }
  const state = raw && typeof raw === "object" ? raw : {};
  if (!Array.isArray(state.done)) state.done = [];
  return state;
}

function schoolPoints(state) {
  let sum = 0;
  SCHOOL_LEVELS.forEach((level) => {
    level.lessons.forEach((lesson) => {
      if (state.done.includes(lesson.id)) sum += lesson.points;
    });
  });
  return sum;
}

function schoolRank(points) {
  let best = SCHOOL_RANKS[0];
  SCHOOL_RANKS.forEach((rank) => {
    if (points >= Math.round(rank.at * SCHOOL_MAX_POINTS)) best = rank;
  });
  return best;
}

function schoolSummary() {
  const state = schoolState();
  const points = schoolPoints(state);
  const total = SCHOOL_LEVELS.reduce((n, level) => n + level.lessons.length, 0);
  return { state, points, total, cleared: state.done.length, rank: schoolRank(points) };
}

function schoolComplete(lesson) {
  const state = schoolState();
  const already = state.done.includes(lesson.id);
  if (!already) state.done.push(lesson.id);
  localStorage.setItem(STORE + ":school", JSON.stringify(state));
  return { already, points: schoolPoints(state), rank: schoolRank(schoolPoints(state)) };
}

function findLesson(id) {
  for (const level of SCHOOL_LEVELS) {
    for (const lesson of level.lessons) {
      if (lesson.id === id) return { level, lesson };
    }
  }
  return null;
}

function schoolText(pair) {
  if (!pair) return "";
  return locale === "en" ? pair.en || pair.uk : pair.uk || pair.en;
}

function humanizeSource(source) {
  return source.replace(/\\s[+*]/g, " ").replace(/\\/g, "");
}

function checkLesson(lesson, code, output) {
  const missing = [];
  (lesson.check.prints || []).forEach((needle) => {
    if (!output.includes(needle)) missing.push(t("school.wantPrint") + " «" + needle + "»");
  });
  (lesson.check.use || []).forEach((source) => {
    if (!new RegExp(source).test(code)) missing.push(t("school.wantCode") + " «" + humanizeSource(source) + "»");
  });
  return { ok: missing.length === 0, missing };
}
