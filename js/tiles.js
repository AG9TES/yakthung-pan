/**
 * Yakthung Pan • Village Phrases Tile Builder Engine (Mode C)
 * Interactive sentence/phrase constructor for Phedape Limbu conversation.
 */

function initVillageTiles() {
    session.stepIdx = 0;
    loadVillagePhraseStep();
}

function loadVillagePhraseStep() {
    const total = VILLAGE_PHRASES.length;
    const item = VILLAGE_PHRASES[session.stepIdx];
    session.tileSelected = [];
    session.tileChecked = false;

    const lvlNum = (session.activeLevel && session.activeLevel.levelNum) ? session.activeLevel.levelNum : 21;
    const lvlTitle = (session.activeLevel && session.activeLevel.title) ? session.activeLevel.title : 'Phedape Conversations';
    document.getElementById('lessonHeaderTitle').textContent = `Level ${lvlNum} • ${lvlTitle}`;
    document.getElementById('lessonStepCounter').textContent = `${session.stepIdx + 1} / ${total}`;
    document.getElementById('lessonProgressBar').style.width = `${Math.round(((session.stepIdx + 1) / total) * 100)}%`;

    document.getElementById('tilePromptEmoji').textContent = item.emoji;
    document.getElementById('tilePromptEnglish').textContent = item.english;
    document.getElementById('tilePromptNepali').textContent = item.nepali;
    document.getElementById('tileFeedbackBox').classList.add('hidden');

    const combined = [
        ...item.tiles.map((t, idx) => ({ ...t, uid: `ans_${idx}` })),
        ...item.distractors.map((d, idx) => ({ ...d, uid: `dist_${idx}` }))
    ].sort(() => Math.random() - 0.5);

    session.tileBank = combined;
    renderTileTrays();
}

function playCurrentTileAudio() {
    const item = VILLAGE_PHRASES ? VILLAGE_PHRASES[session.stepIdx] : null;
    if (item) {
        AudioSystem.playItem(item, 440);
    }
}

function renderTileTrays() {
    const ansTray = document.getElementById('tileAnswerTray');
    const bankTray = document.getElementById('tileBankTray');
    const actionBtn = document.getElementById('tileActionBtn');
    if (!ansTray || !bankTray || !actionBtn) return;

    ansTray.innerHTML = '';
    if (session.tileSelected.length === 0) {
        ansTray.innerHTML = '<span class="text-xs text-slate-400 italic">Tap tiles below to build the phrase...</span>';
    } else {
        session.tileSelected.forEach(tile => {
            const chip = document.createElement('button');
            chip.className = 'px-3 py-2 rounded-xl bg-slatebrand-900 text-white shadow-xs flex flex-col items-center active:scale-95 transition';
            chip.innerHTML = `
                <span class="font-limbu text-lg text-goldaccent-400 leading-none">${tile.limbu}</span>
                <span class="text-[10px] font-bold mt-0.5">${tile.latin}</span>
            `;
            chip.onclick = () => {
                if (session.tileChecked) return;
                session.tileSelected = session.tileSelected.filter(t => t.uid !== tile.uid);
                renderTileTrays();
            };
            ansTray.appendChild(chip);
        });
    }

    bankTray.innerHTML = '';
    session.tileBank.forEach(tile => {
        const isUsed = session.tileSelected.some(s => s.uid === tile.uid);
        const chip = document.createElement('button');
        chip.disabled = isUsed || session.tileChecked;
        chip.className = isUsed
            ? 'px-3 py-2 rounded-xl bg-slate-200/60 border border-slate-300 text-transparent select-none'
            : 'px-3 py-2 rounded-xl bg-white hover:bg-parchment-50 border-2 border-parchment-300 shadow-xs flex flex-col items-center active:scale-95 transition';
        chip.innerHTML = `
            <span class="font-limbu text-lg ${isUsed ? 'opacity-0' : 'text-slatebrand-900'} leading-none">${tile.limbu}</span>
            <span class="text-[10px] font-bold mt-0.5 ${isUsed ? 'opacity-0' : 'text-emerald-700'}">${tile.latin}</span>
        `;
        chip.onclick = () => {
            playTone(493.9, 'note');
            session.tileSelected.push(tile);
            renderTileTrays();
        };
        bankTray.appendChild(chip);
    });

    if (!session.tileChecked) {
        if (session.tileSelected.length > 0) {
            actionBtn.disabled = false;
            actionBtn.className = 'flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow transition active:scale-95';
            actionBtn.textContent = 'Check Answer';
        } else {
            actionBtn.disabled = true;
            actionBtn.className = 'flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-slate-300 text-slate-500 cursor-not-allowed transition';
            actionBtn.textContent = 'Check Answer';
        }
    }
}

function clearCurrentTileSelection() {
    if (session.tileChecked) return;
    session.tileSelected = [];
    renderTileTrays();
}

function handleTileAction() {
    const item = VILLAGE_PHRASES[session.stepIdx];
    const fb = document.getElementById('tileFeedbackBox');
    const actionBtn = document.getElementById('tileActionBtn');

    if (!session.tileChecked) {
        const expected = item.tiles.map(t => t.latin).join(' ');
        const actual = session.tileSelected.map(t => t.latin).join(' ');
        const isRight = expected === actual;

        fb.classList.remove('hidden');
        if (isRight) {
            session.tileChecked = true;
            playTone(523.25, 'success');
            fb.className = 'p-3 rounded-2xl text-xs font-bold text-center bg-emerald-100 text-emerald-900 border border-emerald-300';
            fb.textContent = `✓ Sewaro! "${item.tiles.map(t => t.limbu).join(' ')}" (${expected}) is right!`;
            actionBtn.className = 'flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow transition active:scale-95';
            actionBtn.textContent = (session.stepIdx < VILLAGE_PHRASES.length - 1) ? 'Next Phrase →' : 'Complete Finale →';
            renderTileTrays();
        } else {
            playTone(165, 'error');
            fb.className = 'p-3 rounded-2xl text-xs font-bold text-center bg-rose-100 text-rose-900 border border-rose-300';
            fb.textContent = `✗ Try again! Expected order: ${expected}`;
        }
    } else {
        if (session.stepIdx < VILLAGE_PHRASES.length - 1) {
            session.stepIdx++;
            loadVillagePhraseStep();
        } else {
            completeLevelWithStars(3, 120, 'Completed all Phedape Conversations & Phrases!');
        }
    }
}

