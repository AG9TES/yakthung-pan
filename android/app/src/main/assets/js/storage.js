/**
 * Yakthung Pan • Persistent State & Developer Testing Mode
 * Handles localStorage persistence, daily streaks, XP, HUD, and Dev Mode toggles.
 */

const STORAGE_KEY = 'yakthung_pan_final_v1';

let devMode = false; // Normal adventure progression by default
try {
    const savedDev = localStorage.getItem('yakthung_dev_mode');
    devMode = (savedDev === 'true');
} catch (e) {
    devMode = false;
}

let progress = {
    unlockedLevel: 1,
    levelStars: {},         // { 1: 3, 2: 2, ... }
    masteredChars: [],      // up to 45 traceable items
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toDateString()
};

// Computes the actual unlocked level based on sequential stars
function getEffectiveUnlockedLevel() {
    if (typeof ADVENTURE_LEVELS === 'undefined' || !ADVENTURE_LEVELS.length) return 1;
    for (let i = 0; i < ADVENTURE_LEVELS.length; i++) {
        const lvl = ADVENTURE_LEVELS[i];
        const stars = progress.levelStars[lvl.levelNum] || progress.levelStars[String(lvl.levelNum)] || 0;
        if (stars === 0) {
            return lvl.levelNum; // Next level player needs to conquer
        }
    }
    return ADVENTURE_LEVELS[ADVENTURE_LEVELS.length - 1].levelNum;
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            progress = { ...progress, ...parsed };

            const today = new Date().toDateString();
            if (progress.lastActiveDate !== today) {
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                progress.streak = (progress.lastActiveDate === yesterday) ? (progress.streak + 1) : 1;
                progress.lastActiveDate = today;
                saveProgress();
            }
        } else {
            saveProgress();
        }

        // Self-heal: ensure unlockedLevel matches actual stars so map never opens in the middle
        const effective = getEffectiveUnlockedLevel();
        if (!devMode && Number(progress.unlockedLevel) > Number(effective)) {
            progress.unlockedLevel = effective;
            saveProgress();
        }
    } catch (e) {
        console.warn('Could not read localStorage:', e);
    }
    updateHudDisplay();
}

function saveProgress() {
    try {
        progress.lastActiveDate = new Date().toDateString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.warn('Could not save localStorage:', e);
    }
    updateHudDisplay();

    // Automatically sync cloud & notify Admin Dashboard of real-time progress
    if (typeof syncCloudProgress === 'function') {
        try { syncCloudProgress(false); } catch (e) {}
    }
}

function updateHudDisplay() {
    const streakEl = document.getElementById('hudStreak');
    const xpEl = document.getElementById('hudXp');
    const masteredEl = document.getElementById('hudMastered');
    const summaryEl = document.getElementById('modalStatsSummary');

    if (streakEl) streakEl.textContent = progress.streak;
    if (xpEl) xpEl.textContent = progress.xp;
    const totalChars = (typeof ALL_TRACEABLE_ITEMS !== 'undefined' && ALL_TRACEABLE_ITEMS.length) ? ALL_TRACEABLE_ITEMS.length : 45;
    if (masteredEl) masteredEl.textContent = `${progress.masteredChars.length}/${totalChars}`;
    if (summaryEl) {
        summaryEl.textContent = `${progress.masteredChars.length}/${totalChars} Characters Mastered • ${progress.xp} XP`;
    }
}

// Developer Mode Controller
function toggleDevMode() {
    devMode = !devMode;
    try {
        localStorage.setItem('yakthung_dev_mode', devMode ? 'true' : 'false');
    } catch (e) {}
    updateDevModeUI();
    if (typeof renderWindingMap === 'function') renderWindingMap();
    if (typeof showToast === 'function') {
        showToast(devMode ? 'Developer Mode: All 21 levels are OPEN!' : 'Normal Mode: Standard level progression restored', devMode ? '🔓' : '🔒');
    }
}

