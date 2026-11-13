(function (root) {
  "use strict";

  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createSession(bank, { domain = "all", count = 25 } = {}, random = Math.random) {
    const eligible = bank.filter((question) => domain === "all" || question.domain === domain);
    if (!Number.isInteger(count) || count < 1 || !eligible.length) {
      throw new Error("Choose a positive question count and an available domain.");
    }
    const size = Math.min(count, eligible.length);
    const groups = [...new Set(eligible.map((question) => question.domain))].map((name) => {
      const questions = shuffle(eligible.filter((question) => question.domain === name), random);
      const quota = size * questions.length / eligible.length;
      return { questions, count: Math.floor(quota), remainder: quota % 1 };
    });
    let remaining = size - groups.reduce((sum, group) => sum + group.count, 0);
    for (const group of [...groups].sort((a, b) => b.remainder - a.remainder)) {
      if (remaining > 0) {
        group.count += 1;
        remaining -= 1;
      }
    }
    return shuffle(groups.flatMap((group) => group.questions.slice(0, group.count)), random)
      .map((question) => ({ ...question, choices: shuffle(question.choices, random) }));
  }

  function isCorrect(question, selected = []) {
    const expected = question.choices.filter((choice) => choice.correct).map((choice) => choice.id);
    return selected.length === expected.length &&
      new Set(selected).size === selected.length &&
      expected.every((id) => selected.includes(id));
  }

  function scoreSession(questions, answers) {
    const domains = {};
    const missed = [];
    let correct = 0;
    for (const question of questions) {
      const result = isCorrect(question, answers[question.id] || []);
      domains[question.domain] ||= { correct: 0, total: 0 };
      domains[question.domain].total += 1;
      if (result) {
        correct += 1;
        domains[question.domain].correct += 1;
      } else {
        missed.push(question.id);
      }
    }
    return { correct, total: questions.length, domains, missed };
  }

  const api = { shuffle, createSession, isCorrect, scoreSession };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.QuizCore = api;
  }
})(globalThis);
