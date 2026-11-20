/**
 * Yakthung Pan • Main Application Engine & Router
 * Manages runtime session, level routers, victory splash, PWA controller, and initialization.
 */

let session = {
    activeLevel: null,
    isSinglePractice: false,
    stepIdx: 0,
    currentAccuracy: 0,
    stepAccuracies: [],
    ghostMode: false,
    stepPassed: false,
    quizQuestions: [],
    quizCorrectCount: 0,
    quizAnswered: false,
    quizMissedItems: [],
    quizRequeuedIds: [],
    saknamItems: [],
    saknamCorrectCount: 0,
    saknamAnswered: false,
    tileSelected: [],
    tileBank: [],
    tileChecked: false,
    activeChartTab: 'consonants',
    selectedNaukhariConsonant: 'ka'
};

function showToast(msg, icon = '✦') {
    const banner = document.getElementById('toastBanner');
    const msgEl = document.getElementById('toastMessage');
    const iconEl = document.getElementById('toastIcon');
    if (!banner || !msgEl) return;

    msgEl.textContent = msg;
    if (iconEl) iconEl.textContent = icon;

    banner.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none');
    banner.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        banner.classList.remove('opacity-100', 'translate-y-0');
        banner.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
    }, 2800);
}

function showLessonWorkspace(workspaceId) {
    const list = ['tracingWorkspace', 'quizWorkspace', 'retryWorkspace', 'tileWorkspace', 'saknamWorkspace', 'victoryWorkspace'];
    list.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === workspaceId) {
                el.classList.remove('hidden');
                el.style.setProperty('display', 'flex', 'important');
            } else {
                el.classList.add('hidden');
                el.style.setProperty('display', 'none', 'important');
            }
        }
    });
}
window.showLessonWorkspace = showLessonWorkspace;

function hideAllLessonWorkspaces() {
    ['tracingWorkspace', 'quizWorkspace', 'retryWorkspace', 'tileWorkspace', 'saknamWorkspace', 'victoryWorkspace'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
            el.style.setProperty('display', 'none', 'important');
        }
    });
}
window.hideAllLessonWorkspaces = hideAllLessonWorkspaces;

// Bottom Navigation Dock Controller
function setNavTabActive(tabName) {
    const tabs = ['trail', 'letters', 'studio', 'profile'];
    tabs.forEach(t => {
        const btn = document.getElementById(`navTab_${t}`);
        if (!btn) return;
        if (t === tabName) {
            btn.className = 'flex flex-col items-center gap-0.5 text-emerald-600 font-black transition active:scale-95 cursor-pointer select-none';
        } else {
            btn.className = 'flex flex-col items-center gap-0.5 text-slate-400 font-semibold hover:text-slate-700 transition active:scale-95 cursor-pointer select-none';
        }
    });
}
window.setNavTabActive = setNavTabActive;

function switchNavTab(tabName) {
    setNavTabActive(tabName);
    if (tabName === 'trail') {
        if (typeof closeChartModal === 'function') closeChartModal(true);
        if (typeof closeVoiceStudio === 'function') closeVoiceStudio(true);
        if (typeof closeAuthModal === 'function') closeAuthModal(true);
        if (typeof closeCreditsModal === 'function') closeCreditsModal();
        if (typeof closeSupporterModal === 'function') closeSupporterModal();
        if (typeof renderWindingMap === 'function') renderWindingMap();
    } else if (tabName === 'letters') {
        if (typeof closeVoiceStudio === 'function') closeVoiceStudio(true);
        if (typeof closeAuthModal === 'function') closeAuthModal(true);
        if (typeof closeCreditsModal === 'function') closeCreditsModal();
        if (typeof closeSupporterModal === 'function') closeSupporterModal();
        if (typeof openChartModal === 'function') openChartModal();
    } else if (tabName === 'studio') {
        if (typeof closeChartModal === 'function') closeChartModal(true);
        if (typeof closeAuthModal === 'function') closeAuthModal(true);
        if (typeof closeCreditsModal === 'function') closeCreditsModal();
        if (typeof closeSupporterModal === 'function') closeSupporterModal();
        if (typeof openVoiceStudio === 'function') openVoiceStudio();
    } else if (tabName === 'profile') {
        if (typeof closeChartModal === 'function') closeChartModal(true);
        if (typeof closeVoiceStudio === 'function') closeVoiceStudio(true);
        if (typeof closeCreditsModal === 'function') closeCreditsModal();
        if (typeof closeSupporterModal === 'function') closeSupporterModal();
        if (typeof openAuthModal === 'function') openAuthModal();
    }
}
window.switchNavTab = switchNavTab;

