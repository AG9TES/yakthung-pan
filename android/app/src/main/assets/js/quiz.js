/**
 * Yakthung Pan • Boss Recognition Quiz Engine (Mode B)
 * Rapid forward & reverse recognition quizzes with a 70% mastery threshold.
 */

function buildQuizQuestionForTarget(target, pool) {
    const distractors = pool
        .filter(item => item.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    return { target, options };
}

function initBossQuiz(lvl) {
    const pool = lvl.poolIds.map(id => getLetterById(id));
    const count = lvl.questionCount || 8;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));

    session.quizQuestions = shuffled.map(target => buildQuizQuestionForTarget(target, pool));
    session.stepIdx = 0;
    session.quizCorrectCount = 0;
    session.quizMissedItems = [];
    session.quizRequeuedIds = [];
    renderQuizQuestion();
}

function updateQuizPassMeter() {
    const total = session.quizQuestions.length;
    const pct = total > 0 ? Math.round((session.quizCorrectCount / total) * 100) : 0;
    const threshold = session.activeLevel.passThreshold || 70;

    const scoreTag = document.getElementById('quizScoreTag');
    const accuracyLbl = document.getElementById('quizAccuracyLabel');
    const fillBar = document.getElementById('quizPassFillBar');

    if (scoreTag) scoreTag.textContent = `${session.quizCorrectCount}/${total} (${pct}%)`;
    if (accuracyLbl) accuracyLbl.textContent = `Current Score: ${pct}%`;

    if (fillBar) {
        fillBar.style.width = `${pct}%`;
        fillBar.className = pct >= threshold
            ? 'h-full bg-emerald-500 transition-all duration-300'
            : 'h-full bg-amber-400 transition-all duration-300';
    }
}

function renderQuizQuestion() {
    const lvl = session.activeLevel;
    const total = session.quizQuestions.length;
    const q = session.quizQuestions[session.stepIdx];
    const isReverse = lvl.quizMode === 'reverse';
    session.quizAnswered = false;

    document.getElementById('lessonHeaderTitle').textContent = `Level ${lvl.levelNum} • ${lvl.title}`;
    document.getElementById('lessonStepCounter').textContent = `${session.stepIdx + 1} / ${total}`;
    document.getElementById('lessonProgressBar').style.width = `${Math.round(((session.stepIdx + 1) / total) * 100)}%`;
    document.getElementById('quizBossBadge').textContent = isReverse
        ? `🔥 Reverse Boss • ${lvl.passThreshold || 70}% Goal`
        : `👑 Boss Quiz • ${lvl.passThreshold || 70}% Goal`;

    updateQuizPassMeter();

    const bigGlyphEl = document.getElementById('quizBigGlyph');
    const revDevaEl = document.getElementById('quizReverseDeva');
    const revHintEl = document.getElementById('quizReverseHint');
    const promptSubEl = document.getElementById('quizPromptSub');

    if (isReverse) {
        promptSubEl.textContent = 'Select the matching Sirijonga character for:';
        bigGlyphEl.classList.add('hidden');
        revDevaEl.classList.remove('hidden');
        revHintEl.classList.remove('hidden');
        revDevaEl.textContent = `${q.target.latin} (${q.target.deva})`;
        revHintEl.textContent = `${q.target.emoji || '✦'} As in "${q.target.wordLatin || q.target.latin}" (${(q.target.meaning || '').split('/')[0].trim()})`;
    } else {
        promptSubEl.textContent = 'Identify this Sirijonga character:';
        bigGlyphEl.classList.remove('hidden');
        revDevaEl.classList.add('hidden');
        revHintEl.classList.add('hidden');
        bigGlyphEl.textContent = q.target.char;
    }

    document.getElementById('quizFeedbackBox').classList.add('hidden');

    const nextBtn = document.getElementById('quizNextBtn');
    nextBtn.disabled = true;
    nextBtn.className = 'w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-slate-300 text-slate-500 cursor-not-allowed transition';
    nextBtn.textContent = 'Select an Answer';

    const grid = document.getElementById('quizOptionsGrid');
    grid.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.dataset.optId = opt.id;
        btn.className = 'p-3.5 rounded-2xl bg-white hover:bg-parchment-50 border-2 border-parchment-300 text-center shadow-xs active:scale-95 transition flex flex-col items-center justify-center gap-0.5';
        if (isReverse) {
            btn.innerHTML = `
                <span class="font-limbu text-4xl text-slatebrand-900 leading-tight py-1">${opt.char}</span>
            `;
        } else {
            btn.innerHTML = `
                <span class="text-lg font-extrabold text-slatebrand-900">${opt.latin}</span>
                <span class="font-deva text-sm font-bold text-emerald-700">${opt.deva}</span>
                <span class="text-[10px] text-slate-500 font-semibold">${opt.wordLatin || opt.latin}</span>
            `;
        }
        btn.onclick = () => selectQuizOption(btn, opt.id === q.target.id, q.target);
        grid.appendChild(btn);
    });
}

