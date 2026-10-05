"use strict";

(function () {
  const root = document.getElementById("quiz");
  if (!root) return;

  /* ==========================================================
     QUESTÕES
     correct = posição da resposta certa (0 = A, 1 = B, ...)
     review  = número da aula a revisar se errar
     ========================================================== */

  const REVIEW = {
    2: "Processo clássico de debug",
    3: "IA como apoio",
    4: "Demonstração prática e fechamento",
  };

  const QUIZ = [
    {
      title: "Reproduzir um erro",
      objective: "Reproduzir um erro de forma confiável",
      review: 2,
      question: "O que significa reproduzir um erro?",
      options: [
        "Corrigir o código até a mensagem de erro sumir",
        "Fazer o erro acontecer de novo, de forma controlada, com os mesmos passos e o mesmo resultado",
        "Copiar a mensagem de erro e colar numa IA",
        "Reiniciar o computador e rodar o código mais uma vez",
      ],
      correct: 1,
      right: "Isso mesmo. Quando você consegue repetir o erro sempre do mesmo jeito, depois de mexer no código sabe se realmente corrigiu ou se só teve sorte.",
      wrong: "Reproduzir é conseguir fazer o erro acontecer de novo, de forma controlada, com os mesmos passos e o mesmo resultado. Sem isso, você não sabe se a correção funcionou ou se foi sorte.",
    },
    {
      title: "Formular hipótese",
      objective: "Formular hipóteses sobre a causa",
      review: 2,
      question: "Uma lista tem 4 notas e o código pede a posição 5, gerando um IndexError. Qual das alternativas é uma boa hipótese?",
      options: [
        "O Python está com defeito",
        "Tem algum erro em algum lugar do código",
        "Vou mexer no código até parar de dar erro",
        "A lista tem 4 itens, então as posições vão de 0 a 3 e a posição 5 não existe",
      ],
      correct: 3,
      right: "Exato. Uma boa hipótese parte do que você observou e dá pra ser testada. Aqui, basta imprimir o tamanho da lista pra confirmar.",
      wrong: "Uma boa hipótese aponta uma causa específica, baseada no que você observou, e pode ser testada. \"Algum erro em algum lugar\" não diz nada, e mexer no código sem direção é tentativa e erro. A alternativa D explica o erro e dá pra confirmar com um print do tamanho da lista.",
    },
    {
      title: "O que não compartilhar",
      objective: "Compartilhar o contexto certo com a IA",
      review: 3,
      question: "Qual destas informações você não deve colar numa IA?",
      options: [
        "A mensagem de erro completa",
        "O trecho da função que está com problema",
        "Uma senha ou chave de API que está no código",
        "O resultado que você esperava",
      ],
      correct: 2,
      right: "Correto. Senhas, chaves de API, tokens e dados pessoais não devem ser compartilhados. Se estiverem no trecho, troque por valores falsos antes de colar.",
      wrong: "A mensagem de erro, o trecho do código e o resultado esperado são justamente o que ajuda a IA a responder bem. O que não deve ser colado são senhas, chaves de API, tokens e dados pessoais. Se estiverem no trecho, troque por valores falsos antes.",
    },
    {
      title: "Pedido bem formulado",
      objective: "Compartilhar o contexto certo com a IA",
      review: 3,
      question: "Qual destes pedidos tem mais chance de gerar uma resposta útil?",
      options: [
        "\"Essa função deveria devolver a média das notas, mas devolve a soma. Esperado: 7.5. Obtido: 30. Não aparece erro. Já testei que sum(notas) é 30 e len(notas) é 4. Minha hipótese: falta dividir. Confirma?\"",
        "\"Meu código não funciona, ajuda.\"",
        "(colar o código sem explicação) \"conserta\"",
        "\"Escreve um programa melhor pra mim.\"",
      ],
      correct: 0,
      right: "Muito bem. Esse pedido diz o que a função deveria fazer, o esperado e o obtido, o que já foi testado e a hipótese. Com isso a IA consegue ajudar e você consegue conferir a resposta.",
      wrong: "Um bom pedido tem quatro partes: o que você queria, o código relevante, o erro (ou o esperado contra o obtido) e o que você já testou, com sua hipótese. As alternativas B, C e D não dão contexto nenhum, então a IA vai ter que adivinhar.",
    },
    {
      title: "Sugestão da IA",
      objective: "Validar a sugestão da IA antes de aplicar",
      review: 4,
      question: "A IA sugeriu uma correção que parece certa. O que fazer antes de aceitar?",
      options: [
        "Aplicar direto, porque a IA raramente erra",
        "Testar com um caso normal, um caso no limite e um caso estranho",
        "Perguntar de novo pra mesma IA se ela tem certeza e parar por aí",
        "Apagar o código antigo pra não confundir",
      ],
      correct: 1,
      right: "Isso. Na demonstração, a média corrigida funcionava com listas normais, mas quebrava com lista vazia. Só testando casos diferentes você descobre esse tipo de problema.",
      wrong: "A resposta da IA é uma hipótese, não uma verdade. Ela pode funcionar no caso que você mostrou e quebrar em outro. Por isso é preciso testar com um caso normal, um caso no limite e um caso estranho, como a lista vazia na média.",
    },
    {
      title: "Ordem do processo",
      objective: "Conhecer o processo de investigação de erros",
      review: 2,
      question: "Qual é a ordem correta do processo de debug?",
      options: [
        "Hipótese, testar, reproduzir, isolar",
        "Isolar, reproduzir, testar, hipótese",
        "Testar, hipótese, isolar, reproduzir",
        "Reproduzir, isolar, formular a hipótese, testar a hipótese",
      ],
      correct: 3,
      right: "Perfeito. Primeiro você faz o erro se repetir, depois reduz o cenário, levanta uma causa provável e testa essa causa antes de mudar o código.",
      wrong: "A ordem é: reproduzir o erro, isolar o menor cenário que o mostra, formular uma hipótese e testar essa hipótese antes de mudar o código. Cada passo depende do anterior. Sem reproduzir, por exemplo, não dá pra isolar nem testar nada.",
    },
    {
      title: "Bug silencioso",
      objective: "Reproduzir e investigar erros sem mensagem",
      review: 4,
      question: "O código roda sem nenhuma mensagem de erro, mas o resultado está errado. Qual é o principal cuidado?",
      options: [
        "Definir o que você esperava e comparar com o que o código devolveu, porque não há traceback pra guiar",
        "Esperar aparecer uma mensagem de erro",
        "Concluir que o código está certo, já que não deu erro",
        "Pedir pra IA reescrever tudo sem dar explicação",
      ],
      correct: 0,
      right: "Certo. No bug silencioso ninguém avisa que algo está errado, então saber o resultado esperado é o que permite perceber o problema, reproduzi-lo e descrever pra IA.",
      wrong: "Quando não aparece erro, não existe traceback pra te guiar. Quem percebe o problema é você, comparando o resultado esperado com o obtido. Esse comparativo também é o que você precisa descrever pra IA pedir ajuda direito.",
    },
  ];

  /* ==========================================================
     CÓDIGO
     ========================================================== */

  const LETTERS = "ABCD";
  const state = { index: 0, answers: [], answered: false, selected: null };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function focusLater(id) {
    const target = document.getElementById(id);
    if (target) target.focus({ preventScroll: true });
  }

  function reveal() {
    const top = root.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.6) {
      root.scrollIntoView({ block: "start" });
    }
  }

  function render() {
    root.replaceChildren();
    if (state.index >= QUIZ.length) renderResult();
    else renderQuestion();
  }

  function renderQuestion() {
    const q = QUIZ[state.index];
    const card = el("div", "quiz-card");

    const head = el("div", "quiz-head");
    const count = el("p", "quiz-count", `Questão ${state.index + 1} de ${QUIZ.length}`);
    const bar = document.createElement("progress");
    bar.max = QUIZ.length;
    bar.value = state.index;
    bar.setAttribute("aria-label", "Progresso da avaliação");
    head.append(count, bar, el("p", "quiz-objective", `Objetivo avaliado: ${q.objective}`));

    const fieldset = el("fieldset", "quiz-fs");
    const legend = el("legend", "quiz-q", q.question);
    legend.id = "quiz-legend";
    legend.tabIndex = -1;
    fieldset.append(legend);

    const labels = [];
    const action = el("button", "btn", "Responder");
    action.type = "button";
    action.disabled = true;

    q.options.forEach((text, i) => {
      const label = el("label", "quiz-opt");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "quiz-option";
      input.value = String(i);
      input.addEventListener("change", () => {
        state.selected = i;
        labels.forEach((l, k) => l.classList.toggle("is-selected", k === i));
        action.disabled = false;
      });
      label.append(input, el("span", "quiz-letter", LETTERS[i]), el("span", "quiz-text", text));
      labels.push(label);
      fieldset.append(label);
    });

    const slot = el("div", "quiz-fb-slot");
    slot.setAttribute("aria-live", "polite");

    action.addEventListener("click", () => {
      if (!state.answered) answer(q, labels, slot, action, bar);
      else next();
    });

    const actions = el("div", "quiz-actions");
    actions.append(action);

    card.append(head, fieldset, slot, actions);
    root.append(card);
  }

  function answer(q, labels, slot, action, bar) {
    if (state.selected === null) return;
    state.answered = true;
    state.answers[state.index] = state.selected;
    const ok = state.selected === q.correct;

    labels.forEach((label, i) => {
      const input = label.querySelector("input");
      input.disabled = true;
      if (i === q.correct) {
        label.classList.add("is-correct");
        label.append(el("span", "quiz-badge", "Resposta certa"));
      } else if (i === state.selected) {
        label.classList.add("is-wrong");
        label.append(el("span", "quiz-badge", "Sua resposta"));
      }
    });

    const fb = el("div", `quiz-fb ${ok ? "is-ok" : "is-bad"}`);
    fb.append(
      el("p", "quiz-fb-title", ok ? "Resposta correta" : `Resposta incorreta. A certa é a alternativa ${LETTERS[q.correct]}.`),
      el("p", "quiz-fb-text", ok ? q.right : q.wrong)
    );
    slot.append(fb);

    bar.value = state.index + 1;
    action.textContent = state.index === QUIZ.length - 1 ? "Ver resultado" : "Próxima questão";
  }

  function next() {
    state.index += 1;
    state.answered = false;
    state.selected = null;
    render();
    reveal();
    focusLater(state.index >= QUIZ.length ? "quiz-result" : "quiz-legend");
  }

  function restart() {
    state.index = 0;
    state.answers = [];
    state.answered = false;
    state.selected = null;
    render();
    reveal();
    focusLater("quiz-legend");
  }

  function renderResult() {
    const score = QUIZ.filter((q, i) => state.answers[i] === q.correct).length;
    const total = QUIZ.length;
    const card = el("div", "quiz-card quiz-result");

    const title = el("h3", "quiz-result-title", `Você acertou ${score} de ${total} questões`);
    title.id = "quiz-result";
    title.tabIndex = -1;

    let message;
    if (score === total) message = "Excelente! Você dominou o processo de debug com apoio de IA.";
    else if (score >= 5) message = "Muito bem! Veja abaixo os pontos que valem uma revisão.";
    else message = "Vale rever as aulas indicadas abaixo e tentar de novo.";

    const list = el("ul", "quiz-summary");
    const toReview = new Set();
    QUIZ.forEach((q, i) => {
      const ok = state.answers[i] === q.correct;
      if (!ok) toReview.add(q.review);
      const item = el("li", ok ? "is-ok" : "is-bad");
      item.append(
        el("span", "quiz-summary-mark", ok ? "Certa" : "Errada"),
        el("span", "quiz-summary-text", `Questão ${i + 1}: ${q.title}`)
      );
      list.append(item);
    });

    card.append(title, el("p", "quiz-result-msg", message), list);

    if (toReview.size) {
      const box = el("div", "quiz-review");
      box.append(el("p", "quiz-review-title", "Aulas para revisar"));
      const row = el("div", "quiz-review-list");
      [...toReview].sort().forEach((n) => {
        const b = el("button", "btn btn-ghost", `Aula ${n}: ${REVIEW[n]}`);
        b.type = "button";
        b.addEventListener("click", () => {
          if (typeof selectLesson === "function") selectLesson(n - 1, false);
          const aula = document.getElementById("aula");
          if (aula) aula.scrollIntoView({ block: "start" });
        });
        row.append(b);
      });
      box.append(row);
      card.append(box);
    }

    const again = el("button", "btn", "Refazer a avaliação");
    again.type = "button";
    again.addEventListener("click", restart);
    const actions = el("div", "quiz-actions");
    actions.append(again);
    card.append(actions);

    root.append(card);
  }

  render();
})();
