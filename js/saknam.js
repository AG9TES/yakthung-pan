/**
 * Yakthung Pan • Saknam-sak Matras & Marks Engine (Mode D)
 * Interactive builder for 8 Matras, 7 Chuk-sak finals, Conjuncts, and Sound marks.
 */

function initSaknamBuilder(lvl) {
    session.saknamItems = lvl.items ? [...lvl.items] : [];
    session.stepIdx = 0;
    session.saknamCorrectCount = 0;
    session.extraSaknamFilter = (lvl.levelNum === 13.2 || String(lvl.levelNum) === '13.2') ? 'marks' : 'finals';
    renderSaknamStep();
}

function switchExtraSaknamMode(mode) {
    const allFinals = (typeof CHUK_LEVEL_13_1_ITEMS !== 'undefined' ? CHUK_LEVEL_13_1_ITEMS : []);
    const allMarks = (typeof MARKS_LEVEL_13_2_ITEMS !== 'undefined' ? MARKS_LEVEL_13_2_ITEMS : []);

    if (mode === 'finals') {
        session.saknamItems = [...allFinals];
    } else if (mode === 'marks') {
        session.saknamItems = [...allMarks];
    } else {
        session.saknamItems = [...allFinals, ...allMarks];
    }
    session.extraSaknamFilter = mode;
    session.stepIdx = 0;
    session.saknamCorrectCount = 0;
    renderSaknamStep();
}

const CHUK_SAK_7_PAIRS = [
    { id: 'c_k', full: 'ᤁ', half: 'ᤰ', deva: 'क्', fullDeva: 'क', latin: 'k', fontKey: 'Z = ट' },
    { id: 'c_ng', full: 'ᤅ', half: 'ᤱ', deva: 'ङ्', fullDeva: 'ङ', latin: 'ng', fontKey: 'उ° = ०' },
    { id: 'c_t', full: 'ᤋ', half: 'ᤳ', deva: 'त्', fullDeva: 'त', latin: 't', fontKey: '३ = ⌒' },
    { id: 'c_p', full: 'ᤐ', half: 'ᤵ', deva: 'प्', fullDeva: 'प', latin: 'p', fontKey: 'w = ч' },
    { id: 'c_m', full: 'ᤔ', half: 'ᤶ', deva: 'म्', fullDeva: 'म', latin: 'm', fontKey: 'य = ५' },
    { id: 'c_r', full: 'ᤖ', half: 'ᤷ', deva: 'र्', fullDeva: 'र', latin: 'r', fontKey: 'र = ,' },
    { id: 'c_l', full: 'ᤗ', half: 'ᤸ', deva: 'ल्', fullDeva: 'ल', latin: 'l', fontKey: 'u = प' }
];

function toggleChukBookChart() {
    const box = document.getElementById('chukBookChartBox');
    const txt = document.getElementById('chukBookChartToggleText');
    if (!box) return;
    const isHidden = box.classList.contains('hidden');
    if (isHidden) {
        box.classList.remove('hidden');
        if (txt) txt.textContent = 'Hide Chart';
    } else {
        box.classList.add('hidden');
        if (txt) txt.textContent = 'Book Chart';
    }
}
if (typeof window !== 'undefined') window.toggleChukBookChart = toggleChukBookChart;

function renderChukSakPills(activeIdx) {
    const container = document.getElementById('chukSakPillsContainer');
    if (!container) return;
    container.innerHTML = '';

    CHUK_SAK_7_PAIRS.forEach((pair, idx) => {
        const isActive = (idx === activeIdx);
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = isActive
            ? 'p-1.5 rounded-xl bg-emerald-600 text-white font-black text-center shadow-sm border border-emerald-500 ring-2 ring-emerald-400 active:scale-95 transition cursor-pointer'
            : 'p-1.5 rounded-xl bg-white hover:bg-parchment-100 text-slate-800 font-bold text-center border border-parchment-300 shadow-2xs active:scale-95 transition cursor-pointer';

        const svgDef = (typeof CHUK_SVG_PATHS !== 'undefined' && CHUK_SVG_PATHS[pair.id]);
        const halfVisual = svgDef 
            ? `<svg viewBox="0 0 ${svgDef.width} ${svgDef.height}" class="w-4 h-4 ${isActive ? 'fill-white' : 'fill-slate-800'} inline-block align-middle"><path d="${svgDef.d}" /></svg>`
            : `<span class="font-limbu">${pair.half}</span>`;

        pill.innerHTML = `
            <div class="flex items-center justify-center gap-1 text-xs sm:text-sm font-black leading-tight">
                <span class="font-limbu">${pair.full}</span>
                <span class="text-[10px] opacity-70">➔</span>
                ${halfVisual}
            </div>
            <div class="text-[9px] font-bold ${isActive ? 'text-emerald-100' : 'text-slate-500'}">चुक् (${pair.deva})</div>
        `;
        pill.title = `Full letter ${pair.full} (${pair.fullDeva}) = Half letter ${pair.half} (${pair.deva}) [${pair.fontKey}]`;
        pill.onclick = () => {
            if (typeof AudioSystem !== 'undefined' && AudioSystem.playTone) {
                AudioSystem.playTone(330 + idx * 40, 'triangle', 0.2);
            }
            if (typeof showToast === 'function') {
                showToast(`Half Letter: ${pair.full} (${pair.fullDeva}) ➔ ${pair.half} (${pair.deva}) [${pair.fontKey}]`, '🔤');
            }
        };
        container.appendChild(pill);
    });
}

