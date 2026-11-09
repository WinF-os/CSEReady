# CSE Ready

Civil Service Exam reviewer (Philippines) - Professional and Subprofessional. Vanilla-JS PWA, no build step.

- Built-in question bank (`bank.js`): hand-written Verbal, Analytical and General Information items plus generators for Numerical, series, vocabulary and Clerical items.
- Practice by subtest, timed mock exams (quick / half / full), mistake review, progress tracking.
- Optional AI generate: user pastes their own Gemini key (Profile); calls go straight from the browser to Google. No backend.
- All data stays in the browser (localStorage key `cseready-v1`).

Bump `CSE_VERSION` in `app.js` and `CACHE_NAME` in `sw.js` together on every change.
Independent study aid, not affiliated with the Civil Service Commission.
