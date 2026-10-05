"use strict";

/* ==========================================================
   CONFIGURAÇÃO
   ========================================================== */

const CONFIG = {
  storageKey: "minicurso-depuracao-ia",
};

// youtubeId aceita o ID do vídeo (11 caracteres) ou a URL completa do YouTube
const LESSONS = [
  {
    title: "Abertura",
    minutes: 3,
    youtubeId: "PhIFdmPxEKc",
    description: "Apresentação do tema, dos objetivos do minicurso e de um erro real acontecendo na tela.",
  },
  {
    title: "Processo clássico de debug",
    minutes: 6,
    youtubeId: "SDFU-sIgesU",
    description: "Reproduzir o erro, isolar a causa, levantar uma hipótese e testá-la antes de mudar o código.",
  },
  {
    title: "IA como apoio",
    minutes: 5,
    youtubeId: "Q3ptNJD62H0",
    description: "O que compartilhar com a IA, o que evitar e como montar uma pergunta que leva a respostas melhores.",
  },
  {
    title: "Demonstração prática e fechamento",
    minutes: 14,
    youtubeId: "zXVAVzBOYmg",
    description: "Dois bugs em Python, um com mensagem de erro e outro silencioso, resolvidos com o processo completo. No fim, a recapitulação e o cuidado de testar toda sugestão da IA.",
  },
];

/* ==========================================================
   CÓDIGO
   ========================================================== */

const state = { current: 0, done: new Set() };

const $ = (id) => document.getElementById(id);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function isValidIndex(i) {
  return Number.isInteger(i) && i >= 0 && i < LESSONS.length;
}

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.done)) {
      saved.done.filter(isValidIndex).forEach((i) => state.done.add(i));
    }
    if (isValidIndex(saved.current)) state.current = saved.current;
  } catch (err) {
    /* armazenamento indisponível: segue sem salvar progresso */
  }
}

function saveState() {
  try {
    localStorage.setItem(
      CONFIG.storageKey,
      JSON.stringify({ current: state.current, done: [...state.done] })
    );
  } catch (err) {
    /* ignora */
  }
}

function extractYoutubeId(value) {
  const v = (value || "").trim();
  if (!v) return "";
  if (/^[\w-]{11}$/.test(v)) return v;
  const match = v.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : "";
}

function renderVideo() {
  const lesson = LESSONS[state.current];
  const frame = $("video-frame");
  const id = extractYoutubeId(lesson.youtubeId);
  frame.replaceChildren();

  if (id) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&cc_load_policy=1&hl=pt-BR`;
    iframe.title = `Aula ${state.current + 1}: ${lesson.title}`;
    iframe.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    frame.appendChild(iframe);
    return;
  }

  const box = el("div", "placeholder");
  box.append(
    el("strong", "", `Aula ${state.current + 1}: ${lesson.title}`),
    el("span", "", "O vídeo desta aula ainda não foi adicionado.")
  );
  frame.appendChild(box);
}

function renderLessonHead() {
  const lesson = LESSONS[state.current];
  const isFirst = state.current === 0;
  const isLast = state.current === LESSONS.length - 1;

  $("aula-titulo").textContent = `Aula ${state.current + 1}: ${lesson.title}`;
  $("aula-desc").textContent = lesson.description;

  const prev = $("prev");
  prev.disabled = isFirst;

  $("next").textContent = isLast ? "Concluir e fazer a avaliação" : "Concluir e avançar";
}

function buildList() {
  const list = $("lesson-list");
  LESSONS.forEach((lesson, i) => {
    const li = el("li", "lesson");

    const button = el("button", "lesson-btn");
    button.type = "button";
    const text = el("span", "lesson-text");
    text.append(el("span", "lesson-title", lesson.title), el("span", "lesson-time", `${lesson.minutes} min`));
    button.append(el("span", "lesson-num", String(i + 1)), text);
    button.addEventListener("click", () => selectLesson(i, true));

    const label = el("label", "done");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.addEventListener("change", () => toggleDone(i, input.checked));
    label.append(input, el("span", "sr-only", `Marcar a aula ${i + 1}, ${lesson.title}, como concluída`));

    li.append(button, label);
    list.appendChild(li);
  });
}

function updateList() {
  document.querySelectorAll(".lesson").forEach((li, i) => {
    const button = li.querySelector(".lesson-btn");
    const input = li.querySelector("input");
    const isCurrent = i === state.current;

    li.classList.toggle("is-current", isCurrent);
    if (isCurrent) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
    input.checked = state.done.has(i);
  });
}

function updateProgress() {
  const total = LESSONS.length;
  const count = state.done.size;
  const bar = $("progress");
  bar.max = total;
  bar.value = count;
  $("progress-text").textContent = `${count} de ${total} aulas concluídas`;
}

function renderAll() {
  renderVideo();
  renderLessonHead();
  updateList();
  updateProgress();
}

function toggleDone(index, checked) {
  if (checked) state.done.add(index);
  else state.done.delete(index);
  saveState();
  updateProgress();
}

function selectLesson(index, scrollToVideo) {
  if (!isValidIndex(index)) return;
  state.current = index;
  saveState();
  renderAll();
  if (scrollToVideo && window.matchMedia("(max-width: 960px)").matches) {
    $("aula").scrollIntoView({ block: "start" });
  }
}

function setupNavigation() {
  $("prev").addEventListener("click", () => selectLesson(state.current - 1, true));

  $("next").addEventListener("click", () => {
    state.done.add(state.current);
    saveState();

    if (state.current === LESSONS.length - 1) {
      updateList();
      updateProgress();
      $("avaliacao").scrollIntoView({ block: "start" });
      return;
    }
    selectLesson(state.current + 1, true);
  });
}

function setupMeta() {
  const total = LESSONS.reduce((sum, lesson) => sum + lesson.minutes, 0);
  $("meta-videos").textContent = `${LESSONS.length} vídeos, cerca de ${total} minutos`;
}

function init() {
  loadState();
  buildList();
  setupNavigation();
  setupMeta();
  renderAll();
}

init();