function closeLessonModal() {
    const modal = document.getElementById('lessonModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.setProperty('display', 'none', 'important');
    }
    const navDock = document.getElementById('bottomNavDock');
    if (navDock) navDock.classList.remove('hidden');
    if (typeof setNavTabActive === 'function') setNavTabActive('trail');
    hideAllLessonWorkspaces();
    renderWindingMap();
}

function startAdventureLevel(lvl) {
    session.activeLevel = lvl;
    session.isSinglePractice = false;
    session.stepIdx = 0;
    session.stepAccuracies = [];

    const navDock = document.getElementById('bottomNavDock');
    if (navDock) navDock.classList.add('hidden');

    const modal = document.getElementById('lessonModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
    }

    if (lvl.type === 'trace') {
        showLessonWorkspace('tracingWorkspace');
        loadCurrentTraceCard();
    } else if (lvl.type === 'quiz') {
        showLessonWorkspace('quizWorkspace');
        initBossQuiz(lvl);
    } else if (lvl.type === 'saknam') {
        showLessonWorkspace('saknamWorkspace');
        initSaknamBuilder(lvl);
    } else if (lvl.type === 'tiles') {
        showLessonWorkspace('tileWorkspace');
        initVillageTiles();
    }
}

function completeLevelWithStars(stars, xpEarned, subDetails) {
    const lvl = session.activeLevel || { levelNum: 1, title: 'Level 1' };
    const prevStars = progress.levelStars[lvl.levelNum] || progress.levelStars[String(lvl.levelNum)] || 0;
    if (stars > prevStars) {
        progress.levelStars[lvl.levelNum] = stars;
        progress.levelStars[String(lvl.levelNum)] = stars;
    }

    // Dynamic progression advance:
    const nextUn = (typeof getEffectiveUnlockedLevel === 'function') 
        ? getEffectiveUnlockedLevel() 
        : (Number(lvl.levelNum) + 1);
    progress.unlockedLevel = nextUn;

    const earnedXp = (xpEarned || 40);
    progress.xp += earnedXp;
    saveProgress();
    if (typeof syncCloudProgress === 'function') {
        try { syncCloudProgress(false); } catch (e) {}
    }

    // Direct Cloud Firestore hook for users/{uid} collection (increment xp & score, update currentLevel & lastLoginAt)
    try {
        const authUid = (typeof window !== 'undefined' && window.firebase && window.firebase.auth && window.firebase.auth().currentUser && window.firebase.auth().currentUser.uid)
            || (typeof currentUser !== 'undefined' && currentUser ? (currentUser.id || currentUser.uid) : null);
        const db = (typeof window !== 'undefined' && window.firebase && window.firebase.firestore) ? window.firebase.firestore() : null;

        if (db && authUid && (!currentUser || !currentUser.isLocalAccount || (window.firebase && window.firebase.auth && window.firebase.auth().currentUser))) {
            db.collection('users').doc(authUid).update({
                currentLevel: nextUn,
                xp: window.firebase.firestore.FieldValue.increment(earnedXp),
                score: window.firebase.firestore.FieldValue.increment(earnedXp),
                lastLoginAt: window.firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                console.log('[Firestore] Successfully updated users/' + authUid + ' with incremented XP & score');
            }).catch(e => {
                console.warn('[Firestore] Notice updating users/' + authUid + ':', e);
            });
        }
    } catch (fsErr) {
        console.warn('[Firestore] Level complete hook error:', fsErr);
    }

    // Telemetry: Log level completion for the Admin Dashboard
    if (typeof recordAdminActivity === 'function') {
        recordAdminActivity('level_complete', {
            level: nextUn,
            xp: progress.xp,
            details: `Completed Level ${lvl.levelNum} with ${stars} Stars (+${xpEarned || 40} XP)`
        });
    }

    try { playTone(523.25, 'success'); } catch (e) {}

    // Show Victory Screen
    showLessonWorkspace('victoryWorkspace');

    const starEl = document.getElementById('victoryStarsDisplay');
    if (starEl) {
        starEl.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            const span = document.createElement('span');
            span.textContent = '★';
            span.className = i <= stars ? 'text-goldaccent-400 drop-shadow' : 'text-slate-300';
            starEl.appendChild(span);
        }
    }

    const badgeEl = document.getElementById('victoryBadgeText');
    if (badgeEl) badgeEl.textContent = `Level ${lvl.levelNum} Complete!`;

    const xpEl = document.getElementById('victoryXpPill');
    if (xpEl) xpEl.textContent = `+${xpEarned || 40} XP`;

    const headlineEl = document.getElementById('victoryHeadline');
    if (headlineEl) headlineEl.textContent = lvl.title || 'Well Done!';

    const subTextEl = document.getElementById('victorySubText');
    if (subTextEl) subTextEl.textContent = subDetails || 'Next stage unlocked on your Yakthung Pan adventure path.';

    updateHudDisplay();
}

