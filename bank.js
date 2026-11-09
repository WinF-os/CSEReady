/* CSE Ready - built-in question bank + generators.
   Hand-written items live in HAND_*; endless numerical/series/clerical/vocab
   items are generated with guaranteed-correct answers.
   Item shape: { id, levels:['pro','sub'], area, topic, q, choices[], a (index), exp } */
(function () {
  'use strict';

  var BOTH = ['pro', 'sub'], PRO = ['pro'], SUB = ['sub'];

  /* ---------- tiny helpers ---------- */
  function rnd(n) { return Math.floor(Math.random() * n); }
  function ri(a, b) { return a + rnd(b - a + 1); }
  function pick(arr) { return arr[rnd(arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function uniq(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); }
  function fmt(n) {
    if (typeof n !== 'number') return String(n);
    if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
    return String(Math.round(n * 100) / 100);
  }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  /* Build a question; choices = correct + wrongs, shuffled, `a` = index of correct. */
  function mk(id, levels, area, topic, q, correct, wrongs, exp) {
    var ws = uniq(wrongs.map(String)).filter(function (w) { return w !== String(correct); });
    var ch = shuffle([String(correct)].concat(ws.slice(0, 3)));
    return { id: id, levels: levels, area: area, topic: topic, q: q, choices: ch, a: ch.indexOf(String(correct)), exp: exp || '' };
  }

  /* numeric distractors close to the right answer */
  function numWrongs(ans, step) {
    step = step || Math.max(1, Math.round(Math.abs(ans) * 0.1));
    var c = [ans + step, ans - step, ans + 2 * step, ans - 2 * step, ans + 3 * step, ans * 2, ans + 1, ans - 1];
    c = uniq(c.map(fmt)).filter(function (v) { return v !== fmt(ans); });
    return shuffle(c).slice(0, 3);
  }

  /* =====================================================================
     HAND-WRITTEN: GENERAL INFORMATION
     ===================================================================== */
  var G = [];
  function g(levels, topic, q, a, w, exp) { G.push([levels, topic, q, a, w, exp]); }

  // --- 1987 Constitution
  g(BOTH, 'Constitution', 'Under the 1987 Constitution, how many years is the term of the President of the Philippines?', 'Six years, without reelection', ['Four years, with one reelection', 'Six years, with one reelection', 'Five years, without reelection'], 'Art. VII, Sec. 4: the President serves six years and is not eligible for reelection.');
  g(BOTH, 'Constitution', 'How many members does the Philippine Senate have?', '24', ['12', '27', '250'], 'Art. VI, Sec. 2: the Senate is composed of twenty-four Senators elected at large.');
  g(BOTH, 'Constitution', 'A Senator may serve for how many consecutive terms?', 'Two consecutive six-year terms', ['One six-year term only', 'Three consecutive six-year terms', 'Two consecutive three-year terms'], 'Art. VI, Sec. 4: no Senator shall serve for more than two consecutive terms.');
  g(BOTH, 'Constitution', 'Members of the House of Representatives may serve for at most how many consecutive terms?', 'Three terms of three years each', ['Two terms of six years each', 'Two terms of three years each', 'Unlimited terms'], 'Art. VI, Sec. 7: three consecutive terms, each of three years.');
  g(BOTH, 'Constitution', 'What is the minimum age to be elected President of the Philippines?', '40 years old', ['35 years old', '45 years old', '30 years old'], 'Art. VII, Sec. 2: at least forty years of age on the day of the election.');
  g(BOTH, 'Constitution', 'What is the minimum age to be elected Senator?', '35 years old', ['25 years old', '40 years old', '30 years old'], 'Art. VI, Sec. 3: at least thirty-five years of age on the day of the election.');
  g(BOTH, 'Constitution', 'The Supreme Court is composed of a Chief Justice and how many Associate Justices?', '14', ['10', '12', '16'], 'Art. VIII, Sec. 4: a Chief Justice and fourteen Associate Justices, 15 members in all.');
  g(BOTH, 'Constitution', 'Which of the following is NOT a Constitutional Commission?', 'Commission on Higher Education', ['Civil Service Commission', 'Commission on Elections', 'Commission on Audit'], 'Art. IX created the CSC, COMELEC and COA. CHED is created by statute, not by Art. IX.');
  g(BOTH, 'Constitution', 'The Civil Service Commission is composed of a Chairman and how many Commissioners?', 'Two', ['One', 'Four', 'Six'], 'Art. IX-B, Sec. 1: a Chairman and two Commissioners.');
  g(BOTH, 'Constitution', 'What is the term of office of the CSC Chairman and Commissioners?', 'Seven years, without reappointment', ['Six years, with reappointment', 'Five years, with reappointment', 'Seven years, with one reappointment'], 'Art. IX-B, Sec. 1: seven years without reappointment for the Chairman; the Commissioners\' terms are staggered.');
  g(BOTH, 'Constitution', 'Which Article of the 1987 Constitution is the Bill of Rights?', 'Article III', ['Article I', 'Article II', 'Article VII'], 'Article III contains the Bill of Rights.');
  g(BOTH, 'Constitution', 'Which Article of the 1987 Constitution contains the Declaration of Principles and State Policies?', 'Article II', ['Article I', 'Article III', 'Article IV'], 'Article II is the Declaration of Principles and State Policies.');
  g(BOTH, 'Constitution', 'According to the Constitution, sovereignty resides in:', 'The people', ['The President', 'Congress', 'The Supreme Court'], 'Art. II, Sec. 1: sovereignty resides in the people and all government authority emanates from them.');
  g(BOTH, 'Constitution', 'Which body has the exclusive power to initiate all cases of impeachment?', 'House of Representatives', ['Senate', 'Supreme Court', 'Office of the Ombudsman'], 'Art. XI, Sec. 3: the House initiates; the Senate has the sole power to try and decide.');
  g(BOTH, 'Constitution', 'Which body has the sole power to try and decide all cases of impeachment?', 'Senate', ['House of Representatives', 'Supreme Court', 'Sandiganbayan'], 'Art. XI, Sec. 3(6): the Senate tries and decides impeachment cases.');
  g(BOTH, 'Constitution', 'Who is the Commander-in-Chief of all armed forces of the Philippines?', 'The President', ['The Secretary of National Defense', 'The Chief of Staff of the AFP', 'The Senate President'], 'Art. VII, Sec. 18.');
  g(BOTH, 'Constitution', 'The national language of the Philippines is:', 'Filipino', ['Tagalog', 'English', 'Cebuano'], 'Art. XIV, Sec. 6: the national language is Filipino.');
  g(BOTH, 'Constitution', 'What is the minimum voting age in the Philippines?', '18 years old', ['16 years old', '21 years old', '17 years old'], 'Art. V, Sec. 1: citizens at least eighteen years of age, residing in the Philippines for at least one year.');
  g(BOTH, 'Constitution', 'The right to be secure against unreasonable searches and seizures is found in which Article?', 'Article III (Bill of Rights)', ['Article II', 'Article IX', 'Article XI'], 'Art. III, Sec. 2 of the Bill of Rights.');
  g(BOTH, 'Constitution', 'Public office is a public trust. This principle appears in which Article?', 'Article XI, Accountability of Public Officers', ['Article IX-B', 'Article VII', 'Article II'], 'Art. XI, Sec. 1: public officers must be accountable, serve with responsibility, integrity, loyalty and efficiency.');
  g(BOTH, 'Constitution', 'The three co-equal branches of the Philippine government are:', 'Executive, Legislative, Judicial', ['Executive, Legislative, Administrative', 'Federal, State, Local', 'Presidential, Parliamentary, Judicial'], 'The doctrine of separation of powers divides government into these three branches.');
  g(BOTH, 'Constitution', 'Who appoints the Justices of the Supreme Court?', 'The President, from a list submitted by the Judicial and Bar Council', ['The Senate', 'The Chief Justice', 'The Commission on Appointments alone'], 'Art. VIII, Sec. 9.');
  g(BOTH, 'Constitution', 'Appointments in the civil service shall be made according to:', 'Merit and fitness, determined by competitive examination where practicable', ['Seniority only', 'Political party affiliation', 'The appointing officer\'s preference'], 'Art. IX-B, Sec. 2(2) and Sec. 3 of the Constitution.');

  // --- RA 6713
  g(BOTH, 'RA 6713', 'Republic Act No. 6713 is also known as:', 'Code of Conduct and Ethical Standards for Public Officials and Employees', ['Anti-Graft and Corrupt Practices Act', 'Civil Service Decree of the Philippines', 'Plunder Law'], 'RA 6713 (1989) sets norms of conduct for public officials and employees.');
  g(BOTH, 'RA 6713', 'Which of the following is a norm of conduct under RA 6713?', 'Commitment to public interest', ['Loyalty to one\'s superior above all', 'Maximum profit for the agency', 'Secrecy in all transactions'], 'The norms: commitment to public interest, professionalism, justness and sincerity, political neutrality, responsiveness to the public, nationalism and patriotism, commitment to democracy, simple living.');
  g(BOTH, 'RA 6713', 'Under RA 6713, public officials and employees must file their SALN at least:', 'Annually, on or before April 30', ['Every six months', 'Every three years', 'Only upon assumption of office'], 'SALN stands for Statement of Assets, Liabilities and Net Worth; it is filed annually on or before April 30, and also upon assuming and leaving office.');
  g(BOTH, 'RA 6713', 'SALN stands for:', 'Statement of Assets, Liabilities and Net Worth', ['Statement of Accounts, Loans and Net Worth', 'Summary of Assets, Liabilities and Notes', 'Statement of Assets and Liabilities for Newcomers'], 'It is required under RA 6713 and the Constitution.');
  g(BOTH, 'RA 6713', 'Under RA 6713, public officials and employees are prohibited from:', 'Soliciting or accepting gifts in connection with their official duties', ['Joining professional organizations', 'Voting in elections', 'Attending seminars'], 'Sec. 7 prohibits soliciting or accepting gifts, gratuities, favors or loans in the course of official duties.');
  g(BOTH, 'RA 6713', 'The norm of "simple living" under RA 6713 means public servants shall:', 'Lead modest lives appropriate to their positions and income', ['Live only in government housing', 'Refuse all salary increases', 'Avoid owning property'], 'Sec. 4(h): officials shall lead modest lives, avoiding extravagance and ostentation.');
  g(BOTH, 'RA 6713', 'Which law is also called the "Anti-Graft and Corrupt Practices Act"?', 'Republic Act No. 3019', ['Republic Act No. 6713', 'Republic Act No. 6770', 'Republic Act No. 7160'], 'RA 3019 (1960) penalizes corrupt practices of public officers.');

  // --- other laws (civil-service flavored)
  g(BOTH, 'Philippine laws', 'Republic Act No. 7160 is also known as the:', 'Local Government Code of 1991', ['Civil Service Law', 'Administrative Code of 1987', 'Ombudsman Act'], 'RA 7160 devolved powers to local government units.');
  g(BOTH, 'Philippine laws', 'Executive Order No. 292 is the:', 'Administrative Code of 1987', ['Local Government Code', 'Omnibus Election Code', 'Civil Code'], 'EO 292 includes Book V on the Civil Service Commission and civil service rules.');
  g(BOTH, 'Philippine laws', 'Presidential Decree No. 807 is the:', 'Civil Service Decree of the Philippines', ['Labor Code of the Philippines', 'Anti-Graft Law', 'Government Procurement Act'], 'PD 807 (1975) was the earlier Civil Service Decree; its provisions were later carried into EO 292.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 6770 is the:', 'Ombudsman Act of 1989', ['Anti-Plunder Act', 'Data Privacy Act', 'Magna Carta for Public School Teachers'], 'RA 6770 created the Office of the Ombudsman\'s functional structure.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 10173 is the:', 'Data Privacy Act of 2012', ['Cybercrime Prevention Act of 2012', 'Anti-Wiretapping Act', 'Freedom of Information Act'], 'RA 10173 protects personal information and created the National Privacy Commission.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 10175 is the:', 'Cybercrime Prevention Act of 2012', ['Data Privacy Act of 2012', 'E-Commerce Act of 2000', 'Anti-Photo and Video Voyeurism Act'], 'RA 10175 defines and penalizes cybercrime.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 9262 is the:', 'Anti-Violence Against Women and Their Children Act of 2004', ['Magna Carta of Women', 'Anti-Sexual Harassment Act', 'Safe Spaces Act'], 'RA 9262 protects women and children from physical, sexual, psychological and economic abuse.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 7877 is the:', 'Anti-Sexual Harassment Act of 1995', ['Safe Spaces Act', 'Magna Carta of Women', 'Anti-Child Abuse Law'], 'RA 7877 covers sexual harassment in work, education and training environments.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 9710 is the:', 'Magna Carta of Women', ['Anti-VAWC Act', 'Women in Development and Nation Building Act', 'Expanded Maternity Leave Law'], 'RA 9710 (2009) is the comprehensive women\'s human rights law.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 11313 is the:', 'Safe Spaces Act (Bawal Bastos Law)', ['Anti-Sexual Harassment Act', 'Magna Carta of Women', 'Anti-Child Pornography Act'], 'RA 11313 (2019) penalizes gender-based sexual harassment in streets, public spaces, workplaces, schools and online.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 11032 is the:', 'Ease of Doing Business and Efficient Government Service Delivery Act of 2018', ['Government Procurement Reform Act', 'Citizen\'s Charter Act', 'Public-Private Partnership Code'], 'RA 11032 requires government offices to follow a Citizen\'s Charter and set maximum processing times.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 9165 is the:', 'Comprehensive Dangerous Drugs Act of 2002', ['Anti-Terrorism Act', 'Anti-Money Laundering Act', 'Cheaper Medicines Act'], 'RA 9165 is the principal drug law.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 10121 is the:', 'Philippine Disaster Risk Reduction and Management Act of 2010', ['Climate Change Act', 'Clean Air Act', 'Organic Agriculture Act'], 'RA 10121 created the NDRRMC framework.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 11223 is the:', 'Universal Health Care Act', ['Mental Health Act', 'Reproductive Health Law', 'Senior Citizens Act'], 'RA 11223 (2019) automatically enrolls all Filipinos in PhilHealth.');
  g(BOTH, 'Philippine laws', 'Republic Act No. 11036 is the:', 'Mental Health Act', ['Universal Health Care Act', 'Cheaper Medicines Act', 'Rare Diseases Act'], 'RA 11036 (2018) protects the rights of persons with mental health conditions.');
  g(BOTH, 'Philippine laws', 'Under the Juvenile Justice and Welfare Act (RA 9344, as amended), the minimum age of criminal responsibility is:', '15 years old', ['9 years old', '12 years old', '18 years old'], 'A child 15 years old or under is exempt from criminal liability and is subjected to an intervention program.');
  g(BOTH, 'Philippine laws', 'The Sangguniang Kabataan (SK) covers youth aged:', '15 to 30', ['12 to 21', '18 to 35', '10 to 25'], 'RA 10742, the SK Reform Act of 2015, sets the youth sector at 15 to 30 years old.');
  g(BOTH, 'Philippine laws', 'The smallest political unit in the Philippines is the:', 'Barangay', ['Municipality', 'City', 'Province'], 'The barangay is the basic political unit under the Local Government Code.');

  // --- human rights / peace
  g(BOTH, 'Human rights & peace', 'The Universal Declaration of Human Rights was adopted by the UN General Assembly in:', '1948', ['1945', '1966', '1976'], 'Adopted on December 10, 1948, which is why Human Rights Day is observed on December 10.');
  g(BOTH, 'Human rights & peace', 'Human Rights Day is celebrated every:', 'December 10', ['October 24', 'June 12', 'August 19'], 'It commemorates the adoption of the UDHR on Dec 10, 1948.');
  g(BOTH, 'Human rights & peace', 'The constitutional body mandated to investigate human rights violations in the Philippines is the:', 'Commission on Human Rights', ['Department of Justice', 'Office of the Ombudsman', 'Philippine National Police'], 'The CHR was created by Art. XIII, Sec. 17 of the 1987 Constitution.');
  g(BOTH, 'Human rights & peace', 'Republic Act No. 7438 defines the rights of:', 'Persons arrested, detained or under custodial investigation', ['Senior citizens', 'Persons with disabilities', 'Overseas Filipino workers'], 'It includes the right to remain silent, to counsel and to be informed of these rights.');
  g(BOTH, 'Human rights & peace', 'The "Miranda rights" correspond to the right of an arrested person to:', 'Remain silent and have competent, independent counsel', ['Be released on bail in all cases', 'Refuse booking and fingerprinting', 'Be tried only by a jury'], 'Art. III, Sec. 12 of the Constitution.');
  g(BOTH, 'Human rights & peace', 'The Writ of Habeas Corpus protects a person\'s right to:', 'Liberty, by questioning the legality of detention', ['Property', 'Privacy of data', 'Freedom of the press'], 'Habeas corpus (Latin: "you shall have the body") tests the lawfulness of a person\'s confinement.');
  g(BOTH, 'Human rights & peace', 'The Writ of Amparo is a remedy for:', 'Extralegal killings and enforced disappearances', ['Unpaid wages', 'Land ownership disputes', 'Defamation'], 'It protects the rights to life, liberty and security.');
  g(BOTH, 'Human rights & peace', 'The Writ of Habeas Data protects a person\'s right to:', 'Privacy in life, liberty or security, in relation to information gathered about them', ['Free legal aid', 'Free education', 'Free medical care'], 'It allows a person to seek correction or deletion of data held about them.');

  // --- environment
  g(BOTH, 'Environment', 'Republic Act No. 9003 is the:', 'Ecological Solid Waste Management Act of 2000', ['Philippine Clean Air Act', 'Philippine Clean Water Act', 'Climate Change Act'], 'RA 9003 requires waste segregation at source and the closure of open dumpsites.');
  g(BOTH, 'Environment', 'Republic Act No. 8749 is the:', 'Philippine Clean Air Act of 1999', ['Clean Water Act of 2004', 'Solid Waste Management Act', 'Renewable Energy Act'], 'RA 8749 is the main air-quality law.');
  g(BOTH, 'Environment', 'Republic Act No. 9275 is the:', 'Philippine Clean Water Act of 2004', ['Clean Air Act', 'Wildlife Act', 'Fisheries Code'], 'RA 9275 addresses water pollution from all sources.');
  g(BOTH, 'Environment', 'Republic Act No. 9729 is the:', 'Climate Change Act of 2009', ['Renewable Energy Act', 'Disaster Risk Reduction Act', 'Clean Air Act'], 'It created the Climate Change Commission.');
  g(BOTH, 'Environment', 'Republic Act No. 9147 is the:', 'Wildlife Resources Conservation and Protection Act', ['Fisheries Code', 'IPRA Law', 'Forestry Reform Code'], 'It protects Philippine wildlife and their habitats.');
  g(BOTH, 'Environment', 'The 3Rs of waste management stand for:', 'Reduce, Reuse, Recycle', ['Reduce, Repair, Recover', 'Reject, Reuse, Replace', 'Recycle, Reclaim, Refuse'], 'The standard waste hierarchy emphasizes reducing waste first.');
  g(BOTH, 'Environment', 'Earth Day is celebrated every:', 'April 22', ['March 22', 'June 5', 'September 16'], 'World Environment Day is on June 5, a different observance.');
  g(BOTH, 'Environment', 'The primary government agency that protects the Philippine environment and natural resources is the:', 'Department of Environment and Natural Resources (DENR)', ['Department of Agriculture', 'Department of Energy', 'Department of Science and Technology'], 'The DENR leads conservation and management of the country\'s natural resources.');
  g(BOTH, 'Environment', 'The Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) is mainly responsible for:', 'Weather forecasts and tropical cyclone warnings', ['Earthquake monitoring', 'Volcano monitoring', 'Coastal law enforcement'], 'PHIVOLCS monitors earthquakes and volcanoes; PAGASA handles weather and climate.');
  g(BOTH, 'Environment', 'The agency that monitors volcanoes and earthquakes in the Philippines is:', 'PHIVOLCS', ['PAGASA', 'NDRRMC', 'MGB'], 'Philippine Institute of Volcanology and Seismology.');

  // --- Philippine geography / history / general
  g(BOTH, 'Philippine facts', 'The Philippines has how many islands, officially?', '7,641', ['7,107', '7,500', '6,000'], 'NAMRIA officially recognizes 7,641 islands (the older 7,107 figure is outdated).');
  g(BOTH, 'Philippine facts', 'The highest mountain in the Philippines is:', 'Mount Apo', ['Mount Pulag', 'Mount Mayon', 'Mount Kanlaon'], 'Mount Apo in Mindanao is about 2,954 m.');
  g(BOTH, 'Philippine facts', 'The largest lake in the Philippines is:', 'Laguna de Bay', ['Lake Taal', 'Lake Lanao', 'Lake Sebu'], 'Laguna de Bay is the largest freshwater lake.');
  g(BOTH, 'Philippine facts', 'The longest river in the Philippines is the:', 'Cagayan River', ['Pasig River', 'Agusan River', 'Pampanga River'], 'The Cagayan River in northern Luzon is the longest.');
  g(BOTH, 'Philippine facts', 'Philippine Independence Day is celebrated every:', 'June 12', ['July 4', 'August 21', 'November 30'], 'It commemorates the proclamation of independence from Spain in 1898.');
  g(BOTH, 'Philippine facts', 'Who is the national hero of the Philippines?', 'Dr. Jose Rizal', ['Andres Bonifacio', 'Emilio Aguinaldo', 'Apolinario Mabini'], 'Rizal was executed on December 30, 1896 (Rizal Day).');
  g(BOTH, 'Philippine facts', 'Who is known as the "Father of the Philippine Revolution"?', 'Andres Bonifacio', ['Jose Rizal', 'Emilio Aguinaldo', 'Marcelo H. del Pilar'], 'Bonifacio founded the Katipunan in 1892.');
  g(BOTH, 'Philippine facts', 'Who was the first President of the Philippines?', 'Emilio Aguinaldo', ['Manuel L. Quezon', 'Sergio Osmena', 'Jose P. Laurel'], 'Aguinaldo led the First Philippine Republic (1899).');
  g(BOTH, 'Philippine facts', 'Who is known as the "Brains of the Revolution"?', 'Apolinario Mabini', ['Emilio Jacinto', 'Gregorio del Pilar', 'Antonio Luna'], 'Mabini was the chief adviser of Aguinaldo.');
  g(BOTH, 'Philippine facts', 'Which is the largest island in the Philippines?', 'Luzon', ['Mindanao', 'Samar', 'Palawan'], 'Luzon is the largest and most populous island.');
  g(BOTH, 'Philippine facts', 'The Philippine national flower is:', 'Sampaguita', ['Waling-waling', 'Rose', 'Ilang-ilang'], 'Declared in 1934. The national tree is the narra; the national bird is the Philippine eagle.');
  g(BOTH, 'Philippine facts', 'The Philippine national bird is the:', 'Philippine eagle', ['Maya', 'Tarictic hornbill', 'Kalaw'], 'Declared in 1995 by Proclamation No. 615.');
  g(BOTH, 'Philippine facts', 'The Philippine national tree is the:', 'Narra', ['Acacia', 'Mahogany', 'Molave'], 'Narra (Pterocarpus indicus).');
  g(BOTH, 'Philippine facts', 'The colors of the Philippine flag are:', 'Blue, red, white and a golden-yellow sun', ['Blue, white and green', 'Red, white and gold', 'Blue, yellow and red only'], 'The eight rays of the sun stand for the first eight provinces that rose against Spain.');
  g(BOTH, 'Philippine facts', 'The eight rays of the sun on the Philippine flag represent:', 'The first eight provinces that revolted against Spain', ['The eight major islands', 'The eight national heroes', 'The eight regions at the time of independence'], 'Manila, Cavite, Bulacan, Pampanga, Nueva Ecija, Tarlac, Laguna and Batangas.');
  g(BOTH, 'Philippine facts', 'The Philippines is a member of which regional organization?', 'ASEAN', ['EU', 'NATO', 'OPEC'], 'Association of Southeast Asian Nations; the Philippines is a founding member (1967).');
  g(BOTH, 'Philippine facts', 'The Philippine currency is the:', 'Peso, managed by the Bangko Sentral ng Pilipinas', ['Ringgit', 'Baht', 'Dong'], 'The BSP is the country\'s central bank.');
  g(BOTH, 'Philippine facts', 'The capital of the Philippines is:', 'Manila', ['Quezon City', 'Makati', 'Cebu City'], 'Manila is the capital; Quezon City is the most populous city.');
  g(BOTH, 'Philippine facts', 'The official oath-taking required of civil servants is administered to affirm:', 'Allegiance to the Republic and obedience to the Constitution', ['Loyalty to the appointing authority', 'Membership in a political party', 'Secrecy of office transactions'], 'Art. IX-B, Sec. 4 and the Administrative Code require every public officer to take an oath of office.');

  // --- civil service rules
  g(BOTH, 'Civil service', 'The central personnel agency of the Philippine government is the:', 'Civil Service Commission', ['Department of Budget and Management', 'Commission on Audit', 'Department of Labor and Employment'], 'The CSC is the central personnel agency of the government.');
  g(BOTH, 'Civil service', 'To pass the Career Service Examination (Pen and Paper Test), an examinee must obtain a general rating of at least:', '80%', ['60%', '70%', '75%'], 'The passing rate for the CSE-PPT is 80%.');
  g(BOTH, 'Civil service', 'The Career Service Examination passers are issued which eligibility?', 'Career Service Professional or Subprofessional, depending on the level taken', ['Barangay Official Eligibility', 'Honor Graduate Eligibility', 'Foreign Service Eligibility'], 'Professional covers 2nd-level positions; Subprofessional covers 1st-level positions.');
  g(BOTH, 'Civil service', 'The Citizen\'s Charter under RA 11032 is a document that:', 'Lists the services of an agency, requirements, fees and processing times', ['Lists the agency\'s employees and salaries', 'Lists the agency\'s procurement contracts', 'Lists the agency\'s budget allocation'], 'Every government office must post its Citizen\'s Charter.');
  g(BOTH, 'Civil service', 'A public officer who is dishonest, grossly neglectful, or commits oppression may face:', 'Administrative disciplinary action, including dismissal from service', ['Only a verbal warning', 'Transfer to another office as a reward', 'A mandatory promotion review'], 'Grave offenses under CSC rules carry penalties up to dismissal.');
  g(BOTH, 'Civil service', 'Government workers are expected to render service with:', 'Utmost responsibility, integrity, loyalty and efficiency', ['Speed over accuracy', 'Personal discretion above rules', 'Priority to relatives'], 'Art. XI, Sec. 1.');

  /* =====================================================================
     HAND-WRITTEN: VERBAL
     ===================================================================== */
  var V = [];
  function v(levels, topic, q, a, w, exp) { V.push([levels, topic, q, a, w, exp]); }

  // grammar / usage
  v(BOTH, 'Grammar', 'Choose the correct sentence.', 'Neither of the applicants was qualified.', ['Neither of the applicants were qualified.', 'Neither of the applicants are qualified.', 'Neither of the applicants have been qualified.'], '"Neither" is singular, so it takes a singular verb.');
  v(BOTH, 'Grammar', 'Choose the correct sentence.', 'The committee has submitted its report.', ['The committee have submitted its report.', 'The committee has submitted their report.', 'The committee are submitted its report.'], 'A collective noun acting as a unit takes a singular verb and the pronoun "its".');
  v(BOTH, 'Grammar', 'Choose the word that completes the sentence: "The manager, along with his staff, ____ attending the seminar."', 'is', ['are', 'were', 'be'], 'The subject is "manager"; "along with his staff" is a modifier, so the verb is singular.');
  v(BOTH, 'Grammar', 'Choose the word that completes the sentence: "Each of the employees ____ a copy of the memo."', 'received', ['receive', 'have receive', 'were receiving'], '"Each" is singular, so use the singular form (received).');
  v(BOTH, 'Grammar', 'Choose the correct sentence.', 'She and I attended the training.', ['Her and me attended the training.', 'Her and I attended the training.', 'She and me attended the training.'], 'Use subject pronouns (she, I) as subjects of the verb.');
  v(BOTH, 'Grammar', 'Choose the correct sentence.', 'Between you and me, the plan is risky.', ['Between you and I, the plan is risky.', 'Between you and myself, the plan is risky.', 'Between I and you, the plan is risky.'], 'A preposition ("between") takes object pronouns (me).');
  v(BOTH, 'Grammar', 'Choose the word that best completes the sentence: "He is the ____ of the two brothers."', 'taller', ['tallest', 'more tall', 'most tall'], 'Use the comparative for two persons or things.');
  v(BOTH, 'Grammar', 'Choose the correct sentence.', 'The data are incomplete.', ['The data is incomplete and are missing.', 'The data was incomplete are.', 'The datas are incomplete.'], '"Data" is the plural of "datum" and in formal usage takes a plural verb.');
  v(BOTH, 'Grammar', 'Which sentence is punctuated correctly?', 'The office opens at eight, and it closes at five.', ['The office opens at eight and, it closes at five.', 'The office opens at eight; and it closes at five,', 'The office, opens at eight and it closes, at five.'], 'A comma comes before a coordinating conjunction joining two independent clauses.');
  v(BOTH, 'Grammar', 'Choose the correct word: "The effect of the new policy was ____ ."', 'immediate', ['immediatly', 'immediete', 'imediate'], 'The correct spelling is "immediate".');
  v(BOTH, 'Grammar', 'Choose the sentence with correct subject-verb agreement.', 'Either the director or the clerks are responsible.', ['Either the director or the clerks is responsible.', 'Either the director or the clerks be responsible.', 'Either the director or the clerks was responsible.'], 'With "either...or", the verb agrees with the nearer subject ("clerks", plural).');
  v(BOTH, 'Grammar', 'Choose the correct word: "Please ____ the document before you sign it."', 'review', ['reviews', 'reviewing', 'to reviewed'], 'After "please", use the base form of the verb.');
  v(BOTH, 'Grammar', 'Choose the correct sentence.', 'If I were you, I would file the complaint.', ['If I was you, I would file the complaint.', 'If I am you, I will file the complaint.', 'If I be you, I would file the complaint.'], 'The subjunctive mood uses "were" for contrary-to-fact conditions.');
  v(BOTH, 'Grammar', 'Which is the correct plural of "criterion"?', 'criteria', ['criterions', 'criterias', 'criterium'], 'Criterion (singular) -> criteria (plural).');
  v(BOTH, 'Grammar', 'Identify the correctly spelled word.', 'Accommodate', ['Acommodate', 'Accomodate', 'Acomodate'], '"Accommodate" has double c and double m.');
  v(BOTH, 'Grammar', 'Which sentence uses "its" and "it\'s" correctly?', 'It\'s clear that the agency lost its funding.', ['Its clear that the agency lost it\'s funding.', 'It\'s clear that the agency lost it\'s funding.', 'Its clear that the agency lost its\' funding.'], '"It\'s" = "it is"; "its" shows possession.');
  v(BOTH, 'Grammar', 'Which sentence is in the passive voice?', 'The report was signed by the director.', ['The director signed the report.', 'The director is signing the report.', 'The director will sign the report.'], 'In passive voice the subject receives the action.');
  v(BOTH, 'Grammar', 'Choose the correct word: "The clerk could not ____ the missing file."', 'find', ['found', 'finded', 'founded'], 'After a modal verb ("could not"), use the base form.');

  // sentence completion / reading
  v(BOTH, 'Sentence completion', 'The new employee was so ____ that she finished the entire report before lunch.', 'diligent', ['indolent', 'reluctant', 'careless'], '"Diligent" (hard-working) fits finishing a report so quickly.');
  v(BOTH, 'Sentence completion', 'Because the evidence was ____, the court dismissed the case.', 'insufficient', ['overwhelming', 'abundant', 'conclusive'], 'A case is dismissed when evidence is not enough.');
  v(BOTH, 'Sentence completion', 'The mayor\'s decision was ____ by the public; hundreds attended to thank her.', 'applauded', ['condemned', 'ignored', 'ridiculed'], 'Thanks from the crowd means the decision was praised.');
  v(BOTH, 'Sentence completion', 'A good public servant must be ____ in handling public funds and avoid even the appearance of wrongdoing.', 'prudent', ['reckless', 'lenient', 'frivolous'], '"Prudent" means careful and sensible.');
  v(BOTH, 'Sentence completion', 'Although the task seemed ____, the team completed it in a single afternoon.', 'daunting', ['trivial', 'pleasant', 'brief'], 'The "although" signals a contrast: the task looked hard but was finished quickly.');

  v(PRO, 'Reading comprehension', 'Read: "Public offices have long struggled with delays. Citizens often return several times to complete a single transaction. Offices that post clear requirements and processing times, however, reduce repeat visits dramatically." -- What is the main idea?', 'Clear requirements and posted processing times reduce repeat visits to public offices.', ['Citizens should avoid government offices.', 'Delays are impossible to prevent.', 'Public offices have too many employees.'], 'The passage ends on the solution; the first two sentences set up the problem.');
  v(PRO, 'Reading comprehension', 'Read: "Recycling reduces landfill waste and saves energy, yet only a fraction of household waste in many cities is actually recycled." -- Which is implied?', 'Many households could recycle more than they do.', ['Recycling wastes energy.', 'Landfills are no longer necessary.', 'Cities forbid recycling.'], '"Yet only a fraction..." implies there is room to recycle more.');
  v(PRO, 'Reading comprehension', 'Read: "The agency adopted an online appointment system. Within a month, average waiting time fell from 90 minutes to 25 minutes." -- What can be concluded?', 'The online appointment system shortened waiting time.', ['Customers prefer the old system.', 'The agency hired more staff.', 'Waiting time doubled.'], 'The change is directly followed by a drop in waiting time.');
  v(PRO, 'Reading comprehension', 'Read: "Honesty in public service is not merely a personal virtue; it is a duty owed to the taxpayers who fund the government." -- The author would most likely agree that:', 'Public officials are accountable to taxpayers.', ['Honesty is optional for private citizens.', 'Taxpayers have no role in government.', 'Government funds belong to the officials.'], 'The sentence ties honesty to a duty to taxpayers.');
  v(PRO, 'Reading comprehension', 'The word "merely" in "not merely a personal virtue" most nearly means:', 'only', ['rarely', 'barely', 'sometimes'], '"Not merely" = "not only".');

  // Paragraph/sentence arrangement (pro)
  v(PRO, 'Paragraph organization', 'Arrange to form a coherent paragraph: (1) The result was a faster, friendlier service. (2) The office decided to retrain its front-line staff. (3) Customers had been complaining of rude and slow service. (4) Training focused on courtesy and efficiency.', '3, 2, 4, 1', ['2, 3, 1, 4', '1, 3, 2, 4', '4, 2, 3, 1'], 'Problem (3) -> decision (2) -> action (4) -> result (1).');
  v(PRO, 'Paragraph organization', 'Arrange to form a coherent paragraph: (1) Therefore, he was promoted. (2) Mr. Reyes always submitted his reports on time. (3) His supervisors praised his accuracy. (4) He worked in the records section for ten years.', '4, 2, 3, 1', ['2, 4, 1, 3', '1, 4, 2, 3', '3, 1, 4, 2'], 'Background -> habit -> praise -> consequence ("Therefore").');

  /* =====================================================================
     HAND-WRITTEN: ANALYTICAL (Professional)
     ===================================================================== */
  var A = [];
  function an(topic, q, a, w, exp) { A.push([PRO, topic, q, a, w, exp]); }

  an('Syllogism', 'All clerks are employees. All employees are paid monthly. Therefore:', 'All clerks are paid monthly.', ['All employees are clerks.', 'Some clerks are not employees.', 'No employee is a clerk.'], 'Clerks are a subset of employees, who are paid monthly.');
  an('Syllogism', 'No cheater is honest. Some students are cheaters. Therefore:', 'Some students are not honest.', ['All students are honest.', 'No student is a cheater.', 'All cheaters are students.'], 'The students who are cheaters cannot be honest.');
  an('Syllogism', 'All doctors are graduates. Maria is not a graduate. Therefore:', 'Maria is not a doctor.', ['Maria is a doctor.', 'Maria is a graduate.', 'Some graduates are not doctors.'], 'If every doctor is a graduate, a non-graduate cannot be a doctor.');
  an('Syllogism', 'Some employees are managers. All managers attend the meeting. Therefore:', 'Some employees attend the meeting.', ['All employees attend the meeting.', 'No employee attends the meeting.', 'All who attend are managers.'], 'The employees who are managers attend.');
  an('Syllogism', 'If it rains, the field trip is cancelled. The field trip was not cancelled. Therefore:', 'It did not rain.', ['It rained.', 'It will rain tomorrow.', 'The field trip was held indoors.'], 'Modus tollens: not-Q therefore not-P.');
  an('Syllogism', 'If the alarm sounds, everyone evacuates. The alarm sounded. Therefore:', 'Everyone evacuates.', ['No one evacuates.', 'Only managers evacuate.', 'The alarm was false.'], 'Modus ponens.');
  an('Syllogism', 'All birds have wings. Penguins are birds. Therefore:', 'Penguins have wings.', ['Penguins can fly.', 'Some birds are not penguins and cannot fly.', 'Penguins have no wings.'], 'A valid deduction from the premises; flying is not stated.');
  an('Syllogism', 'Every permit is stamped. This paper is not stamped. Therefore:', 'This paper is not a permit.', ['This paper is a permit.', 'All stamped papers are permits.', 'Some permits are unstamped.'], 'Contrapositive of "every permit is stamped".');

  an('Logic puzzle', 'Ana is taller than Ben. Ben is taller than Carla. Dina is shorter than Carla. Who is the shortest?', 'Dina', ['Ana', 'Ben', 'Carla'], 'Order: Ana > Ben > Carla > Dina.');
  an('Logic puzzle', 'Five people are in a line. Rico is ahead of Sam. Sam is ahead of Tina. Uma is ahead of Rico. Vic is behind Tina. Who is in the middle (third place)?', 'Sam', ['Rico', 'Tina', 'Uma'], 'Order: Uma, Rico, Sam, Tina, Vic.');
  an('Logic puzzle', 'Jun is twice as old as Lito. In 5 years, the sum of their ages will be 40. How old is Lito now?', '10', ['8', '12', '15'], 'Let Lito = x, Jun = 2x. 3x + 10 = 40, so x = 10.');
  an('Logic puzzle', 'Pia is 6 years older than Rona. The sum of their ages is 30. How old is Pia?', '18', ['12', '15', '24'], 'Rona = x, Pia = x + 6; 2x + 6 = 30, so x = 12 and Pia = 18.');
  an('Logic puzzle', 'In a code, MANILA is written as NBOJMB. How is CEBU written in the same code?', 'DFCV', ['BDAT', 'DEBV', 'CFDV'], 'Each letter is moved one place forward in the alphabet.');
  an('Logic puzzle', 'In a code, PASIG is written as QBTJH. How is RIZAL written in the same code?', 'SJABM', ['SJZBM', 'QHYZK', 'SJAAM'], 'Each letter is moved one place forward.');
  an('Logic puzzle', 'A clock shows 3:15. What is the angle between the hour and minute hands?', '7.5 degrees', ['0 degrees', '15 degrees', '22.5 degrees'], 'At 3:15 the hour hand is at 97.5 degrees and the minute hand at 90 degrees.');
  an('Logic puzzle', 'Four friends - Ann, Bea, Cy, and Dan - each have a different favorite color: red, blue, green, yellow. Ann does not like red or blue. Bea likes blue. Cy does not like red. Dan likes red. Who likes green if Ann does not like yellow?', 'Ann', ['Bea', 'Cy', 'Dan'], 'Bea = blue, Dan = red, so Ann and Cy have green/yellow. Ann does not like yellow, so Ann = green.');
  an('Analogy', 'Doctor is to hospital as teacher is to:', 'School', ['Student', 'Book', 'Lesson'], 'The workplace of each profession.');
  an('Analogy', 'Pen is to write as knife is to:', 'Cut', ['Sharp', 'Kitchen', 'Steel'], 'Tool and its function.');
  an('Analogy', 'Hot is to cold as ascend is to:', 'Descend', ['Climb', 'Rise', 'Mountain'], 'Antonym pairs.');
  an('Analogy', 'Page is to book as scene is to:', 'Play', ['Actor', 'Stage', 'Audience'], 'Part to whole.');
  an('Analogy', 'Seed is to plant as egg is to:', 'Chicken', ['Nest', 'Shell', 'Yolk'], 'Origin to the grown form.');
  an('Assumption', 'Statement: "Only employees with an ID may enter the building." Which MUST be true?', 'A person with no ID may not enter.', ['Every employee has an ID.', 'All persons with an ID are employees.', 'The building has no visitors.'], 'The statement limits entry to ID holders.');
  an('Assumption', 'Statement: "All permits submitted after 5 PM will be processed the next day." Ben submitted his permit at 6 PM. Which is true?', 'It will be processed the next day.', ['It will be processed today.', 'It will be rejected.', 'It will be processed in two days.'], 'Direct application of the rule.');
  an('Assumption', 'A report says: "Reading scores rose after the library opened." Which conclusion is best supported?', 'Scores rose after the library opened, but the report does not prove the library caused it.', ['The library caused all of the increase.', 'Reading scores will keep rising forever.', 'Students no longer need teachers.'], 'Correlation or sequence alone does not prove causation.');

  /* =====================================================================
     GENERATORS
     ===================================================================== */
  var gen = {};
  var gcount = 0;
  function gid(p) { gcount++; return 'g-' + p + '-' + gcount + '-' + ri(100, 999); }

  /* ----- Numerical (both levels) ----- */
  gen.numerical = [
    function addsub() {
      var a = ri(120, 980), b = ri(120, 980), c = ri(10, 99);
      var ans = a + b - c;
      return mk(gid('n'), BOTH, 'numerical', 'Basic operations', 'Compute: ' + a + ' + ' + b + ' - ' + c, ans, numWrongs(ans, 10), a + ' + ' + b + ' = ' + (a + b) + '; ' + (a + b) + ' - ' + c + ' = ' + ans + '.');
    },
    function multi() {
      var a = ri(12, 49), b = ri(6, 19);
      var ans = a * b;
      return mk(gid('n'), BOTH, 'numerical', 'Basic operations', 'What is ' + a + ' x ' + b + '?', ans, numWrongs(ans, b), a + ' x ' + b + ' = ' + ans + '.');
    },
    function order() {
      var a = ri(3, 9), b = ri(2, 9), c = ri(2, 9), d = ri(2, 6);
      var ans = a + b * c - d;
      return mk(gid('n'), BOTH, 'numerical', 'Order of operations', 'Evaluate: ' + a + ' + ' + b + ' x ' + c + ' - ' + d, ans, [(a + b) * c - d, a + b * (c - d), a + b * c + d], 'Multiply first: ' + b + ' x ' + c + ' = ' + (b * c) + '; then add and subtract left to right = ' + ans + '.');
    },
    function percentOf() {
      var p = pick([5, 10, 12, 15, 20, 25, 30, 40, 60, 75]), n = pick([40, 60, 80, 120, 150, 200, 240, 360, 500, 800]);
      var ans = p * n / 100;
      return mk(gid('n'), BOTH, 'numerical', 'Percent', 'What is ' + p + '% of ' + n + '?', fmt(ans), numWrongs(ans), p + '% of ' + n + ' = ' + p + '/100 x ' + n + ' = ' + fmt(ans) + '.');
    },
    function discount() {
      var price = pick([400, 500, 800, 1200, 1500, 2000, 2500, 4000]), d = pick([10, 15, 20, 25, 30, 40]);
      var ans = price * (100 - d) / 100;
      return mk(gid('n'), BOTH, 'numerical', 'Percent', 'A shirt costs P' + price + '. It is sold at a ' + d + '% discount. What is the selling price?', 'P' + fmt(ans), numWrongs(ans, price / 20).map(function (x) { return 'P' + x; }).concat(['P' + fmt(price * d / 100)]), 'Discount = ' + d + '% of ' + price + ' = P' + fmt(price * d / 100) + '; ' + price + ' - ' + fmt(price * d / 100) + ' = P' + fmt(ans) + '.');
    },
    function pctChange() {
      var base = pick([50, 80, 100, 120, 200, 250, 400]), p = pick([10, 20, 25, 30, 50]);
      var ans = base * (100 + p) / 100;
      return mk(gid('n'), BOTH, 'numerical', 'Percent', 'A salary of P' + base + ' (in thousands) is raised by ' + p + '%. What is the new salary (in thousands)?', fmt(ans), numWrongs(ans, base / 10), 'New salary = ' + base + ' x ' + (100 + p) / 100 + ' = ' + fmt(ans) + '.');
    },
    function fraction() {
      var d1 = pick([2, 3, 4, 5, 6]), d2 = pick([2, 3, 4, 5, 6, 8]);
      var n1 = ri(1, d1 - 1) || 1, n2 = ri(1, d2 - 1) || 1;
      var num = n1 * d2 + n2 * d1, den = d1 * d2, k = gcd(num, den);
      var ans = (num / k) + '/' + (den / k);
      var w = [(n1 + n2) + '/' + (d1 + d2), (num / k + 1) + '/' + (den / k), (num / k) + '/' + (den / k + 1), (num / k + 2) + '/' + (den / k)];
      return mk(gid('n'), BOTH, 'numerical', 'Fractions', 'Add: ' + n1 + '/' + d1 + ' + ' + n2 + '/' + d2, ans, w.filter(function (x) { return x !== ans; }), 'Use a common denominator ' + den + ': (' + n1 + 'x' + d2 + ' + ' + n2 + 'x' + d1 + ')/' + den + ' = ' + num + '/' + den + ' = ' + ans + '.');
    },
    function ratio() {
      var a = ri(2, 5), b = ri(2, 7); if (a === b) b++;
      var k = ri(3, 12), total = (a + b) * k;
      var ans = a * k;
      return mk(gid('n'), BOTH, 'numerical', 'Ratio and proportion', 'P' + total + ' is divided between two persons in the ratio ' + a + ':' + b + '. How much does the first person get?', 'P' + ans, numWrongs(ans, k).map(function (x) { return 'P' + x; }), 'Total parts = ' + (a + b) + '; one part = ' + k + '; first share = ' + a + ' x ' + k + ' = ' + ans + '.');
    },
    function average() {
      var n = ri(4, 6), nums = [], sum = 0;
      for (var i = 0; i < n; i++) { var x = ri(60, 100); nums.push(x); sum += x; }
      while (sum % n) { nums[0]++; sum++; }
      var ans = sum / n;
      return mk(gid('n'), BOTH, 'numerical', 'Average', 'Find the average of: ' + nums.join(', '), ans, numWrongs(ans, 2), 'Sum = ' + sum + '; ' + sum + ' / ' + n + ' = ' + ans + '.');
    },
    function speed() {
      var s = pick([40, 45, 50, 60, 72, 80]), t = pick([2, 3, 4, 5, 1.5, 2.5]);
      var ans = s * t;
      return mk(gid('n'), BOTH, 'numerical', 'Word problems', 'A bus travels at ' + s + ' km/h for ' + t + ' hours. How far does it go?', fmt(ans) + ' km', numWrongs(ans, 10).map(function (x) { return x + ' km'; }), 'Distance = speed x time = ' + s + ' x ' + t + ' = ' + fmt(ans) + ' km.');
    },
    function work() {
      var a = pick([6, 8, 10, 12, 15]), b = pick([3, 4, 5, 6, 10, 12, 20, 30]);
      if (a === b) b += 2;
      var tot = (a * b) / (a + b);
      var ans = fmt(tot);
      return mk(gid('n'), PRO, 'numerical', 'Work problems', 'Ana can finish a job in ' + a + ' hours and Ben can finish it in ' + b + ' hours. Working together, how many hours will they need?', ans + ' hours', numWrongs(tot, 1).map(function (x) { return x + ' hours'; }), 'Combined rate = 1/' + a + ' + 1/' + b + '; time = ' + a + 'x' + b + '/(' + a + '+' + b + ') = ' + ans + ' hours.');
    },
    function interest() {
      var p = pick([5000, 8000, 10000, 20000, 50000]), r = pick([3, 4, 5, 6, 8]), t = pick([1, 2, 3, 4]);
      var ans = p * r * t / 100;
      return mk(gid('n'), PRO, 'numerical', 'Simple interest', 'What is the simple interest on P' + p + ' at ' + r + '% per year for ' + t + ' year(s)?', 'P' + ans, numWrongs(ans, p * r / 200).map(function (x) { return 'P' + x; }), 'I = P x r x t = ' + p + ' x ' + r / 100 + ' x ' + t + ' = P' + ans + '.');
    },
    function area() {
      var l = ri(5, 25), w = ri(3, 15);
      var ans = l * w;
      return mk(gid('n'), BOTH, 'numerical', 'Geometry', 'A rectangular room is ' + l + ' m long and ' + w + ' m wide. What is its area?', ans + ' sq m', numWrongs(ans, w).map(function (x) { return x + ' sq m'; }).concat([2 * (l + w) + ' sq m']), 'Area = length x width = ' + l + ' x ' + w + ' = ' + ans + ' sq m. (The perimeter would be ' + 2 * (l + w) + ' m.)');
    },
    function equation() {
      var x = ri(2, 15), a = ri(2, 9), b = ri(1, 20);
      var c = a * x + b;
      return mk(gid('n'), PRO, 'numerical', 'Algebra', 'Solve for x: ' + a + 'x + ' + b + ' = ' + c, x, numWrongs(x, 1), a + 'x = ' + c + ' - ' + b + ' = ' + (c - b) + '; x = ' + x + '.');
    },
    function sqrt() {
      var n = ri(4, 20), sq = n * n;
      return mk(gid('n'), BOTH, 'numerical', 'Powers and roots', 'What is the square root of ' + sq + '?', n, numWrongs(n, 1), n + ' x ' + n + ' = ' + sq + '.');
    },
    function decimals() {
      var a = (ri(11, 99) / 10), b = (ri(11, 99) / 10);
      var ans = Math.round((a + b) * 10) / 10;
      return mk(gid('n'), BOTH, 'numerical', 'Decimals', 'Add: ' + a + ' + ' + b, fmt(ans), numWrongs(ans, 0.5).concat([fmt(ans + 1)]), a + ' + ' + b + ' = ' + fmt(ans) + '.');
    }
  ];

  /* ----- Analytical series (Professional) ----- */
  gen.analytical = [
    function arith() {
      var s = ri(2, 20), d = ri(2, 9), seq = [];
      for (var i = 0; i < 5; i++) seq.push(s + d * i);
      var ans = s + d * 5;
      return mk(gid('a'), PRO, 'analytical', 'Number series', 'What comes next? ' + seq.join(', ') + ', ___', ans, numWrongs(ans, d), 'Add ' + d + ' each time, so the next term is ' + ans + '.');
    },
    function geom() {
      var s = ri(1, 4), r = pick([2, 3]), seq = [];
      for (var i = 0; i < 5; i++) seq.push(s * Math.pow(r, i));
      var ans = s * Math.pow(r, 5);
      return mk(gid('a'), PRO, 'analytical', 'Number series', 'What comes next? ' + seq.join(', ') + ', ___', ans, numWrongs(ans, ans / 4), 'Multiply by ' + r + ' each time, so the next term is ' + ans + '.');
    },
    function alt() {
      var a = ri(2, 10), b = ri(40, 60), da = ri(2, 5), db = ri(3, 7);
      var seq = [a, b, a + da, b - db, a + 2 * da, b - 2 * db];
      var ans = a + 3 * da;
      return mk(gid('a'), PRO, 'analytical', 'Number series', 'What comes next? ' + seq.join(', ') + ', ___', ans, numWrongs(ans, da), 'Two interleaved series: the odd terms increase by ' + da + ' and the even terms decrease by ' + db + '. The next is in the first series: ' + ans + '.');
    },
    function squares() {
      var n = ri(2, 6), seq = [];
      for (var i = 0; i < 5; i++) seq.push((n + i) * (n + i));
      var ans = (n + 5) * (n + 5);
      return mk(gid('a'), PRO, 'analytical', 'Number series', 'What comes next? ' + seq.join(', ') + ', ___', ans, numWrongs(ans, 2 * n + 9), 'These are consecutive squares: the next is ' + (n + 5) + '^2 = ' + ans + '.');
    },
    function growing() {
      var s = ri(1, 5), seq = [s], inc = 2;
      for (var i = 0; i < 4; i++) { seq.push(seq[seq.length - 1] + inc); inc += 2; }
      var ans = seq[4] + inc;
      return mk(gid('a'), PRO, 'analytical', 'Number series', 'What comes next? ' + seq.join(', ') + ', ___', ans, numWrongs(ans, 2), 'The differences are 2, 4, 6, 8, so the next difference is ' + inc + ' and the next term is ' + ans + '.');
    },
    function fib() {
      var a = ri(1, 4), b = ri(2, 6), seq = [a, b];
      for (var i = 0; i < 4; i++) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
      var ans = seq[5] + seq[4];
      return mk(gid('a'), PRO, 'analytical', 'Number series', 'What comes next? ' + seq.join(', ') + ', ___', ans, numWrongs(ans, 3), 'Each term is the sum of the two before it, so the next is ' + seq[4] + ' + ' + seq[5] + ' = ' + ans + '.');
    },
    function letters() {
      var A_ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', start = ri(0, 8), step = ri(2, 3), seq = [];
      for (var i = 0; i < 5; i++) seq.push(A_[start + step * i]);
      var ans = A_[(start + step * 5) % 26];
      var w = [A_[(start + step * 5 + 1) % 26], A_[(start + step * 5 - 1 + 26) % 26], A_[(start + step * 5 + 2) % 26]];
      return mk(gid('a'), PRO, 'analytical', 'Letter series', 'What letter comes next? ' + seq.join(', ') + ', ___', ans, w, 'Each letter skips ' + (step - 1) + ' letter(s) in the alphabet.');
    }
  ];

  /* ----- Vocabulary (both) from word lists ----- */
  var SYN = [
    ['abundant', 'plentiful'], ['accurate', 'exact'], ['adequate', 'sufficient'], ['alleviate', 'ease'], ['ambiguous', 'unclear'],
    ['assist', 'help'], ['authentic', 'genuine'], ['brief', 'short'], ['candid', 'frank'], ['capable', 'competent'],
    ['cease', 'stop'], ['commence', 'begin'], ['concise', 'brief'], ['conceal', 'hide'], ['diligent', 'hardworking'],
    ['diminish', 'lessen'], ['enormous', 'huge'], ['evident', 'obvious'], ['fragile', 'delicate'], ['frugal', 'thrifty'],
    ['genuine', 'real'], ['hasty', 'rushed'], ['impartial', 'fair'], ['indispensable', 'essential'], ['inquire', 'ask'],
    ['integrity', 'honesty'], ['obsolete', 'outdated'], ['prohibit', 'forbid'], ['reluctant', 'unwilling'], ['scarce', 'rare'],
    ['transparent', 'clear'], ['vital', 'crucial'], ['verify', 'confirm'], ['modify', 'change'], ['mandatory', 'required'],
    ['mediocre', 'average'], ['meticulous', 'careful'], ['tenacious', 'persistent'], ['lucid', 'clear'], ['pragmatic', 'practical'],
    ['benevolent', 'kind'], ['eloquent', 'articulate'], ['prudent', 'wise'], ['venerable', 'respected'], ['ardent', 'passionate']
  ];
  var ANT = [
    ['ancient', 'modern'], ['generous', 'stingy'], ['expand', 'shrink'], ['victory', 'defeat'], ['honest', 'deceitful'],
    ['permit', 'forbid'], ['rigid', 'flexible'], ['scarce', 'abundant'], ['timid', 'bold'], ['transparent', 'opaque'],
    ['accept', 'reject'], ['advance', 'retreat'], ['arrive', 'depart'], ['brave', 'cowardly'], ['complex', 'simple'],
    ['diligent', 'lazy'], ['early', 'late'], ['fertile', 'barren'], ['gloomy', 'cheerful'], ['humble', 'arrogant'],
    ['increase', 'decrease'], ['loyal', 'disloyal'], ['mature', 'immature'], ['optimistic', 'pessimistic'], ['permanent', 'temporary'],
    ['praise', 'criticize'], ['punctual', 'tardy'], ['rapid', 'slow'], ['strengthen', 'weaken'], ['superior', 'inferior'],
    ['vague', 'precise'], ['voluntary', 'compulsory'], ['wealthy', 'poor'], ['zealous', 'apathetic'], ['benign', 'harmful']
  ];
  var SPELL = [
    ['necessary', 'neccessary', 'necesary', 'neccesary'], ['separate', 'seperate', 'separete', 'seprate'], ['receive', 'recieve', 'receeve', 'recive'],
    ['occurrence', 'occurence', 'ocurrence', 'occurrance'], ['definitely', 'definately', 'definitly', 'defanitely'], ['government', 'goverment', 'govenment', 'governmant'],
    ['environment', 'enviroment', 'envirnment', 'environmant'], ['privilege', 'priviledge', 'privelege', 'privilage'], ['schedule', 'shedule', 'schedual', 'scedule'],
    ['calendar', 'calender', 'calandar', 'calendir'], ['commitment', 'comitment', 'commitmant', 'committment'], ['judgment', 'judgement', 'jugdment', 'judgmant'],
    ['responsibility', 'responsability', 'responsibilty', 'resposibility'], ['assistance', 'assistence', 'asistance', 'assistanse'], ['beneficiary', 'benificiary', 'beneficiery', 'benefisiary'],
    ['maintenance', 'maintainance', 'maintenence', 'maintanance'], ['appropriate', 'apropriate', 'appropriete', 'appropiate'], ['guarantee', 'garantee', 'guarentee', 'guaranty'],
    ['correspondence', 'correspondance', 'corespondence', 'correspondense'], ['embarrass', 'embarass', 'embarras', 'embarrasss'], ['recommend', 'reccomend', 'recomend', 'recommed'],
    ['sufficient', 'sufficent', 'suficient', 'sufficeint'], ['permanent', 'permenent', 'permanant', 'permannent'], ['acknowledge', 'acknowlege', 'aknowledge', 'acknowlegde']
  ];
  var ANALOGY = [
    ['Teacher', 'school', 'Judge', 'court'], ['Pilot', 'airplane', 'Driver', 'car'], ['Bird', 'nest', 'Bee', 'hive'],
    ['Eye', 'see', 'Ear', 'hear'], ['Author', 'book', 'Painter', 'painting'], ['Cow', 'milk', 'Hen', 'egg'],
    ['Glove', 'hand', 'Shoe', 'foot'], ['Day', 'night', 'Summer', 'winter'], ['Mayor', 'city', 'Governor', 'province'],
    ['Book', 'library', 'Painting', 'museum'], ['Thermometer', 'temperature', 'Clock', 'time'], ['Fish', 'school', 'Wolf', 'pack']
  ];

  function otherPairs(list, idx, k, n) {
    var out = [];
    shuffle(list.map(function (_, i) { return i; })).forEach(function (i) { if (i !== idx && out.length < n) out.push(list[i][k]); });
    return out;
  }

  gen.verbal = [
    function syn() {
      var i = rnd(SYN.length), p = SYN[i];
      var wrongs = otherPairs(SYN, i, 1, 3);
      return mk(gid('v'), BOTH, 'verbal', 'Synonyms', 'Choose the word closest in meaning to "' + p[0] + '".', p[1], wrongs, '"' + p[0] + '" means ' + p[1] + '.');
    },
    function ant() {
      var i = rnd(ANT.length), p = ANT[i];
      var wrongs = otherPairs(ANT, i, 1, 3);
      return mk(gid('v'), BOTH, 'verbal', 'Antonyms', 'Choose the word opposite in meaning to "' + p[0] + '".', p[1], wrongs, 'The opposite of "' + p[0] + '" is "' + p[1] + '".');
    },
    function spell() {
      var p = pick(SPELL);
      return mk(gid('v'), BOTH, 'verbal', 'Spelling', 'Which is the correctly spelled word?', p[0], p.slice(1), 'The correct spelling is "' + p[0] + '".');
    },
    function analogy() {
      var i = rnd(ANALOGY.length), p = ANALOGY[i];
      var wrongs = otherPairs(ANALOGY, i, 3, 3);
      return mk(gid('v'), BOTH, 'verbal', 'Analogy', p[0] + ' is to ' + p[1] + ' as ' + p[2] + ' is to:', p[3], wrongs, 'The same relationship holds: ' + p[2] + ' : ' + p[3] + '.');
    }
  ];

  /* ----- Clerical operations (Subprofessional) ----- */
  var SURNAMES = ['Abad', 'Bautista', 'Castillo', 'Dela Cruz', 'Estrada', 'Flores', 'Garcia', 'Hernandez', 'Ignacio', 'Jimenez', 'Katigbak', 'Lopez', 'Mendoza', 'Navarro', 'Ocampo', 'Pascual', 'Quizon', 'Ramos', 'Santos', 'Tolentino', 'Ubaldo', 'Villanueva', 'Yap', 'Zamora', 'Aquino', 'Bonifacio', 'Cruz', 'Domingo', 'Evangelista', 'Fernandez', 'Gonzales', 'Ilagan', 'Lim', 'Macapagal', 'Natividad', 'Reyes', 'Salazar', 'Torres', 'Valdez'];
  gen.clerical = [
    function alphaFirst() {
      var names = shuffle(SURNAMES).slice(0, 4);
      var sorted = names.slice().sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
      return mk(gid('c'), SUB, 'clerical', 'Alphabetical filing', 'Which surname comes FIRST in an alphabetical file?', sorted[0], sorted.slice(1), 'Alphabetical order compares letters from left to right: ' + sorted.join(', ') + '.');
    },
    function alphaLast() {
      var names = shuffle(SURNAMES).slice(0, 4);
      var sorted = names.slice().sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
      return mk(gid('c'), SUB, 'clerical', 'Alphabetical filing', 'Which surname comes LAST in an alphabetical file?', sorted[3], sorted.slice(0, 3), 'Alphabetical order: ' + sorted.join(', ') + '.');
    },
    function alphaOrder() {
      var names = shuffle(SURNAMES).slice(0, 3);
      var sorted = names.slice().sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
      var right = sorted.join(', ');
      var wrong = [];
      while (wrong.length < 3) { var s = shuffle(names).join(', '); if (s !== right && wrong.indexOf(s) < 0) wrong.push(s); }
      return mk(gid('c'), SUB, 'clerical', 'Alphabetical filing', 'Which shows the surnames in correct alphabetical order?', right, wrong, 'Correct order: ' + right + '.');
    },
    function compare() {
      var n = ri(5000, 9999999).toString(), same = Math.random() < 0.5;
      var other = n;
      if (!same) {
        var p = rnd(n.length), d = String((Number(n[p]) + ri(1, 8)) % 10);
        other = n.slice(0, p) + d + n.slice(p + 1);
      }
      return mk(gid('c'), SUB, 'clerical', 'Number checking', 'Are these two numbers the SAME or DIFFERENT?   ' + n + '   vs   ' + other, same ? 'Same' : 'Different', same ? ['Different', 'Cannot be determined', 'Not enough information'] : ['Same', 'Cannot be determined', 'Not enough information'], 'Compare digit by digit: ' + n + (same ? ' = ' : ' != ') + other + '.');
    },
    function countMatches() {
      var tgt = String(ri(1, 9)), list = [], hits = 0;
      for (var i = 0; i < 12; i++) { var d = String(ri(1, 9)); if (d === tgt) hits++; list.push(d); }
      return mk(gid('c'), SUB, 'clerical', 'Number checking', 'How many times does the digit ' + tgt + ' appear in this list?   ' + list.join(' '), hits, numWrongs(hits, 1), 'Count carefully: the digit ' + tgt + ' appears ' + hits + ' time(s).');
    },
    function fileNumber() {
      var nums = []; while (nums.length < 4) { var x = ri(100, 999); if (nums.indexOf(x) < 0) nums.push(x); }
      var sorted = nums.slice().sort(function (a, b) { return a - b; });
      return mk(gid('c'), SUB, 'clerical', 'Numerical filing', 'In a numerical file (smallest to largest), which number comes SECOND?', sorted[1], [sorted[0], sorted[2], sorted[3]], 'Order: ' + sorted.join(', ') + '.');
    },
    function misspelledCheck() {
      var p = pick(SPELL);
      return mk(gid('c'), SUB, 'clerical', 'Spelling', 'Which of the following is misspelled?', p[1], [p[0], 'office', 'document'], 'The correct spelling is "' + p[0] + '", so "' + p[1] + '" is misspelled. (The other options are correctly spelled.)');
    },
    function tallies() {
      var a = ri(10, 40), b = ri(10, 40), c = ri(10, 40);
      var ans = a + b + c;
      return mk(gid('c'), SUB, 'clerical', 'Basic arithmetic checking', 'Three offices received ' + a + ', ' + b + ' and ' + c + ' letters. What is the total number of letters received?', ans, numWrongs(ans, 3), a + ' + ' + b + ' + ' + c + ' = ' + ans + '.');
    }
  ];

  /* =====================================================================
     EXPORT
     ===================================================================== */
  function fromHand(list, area, prefix) {
    return list.map(function (r, i) { return mk(prefix + '-' + (i + 1), r[0], area, r[1], r[2], r[3], r[4], r[5]); });
  }

  var FIXED = []
    .concat(fromHand(G, 'general', 'gi'))
    .concat(fromHand(V, 'verbal', 'vb'))
    .concat(fromHand(A, 'analytical', 'an'));

  /* Areas per level (item share is used to build mock exams). */
  var LEVELS = {
    pro: {
      label: 'Professional', desc: 'For second-level (professional/technical) positions',
      areas: ['verbal', 'numerical', 'analytical', 'general'],
      mix: { verbal: 0.30, numerical: 0.25, analytical: 0.25, general: 0.20 },
      fullItems: 170, fullMinutes: 190
    },
    sub: {
      label: 'Subprofessional', desc: 'For first-level (clerical/trades) positions',
      areas: ['verbal', 'numerical', 'clerical', 'general'],
      mix: { verbal: 0.30, numerical: 0.30, clerical: 0.20, general: 0.20 },
      fullItems: 165, fullMinutes: 160
    }
  };
  var AREAS = {
    verbal: { label: 'Verbal', icon: 'V' },
    numerical: { label: 'Numerical', icon: 'N' },
    analytical: { label: 'Analytical', icon: 'A' },
    general: { label: 'General Info', icon: 'G' },
    clerical: { label: 'Clerical', icon: 'C' }
  };

  function fixedFor(level, area) {
    return FIXED.filter(function (q) { return q.area === area && q.levels.indexOf(level) >= 0; });
  }

  /* Produce n questions for (level, area). Mixes fixed hand-written items with
     generated ones so every session feels different; de-dupes by question text. */
  function getQuestions(level, area, n) {
    var out = [], seen = {};
    var fixed = shuffle(fixedFor(level, area));
    var gens = gen[area] || [];
    function push(q) {
      if (!q || q.levels.indexOf(level) < 0) return false;
      var key = q.q + '|' + q.choices.join('|');
      if (seen[key]) return false;
      seen[key] = 1; out.push(q); return true;
    }
    // Fixed items are curated, so favor them; top up with generated ones.
    var fixedShare = gens.length ? Math.ceil(n * 0.6) : n;
    fixed.slice(0, fixedShare).forEach(push);
    var guard = 0;
    while (out.length < n && guard++ < n * 40) {
      if (gens.length) {
        var f = pick(gens);
        // some generators are level-specific; retry until accepted
        push(f());
      } else if (fixed.length) {
        push(fixed[rnd(fixed.length)]);
        if (guard > fixed.length * 3) break;
      } else break;
    }
    return shuffle(out).slice(0, n);
  }

  function poolSize(level, area) {
    var g = (gen[area] || []).length ? '+' : '';
    return fixedFor(level, area).length + g;
  }

  window.CSEBank = {
    LEVELS: LEVELS, AREAS: AREAS,
    getQuestions: getQuestions, poolSize: poolSize, fixedFor: fixedFor,
    fixedCount: function () { return FIXED.length; },
    shuffle: shuffle
  };
})();
