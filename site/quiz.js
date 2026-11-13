(function (root) {
  "use strict";

  const storageKey = "cert-study.gh-200.attempts.v1";
  const bank = root.GH200Quiz;
  const core = root.QuizCore;
  const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
  const percent = (correct, total) => total ? Math.round(correct / total * 100) : 0;

  function mount(container) {
    let questions = [];
    let answers = {};
    let checked = new Set();
    let index = 0;
    let mode = "study";
    let domain = "all";
    let result = null;
    let confirming = false;
    let history = [];
    let storageNotice = "";
    let retry = false;

    function storageFailure(error) {
      console.warn("Quiz attempt history is unavailable:", error);
      storageNotice = "Browser history could not be read or saved. Your current quiz still works; check browser storage settings. Clear history to reset damaged data.";
    }

    function validResult(value) {
      return value && Number.isInteger(value.total) && value.total > 0 &&
        Number.isInteger(value.correct) && value.correct >= 0 && value.correct <= value.total;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(saved) || saved.length > 10 || saved.some((attempt) =>
        !validResult(attempt) || !["study", "exam"].includes(attempt.mode) ||
        !Number.isFinite(Date.parse(attempt.date)) ||
        !attempt.domains || typeof attempt.domains !== "object" ||
        !Object.entries(attempt.domains).length ||
        Object.entries(attempt.domains).some(([name, value]) => !bank.domains[name] || !validResult(value)) ||
        Object.values(attempt.domains).reduce((sum, value) => sum + value.total, 0) !== attempt.total ||
        Object.values(attempt.domains).reduce((sum, value) => sum + value.correct, 0) !== attempt.correct
      )) {
        throw new Error("Stored attempt history has an invalid format.");
      }
      history = saved;
    } catch (error) {
      storageFailure(error);
    }

    function notice() {
      return storageNotice ? `<p class="quiz-notice" role="alert">${escape(storageNotice)}</p>` : "";
    }

    function show(html) {
      container.innerHTML = `<div class="quiz">${notice()}${html}</div>`;
      container.querySelector("[data-focus]")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    function historyHTML() {
      if (!history.length) {
        return "<p>No completed attempts yet. Recent attempts are stored only in this browser.</p>";
      }
      return `<p>Last ${history.length} completed attempts in this browser. Study and missed-question retries are learning practice, not independent readiness tests.</p>
        <ol class="quiz-history">${history.map((attempt) => `
          <li><strong>${attempt.correct}/${attempt.total} (${percent(attempt.correct, attempt.total)}%)</strong>
            ${escape(attempt.mode)}${attempt.retry ? " / missed-question retry" : ""} &middot;
            <time datetime="${escape(attempt.date)}">${escape(new Date(attempt.date).toLocaleString())}</time>
            <ul>${Object.entries(attempt.domains).map(([name, score]) =>
              `<li>${escape(bank.domains[name].title)}: ${score.correct}/${score.total}</li>`
            ).join("")}</ul>
          </li>`).join("")}</ol>`;
    }

    function setup() {
      show(`
        <p class="eyebrow">Original practice questions &middot; ${bank.questions.length}-question bank</p>
        <h1 tabindex="-1" data-focus>GH-200 Practice Quiz</h1>
        <p>Practice choosing between plausible answers across all five GitHub Actions exam domains. Questions and choices are shuffled on every attempt.</p>
        <p>These are independent study questions, not real exam questions or the official assessment.
          Raw percentages do not map to the exam's scaled passing score and do not guarantee a pass.</p>
        <form id="quiz-setup" class="quiz-settings">
          <label>Mode<select name="mode">
            <option value="study">Study - explanations after each answer</option>
            <option value="exam">Exam practice - feedback only after submission</option>
          </select></label>
          <label>Domain<select name="domain">
            <option value="all">All five domains (balanced by bank coverage)</option>
            ${Object.entries(bank.domains).map(([name, value]) =>
              `<option value="${name}">${escape(value.title)}</option>`
            ).join("")}
          </select></label>
          <label>Session length<select name="count">
            <option value="10">10 questions</option>
            <option value="25" selected>25 questions</option>
            <option value="50">50 questions</option>
            <option value="100">Entire available bank</option>
          </select></label>
          <p id="quiz-available"></p>
          <button class="quiz-button" type="submit">Start quiz</button>
        </form>
        <p>Single-answer and multiple-answer questions use exact-match scoring: choose all correct answers and no incorrect ones. No partial credit.</p>
        <p>Exam practice is untimed. You can move back and forward, leave questions unanswered, and submit when ready.
          In-progress sessions are not saved: refreshing or navigating to a guide resets them.</p>
        <details><summary>Domain coverage and sources</summary>
          <ul>${Object.entries(bank.domains).map(([name, value]) =>
            `<li>${escape(value.title)}: ${bank.questions.filter((q) => q.domain === name).length} questions</li>`
          ).join("")}</ul>
          <p>Aligned to the <a href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200" target="_blank" rel="noopener noreferrer">official GH-200 study guide</a>,
            reviewed ${bank.reviewed}. Each question includes a documentation link in its feedback.</p>
        </details>
        <h2>Recent attempts</h2>${historyHTML()}
        <button class="quiz-button secondary" type="button" data-action="clear-history">Clear browser history</button>
      `);
      updateAvailable();
    }

    function updateAvailable() {
      const form = container.querySelector("#quiz-setup");
      const selectedDomain = form.elements.domain.value;
      const available = bank.questions.filter((q) => selectedDomain === "all" || q.domain === selectedDomain).length;
      const count = Math.min(Number(form.elements.count.value), available);
      container.querySelector("#quiz-available").textContent = `${count} questions will be drawn without repeats from ${available} available.`;
    }

    function feedback(question, selected) {
      const correct = core.isCorrect(question, selected);
      return `<section class="quiz-feedback ${correct ? "correct" : "incorrect"}">
        <h3>${correct ? "Correct" : selected.length ? "Incorrect" : "Unanswered"}</h3>
        <ul>${question.choices.map((choice) => `<li>
          <strong>${choice.correct ? "Correct answer" : "Distractor"}${selected.includes(choice.id) ? " / your selection" : ""}:</strong>
          ${escape(choice.text)}<br>${escape(choice.explanation)}
        </li>`).join("")}</ul>
        <p><a href="${escape(question.reference)}" target="_blank" rel="noopener noreferrer">Read the official documentation</a>
          &middot; <a href="#/${bank.domains[question.domain].study}">Study this domain</a></p>
      </section>`;
    }

    function questionPage() {
      const question = questions[index];
      const selected = answers[question.id] || [];
      const required = question.choices.filter((choice) => choice.correct).length;
      const locked = mode === "study" && checked.has(question.id);
      const answered = questions.filter((q) => answers[q.id]?.length).length;
      show(`
        <p class="eyebrow">${escape(mode)}${retry ? " / missed-question retry" : ""} &middot; Question ${index + 1} of ${questions.length}</p>
        <progress class="quiz-progress" max="${questions.length}" value="${mode === "study" ? checked.size : answered}"
          aria-label="${mode === "study" ? "Questions checked" : "Questions answered"}"></progress>
        <p>${escape(bank.domains[question.domain].title)} &middot; ${escape(question.topic)}</p>
        <h2 class="quiz-prompt" tabindex="-1" data-focus>${escape(question.prompt)}</h2>
        ${question.code ? `<pre><code>${escape(question.code)}</code></pre>` : ""}
        <fieldset class="quiz-choices"><legend>Select ${required === 1 ? "one answer" : `${required} answers`}.</legend>
          ${question.choices.map((choice) => `<label class="quiz-choice">
            <input type="${required === 1 ? "radio" : "checkbox"}" name="answer" value="${choice.id}"
              ${selected.includes(choice.id) ? "checked" : ""} ${locked ? "disabled" : ""}>
            <span>${escape(choice.text)}</span>
          </label>`).join("")}
        </fieldset>
        ${locked ? feedback(question, selected) : ""}
        <div class="quiz-controls">
          ${mode === "exam" ? `<button class="quiz-button secondary" data-action="previous" ${index === 0 ? "disabled" : ""}>Previous</button>` : ""}
          ${mode === "study" && !locked ? `<button class="quiz-button" data-action="check" ${selected.length !== required ? "disabled" : ""}>Check answer</button>` : ""}
          ${(mode === "exam" || locked) && index < questions.length - 1 ? '<button class="quiz-button" data-action="next">Next question</button>' : ""}
          ${mode === "exam" || (locked && index === questions.length - 1) ? '<button class="quiz-button" data-action="finish">Finish attempt</button>' : ""}
        </div>
        ${confirming ? `<div class="quiz-notice" role="alert">
          <p>${questions.length - answered} unanswered question(s) will count as incorrect. Submit this attempt?</p>
          <button class="quiz-button" data-action="submit-exam">Submit attempt</button>
          <button class="quiz-button secondary" data-action="continue">Keep answering</button>
        </div>` : ""}
        <p id="quiz-answer-status">${mode === "exam" ? `${answered}/${questions.length} questions answered. Feedback is hidden until submission.` : "Answers lock after checking. Use the explanations to understand each distractor."}</p>
      `);
    }

    function resultsPage() {
      show(`
        <h1 tabindex="-1" data-focus>Attempt complete</h1>
        <p class="quiz-score">${result.correct}/${result.total} <span>(${percent(result.correct, result.total)}%)</span></p>
        <p>${escape(mode)}${retry ? " / missed-question retry" : ""} practice &middot; ${result.missed.length} missed or unanswered.</p>
        <p>This is a raw practice score, not the exam's scaled score. Consistent results on fresh exam-mode attempts and hands-on labs are more useful than memorizing this bank.</p>
        <h2>Domain breakdown</h2>
        <table><thead><tr><th>Domain</th><th>Correct</th><th>Practice accuracy</th></tr></thead>
          <tbody>${Object.entries(result.domains).map(([name, score]) => `<tr>
            <td>${escape(bank.domains[name].title)}</td><td>${score.correct}/${score.total}</td>
            <td>${percent(score.correct, score.total)}%</td>
          </tr>`).join("")}</tbody>
        </table>
        <div class="quiz-controls">
          <button class="quiz-button" data-action="restart">New randomized attempt</button>
          ${result.missed.length ? '<button class="quiz-button secondary" data-action="retry">Practice missed questions</button>' : ""}
        </div>
        <h2>Answer review</h2>
        <label class="quiz-review-filter"><input id="quiz-missed-only" type="checkbox" checked> Show only missed or unanswered questions</label>
        <div id="quiz-review">${questions.map((question, i) => `<details data-missed="${result.missed.includes(question.id)}" ${result.missed.includes(question.id) ? "" : "hidden"}>
          <summary>${i + 1}. ${escape(question.prompt)} - ${result.missed.includes(question.id) ? "Missed" : "Correct"}</summary>
          ${question.code ? `<pre><code>${escape(question.code)}</code></pre>` : ""}
          ${feedback(question, answers[question.id] || [])}
        </details>`).join("")}</div>
        ${!result.missed.length ? '<p>All answers were correct. Uncheck the filter to review every explanation.</p>' : ""}
      `);
    }

    function finish() {
      result = core.scoreSession(questions, answers);
      const attempt = {
        date: new Date().toISOString(), mode, domain, retry,
        correct: result.correct, total: result.total, domains: result.domains
      };
      history = [attempt, ...history].slice(0, 10);
      try {
        localStorage.setItem(storageKey, JSON.stringify(history));
        storageNotice = "";
      } catch (error) {
        storageFailure(error);
      }
      resultsPage();
    }

    function onSubmit(event) {
      if (event.target.id !== "quiz-setup") {
        return;
      }
      event.preventDefault();
      const form = event.target;
      mode = form.elements.mode.value;
      domain = form.elements.domain.value;
      questions = core.createSession(bank.questions, { domain, count: Number(form.elements.count.value) });
      answers = {};
      checked = new Set();
      index = 0;
      result = null;
      retry = false;
      confirming = false;
      questionPage();
    }

    function onChange(event) {
      if (event.target.closest("#quiz-setup")) {
        updateAvailable();
      } else if (event.target.name === "answer") {
        const question = questions[index];
        answers[question.id] = [...container.querySelectorAll('input[name="answer"]:checked')].map((input) => input.value);
        const check = container.querySelector('[data-action="check"]');
        if (check) {
          check.disabled = answers[question.id].length !== question.choices.filter((choice) => choice.correct).length;
        }
        if (mode === "exam") {
          const answered = questions.filter((q) => answers[q.id]?.length).length;
          container.querySelector("progress").value = answered;
          container.querySelector("#quiz-answer-status").textContent = `${answered}/${questions.length} questions answered. Feedback is hidden until submission.`;
        }
      } else if (event.target.id === "quiz-missed-only") {
        container.querySelectorAll("#quiz-review details").forEach((item) => {
          item.hidden = event.target.checked && item.dataset.missed !== "true";
        });
      }
    }

    function onClick(event) {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (!action) {
        return;
      }
      if (action === "check") {
        checked.add(questions[index].id);
        questionPage();
      } else if (action === "next" || action === "previous") {
        index += action === "next" ? 1 : -1;
        confirming = false;
        questionPage();
      } else if (action === "finish") {
        if (mode === "exam") {
          confirming = true;
          questionPage();
        } else {
          finish();
        }
      } else if (action === "submit-exam") {
        finish();
      } else if (action === "continue") {
        confirming = false;
        questionPage();
      } else if (action === "restart") {
        setup();
      } else if (action === "retry") {
        questions = core.createSession(bank.questions.filter((q) => result.missed.includes(q.id)), { count: result.missed.length });
        mode = "study";
        retry = true;
        answers = {};
        checked = new Set();
        index = 0;
        result = null;
        confirming = false;
        questionPage();
      } else if (action === "clear-history") {
        try {
          localStorage.removeItem(storageKey);
          history = [];
          storageNotice = "";
        } catch (error) {
          storageFailure(error);
        }
        setup();
      }
    }

    container.addEventListener("submit", onSubmit);
    container.addEventListener("change", onChange);
    container.addEventListener("click", onClick);
    setup();
    return () => {
      container.removeEventListener("submit", onSubmit);
      container.removeEventListener("change", onChange);
      container.removeEventListener("click", onClick);
    };
  }

  root.QuizUI = { mount };
})(globalThis);