function finishLevelAndReturn() {
    closeLessonModal();
    const targetLvl = (typeof getEffectiveUnlockedLevel === 'function')
        ? getEffectiveUnlockedLevel()
        : (progress.unlockedLevel || 2);
    renderWindingMap(targetLvl);
    playTone(587.33, 'note');
}

// Supporter & Audio Studio Modal Handlers
function openSupporterModal() {
    document.getElementById('supporterModal').classList.remove('hidden');
    resetResetButtonUI();
    if (typeof updateDevModeUI === 'function') updateDevModeUI();
    if (typeof populateDevJumpSelect === 'function') populateDevJumpSelect();
}

function closeSupporterModal() {
    document.getElementById('supporterModal').classList.add('hidden');
}

function handleSupportAction(message) {
    playTone(587.33, 'note');
    showToast(message, '♥');
}

// PWA System Controller
let deferredPwaPrompt = null;

function initPwaSystem() {
    // Register Service Worker for offline PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('[PWA] Service Worker registered with scope:', reg.scope);
            })
            .catch(err => {
                console.warn('[PWA] Service Worker registration failed:', err);
            });
    }

    // Listen for mobile & desktop installation prompts
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaPrompt = e;
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) {
            installBtn.classList.remove('hidden');
        }
    });

    window.addEventListener('appinstalled', () => {
        console.log('[PWA] Yakthung Pan installed successfully.');
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) installBtn.classList.add('hidden');
        showToast('Yakthung Pan installed to home screen!', '🎉');
    });

    window.addEventListener('online', () => {
        showToast('Connected to network', '🌐');
    });

    window.addEventListener('offline', () => {
        showToast('Offline Mode Active • 100% playable with native chimes', '⚡');
    });
}

function promptPwaInstall() {
    if (!deferredPwaPrompt) {
        showToast('To install, tap browser menu & select "Install" or "Add to Home Screen"', '📱');
        return;
    }
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted installation prompt');
        }
        deferredPwaPrompt = null;
    });
}

// Welcome Screen Controller
function showWelcomeScreen() {
    const welcome = document.getElementById('welcomeScreen');
    if (!welcome) return;
    updateWelcomeScreenUI();
    welcome.classList.remove('hidden');
    welcome.style.setProperty('display', 'flex', 'important');
    welcome.style.setProperty('pointer-events', 'auto', 'important');
    welcome.style.setProperty('visibility', 'visible', 'important');
    try { playTone(440, 'note'); } catch (e) {}
}

