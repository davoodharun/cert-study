const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../site/quiz-core.js");
const bank = require("../site/gh-200-questions.js");

function seeded(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}

test("bank has 100 unique, complete original questions across all five domains", () => {
  assert.equal(bank.questions.length, 100);
  assert.equal(new Set(bank.questions.map((q) => q.id)).size, 100);
  assert.equal(new Set(bank.questions.map((q) => q.prompt)).size, 100);
  const counts = {};
  let multi = 0;
  for (const question of bank.questions) {
    counts[question.domain] = (counts[question.domain] || 0) + 1;
    assert.ok(bank.domains[question.domain]);
    assert.ok(question.topic.trim());
    assert.ok(question.prompt.trim());
    assert.equal(question.choices.length, 4);
    assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 4);
    assert.equal(new Set(question.choices.map((choice) => choice.text)).size, 4);
    const correct = question.choices.filter((choice) => choice.correct);
    assert.ok(correct.length >= 1 && correct.length < 4);
    multi += correct.length > 1 ? 1 : 0;
    for (const choice of question.choices) {
      assert.equal(typeof choice.correct, "boolean");
      assert.ok(choice.text.trim());
      assert.ok(choice.explanation.trim());
    }
    const url = new URL(question.reference);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "docs.github.com");
  }
  assert.deepEqual(counts, { workflows: 25, troubleshooting: 20, actions: 20, enterprise: 23, security: 12 });
  assert.ok(multi >= 20, "At least twenty multiple-answer questions");
  assert.ok(bank.questions.filter((q) => q.code).length >= 4, "Includes YAML interpretation");
});

test("all-domain sessions use proportional coverage, exact size, and no repeats", () => {
  for (const count of [10, 25, 50, 100]) {
    for (let seed = 1; seed <= 20; seed += 1) {
      const session = core.createSession(bank.questions, { count }, seeded(seed));
      assert.equal(session.length, count);
      assert.equal(new Set(session.map((q) => q.id)).size, count);
      for (const domain of Object.keys(bank.domains)) {
        const available = bank.questions.filter((q) => q.domain === domain).length;
        const drawn = session.filter((q) => q.domain === domain).length;
        assert.ok(Math.abs(drawn - count * available / 100) < 1);
      }
    }
  }
});

test("domain filtering clamps counts to availability and rejects invalid configuration", () => {
  for (const domain of Object.keys(bank.domains)) {
    const session = core.createSession(bank.questions, { domain, count: 100 });
    assert.ok(session.every((q) => q.domain === domain));
    assert.equal(session.length, bank.questions.filter((q) => q.domain === domain).length);
  }
  assert.throws(() => core.createSession(bank.questions, { domain: "unknown" }));
  for (const count of [0, -1, 1.5, NaN, "10"]) {
    assert.throws(() => core.createSession(bank.questions, { count }));
  }
  assert.throws(() => core.createSession([], { count: 10 }));
});

test("questions and choices shuffle without mutating the source or changing correctness", () => {
  const original = JSON.stringify(bank);
  const first = core.createSession(bank.questions, { count: 100 }, seeded(42));
  const second = core.createSession(bank.questions, { count: 100 }, seeded(99));
  assert.notDeepEqual(first.map((q) => q.id), second.map((q) => q.id));
  assert.ok(first.some((q) => {
    const originalQ = bank.questions.find((entry) => entry.id === q.id);
    return q.choices.map((choice) => choice.id).join() !== originalQ.choices.map((choice) => choice.id).join();
  }));
  for (const q of first) {
    const correct = bank.questions.find((entry) => entry.id === q.id).choices.filter((choice) => choice.correct).map((choice) => choice.id);
    assert.equal(core.isCorrect(q, correct), true);
  }
  assert.equal(JSON.stringify(bank), original);
});

test("exact-match scoring rejects blanks, distractors, partial multi answers, and duplicates", () => {
  for (const question of bank.questions) {
    const correct = question.choices.filter((choice) => choice.correct).map((choice) => choice.id);
    const wrong = question.choices.find((choice) => !choice.correct).id;
    assert.equal(core.isCorrect(question, correct), true);
    assert.equal(core.isCorrect(question, [...correct].reverse()), true);
    assert.equal(core.isCorrect(question), false);
    assert.equal(core.isCorrect(question, [wrong]), false);
    assert.equal(core.isCorrect(question, [...correct, wrong]), false);
    assert.equal(core.isCorrect(question, correct.slice(1)), false);
    assert.equal(core.isCorrect(question, [correct[0], correct[0]]), false);
    assert.equal(core.isCorrect(question, ["unknown"]), false);
  }
});

test("summary and per-domain totals reflect strict scores, including unanswered questions", () => {
  const questions = core.createSession(bank.questions, { count: 25 }, seeded(7));
  const answers = {};
  questions.forEach((q, index) => {
    if (index % 2 === 0) {
      answers[q.id] = q.choices.filter((choice) => choice.correct).map((choice) => choice.id);
    }
  });
  const result = core.scoreSession(questions, answers);
  assert.equal(result.correct, 13);
  assert.equal(result.total, 25);
  assert.equal(result.missed.length, 12);
  assert.deepEqual(result.missed, questions.filter((q, index) => index % 2 !== 0).map((q) => q.id));
  assert.equal(Object.values(result.domains).reduce((sum, value) => sum + value.total, 0), 25);
  assert.equal(Object.values(result.domains).reduce((sum, value) => sum + value.correct, 0), 13);
  assert.equal(core.scoreSession(questions, {}).correct, 0);
});

test("missed-question retry contains only missed IDs with a fresh choice shuffle", () => {
  const initial = core.createSession(bank.questions, { count: 10 }, seeded(11));
  const answers = { [initial[0].id]: initial[0].choices.filter((c) => c.correct).map((c) => c.id) };
  const result = core.scoreSession(initial, answers);
  const retry = core.createSession(bank.questions.filter((q) => result.missed.includes(q.id)), { count: result.missed.length }, seeded(18));
  assert.deepEqual(retry.map((q) => q.id).sort(), [...result.missed].sort());
  assert.equal(retry.length, 9);
});