function renderSaknamStep() {
    if (!session.saknamItems || !session.saknamItems.length) return;
    const total = session.saknamItems.length;
    const item = session.saknamItems[session.stepIdx];
    session.saknamAnswered = false;

    document.getElementById('lessonHeaderTitle').textContent = `Level ${session.activeLevel.levelNum} • ${session.activeLevel.title}`;
    document.getElementById('lessonStepCounter').textContent = `${session.stepIdx + 1} / ${total}`;
    document.getElementById('lessonProgressBar').style.width = `${Math.round(((session.stepIdx + 1) / total) * 100)}%`;

    document.getElementById('saknamBadge').textContent = item.badge;
    document.getElementById('saknamInstruction').textContent = item.instruction;
    document.getElementById('saknamTargetDeva').textContent = item.targetDeva;
    document.getElementById('saknamTargetLatin').textContent = item.targetLatin;
    document.getElementById('saknamRuleTitle').textContent = item.ruleTitle;
    document.getElementById('saknamRuleDesc').textContent = item.ruleDesc;
    document.getElementById('saknamFeedbackBox').classList.add('hidden');

    // Level 15 Half-Letters (Chuk-sak) Banner
    const isChukLevel = session.activeLevel && (session.activeLevel.levelNum === 15 || String(session.activeLevel.levelNum) === '15');
    const chukBanner = document.getElementById('saknamChukSakBanner');
    const eqBox = document.getElementById('saknamHalfLetterEquation');

    if (chukBanner) {
        if (isChukLevel) {
            chukBanner.classList.remove('hidden');
            renderChukSakPills(session.stepIdx);
        } else {
            chukBanner.classList.add('hidden');
        }
    }

    if (eqBox) {
        if (item.fullLetter && item.halfLetter) {
            eqBox.classList.remove('hidden');
            const fullEl = document.getElementById('eqFullConsonant');
            const halfEl = document.getElementById('eqHalfConsonant');
            const devaEl = document.getElementById('eqHalfDeva');
            if (fullEl) fullEl.textContent = `${item.fullLetter} (${item.fullDeva || ''})`;
            if (halfEl) halfEl.textContent = item.halfLetter;
            if (devaEl) devaEl.textContent = `चुक् (${item.devaHalf || ''}) आधा अक्षर`;
        } else {
            eqBox.classList.add('hidden');
        }
    }

    const extraBanner = document.getElementById('saknamExtraBanner');
    if (extraBanner) {
        const isExtra = session.activeLevel && (session.activeLevel.isExtra || session.activeLevel.levelNum === 13.1 || session.activeLevel.levelNum === 13.2 || String(session.activeLevel.levelNum) === '13.1' || String(session.activeLevel.levelNum) === '13.2');
        if (isExtra) {
            extraBanner.classList.remove('hidden');
            const img = document.getElementById('saknamBannerImg');
            if (img) img.src = 'img/extra_chuk_ektum.png';

            // Update mode filter buttons
            const curFilter = session.extraSaknamFilter || 'finals';
            const allBtn = document.getElementById('extraFilterAllBtn');
            const finalsBtn = document.getElementById('extraFilterFinalsBtn');
            const marksBtn = document.getElementById('extraFilterMarksBtn');

            if (allBtn && finalsBtn && marksBtn) {
                const activeCls = 'flex-1 py-1 px-2 rounded-lg text-[10px] font-extrabold transition bg-emerald-700 text-white shadow-2xs';
                const inactiveCls = 'flex-1 py-1 px-2 rounded-lg text-[10px] font-extrabold transition bg-parchment-100 text-slate-700 hover:bg-parchment-200';

                allBtn.className = (curFilter === 'all') ? activeCls : inactiveCls;
                finalsBtn.className = (curFilter === 'finals') ? activeCls : inactiveCls;
                marksBtn.className = (curFilter === 'marks') ? activeCls : inactiveCls;
            }
        } else {
            extraBanner.classList.add('hidden');
        }
    }

    const nextBtn = document.getElementById('saknamNextBtn');
    nextBtn.disabled = true;
    nextBtn.className = 'w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-slate-300 text-slate-500 cursor-not-allowed transition';
    nextBtn.textContent = 'Select the Matching Form';

    const grid = document.getElementById('saknamOptionsGrid');
    grid.innerHTML = '';

    item.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'p-3.5 rounded-2xl bg-white hover:bg-parchment-50 border-2 border-parchment-300 text-center shadow-xs active:scale-95 transition flex flex-col items-center justify-center gap-1';
        btn.innerHTML = `
            <span class="font-limbu text-3xl text-slatebrand-900 leading-tight">${opt.limbu}</span>
            <span class="text-xs font-extrabold text-slate-700">${opt.label}</span>
        `;
        btn.onclick = () => selectSaknamOption(btn, opt.limbu === item.answer, item);
        grid.appendChild(btn);
    });
}