function dismissWelcomeScreen() {
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) {
        welcome.classList.add('hidden');
        welcome.style.setProperty('display', 'none', 'important');
        welcome.style.setProperty('pointer-events', 'none', 'important');
        welcome.style.setProperty('visibility', 'hidden', 'important');
    }
    try { localStorage.setItem('yakthung_welcome_seen', 'true'); } catch (e) {}
    try { playTone(523.25, 'note'); } catch (e) {}
    try {
        const targetLvl = (typeof getEffectiveUnlockedLevel === 'function') 
            ? getEffectiveUnlockedLevel() 
            : ((typeof progress !== 'undefined' && progress.unlockedLevel) ? progress.unlockedLevel : 1);
        if (typeof renderWindingMap === 'function') renderWindingMap(targetLvl);
    } catch (e) {
        console.warn('[Welcome] renderWindingMap error:', e);
    }
}
window.dismissWelcomeScreen = dismissWelcomeScreen;
window.showWelcomeScreen = showWelcomeScreen;

function setupWelcomeListeners() {
    ['welcomeStartBtn', 'welcomeCloseBtn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const onDismiss = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                dismissWelcomeScreen();
            };
            el.addEventListener('click', onDismiss);
            el.addEventListener('touchend', onDismiss);
            el.addEventListener('pointerup', onDismiss);
        }
    });
}

function updateWelcomeScreenUI() {
    const startBtnText = document.getElementById('welcomeStartBtnText');
    const startBtn = document.getElementById('welcomeStartBtn');
    const hasProgress = progress && (progress.xp > 0 || (progress.unlockedLevel && Number(progress.unlockedLevel) > 1));

    if (startBtnText) {
        startBtnText.textContent = hasProgress 
            ? (typeof t === 'function' ? t('continue_adventure') : 'Continue Adventure')
            : (typeof t === 'function' ? t('start_learning') : 'Start Learning');
    }
}

// Application Bootstrapping
window.onload = async function () {
    try { await loadCurriculumData(); } catch (e) { console.warn('[Boot] Curriculum load notice:', e); }
    try { loadProgress(); } catch (e) { console.warn('[Boot] Progress load notice:', e); }

    // Initialize Authentic Custom Voice DB (IndexedDB)
    try {
        if (typeof CustomAudioStore !== 'undefined') {
            await CustomAudioStore.init();
        }
    } catch (e) {
        console.warn('[Boot] CustomAudioStore init fallback:', e);
    }

    // Initialize Auth & Google Identity Services
    try {
        if (typeof initAuthSystem === 'function') {
            initAuthSystem();
        }
    } catch (e) {
        console.warn('[Boot] AuthSystem init notice:', e);
    }

    // Apply i18n DOM translations & update UI
    try {
        if (typeof applyLanguageToDOM === 'function') {
            applyLanguageToDOM();
            updateLanguageSwitcherUI();
        }
    } catch (e) {
        console.warn('[Boot] Language UI notice:', e);
    }

    try { updateDevModeUI(); } catch (e) {}
    try { setupCanvasEvents(); } catch (e) {}
    try { renderWindingMap(); } catch (e) {}
    try { initPwaSystem(); } catch (e) {}
    try { setupWelcomeListeners(); } catch (e) {}

    // Welcome Landing Screen Check: check if already seen
    try {
        const welcomeEl = document.getElementById('welcomeScreen');
        const welcomeSeen = localStorage.getItem('yakthung_welcome_seen') === 'true';
        if (welcomeEl) {
            if (welcomeSeen) {
                welcomeEl.classList.add('hidden');
                welcomeEl.style.setProperty('display', 'none', 'important');
                welcomeEl.style.setProperty('pointer-events', 'none', 'important');
                welcomeEl.style.setProperty('visibility', 'hidden', 'important');
            } else {
                updateWelcomeScreenUI();
                welcomeEl.classList.remove('hidden');
                welcomeEl.style.setProperty('display', 'flex', 'important');
                welcomeEl.style.setProperty('pointer-events', 'auto', 'important');
                welcomeEl.style.setProperty('visibility', 'visible', 'important');
            }
        }
    } catch (e) {}
};