function updateDevModeUI() {
    const btn = document.getElementById('devModeToggleBtn');
    const icon = document.getElementById('devModeIcon');
    const text = document.getElementById('devModeText');
    const modalBadge = document.getElementById('modalDevBadge');

    if (btn && icon && text) {
        if (devMode) {
            btn.className = 'px-2 py-1 rounded-xl bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-amber-300 font-extrabold text-[10px] flex items-center gap-1 transition shadow-xs';
            icon.textContent = '🔓';
            text.textContent = 'Dev: Open';
        } else {
            btn.className = 'px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 font-extrabold text-[10px] flex items-center gap-1 transition shadow-xs';
            icon.textContent = '🔒';
            text.textContent = 'Normal';
        }
    }
    if (modalBadge) {
        modalBadge.textContent = devMode ? 'Dev: All 21 Open' : 'Normal Locked';
        modalBadge.className = devMode
            ? 'text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900'
            : 'text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700';
    }
}

function populateDevJumpSelect() {
    const sel = document.getElementById('devJumpSelect');
    if (!sel || typeof ADVENTURE_LEVELS === 'undefined') return;
    sel.innerHTML = '<option value="">⚡ Jump to Any Level (1–21)...</option>';
    ADVENTURE_LEVELS.forEach(lvl => {
        const opt = document.createElement('option');
        opt.value = lvl.levelNum;
        opt.textContent = `Lvl ${lvl.levelNum}: ${lvl.title} (${lvl.type.toUpperCase()})`;
        sel.appendChild(opt);
    });
}

function jumpToSelectedLevel(lvlNum) {
    if (!lvlNum || typeof ADVENTURE_LEVELS === 'undefined') return;
    const lvl = ADVENTURE_LEVELS.find(l => String(l.levelNum) === String(lvlNum));
    if (lvl) {
        if (typeof closeSupporterModal === 'function') closeSupporterModal();
        if (typeof showToast === 'function') {
            showToast(`Developer Jump: Opening Level ${lvl.levelNum} • ${lvl.title}`, '🚀');
        }
        if (typeof startAdventureLevel === 'function') startAdventureLevel(lvl);
    }
}

function unlockAllLevelsPermanently() {
    if (typeof ADVENTURE_LEVELS !== 'undefined' && ADVENTURE_LEVELS.length) {
        progress.unlockedLevel = ADVENTURE_LEVELS[ADVENTURE_LEVELS.length - 1].levelNum;
    }
    devMode = true;
    try {
        localStorage.setItem('yakthung_dev_mode', 'true');
    } catch (e) {}
    saveProgress();
    updateDevModeUI();
    if (typeof renderWindingMap === 'function') renderWindingMap();
    if (typeof showToast === 'function') {
        showToast('All 21 Levels Unlocked Permanently!', '🎉');
    }
}

// Reset Progress Logic
function resetResetButtonUI() {
    const container = document.getElementById('resetConfirmGroup');
    if (!container) return;
    container.innerHTML = `
        <button onclick="promptResetProgress()" class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition">
            Reset Progress
        </button>
    `;
}

function promptResetProgress() {
    const container = document.getElementById('resetConfirmGroup');
    if (!container) return;
    container.innerHTML = `
        <div class="flex items-center gap-1.5">
            <span class="text-[10px] font-bold text-rose-600">Sure?</span>
            <button onclick="confirmResetProgress()" class="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] shadow-xs transition">
                Yes, Reset
            </button>
            <button onclick="resetResetButtonUI()" class="px-2 py-1 rounded-xl bg-slate-200 text-slate-700 font-bold text-[10px] transition">
                Cancel
            </button>
        </div>
    `;
}

function confirmResetProgress() {
    progress = {
        unlockedLevel: 1,
        levelStars: {},
        masteredChars: [],
        xp: 0,
        streak: 1,
        lastActiveDate: new Date().toDateString()
    };
    devMode = false;
    try {
        localStorage.setItem('yakthung_dev_mode', 'false');
    } catch (e) {}
    saveProgress();
    updateDevModeUI();
    resetResetButtonUI();
    if (typeof closeSupporterModal === 'function') closeSupporterModal();
    if (typeof renderWindingMap === 'function') renderWindingMap(1);
    if (typeof showToast === 'function') showToast('Progress reset to Level 1.', '↺');
}

