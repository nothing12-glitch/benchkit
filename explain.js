/* Benchkit — перекладач помилок на просту мову. Працює офлайн, без ШІ. */
/* Формат правила: один регулярний вираз → що сталося + 1-2 поради. */

const ERROR_RULES = [
  {
    re: /SyntaxError: unexpected EOF while parsing|SyntaxError: '(' was never closed|SyntaxError: unterminated string|unexpected EOF while parsing|missing ) after argument list|Unexpected end of (input|expression|JSON input)/i,
    uk: {
      what: "Десь не закруж дужку, лапку або дужку-дужку. Python дійшов до кінця файла й здивувався.",
      try: [
        "Полічи відкриту й закриту дужку в кожному рядку — зазвичай губиться остання.",
        "Якщо це лапка: текст має починатись і закінчуватись однаковою лапкою.",
      ],
    },
    en: {
      what: "A bracket or a quote is not closed. The code runs to the end and is still waiting.",
      try: [
        "Count the open and close brackets on each line — usually the last one is missing.",
        "If it is a quote: text must start and end with the same kind of quote.",
      ],
    },
  },
  {
    re: /IndentationError: expected an indented block|IndentationError: unexpected indent|IndentationError: expected an indented block after/i,
    uk: {
      what: "Python читає відступи. Після if, for, while або def наступний рядок має бути зсунутий вправо.",
      try: ["Постав 4 пробіли на початку рядка всередині if / for.", "Не мішай табуляцію та пробіли — обери пробіли."],
    },
    en: {
      what: "Python reads the spaces at the start of a line. After if, for, while or def the next line must be indented.",
      try: ["Put 4 spaces at the start of the line inside if / for.", "Do not mix tabs and spaces — pick spaces."],
    },
  },
  {
    re: /TabError|SyntaxError: invalid syntax.*tab/i,
    uk: { what: "У коді змішались табуляція і пробіли — Python не розуміє, який з них відступ.", try: ["Заміни всі таби на 4 пробіли."] },
    en: { what: "Tabs and spaces are mixed, so Python cannot tell the indent.", try: ["Replace all tabs with 4 spaces."] },
  },
  {
    re: /SyntaxError: expected ':'|SyntaxError: expected ';'|expected an indented block after/i,
    uk: {
      what: "Після if, for, while, def, class рядок має закінчуватись двокрапкою «:».",
      try: ["Написав if x > 5 — а треба if x > 5:", "Двокрапка каже Python: «ось далі йде те, що всередині»."],
    },
    en: {
      what: "After if, for, while, def, class the line must end with a colon.",
      try: ["You wrote if x > 5 — it should be if x > 5:", "The colon tells Python: what comes next belongs inside."],
    },
  },
  {
    re: /SyntaxError: invalid syntax|SyntaxError: expected expression|Unexpected token|SyntaxError: Unexpected identifier|Invalid or unexpected token|missing ; after|Unexpected number|Unexpected string/i,
    uk: {
      what: "Python не впізнає цей запис. Найчастіше забуто двокрапку або написано «=» замість «==».",
      try: ["Після if, for, while, def, class обов'язково двокрапка в кінці рядка.", "Одне «=» — це «покласти», два «==» — це «чи однаково?»."],
    },
    en: {
      what: "This line is not valid code. Usually a colon is missing, or «=» was written instead of «==».",
      try: ["After if, for, while, def, class the line must end with a colon.", "One «=» means put a value in, two «==» means ask if they are equal."],
    },
  },
  {
    re: /NameError: name '([^']+)' is not defined|ReferenceError: ([^ ]+) is not defined/i,
    uk: {
      what: "Такого імені не існує. Можливо, змінну ще не створено, або вкрай помилка в написанні.",
      try: ["Перевір великі й малі літери: total і Total — це різні речі.", "Спершу створи змінну (total = 0), і тільки потім її використовуй."],
    },
    en: {
      what: "That name does not exist. Either the variable was never created, or it is spelled differently.",
      try: ["Check capital letters: total and Total are two different things.", "Create the variable first (total = 0), then use it."],
    },
  },
  {
    re: /TypeError: unsupported operand type\(s\) for \+.*'int'.*'str'|can only concatenate str|not supported between instances/i,
    uk: {
      what: "Ти намагаєшся сложити число і текст. Python не вгадує, що ти мав на увазі.",
      try: ["Число в текст: str(5) дає \"5\".", "Текст у число: int(\"5\") дає 5."],
    },
    en: {
      what: "You are trying to add a number and a piece of text together.",
      try: ["Number into text: str(5) gives \"5\".", "Text into number: int(\"5\") gives 5."],
    },
  },
  {
    re: /TypeError: (int|float|bool|NoneType) object is not subscriptable|Cannot read properties of (undefined|null|number) \(reading|is not a function|not iterable/i,
    uk: {
      what: "Щось використовується не як те, чим воно є: квадратні дужки чи виклик функції там, де їх бути не може.",
      try: ["Дужки () — це «виклич функцію». Якщо це звичайне число, приберь ()", "Подивись, що насправді повертає попередній рядок."],
    },
    en: {
      what: "Something is used as if it were another thing: brackets or a function call where they cannot work.",
      try: ["Brackets () mean call a function. A plain number cannot be called.", "Look at what the previous line really gives back."],
    },
  },
  {
    re: /IndexError: list index out of range|Index out of bounds/i,
    uk: {
      what: "Рахунок у списку починається з нуля, тому останній елемент — це не len(список), а len(список) - 1.",
      try: ["Список із 3 речей має індекси 0, 1, 2.", "Перед виведенням перевір: if i < len(items):"]
    },
    en: {
      what: "Counting in a list starts at zero, so the last item is len(list) - 1, not len(list).",
      try: ["A list of 3 things has indexes 0, 1, 2.", "Check first: if i < len(items):"]
    },
  },
  {
    re: /KeyError|is not in the dictionary|no such key/i,
    uk: { what: "У словнику немає такого ключа. Ключі чутливі до регістру та до зайвого пробіла.", try: ["Перевір: if \"name\" in data:", "Друкуй сам словник — побачиш, які ключі справді є."] },
    en: { what: "That key is not in the dictionary. Keys care about capital letters and stray spaces.", try: ["Check it: if \"name\" in data:", "Print the dictionary to see which keys are really there."] },
  },
  {
    re: /ZeroDivisionError|division by zero|Divide by zero/i,
    uk: { what: "Ділення на нуль — так не можна. Значить якийсь знаменник виявився порожнім або нульовим.", try: ["Перевір перед діленням: if b != 0:", "Подивись, де знаменник отримує 0 (можливо, сума пустого списку)."] },
    en: { what: "Division by zero. Some bottom number turned out to be 0.", try: ["Check before dividing: if b != 0:", "Find where that number becomes 0 — often an empty sum."] },
  },
  {
    re: /ModuleNotFoundError: No module named '([^']+)'/i,
    uk: { what: "Такої бібліотеки тут немає. У браузерному Python доступні лише стандартні модулі.", try: ["Спробуй без неї: часто те ж саме робиться звичайним списком і циклом.", "Якщо дуже треба — напиши мені, і я підключу цей пакет."] },
    en: { what: "That library is not here. Browser Python only has the standard modules.", try: ["Try without it — a list and a loop often do the same job.", "If you really need it, tell me and I will add that package."] },
  },
  {
    re: /ValueError: invalid literal for int\(\) with base 10|NaN|is not a number/i,
    uk: { what: "int() перетворює лише чисті числа в тексті. Пробіл, крапка з комою чи літера ламають його.", try: ["Прибери зайве: int(\"42\") працює, int(\"42 роки\") — ні.", "Спершу перевір: if text.isdigit():"] },
    en: { what: "int() only turns a clean number-word into a number. A letter or a sign breaks it.", try: ["int(\"42\") works, int(\"42 years\") does not.", "Check first: if text.isdigit():"] },
  },
  {
    re: /AttributeError: '([^']+)' object has no attribute '([^']+)'/i,
    uk: { what: "У такого значення немає такої команди. Наприклад, у тексту немає append — він є лише в списках.", try: ["Подивись, який тип у змінної: print(type(x)).", "str — текст, list — список, int — ціле число, dict — словник."] },
    en: { what: "That kind of value has no such command. Text has no append, only lists do.", try: ["Look at the type: print(type(x)).", "str is text, list is a list, int is a whole number, dict is a dictionary."] },
  },
  {
    re: /RecursionError|Maximum call stack size exceeded|RangeError: Invalid call stack/i,
    uk: { what: "Функція викликає сама себе й не зупиняється. Має бути умова, яка повертає результат без нового виклику.", try: ["Додай «вихід» на початку: if n <= 1: return 1", "Перевір, що умова виходу взагалі стає правдивою."] },
    en: { what: "A function calls itself and never stops. It needs a way out.", try: ["Add the exit first: if n <= 1: return 1", "Make sure that exit can actually become true."] },
  },
  {
    re: /TypeError: '([^']+)' object is not callable/i,
    uk: { what: "Ти викликаєш щось, що не є функцією — можливо, назвав змінну так само, як функцію.", try: ["Якщо написав print = 5, то print() вже не працює. Перейменуй змінну."] },
    en: { what: "You are calling something that is not a function — maybe a variable has the same name as the function.", try: ["If you wrote print = 5, then print() no longer works. Rename the variable."] },
  },
  {
    re: /SyntaxError: cannot assign to literal|TypeError: Assignment to constant variable|invalid assignment left-hand side/i,
    uk: { what: "Спроба покласти значення туди, де його покласти не можна (число, текст або const).", try: ["const і let: const уже не змінити. Потрібне let.", "Ліворуч від = має бути ім'я змінної."] },
    en: { what: "Trying to put a value somewhere that cannot hold it (a number, a text or a const).", try: ["const cannot be changed later — use let.", "The left side of = must be a variable name."] },
  },
  {
    re: /Ecmascript|await is only valid as well|SyntaxError: await is only valid/i,
    uk: { what: "await можна писати лише всередині async функції.", try: ["Обгорни код у: async function головна() { ... }"] },
    en: { what: "await only works inside an async function.", try: ["Wrap the code in: async function main() { ... }"] },
  },
  {
    re: /expected.{0,14};.{0,12}before|expected\s+["'“‘];|';' expected/i,
    uk: {
      what: "Компілятор дійшов до кінця рядка й здивувався: там має бути крапка з комої «;».",
      try: [
        "У C++ і Java кожна команда закінчується крапкою з комої: int a = 5;",
        "Подивись на рядок перед тим, на який вказує помилка — губиться саме там.",
      ],
    },
    en: {
      what: "The compiler reached the end of the line and was surprised: a semicolon belongs there.",
      try: ["In C++ and Java every command ends with a semicolon: int a = 5;", "Look at the line before the one the error points to — that is where it is missing."],
    },
  },
  {
    re: /is not declared in this scope|is not a member of|use of undeclared identifier|was not declared in this scope/i,
    uk: {
      what: "C++ не знайомий з такою назвою. Найчастіше забуто підключити бібліотеку або переплутано велику й малу літеру.",
      try: [
        "На самому початку має бути: #include <iostream> та using namespace std;",
        "cout, cin, endl, int — усе малою літерою.",
        "Якщо це твоя функція — спершу напиши її, і тільки потім викликай.",
      ],
    },
    en: {
      what: "C++ has never seen this name. Usually a library is not included, or a capital letter is wrong.",
      try: ["At the very top there must be: #include <iostream> and using namespace std;", "cout, cin, endl, int — all lowercase.", "If it is your own function — write it first, then call it."],
    },
  },
  {
    re: /cannot find symbol|symbol:\s+|package [^\s]+ does not exist/i,
    uk: {
      what: "Java не бачить таке ім'я: змінну ще не створено, або не той регістр, або забуто import.",
      try: [
        "Спершу створи: int suma = 0; — і тільки потім її використовуй.",
        "println і println — різні назви; System пишеться з великої.",
        "Для Scanner, Map, TreeMap додай у першому рядку: import java.util.*;",
      ],
    },
    en: {
      what: "Java cannot see this name: the variable is not created yet, the case is wrong, or an import is missing.",
      try: ["Create it first: int suma = 0; — then use it.", "println and println are different names; System starts with a capital letter.", "For Scanner, Map, TreeMap put on the first line: import java.util.*;"],
    },
  },
  {
    re: /class Main is public|should be declared in a file named|public class Main/i,
    uk: {
      what: "Тут файл називається інакше, тому клас не може бути public.",
      try: ["Прибери слово public: пиши class Main, а не public class Main.", "Назву класу не змінюй — вона має лишитись Main."],
    },
    en: {
      what: "The file here has a different name, so the class cannot be public.",
      try: ["Remove the word public: write class Main, not public class Main.", "Keep the class name as Main."],
    },
  },
  {
    re: /exception in thread "main"|ArithmeticException|ArrayIndexOutOfBounds|NullPointerException/i,
    uk: {
      what: "Код скомпілювався, але впав уже під час роботи.",
      try: [
        "Подивись на рядок, на який вказує помилка (наприклад prog.java:7) — там сталось.",
        "Ділення на нуль і вихід за межі списку — найчастіші причини.",
      ],
    },
    en: {
      what: "The code compiled, but fell over while it was running.",
      try: ["Look at the line the error points to (for example prog.java:7) — that is where it broke.", "Dividing by zero and going past the end of a list are the usual causes."],
    },
  },
  {
    re: /error\[E\d+\]|mismatched types|cannot be redefined|does not live long enough|cannot borrow/i,
    uk: {
      what: "Rust суворий: ти намагаєшся змінити те, що йому ще знадобиться, або поклав не той тип.",
      try: [
        "Дозволь зміни: let mut lista = vec![];",
        "Потрібне ще раз? Зроби копію: let other = lista.clone();",
        "число і текст — різне: i32 не стає &str само собою.",
      ],
    },
    en: {
      what: "Rust is strict: you are changing something it still needs, or putting the wrong type in.",
      try: ["Allow changes: let mut lista = vec![];", "Needed again later? Copy it: let other = lista.clone();", "A number and a text are different: i32 does not become &str by itself."],
    },
  },
  {
    re: /declared and not used|imported and not used|declared but not used|no new variables on left side/i,
    uk: {
      what: "Go сердиться на зайве: створив — і не використав.",
      try: [
        "Додай fmt.Println(щось) для цієї змінної або приберіть її.",
        "Непотрібний імпорт з блоку import — теж видали.",
        "Якщо значення свідомо не потрібне, напиши замість назви _.",
      ],
    },
    en: {
      what: "Go complains about leftovers: you created something and never used it.",
      try: ["Add fmt.Println(thatVariable) or remove it.", "Delete the import you do not use.", "If the value is truly not needed, write _ instead of a name."],
    },
  },
  {
    re: /undefined: /i,
    uk: {
      what: "Go не знайомий з такою назвою — найчастіше забуто імпорт.",
      try: [
        "Написав fmt.Println — отже вгорі має бути блок import з рядком \"fmt\".",
        "Спершу створи змінну: suma := 0 — і тільки потім її використовуй.",
      ],
    },
    en: {
      what: "Go has never seen this name — most often an import is missing.",
      try: ["If you wrote fmt.Println, the import block at the top needs a \"fmt\" line.", "Create the variable first: suma := 0 — then use it."],
    },
  },
  {
    re: /expected ';', found|missing return at end of function|syntax error: unexpected/i,
    uk: {
      what: "Go не розуміє цей запис. У Go крапка з комої в кінці рядка не потрібна, а змінна має спочатку з'явитись.",
      try: [
        "Створи змінну перед вживанням: suma := 0",
        "Прибери зайві крапки з комої в кінці рядків — Go ставить їх сам.",
      ],
    },
    en: {
      what: "Go does not understand this. In Go a line needs no semicolon, and a variable must exist before you use it.",
      try: ["Create it first: suma := 0", "Drop extra semicolons at the end of lines — Go adds them itself."],
    },
  },
  {
    re: /panicked at|invalid digit|cannot parse/i,
    uk: {
      what: "Програма зупинилась під час роботи: вона читала щось, чого не змогла перетворити на потрібний тип.",
      try: [
        "Заповни поле «Вхідні дані» — програма чекає саме з нього.",
        "Числа мають бути числами: 12 30, а не «дванадцять тридцять».",
      ],
    },
    en: {
      what: "The program stopped while running: it read something it could not turn into the type it wanted.",
      try: ["Fill in the Input data box — that is where the program reads from.", "Numbers must be numbers: 12 30, not twelve thirty."],
    },
  },
  {
    re: /EOF in multi-line statement|expected ':'|expected an indented block after|SyntaxError: invalid character|invalid character|unmatched '\)'|MissingInitializer|';' expected/i,
    uk: { what: "Рядок обірвався на півслові: чогось не вистачає до повної команди.", try: ["Подивись на рядок, на який вказує номер у помилці, і на рядок над ним.", "Повні команди: if умова: , for x in список: , print(щось)"] },
    en: { what: "The line stopped in the middle — a piece of the command is missing.", try: ["Look at the line number in the error, and the line just above it.", "Complete commands look like: if condition: , for x in items: , print(thing)"] },
  },
];

function explainError(text) {
  for (const rule of ERROR_RULES) {
    if (rule.re.test(text)) {
      const pack = locale === "en" ? rule.en : rule.uk;
      return { what: pack.what, try: pack.try || [] };
    }
  }
  return null;
}

function lastErrorLine(text) {
  const lines = String(text).split("\n").map((l) => l.trim()).filter(Boolean);
  const strong = /(?:\b[A-Za-z]*(?:Error|Exception)\b|error\[E\d+\]|: error:|fatal error:|panicked at|panic:|Traceback|declared and not used|cannot find symbol|is not declared|undefined:)/;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (strong.test(lines[i]) && !/^File "/.test(lines[i])) {
      return lines[i].replace(/^Traceback \(most recent call last\):$/, "");
    }
  }
  return lines[lines.length - 1] || String(text);
}