function playCurrentSaknamAudio() {
    const item = session.saknamItems ? session.saknamItems[session.stepIdx] : null;
    if (item) {
        AudioSystem.playItem(item, 440);
    }
}

function selectSaknamOption(clickedBtn, isCorrect, item) {
    if (session.saknamAnswered) return;
    session.saknamAnswered = true;

    const allBtns = document.querySelectorAll('#saknamOptionsGrid button');
    allBtns.forEach(b => {
        b.disabled = true;
        b.classList.remove('active:scale-95', 'hover:bg-parchment-50');
    });

    const fb = document.getElementById('saknamFeedbackBox');
    fb.classList.remove('hidden');

    if (isCorrect) {
        playTone(523.25, 'success');
        session.saknamCorrectCount++;
        clickedBtn.className = 'p-3.5 rounded-2xl bg-emerald-600 border-2 border-emerald-600 text-white font-bold shadow-md';
        fb.className = 'p-3 rounded-2xl text-xs font-bold text-center bg-emerald-100 text-emerald-900 border border-emerald-300';
        fb.textContent = `✓ Perfect! ${item.ruleTitle} creates ${item.answer}.`;
    } else {
        playTone(165, 'error');
        clickedBtn.className = 'p-3.5 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold';
        allBtns.forEach(b => {
            const limbuText = b.querySelector('.font-limbu');
            if (limbuText && limbuText.textContent === item.answer) {
                b.className = 'p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold';
            }
        });
        fb.className = 'p-3 rounded-2xl text-xs font-bold text-center bg-rose-100 text-rose-900 border border-rose-300';
        fb.textContent = `✗ Not quite! Correct combination: ${item.ruleTitle} → ${item.answer}.`;
    }

    const nextBtn = document.getElementById('saknamNextBtn');
    nextBtn.disabled = false;
    nextBtn.className = 'w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow transition active:scale-95';
    nextBtn.textContent = (session.stepIdx < session.saknamItems.length - 1) ? 'Next Challenge →' : 'Complete Challenge →';
}

function advanceSaknamStep() {
    if (!session.saknamAnswered) return;
    if (session.stepIdx < session.saknamItems.length - 1) {
        session.stepIdx++;
        renderSaknamStep();
    } else {
        const total = session.saknamItems.length;
        const ratio = session.saknamCorrectCount / total;
        const pct = Math.round(ratio * 100);
        const threshold = session.activeLevel.passThreshold || 70;

        if (session.activeLevel.isBoss && pct < threshold) {
            showBossQuizRetry(session.saknamCorrectCount, total, pct, threshold);
        } else {
            const stars = ratio >= 0.85 ? 3 : (ratio >= 0.65 ? 2 : 1);
            completeLevelWithStars(stars, session.activeLevel.xpReward || 80, `Scored ${session.saknamCorrectCount} / ${total} on ${session.activeLevel.title}!`);
        }
    }
}

