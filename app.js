const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

const navLinks = qsa(".nav-link, .sidebar-tree-link");
const modules = qsa(".module");
function showModule(target, anchor, activeLink) {
  const module = qs(`#${target}`);
  if (!module) {
    console.warn(`No existe el módulo de navegación: ${target}`);
    return;
  }
  navLinks.forEach((item) => item.classList.toggle("is-active", item === activeLink));
  modules.forEach((item) => item.classList.toggle("is-visible", item.id === target));
  if (!anchor) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  requestAnimationFrame(() => {
    const destination = document.getElementById(anchor);
    if (!destination) {
      console.warn(`No existe el ancla de navegación: ${anchor}`);
      return;
    }
    destination.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

navLinks.forEach((link) => link.addEventListener("click", () => {
  showModule(link.dataset.target, link.dataset.anchor, link);
}));

qsa("[data-jump]").forEach((button) => button.addEventListener("click", () => {
  const target = button.dataset.jump;
  const navLink = qs(`[data-target="${target}"]`);
  if (navLink) navLink.click();
}));

function binomial(n, k) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= k; i += 1) result = result * (n - k + i) / i;
  return result;
}

function coverProbability(n, d) {
  if (n <= 0 || d < 0) return 0;
  const upper = Math.min(d, n - 1);
  let sum = 0;
  for (let i = 0; i <= upper; i += 1) sum += binomial(n - 1, i);
  return Math.min(1, (2 * sum) / (2 ** n));
}

function updateCover() {
  const n = Math.max(1, Number.parseInt(qs("#cover-n").value, 10) || 1);
  const d = Math.max(0, Number.parseInt(qs("#cover-d").value, 10) || 0);
  qs("#cover-result").textContent = `F(N,d) = ${coverProbability(n, d).toFixed(4)}`;
}
["#cover-n", "#cover-d"].forEach((selector) => qs(selector).addEventListener("input", updateCover));

function updateFisher() {
  const between = Number(qs("#fisher-between").value);
  const within = Number(qs("#fisher-within").value);
  qs("#fisher-between-value").textContent = between.toFixed(1);
  qs("#fisher-within-value").textContent = within.toFixed(1);
  qs("#fisher-result").textContent = (between ** 2 / within).toFixed(2);
}
["#fisher-between", "#fisher-within"].forEach((selector) => qs(selector).addEventListener("input", updateFisher));

let weights = [0, 0, 0];
function updatePerceptronView(message = "Salida: 1 · correcto") {
  qs("#perceptron-output").textContent = message;
  qs("#perceptron-weights").textContent = `w = [${weights.map((value) => value.toFixed(2)).join(", ")}]`;
  const magnitude = Math.min(100, Math.round((Math.hypot(...weights) / 5) * 100));
  qs("#perceptron-bar-fill").style.width = `${Math.max(4, magnitude)}%`;
}
qs("#perceptron-step").addEventListener("click", () => {
  const x = [1, Number(qs("#px1").value) || 0, Number(qs("#px2").value) || 0];
  const target = Number(qs("#pt").value);
  const eta = Math.max(0, Number(qs("#peta").value) || 0);
  const score = weights.reduce((total, weight, index) => total + weight * x[index], 0);
  const output = score >= 0 ? 1 : -1;
  if (output !== target) {
    weights = weights.map((weight, index) => weight + eta * target * x[index]);
    updatePerceptronView(`Salida: ${output} · error, actualización aplicada`);
  } else {
    updatePerceptronView(`Salida: ${output} · correcto, sin actualización`);
  }
});
qs("#perceptron-reset").addEventListener("click", () => { weights = [0, 0, 0]; updatePerceptronView(); });

const cards = [
  ["Módulo 1", "¿Qué representa w en un discriminante lineal?", "El vector normal a la frontera de decisión; determina su orientación."],
  ["Módulo 1", "¿Qué resuelve la entrada ficticia x₀ = 1?", "Integra el sesgo w₀ dentro del producto escalar de pesos y entradas."],
  ["Módulo 2", "¿Cuándo conviene usar SVD?", "Cuando ΦᵀΦ es singular o hay menos patrones que funciones base; mejora la estabilidad numérica."],
  ["Módulo 2", "¿Qué maximiza Fisher?", "La separación entre medias de clase y minimiza la dispersión dentro de cada clase."],
  ["Módulo 3", "¿Cuándo converge el perceptrón?", "Cuando el conjunto de entrenamiento es linealmente separable; encuentra una solución en tiempo finito."],
  ["Módulo 4", "¿Por qué un MLP necesita activaciones no lineales?", "Sin ellas, la composición de capas lineales sigue siendo una sola transformación lineal."],
  ["Módulo 4 · 4.3", "¿Qué ventaja tienen las unidades sigmoidales?", "Son continuas y diferenciables, por lo que permiten calcular gradientes y entrenar con retropropagación."],
  ["Módulo 4 · 4.4", "¿Por qué aparece el factor M! en las simetrías de pesos?", "Porque las M unidades ocultas pueden permutarse de M! formas sin cambiar la función si también se reordenan sus conexiones de salida."],
  ["Módulo 4 · 4.7", "¿Qué garantiza el teorema de Kolmogorov?", "Que toda función continua multivariable puede representarse exactamente con una red de dos capas ocultas y 2d + 1 unidades."],
  ["Módulo 4 · 4.10", "¿Qué mide la matriz Hessiana?", "La curvatura de la función de error mediante derivadas de segundo orden respecto a los pesos."],
];
let cardIndex = 0;
let studied = new Set();
qs("#cards-total").textContent = cards.length;
function renderCard() {
  const [category, question, answer] = cards[cardIndex];
  qs("#flashcard-category").textContent = category;
  qs("#flashcard-question").textContent = question;
  qs("#flashcard-answer").textContent = answer;
  qs("#flashcard-answer").hidden = true;
  qs("#flashcard-reveal").textContent = "Mostrar respuesta";
}
qs("#flashcard-reveal").addEventListener("click", () => {
  const answer = qs("#flashcard-answer");
  answer.hidden = !answer.hidden;
  qs("#flashcard-reveal").textContent = answer.hidden ? "Mostrar respuesta" : "Ocultar respuesta";
  if (!answer.hidden) {
    studied.add(cardIndex);
    qs("#cards-studied").textContent = studied.size;
    qs("#progress-label").textContent = `Progreso: ${Math.round((studied.size / cards.length) * 100)}%`;
  }
});
qs("#flashcard-next").addEventListener("click", () => { cardIndex = (cardIndex + 1) % cards.length; renderCard(); });

const explanations = {
  lineal: "El perceptrón solo puede encontrar una frontera lineal. Más iteraciones no crean una solución para XOR ni para cualquier conjunto no separable.",
  svd: "La matriz ΦᵀΦ puede ser singular o estar mal condicionada. La pseudoinversa calculada con SVD evita depender de una inversión inestable.",
  fisher: "La matriz entre clases S_B tiene rango máximo c − 1. Por eso una proyección de Fisher multiclase no puede producir más de c − 1 características discriminantes.",
  mlp: "Las capas adicionales solo ayudan si alguna activación introduce no linealidad. Varias capas lineales se pueden combinar en una sola matriz.",
};
qsa(".error-item").forEach((item) => item.addEventListener("click", () => {
  qs("#error-detail").textContent = explanations[item.dataset.error];
}));

const examQuestions = [
  {
    question: "¿Cuál es la distancia perpendicular desde el origen a wᵀx + w₀ = 0?",
    options: ["‖w‖ / w₀", "−w₀ / ‖w‖", "wᵀw₀", "−w₀ · ‖w‖"],
    answer: 1,
    explanation: "El sesgo dividido por la norma del vector normal, con signo invertido, da la distancia orientada."
  },
  {
    question: "Una red con activaciones ocultas estrictamente lineales es equivalente a:",
    options: ["Una red de una sola capa", "Una red que siempre resuelve XOR", "Una región convexa", "Un modelo inestable"],
    answer: 0,
    explanation: "La composición de transformaciones lineales sigue siendo una única transformación lineal."
  },
  {
    question: "¿Cuándo garantiza convergencia el perceptrón?",
    options: ["Siempre", "Solo con datos gaussianos", "Cuando los datos son linealmente separables", "Cuando se usa SVD"],
    answer: 2,
    explanation: "La convergencia en un número finito de pasos exige que exista un hiperplano separador."
  },
  {
    question: "Para c clases, Fisher puede extraer como máximo:",
    options: ["c", "d − c", "c − 1", "N − 1"],
    answer: 2,
    explanation: "La matriz entre clases S_B tiene rango máximo c − 1."
  },
  {
    question: "Tres capas de unidades de umbral pueden formar:",
    options: ["Solo hiperplanos", "Solo regiones convexas", "Solo funciones diferenciables", "Regiones no convexas y disjuntas"],
    answer: 3,
    explanation: "Las capas sucesivas combinan regiones convexas mediante OR y producen fronteras arbitrarias."
  }
];

function renderExam() {
  qs("#exam-list").innerHTML = examQuestions.map((item, index) => `
    <article class="exam-question">
      <h3>${index + 1}. ${item.question}</h3>
      <div class="exam-options">${item.options.map((option, optionIndex) => `
        <label><input type="radio" name="exam-${index}" value="${optionIndex}"> ${String.fromCharCode(97 + optionIndex)}) ${option}</label>
      `).join("")}</div>
      <p class="exam-explanation" id="exam-explanation-${index}" hidden>${item.explanation}</p>
    </article>
  `).join("");
}
qs("#exam-score").addEventListener("click", () => {
  let score = 0;
  examQuestions.forEach((item, index) => {
    const selected = qs(`input[name="exam-${index}"]:checked`);
    const explanation = qs(`#exam-explanation-${index}`);
    explanation.hidden = false;
    if (selected && Number(selected.value) === item.answer) score += 1;
  });
  qs("#exam-result").textContent = `Resultado: ${score}/${examQuestions.length} respuestas correctas`;
});

renderExam();
renderCard();
updateCover();
updateFisher();
updatePerceptronView();
