/* CSE Ready - Civil Service Exam reviewer. Vanilla JS, no build step. */
(function () {
  'use strict';

  var CSE_VERSION = 'v1.00.01';
  var GEMINI_MODEL = 'gemini-3.1-flash-lite';
  var STORE = 'cseready-v1';
  var B = window.CSEBank;

  /* ---------- storage ---------- */
  var defaults = { showCorrect: true, level: null, theme: 'auto', key: '', history: [], areaStats: {}, topicStats: {}, mistakes: [], days: [], answered: 0, correct: 0 };
  var S = load();
  function load() {
    try { var r = JSON.parse(localStorage.getItem(STORE)); if (r && typeof r === 'object') return Object.assign({}, defaults, r); } catch (e) {}
    return Object.assign({}, defaults);
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function pct(c, t) { return t ? Math.round(c * 100 / t) : 0; }
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function lvl() { return B.LEVELS[S.level || 'pro']; }

  /* ---------- theme ---------- */
  function applyTheme() {
    if (S.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', S.theme);
    $$('#themeSeg button').forEach(function (b) { b.classList.toggle('on', b.dataset.theme === S.theme); });
  }

  /* ---------- navigation ---------- */
  var current = 'home';
  function go(name) {
    if (name === 'mock' && quiz && quiz.mode === 'mock') { /* leaving a running mock is handled by Exit */ }
    current = name;
    $$('.screen').forEach(function (s) { s.hidden = s.id !== 'screen-' + name; });
    $$('.bottom-nav button').forEach(function (b) { b.classList.toggle('on', b.dataset.go === name || (name === 'quiz' && false)); });
    if (name === 'home') renderHome();
    if (name === 'practice') renderPractice();
    if (name === 'mock') renderMock();
    if (name === 'progress') renderProgress();
    if (name === 'profile') renderProfile();
    window.scrollTo(0, 0);
  }

  /* ---------- stats ---------- */
  function streak() {
    var set = {}; S.days.forEach(function (d) { set[d] = 1; });
    var d = new Date(), n = 0;
    if (!set[today()]) d.setDate(d.getDate() - 1);   // streak survives until end of today
    for (;;) {
      var k = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      if (set[k]) { n++; d.setDate(d.getDate() - 1); } else break;
    }
    return n;
  }
  function recordAnswer(q, correct) {
    S.answered++; if (correct) S.correct++;
    var a = S.areaStats[q.area] = S.areaStats[q.area] || { c: 0, t: 0 };
    a.t++; if (correct) a.c++;
    var key = q.area + ' / ' + q.topic;
    var t = S.topicStats[key] = S.topicStats[key] || { c: 0, t: 0 };
    t.t++; if (correct) t.c++;
    var td = today(); if (S.days.indexOf(td) < 0) { S.days.push(td); if (S.days.length > 400) S.days.shift(); }
  }
  function addMistake(q) {
    var sig = q.q + '|' + q.choices[q.a];
    S.mistakes = S.mistakes.filter(function (m) { return m.q + '|' + m.choices[m.a] !== sig; });
    S.mistakes.unshift(q);
    if (S.mistakes.length > 200) S.mistakes.length = 200;
  }
  function clearMistake(q) {
    var sig = q.q + '|' + q.choices[q.a];
    S.mistakes = S.mistakes.filter(function (m) { return m.q + '|' + m.choices[m.a] !== sig; });
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    var L = lvl();
    $('levelChip').textContent = L.label;
    $('homeLevelDesc').textContent = L.label + ' level - ' + L.desc;
    $('statStreak').textContent = streak();
    $('statAnswered').textContent = S.answered;
    $('statAccuracy').textContent = pct(S.correct, S.answered) + '%';
    $('homeAreas').innerHTML = L.areas.map(function (a) {
      var st = S.areaStats[a] || { c: 0, t: 0 }, p = pct(st.c, st.t);
      return '<button class="area-tile" data-area="' + a + '" type="button"><div class="ico">' + B.AREAS[a].icon + '</div><b>' + B.AREAS[a].label + '</b>' +
        '<span>' + (st.t ? p + '% - ' + st.t + ' answered' : 'Not started') + '</span><div class="bar"><i style="width:' + p + '%"></i></div></button>';
    }).join('');
    $$('#homeAreas .area-tile').forEach(function (t) {
      t.onclick = function () { practiceCfg.area = t.dataset.area; go('practice'); };
    });
    $('homeReview').hidden = !S.mistakes.length;
    $('homeReviewCount').textContent = S.mistakes.length;
  }

  /* ---------- PRACTICE ---------- */
  var practiceCfg = { area: null, count: 10, source: 'bank', timed: false };
  function renderPractice() {
    var L = lvl();
    if (!practiceCfg.area || L.areas.indexOf(practiceCfg.area) < 0 && practiceCfg.area !== 'mixed') practiceCfg.area = 'mixed';
    var opts = L.areas.concat(['mixed']);
    $('practiceAreas').innerHTML = opts.map(function (a) {
      return '<button type="button" data-a="' + a + '" class="' + (practiceCfg.area === a ? 'on' : '') + '">' + (a === 'mixed' ? 'Mixed' : B.AREAS[a].label) + '</button>';
    }).join('');
    $$('#practiceAreas button').forEach(function (b) { b.onclick = function () { practiceCfg.area = b.dataset.a; renderPractice(); }; });
    $('practiceCount').innerHTML = [10, 20, 30, 50].map(function (n) {
      return '<button type="button" data-n="' + n + '" class="' + (practiceCfg.count === n ? 'on' : '') + '">' + n + '</button>';
    }).join('');
    $$('#practiceCount button').forEach(function (b) { b.onclick = function () { practiceCfg.count = +b.dataset.n; renderPractice(); }; });
    $$('#practiceSource button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.source === practiceCfg.source);
      b.onclick = function () { practiceCfg.source = b.dataset.source; renderPractice(); };
    });
    $('practiceTimed').checked = practiceCfg.timed;
    $('practiceShowCorrect').checked = S.showCorrect;
    var note = $('aiNote');
    if (practiceCfg.source === 'ai') {
      note.hidden = false;
      note.textContent = S.key ? 'AI will write fresh ' + (practiceCfg.area === 'mixed' ? 'mixed' : B.AREAS[practiceCfg.area].label) + ' questions in the CSE style. Check important facts against official sources.' : 'AI generate needs your free Gemini API key. Add it in Profile.';
    } else note.hidden = true;
  }
  $('practiceShowCorrect').onchange = function () { S.showCorrect = this.checked; save(); };
  $('practiceTimed').onchange = function () { practiceCfg.timed = this.checked; };
  $('startPractice').onclick = function () {
    var L = lvl(), n = practiceCfg.count, area = practiceCfg.area;
    var areas = area === 'mixed' ? L.areas : [area];
    if (practiceCfg.source === 'ai') {
      if (!S.key) { toast('Add your Gemini key in Profile first'); return; }
      var btn = $('startPractice'); btn.disabled = true; btn.textContent = 'Writing questions...';
      generateAI(S.level, areas, n).then(function (qs) {
        btn.disabled = false; btn.textContent = 'Start practice';
        if (!qs.length) { toast('AI returned no usable questions. Try again.'); return; }
        startQuiz({ mode: 'practice', title: 'AI practice', qs: qs, seconds: practiceCfg.timed ? qs.length * 60 : 0 });
      }).catch(function (e) {
        btn.disabled = false; btn.textContent = 'Start practice';
        toast(e && e.message ? e.message : 'AI request failed');
      });
      return;
    }
    var per = Math.ceil(n / areas.length), qs = [];
    areas.forEach(function (a) { qs = qs.concat(B.getQuestions(S.level, a, per)); });
    qs = B.shuffle(qs).slice(0, n);
    if (!qs.length) { toast('No questions available'); return; }
    startQuiz({ mode: 'practice', title: area === 'mixed' ? 'Mixed practice' : B.AREAS[area].label + ' practice', qs: qs, seconds: practiceCfg.timed ? qs.length * 60 : 0 });
  };

  /* ---------- AI generation (BYOK, called straight from the browser) ---------- */
  var AREA_PROMPTS = {
    verbal: 'Verbal Ability: vocabulary (synonyms/antonyms), grammar and correct usage, sentence completion, paragraph organization, reading comprehension (include the short passage inside the question text).',
    numerical: 'Numerical Ability: arithmetic, fractions, decimals, percentages, ratio and proportion, averages, word problems, simple interest, basic algebra and geometry.',
    analytical: 'Analytical Ability: number and letter series, logic puzzles, syllogisms, analogies, ordering and coding-decoding problems.',
    general: 'General Information: the 1987 Philippine Constitution, RA 6713 (Code of Conduct and Ethical Standards), peace and human rights, environment management and protection, and basic Philippine government/civil service facts.',
    clerical: 'Clerical Operations: alphabetical and numerical filing, spelling, number/name checking, and basic office arithmetic.'
  };
  function generateAI(level, areas, n) {
    var L = B.LEVELS[level];
    var per = Math.ceil(n / areas.length);
    var coverage = areas.map(function (a) { return '- ' + AREA_PROMPTS[a] + ' (about ' + per + ' questions, area key "' + a + '")'; }).join('\n');
    var prompt = 'You are writing practice questions for the Philippine Civil Service Commission Career Service Examination, ' + L.label + ' level.\n' +
      'Write exactly ' + n + ' multiple-choice questions with 4 choices each and exactly one correct answer, in the style of the real exam, covering:\n' + coverage + '\n' +
      'Rules: be factually accurate and Philippine-specific where relevant; no trick wording; numerical items must have unambiguous answers; keep each explanation to 1-2 sentences showing why the answer is right. Set "area" to one of the area keys given.';
    var body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              area: { type: 'STRING' }, topic: { type: 'STRING' }, question: { type: 'STRING' },
              choices: { type: 'ARRAY', items: { type: 'STRING' } },
              answerIndex: { type: 'INTEGER' }, explanation: { type: 'STRING' }
            },
            required: ['area', 'topic', 'question', 'choices', 'answerIndex', 'explanation']
          }
        }
      }
    };
    return fetch('https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + encodeURIComponent(S.key), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) {
          var m = (j && j.error && j.error.message) || ('Request failed (' + r.status + ')');
          if (r.status === 400 || r.status === 403) m = 'Gemini rejected the request. Check your API key in Profile.';
          if (r.status === 429) m = 'Gemini rate limit reached. Wait a minute and try again.';
          throw new Error(m);
        }
        return j;
      });
    }).then(function (j) {
      var txt = j.candidates && j.candidates[0] && j.candidates[0].content.parts[0].text;
      var arr = JSON.parse(txt);
      var out = [];
      arr.forEach(function (x, i) {
        if (!x || !x.question || !Array.isArray(x.choices) || x.choices.length < 2) return;
        var ai = +x.answerIndex; if (!(ai >= 0 && ai < x.choices.length)) return;
        var area = areas.indexOf(x.area) >= 0 ? x.area : areas[i % areas.length];
        // shuffle choices so the correct answer isn't always in the same slot
        var correct = String(x.choices[ai]), ch = B.shuffle(x.choices.map(String));
        out.push({ id: 'ai-' + Date.now() + '-' + i, levels: [level], area: area, topic: x.topic || 'AI generated', q: String(x.question), choices: ch, a: ch.indexOf(correct), exp: x.explanation || '', ai: true });
      });
      return out.slice(0, n);
    });
  }

  /* ---------- MOCK ---------- */
  function renderMock() {
    var L = lvl();
    $('mockInfo').textContent = L.label + ' mock exams follow the real subtest mix. The full exam is about ' + L.fullItems + ' items in ' + Math.floor(L.fullMinutes / 60) + 'h ' + (L.fullMinutes % 60) + 'm.';
    var opts = [
      { n: 40, name: 'Quick mock', f: 40 / L.fullItems }, { n: 85, name: 'Half mock', f: 85 / L.fullItems }, { n: L.fullItems, name: 'Full mock exam', f: 1 }
    ];
    $('mockOptions').innerHTML = opts.map(function (o, i) {
      var min = Math.round(L.fullMinutes * o.f);
      return '<button class="mock-opt" data-i="' + i + '" type="button"><b>' + o.name + '</b><span>' + o.n + ' items - ' + min + ' minutes</span></button>';
    }).join('');
    $$('#mockOptions .mock-opt').forEach(function (b) {
      b.onclick = function () {
        var o = opts[+b.dataset.i], qs = [], used = 0;
        L.areas.forEach(function (a, idx) {
          var cnt = idx === L.areas.length - 1 ? o.n - used : Math.round(o.n * L.mix[a]);
          used += cnt; qs = qs.concat(B.getQuestions(S.level, a, cnt));
        });
        qs = qs.slice(0, o.n);
        startQuiz({ mode: 'mock', title: o.name, qs: qs, seconds: Math.round(L.fullMinutes * o.f * 60) });
      };
    });
  }

  /* ---------- QUIZ ---------- */
  var quiz = null, timerId = null;
  function startQuiz(cfg) {
    quiz = { mode: cfg.mode, title: cfg.title, qs: cfg.qs, idx: 0, ans: cfg.qs.map(function () { return -1; }), flags: cfg.qs.map(function () { return false; }),
      seconds: cfg.seconds || 0, left: cfg.seconds || 0, started: Date.now(), cfg: cfg };
    go('quiz');
    $$('.bottom-nav button').forEach(function (b) { b.classList.remove('on'); });
    $('quizMap').hidden = quiz.mode !== 'mock';
    $('quizFlag').hidden = quiz.mode !== 'mock';
    $('quizPrev').hidden = quiz.mode !== 'mock';
    clearInterval(timerId);
    var tm = $('quizTimer');
    if (quiz.seconds) {
      tm.hidden = false; tick();
      timerId = setInterval(function () { quiz.left--; tick(); if (quiz.left <= 0) { clearInterval(timerId); toast('Time is up'); finishQuiz(); } }, 1000);
    } else tm.hidden = true;
    renderQ();
  }
  function tick() {
    var m = Math.floor(Math.max(0, quiz.left) / 60), s = Math.max(0, quiz.left) % 60;
    var tm = $('quizTimer'); tm.textContent = m + ':' + ('0' + s).slice(-2);
    tm.classList.toggle('low', quiz.left <= 60);
  }
  function renderQ() {
    var q = quiz.qs[quiz.idx], practice = quiz.mode !== 'mock', answered = quiz.ans[quiz.idx] >= 0;
    $('quizBar').style.width = ((quiz.idx + (answered ? 1 : 0)) / quiz.qs.length * 100) + '%';
    $('quizMeta').textContent = quiz.title + ' - Question ' + (quiz.idx + 1) + ' of ' + quiz.qs.length + ' - ' + B.AREAS[q.area].label + ' / ' + q.topic;
    $('quizQuestion').textContent = q.q;
    var locked = practice && answered;
    $('quizChoices').innerHTML = q.choices.map(function (c, i) {
      var cls = 'choice';
      if (locked) {
        var pickedRight = quiz.ans[quiz.idx] === q.a;
        if (i === quiz.ans[quiz.idx]) cls += pickedRight ? ' right' : ' wrong';
        else if (i === q.a && S.showCorrect) cls += ' right';
      }
      else if (quiz.ans[quiz.idx] === i) cls += ' sel';
      return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (locked ? ' disabled' : '') + '><span class="k">' + 'ABCD'[i] + '</span><span>' + esc(c) + '</span></button>';
    }).join('');
    $$('#quizChoices .choice').forEach(function (b) { b.onclick = function () { pickChoice(+b.dataset.i); }; });
    var fb = $('quizFeedback');
    if (locked) {
      var ok = quiz.ans[quiz.idx] === q.a;
      fb.hidden = false;
      if (ok) fb.innerHTML = '<b class="ok">Correct!</b><br>' + esc(q.exp || '');
      else if (S.showCorrect) fb.innerHTML = '<b class="no">Not quite. Answer: ' + 'ABCD'[q.a] + '</b><br>' + esc(q.exp || '');
      else fb.innerHTML = '<b class="no">Incorrect.</b> Your answer is locked. The correct answer is shown in the results.';
    } else fb.hidden = true;
    var last = quiz.idx === quiz.qs.length - 1;
    var nb = $('quizNext');
    nb.textContent = last ? 'Finish' : 'Next';
    nb.disabled = practice && !answered;
    $('quizPrev').disabled = quiz.idx === 0;
    $('quizFlag').classList.toggle('flagged', quiz.flags[quiz.idx]);
    $('quizFlag').textContent = quiz.flags[quiz.idx] ? 'Flagged' : 'Flag';
    if (quiz.mode === 'mock') renderMap();
  }
  function renderMap() {
    $('quizMap').innerHTML = quiz.qs.map(function (_, i) {
      var c = (quiz.ans[i] >= 0 ? ' done' : '') + (quiz.flags[i] ? ' flag' : '') + (i === quiz.idx ? ' cur' : '');
      return '<button type="button" class="' + c.trim() + '" data-i="' + i + '">' + (i + 1) + '</button>';
    }).join('');
    $$('#quizMap button').forEach(function (b) { b.onclick = function () { quiz.idx = +b.dataset.i; renderQ(); }; });
  }
  function pickChoice(i) {
    if (quiz.mode !== 'mock' && quiz.ans[quiz.idx] >= 0) return;
    quiz.ans[quiz.idx] = i;
    renderQ();
  }
  $('quizNext').onclick = function () {
    if (quiz.idx < quiz.qs.length - 1) { quiz.idx++; renderQ(); window.scrollTo(0, 0); return; }
    if (quiz.mode === 'mock') {
      var un = quiz.ans.filter(function (a) { return a < 0; }).length;
      if (un && !confirm(un + ' question(s) are unanswered. Finish anyway?')) return;
    }
    finishQuiz();
  };
  $('quizPrev').onclick = function () { if (quiz.idx > 0) { quiz.idx--; renderQ(); } };
  $('quizFlag').onclick = function () { quiz.flags[quiz.idx] = !quiz.flags[quiz.idx]; renderQ(); };
  $('quizExit').onclick = function () {
    if (!confirm('Leave this session? Your answers so far will not be saved.')) return;
    clearInterval(timerId); quiz = null; go('home');
  };
  document.addEventListener('keydown', function (e) {
    if (current !== 'quiz' || !quiz) return;
    var k = e.key.toLowerCase(), i = 'abcd'.indexOf(k);
    if (i >= 0 && i < quiz.qs[quiz.idx].choices.length) pickChoice(i);
    else if (e.key === 'Enter' && !$('quizNext').disabled) $('quizNext').click();
  });

  /* ---------- RESULT ---------- */
  var lastResult = null;
  function finishQuiz() {
    clearInterval(timerId);
    var q = quiz, correct = 0, byArea = {};
    q.qs.forEach(function (item, i) {
      var answered = q.ans[i] >= 0, ok = q.ans[i] === item.a;
      if (!answered) return;              // unanswered items don't count toward accuracy stats, but do count against the score
      recordAnswer(item, ok);
      if (ok) { correct++; if (q.mode === 'review') clearMistake(item); } else addMistake(item);
    });
    q.qs.forEach(function (item, i) {
      var a = byArea[item.area] = byArea[item.area] || { c: 0, t: 0 };
      a.t++; if (q.ans[i] === item.a) a.c++;
    });
    var secs = Math.round((Date.now() - q.started) / 1000);
    S.history.unshift({ ts: Date.now(), mode: q.mode, title: q.title, total: q.qs.length, correct: correct, secs: secs });
    if (S.history.length > 60) S.history.length = 60;
    save();
    lastResult = { quiz: q, correct: correct, byArea: byArea };
    quiz = null;
    renderResult();
    current = 'result';
    $$('.screen').forEach(function (s) { s.hidden = s.id !== 'screen-result'; });
    window.scrollTo(0, 0);
  }
  var reviewFilter = 'all';
  function renderResult() {
    var r = lastResult, q = r.quiz, p = pct(r.correct, q.qs.length), pass = p >= 80;
    $('resultRing').style.setProperty('--p', p);
    $('resultRing').style.setProperty('--ringc', pass ? 'var(--success)' : 'var(--accent)');
    $('resultPct').textContent = p + '%';
    $('resultTitle').textContent = r.correct + ' / ' + q.qs.length + ' correct';
    $('resultSub').textContent = pass ? 'Above the 80% passing mark. Keep it up.' : 'The passing mark is 80%. Review your mistakes below and try again.';
    $('resultAreas').innerHTML = Object.keys(r.byArea).map(function (a) {
      var x = r.byArea[a];
      return '<div class="arow"><span>' + B.AREAS[a].label + '</span><b>' + x.c + '/' + x.t + ' (' + pct(x.c, x.t) + '%)</b></div><div class="bar"><i style="width:' + pct(x.c, x.t) + '%"></i></div>';
    }).join('');
    $$('#reviewFilter button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.f === reviewFilter);
      b.onclick = function () { reviewFilter = b.dataset.f; renderResult(); };
    });
    $('resultReview').innerHTML = q.qs.map(function (item, i) {
      var ok = q.ans[i] === item.a;
      if (reviewFilter === 'wrong' && ok) return '';
      if (reviewFilter === 'flag' && !q.flags[i]) return '';
      return '<div class="review-item ' + (ok ? 'ok' : 'no') + '"><p class="q"><span class="tag">' + (i + 1) + '</span>' + esc(item.q) + '</p>' +
        '<p>Your answer: <b>' + (q.ans[i] >= 0 ? esc(item.choices[q.ans[i]]) : 'No answer') + '</b></p>' +
        (ok ? '' : '<p>Correct answer: <b>' + esc(item.choices[item.a]) + '</b></p>') +
        (item.exp ? '<p class="exp">' + esc(item.exp) + '</p>' : '') + '</div>';
    }).join('') || '<p class="empty">Nothing to show for this filter.</p>';
  }
  $('resultRetry').onclick = function () {
    var c = lastResult.quiz.cfg;
    if (c.mode === 'review') return startReview();
    if (c.mode === 'mock') { go('mock'); return; }
    // practice: fresh questions for the same setup (AI sessions get a fresh request)
    go('practice'); $('startPractice').click();
  };
  $('resultHome').onclick = function () { go('home'); };

  /* ---------- PROGRESS ---------- */
  function renderProgress() {
    var L = lvl();
    $('progressAreas').innerHTML = L.areas.map(function (a) {
      var st = S.areaStats[a] || { c: 0, t: 0 }, p = pct(st.c, st.t);
      return '<div class="arow"><span>' + B.AREAS[a].label + '</span><b>' + (st.t ? p + '% (' + st.c + '/' + st.t + ')' : 'No data') + '</b></div><div class="bar"><i style="width:' + p + '%"></i></div>';
    }).join('');
    $('progressHistory').innerHTML = S.history.length ? S.history.slice(0, 10).map(function (h) {
      var d = new Date(h.ts);
      return '<div class="hist-row"><span>' + esc(h.title) + '<br><small class="muted">' + d.toLocaleDateString() + '</small></span><b>' + h.correct + '/' + h.total + ' (' + pct(h.correct, h.total) + '%)</b></div>';
    }).join('') : '<p class="empty">No sessions yet. Try a practice set.</p>';
    var topics = Object.keys(S.topicStats).map(function (k) { var t = S.topicStats[k]; return { k: k, p: pct(t.c, t.t), t: t.t, c: t.c }; })
      .filter(function (x) { return x.t >= 3; }).sort(function (a, b) { return a.p - b.p; }).slice(0, 6);
    $('progressTopics').innerHTML = topics.length ? topics.map(function (x) {
      return '<div class="hist-row"><span>' + esc(x.k) + '</span><b>' + x.p + '% (' + x.c + '/' + x.t + ')</b></div>';
    }).join('') : '<p class="empty">Answer a few more questions to see your weak spots.</p>';
    $('reviewCount').textContent = S.mistakes.length;
    $('reviewStart').disabled = !S.mistakes.length;
  }
  function startReview() {
    if (!S.mistakes.length) { toast('No saved mistakes'); return; }
    var qs = B.shuffle(S.mistakes.slice()).slice(0, 20).map(function (m) {
      var ch = B.shuffle(m.choices.slice()), correct = m.choices[m.a];
      return Object.assign({}, m, { choices: ch, a: ch.indexOf(correct) });
    });
    startQuiz({ mode: 'review', title: 'Mistake review', qs: qs, seconds: 0 });
  }
  $('reviewStart').onclick = startReview;
  $('homeReviewBtn').onclick = startReview;

  /* ---------- PROFILE ---------- */
  function renderProfile() {
    $('profileLevel').innerHTML = ['pro', 'sub'].map(function (k) {
      return '<button type="button" data-l="' + k + '" class="' + (S.level === k ? 'on' : '') + '">' + B.LEVELS[k].label + '</button>';
    }).join('');
    $$('#profileLevel button').forEach(function (b) { b.onclick = function () { setLevel(b.dataset.l); renderProfile(); toast('Level set to ' + B.LEVELS[b.dataset.l].label); }; });
    $('keyInput').value = '';
    $('keyStatus').textContent = S.key ? 'A key is saved on this device (ends with ' + S.key.slice(-4) + ').' : 'No key saved.';
    $('versionText').textContent = CSE_VERSION;
    applyTheme();
  }
  function setLevel(l) { S.level = l; practiceCfg.area = null; save(); $('levelChip').textContent = lvl().label; }
  $$('#themeSeg button').forEach(function (b) { b.onclick = function () { S.theme = b.dataset.theme; save(); applyTheme(); }; });
  $('keySave').onclick = function () {
    var v = $('keyInput').value.trim();
    if (v.length < 20) { toast('That does not look like a full API key'); return; }
    S.key = v; save(); renderProfile(); toast('Key saved');
  };
  $('keyClear').onclick = function () { S.key = ''; save(); renderProfile(); toast('Key removed'); };
  $('resetData').onclick = function () {
    if (!confirm('Erase all progress, history and saved mistakes on this device?')) return;
    var keep = { level: S.level, theme: S.theme, key: S.key };
    S = Object.assign({}, defaults, keep); save(); renderProfile(); toast('Progress reset');
  };

  /* ---------- level modal ---------- */
  function showLevelModal() { $('levelModal').hidden = false; }
  $$('#levelModal .level-btn').forEach(function (b) {
    b.onclick = function () { setLevel(b.dataset.level); $('levelModal').hidden = true; go('home'); };
  });
  $('levelChip').onclick = showLevelModal;

  /* ---------- nav wiring ---------- */
  $$('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (quiz && !confirm('Leave this session? Your answers so far will not be saved.')) return;
      if (quiz) { clearInterval(timerId); quiz = null; }
      go(b.dataset.go);
    });
  });

  /* ---------- PWA + update flow (mirrors Winfinity / sQUIZit) ---------- */
  var swReg = null;
  function setupSW() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      swReg = reg;
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate();
      reg.addEventListener('updatefound', function () {
        var w = reg.installing;
        if (w) w.addEventListener('statechange', function () { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdate(); });
      });
    }).catch(function () {});
    var reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (reloaded) return; reloaded = true; location.reload(); });
  }
  function showUpdate() { $('updateStatus').textContent = 'A new version is ready.'; $('updateApply').hidden = false; toast('Update available - see Profile'); }
  $('updateCheck').onclick = function () {
    if (!swReg) { toast('Updates are checked when installed as an app'); return; }
    $('updateStatus').textContent = 'Checking...';
    swReg.update().then(function () {
      setTimeout(function () {
        if (swReg.waiting) showUpdate(); else $('updateStatus').innerHTML = 'You are on the latest version (' + CSE_VERSION + ').';
      }, 1200);
    }).catch(function () { $('updateStatus').textContent = 'Could not check. Are you offline?'; });
  };
  $('updateApply').onclick = function () { if (swReg && swReg.waiting) swReg.waiting.postMessage('SKIP_WAITING'); };

  /* ---------- boot ---------- */
  $('versionTag').textContent = CSE_VERSION;
  applyTheme();
  setupSW();
  if (!S.level) { go('home'); showLevelModal(); } else go('home');
})();