function playQuizPromptAudio() {
    const q = session.quizQuestions ? session.quizQuestions[session.stepIdx] : null;
    if (q && q.target) {
        AudioSystem.playItem(q.target);
    }
}

function selectQuizOption(clickedBtn, isCorrect, target) {
    if (session.quizAnswered) return;
    session.quizAnswered = true;

    const allBtns = document.querySelectorAll('#quizOptionsGrid button');
    allBtns.forEach(b => {
        b.disabled = true;
        b.classList.remove('active:scale-95', 'hover:bg-parchment-50');
        if (b.dataset.optId === target.id) {
            b.className = 'p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-md';
        }
    });

    const fb = document.getElementById('quizFeedbackBox');
    fb.classList.remove('hidden');

    if (isCorrect) {
        playTone(523.25, 'success');
        session.quizCorrectCount++;
        clickedBtn.className = 'p-3.5 rounded-2xl bg-emerald-600 border-2 border-emerald-600 text-white font-bold shadow-md';
        fb.className = 'p-3 rounded-2xl text-xs font-bold text-center bg-emerald-100 text-emerald-900 border border-emerald-300';
        fb.textContent = `✓ Correct! ${target.char} represents ${target.latin} (${target.deva}).`;
    } else {
        playTone(165, 'error');
        clickedBtn.className = 'p-3.5 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold';
        if (!session.quizMissedItems.some(i => i.id === target.id)) {
            session.quizMissedItems.push(target);
        }

        // Dynamically re-queue missed letter once during the round
        if (!session.quizRequeuedIds.includes(target.id) && session.quizRequeuedIds.length < 2) {
            session.quizRequeuedIds.push(target.id);
            const pool = session.activeLevel.poolIds.map(id => getLetterById(id));
            session.quizQuestions.push(buildQuizQuestionForTarget(target, pool));
            document.getElementById('lessonStepCounter').textContent = `${session.stepIdx + 1} / ${session.quizQuestions.length}`;
        }

        fb.className = 'p-3 rounded-2xl text-xs font-bold text-center bg-rose-100 text-rose-900 border border-rose-300';
        fb.textContent = `✗ Not quite! ${target.char} is ${target.latin} (${target.deva}). We'll review it again!`;
    }

    updateQuizPassMeter();

    const nextBtn = document.getElementById('quizNextBtn');
    nextBtn.disabled = false;
    nextBtn.className = 'w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow transition active:scale-95';
    nextBtn.textContent = (session.stepIdx < session.quizQuestions.length - 1) ? 'Next Question →' : 'See Boss Quiz Results →';
}

function advanceQuizStep() {
    if (!session.quizAnswered) return;
    if (session.stepIdx < session.quizQuestions.length - 1) {
        session.stepIdx++;
        renderQuizQuestion();
    } else {
        const lvl = session.activeLevel;
        const total = session.quizQuestions.length;
        const score = session.quizCorrectCount;
        const pct = Math.round((score / total) * 100);
        const threshold = lvl.passThreshold || 70;

        if (pct >= threshold) {
            const stars = pct >= 90 ? 3 : (pct >= 80 ? 2 : 1);
            completeLevelWithStars(stars, lvl.xpReward || 80, `Boss Score: ${score}/${total} (${pct}%) — Passed 70% Goal!`);
        } else {
            showBossQuizRetry(score, total, pct, threshold);
        }
    }
}

function showBossQuizRetry(score, total, pct, threshold) {
    try { playTone(165, 'error'); } catch (e) {}
    showLessonWorkspace('retryWorkspace');

    document.getElementById('retryScorePct').textContent = `${pct}%`;
    document.getElementById('retrySubText').textContent = `You got ${score} out of ${total} (${pct}%). You need at least ${threshold}% to pass ${session.activeLevel.title} and unlock Level ${session.activeLevel.levelNum + 1}.`;

    const missedBox = document.getElementById('retryMissedBox');
    const missedChips = document.getElementById('retryMissedChips');
    missedChips.innerHTML = '';

    if (session.quizMissedItems.length > 0) {
        missedBox.classList.remove('hidden');
        session.quizMissedItems.forEach(item => {
            const chip = document.createElement('button');
            chip.className = 'px-2.5 py-1 rounded-xl bg-parchment-50 border border-parchment-300 flex items-center gap-1.5 text-xs font-bold active:scale-95';
            chip.innerHTML = `
                <span class="font-limbu text-lg text-slatebrand-900">${item.char}</span>
                <span class="text-emerald-700">${item.latin}</span>
                <span class="font-deva text-[11px] text-slate-500">(${item.deva})</span>
            `;
            chip.onclick = () => AudioSystem.playItem(item);
            missedChips.appendChild(chip);
        });
    } else {
        missedBox.classList.add('hidden');
    }
}

function retryCurrentBossQuiz() {
    if (session.activeLevel.type === 'saknam') {
        showLessonWorkspace('saknamWorkspace');
        initSaknamBuilder(session.activeLevel);
    } else {
        showLessonWorkspace('quizWorkspace');
        initBossQuiz(session.activeLevel);
    }
}

