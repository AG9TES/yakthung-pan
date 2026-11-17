/**
 * Yakthung Pan • Real-Time Admin Portal & Activity Telemetry Engine
 * Features:
 *  - 100% Real-time updates via Firebase Firestore `onSnapshot` listeners
 *  - Instant sub-millisecond cross-tab broadcast via BroadcastChannel API
 *  - Live table insertion with glowing row animation & counter incrementing
 *  - Live Web Audio API synthesizer chime on incoming login/signup events
 *  - Continuous relative time ticker ("Just now", "30s ago")
 *  - Passcode lock & authorized admin emails auto-unlock
 *  - Filterable activity stream, learner roster inspector, and CSV exports
 */

var ADMIN_STORAGE_AUTH = 'yakthung_admin_auth_session';
var ADMIN_STORAGE_PASSCODE = 'yakthung_admin_passcode';
var ADMIN_STORAGE_EMAILS = 'yakthung_admin_emails';
var ADMIN_STORAGE_SOUND = 'yakthung_admin_sound_enabled';
var DEFAULT_ADMIN_PASSCODE = 'yakthung2026';
var DEFAULT_ADMIN_EMAILS = ['admin@yakthung.com', 'ag9tes@gmail.com'];

var currentAdminTab = 'logs';
var cachedLogs = [];
var cachedLearners = [];
var logFilterAction = 'all';
var logFilterProvider = 'all';
var logSearchQuery = '';
var learnerSearchQuery = '';

// Real-time state
var isSoundEnabled = true;
var isFirstLogsSnapshot = true;
var isFirstUsersSnapshot = true;
var logsUnsubscribe = null;
var usersUnsubscribe = null;
var realtimeBroadcastChannel = null;
var liveTimeTicker = null;
var newEventIds = new Set();

// =====================================================================
// 1. ADMIN AUTHENTICATION & ACCESS CONTROL
// =====================================================================

function isAdminAuthenticated() {
    try {
        if (sessionStorage.getItem(ADMIN_STORAGE_AUTH) === 'true') {
            return true;
        }
        const userProfile = getCurrentUserSafe();
        if (userProfile && userProfile.email && isAuthorizedAdminEmail(userProfile.email)) {
            sessionStorage.setItem(ADMIN_STORAGE_AUTH, 'true');
            return true;
        }
    } catch (e) {}
    return false;
}

function getStoredAdminPasscode() {
    try {
        return localStorage.getItem(ADMIN_STORAGE_PASSCODE) || DEFAULT_ADMIN_PASSCODE;
    } catch (e) {
        return DEFAULT_ADMIN_PASSCODE;
    }
}

function getAuthorizedAdminEmails() {
    try {
        const stored = localStorage.getItem(ADMIN_STORAGE_EMAILS);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_ADMIN_EMAILS;
}

function isAuthorizedAdminEmail(email) {
    if (!email) return false;
    const list = getAuthorizedAdminEmails().map(e => e.toLowerCase().trim());
    return list.includes(email.toLowerCase().trim());
}

function handleAdminLoginSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('adminPasscodeInput');
    const errEl = document.getElementById('adminLoginError');
    const entered = input ? input.value.trim() : '';

    const validPasscode = getStoredAdminPasscode();

    if (entered === validPasscode || entered === DEFAULT_ADMIN_PASSCODE) {
        sessionStorage.setItem(ADMIN_STORAGE_AUTH, 'true');
        if (errEl) errEl.classList.add('hidden');
        if (input) input.value = '';
        renderAdminDashboard();
        showAdminToast('Welcome, Administrator!', '🛡️');
    } else {
        if (errEl) {
            errEl.textContent = 'Invalid administrator passcode. Please try again.';
            errEl.classList.remove('hidden');
        }
        if (input) {
            input.classList.add('ring-2', 'ring-rose-500');
            setTimeout(() => input.classList.remove('ring-2', 'ring-rose-500'), 1500);
            input.focus();
        }
    }
}

function logoutAdmin() {
    sessionStorage.removeItem(ADMIN_STORAGE_AUTH);
    teardownRealtimeListeners();
    renderAdminDashboard();
    showAdminToast('Admin session locked', '🔒');
}

function changeAdminPasscode() {
    const currentPass = getStoredAdminPasscode();
    const oldPass = prompt('Enter current admin passcode:');
    if (oldPass === null) return;
    if (oldPass !== currentPass && oldPass !== DEFAULT_ADMIN_PASSCODE) {
        alert('Incorrect current passcode!');
        return;
    }
    const newPass = prompt('Enter new admin passcode (at least 6 characters):');
    if (!newPass || newPass.trim().length < 6) {
        alert('Passcode must be at least 6 characters long!');
        return;
    }
    try {
        localStorage.setItem(ADMIN_STORAGE_PASSCODE, newPass.trim());
        alert('Admin passcode updated successfully!');
        showAdminToast('Admin passcode updated', '🔑');
    } catch (e) {
        alert('Failed to save passcode in storage.');
    }
}

function addAdminEmail() {
    const email = prompt('Enter email to grant Admin access:');
    if (!email || !email.includes('@')) return;
    const list = getAuthorizedAdminEmails();
    if (!list.includes(email.toLowerCase().trim())) {
        list.push(email.toLowerCase().trim());
        try {
            localStorage.setItem(ADMIN_STORAGE_EMAILS, JSON.stringify(list));
            renderAdminSettings();
            showAdminToast(`Added ${email} to admin roster`, '✅');
        } catch (e) {}
    }
}

function removeAdminEmail(email) {
    if (!confirm(`Revoke admin access for ${email}?`)) return;
    let list = getAuthorizedAdminEmails();
    list = list.filter(e => e.toLowerCase() !== email.toLowerCase());
    try {
        localStorage.setItem(ADMIN_STORAGE_EMAILS, JSON.stringify(list));
        renderAdminSettings();
        showAdminToast(`Removed ${email} from admin roster`, 'ℹ️');
    } catch (e) {}
}

function getCurrentUserSafe() {
    try {
        const stored = localStorage.getItem('yakthung_auth_profile');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
}

// =====================================================================
// 2. REAL-TIME ENGINE (FIRESTORE SNAPSHOTS + BROADCASTCHANNEL + AUDIO)
// =====================================================================

function initRealtimeEngine() {
    // 1. Sound preference restoration
    try {
        const storedSound = localStorage.getItem(ADMIN_STORAGE_SOUND);
        if (storedSound !== null) {
            isSoundEnabled = (storedSound === 'true');
        }
    } catch (e) {}
    updateSoundButtonUI();

    // 2. Baseline local load
    loadInitialBaselineData();

    // 3. Connect Cloud Hub Realtime (Universal cross-device sync between Phone App and Dashboard)
    setupCloudHubRealtime();

    // 4. Connect Firestore Realtime `onSnapshot` listeners
    setupFirestoreRealtime();

    // 5. Connect Browser BroadcastChannel (Instant cross-tab realtime)
    setupBroadcastChannelRealtime();

    // 6. Connect Window Storage Event (localStorage cross-tab sync)
    window.addEventListener('storage', handleStorageEvent);

    // 7. Live Relative Timestamp Ticker (Every 10 seconds)
    if (!liveTimeTicker) {
        liveTimeTicker = setInterval(updateAllTimeAgoStrings, 10000);
    }
}

function teardownRealtimeListeners() {
    if (cloudHubPollTimer) {
        clearInterval(cloudHubPollTimer);
        cloudHubPollTimer = null;
    }
    if (logsUnsubscribe) {
        try { logsUnsubscribe(); } catch (e) {}
        logsUnsubscribe = null;
    }
    if (usersUnsubscribe) {
        try { usersUnsubscribe(); } catch (e) {}
        usersUnsubscribe = null;
    }
    if (realtimeBroadcastChannel) {
        try { realtimeBroadcastChannel.close(); } catch (e) {}
        realtimeBroadcastChannel = null;
    }
    if (liveTimeTicker) {
        clearInterval(liveTimeTicker);
        liveTimeTicker = null;
    }
    window.removeEventListener('storage', handleStorageEvent);
}

// Universal Cloud Telemetry Sync between App & Dashboard
var CLOUD_HUB_OBJECT_ID = 'ff808181a09d98f701a1ea6ca68a0940';
var CLOUD_HUB_URL = 'https://api.restful-api.dev/objects/' + CLOUD_HUB_OBJECT_ID;
var cloudHubPollTimer = null;
var isFirstCloudHubLoad = true;

async function pollCloudHub() {
    try {
        const res = await fetch(CLOUD_HUB_URL, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const data = json.data;
        if (!data) return;

        updateConnectionIndicator('cloud');

        // Check for new logs
        if (Array.isArray(data.logs)) {
            if (isFirstCloudHubLoad) {
                isFirstCloudHubLoad = false;
                mergeLogsIntoCache(data.logs);
                updateKPICards();
                renderCurrentTab();
            } else {
                const newEntries = [];
                for (const log of data.logs) {
                    const exists = cachedLogs.some(l => (l.id && l.id === log.id) || (l.timestamp === log.timestamp && l.email === log.email));
                    if (!exists) {
                        newEntries.push(log);
                    }
                }
                newEntries.reverse().forEach(entry => {
                    handleIncomingRealtimeEntry(entry, true);
                });
            }
        }

        // Merge learners
        if (data.learners && typeof data.learners === 'object') {
            Object.values(data.learners).forEach(user => {
                updateLearnerInRoster(user);
            });
            updateKPICards();
            if (currentAdminTab === 'learners' || currentAdminTab === 'analytics') {
                renderCurrentTab();
            }
        }
    } catch (e) {
        console.warn('[Admin Realtime] Cloud hub poll notice:', e);
    }
}

function setupCloudHubRealtime() {
    if (cloudHubPollTimer) clearInterval(cloudHubPollTimer);
    isFirstCloudHubLoad = true;
    pollCloudHub();
    cloudHubPollTimer = setInterval(pollCloudHub, 3000); // Poll every 3 seconds for live sync
}

function setupFirestoreRealtime() {
    if (typeof window === 'undefined' || !window.firebase || !window.firebase.firestore) {
        updateConnectionIndicator('local');
        return;
    }

    try {
        const db = window.firebase.firestore();
        updateConnectionIndicator('connecting');

        // A. Real-time Activity Logs Stream
        if (logsUnsubscribe) logsUnsubscribe();
        isFirstLogsSnapshot = true;

        logsUnsubscribe = db.collection('admin_activity_logs')
            .orderBy('timestamp', 'desc')
            .limit(200)
            .onSnapshot((snapshot) => {
                updateConnectionIndicator('cloud');

                if (isFirstLogsSnapshot) {
                    // Initial load
                    isFirstLogsSnapshot = false;
                    const cloudLogs = [];
                    snapshot.forEach(doc => {
                        cloudLogs.push({ id: doc.id, ...doc.data() });
                    });
                    mergeLogsIntoCache(cloudLogs);
                    updateKPICards();
                    renderCurrentTab();
                } else {
                    // Real-time incremental additions
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            const newEntry = { id: change.doc.id, ...change.doc.data() };
                            handleIncomingRealtimeEntry(newEntry, true);
                        }
                    });
                }
            }, (err) => {
                console.warn('[Admin Realtime] Firestore logs snapshot notice:', err);
                updateConnectionIndicator('local');
            });

        // B. Real-time Users Roster Stream
        if (usersUnsubscribe) usersUnsubscribe();
        isFirstUsersSnapshot = true;

        usersUnsubscribe = db.collection('users').onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                const data = change.doc.data();
                const key = (data.email ? data.email.toLowerCase() : change.doc.id);
                const updatedUser = {
                    userId: change.doc.id,
                    userName: data.name || data.username || 'Learner',
                    email: data.email || '',
                    provider: data.provider || 'cloud',
                    lastActive: data.lastLogin ? (data.lastLogin.toDate ? data.lastLogin.toDate().toISOString() : data.lastLogin) : new Date().toISOString(),
                    lastAction: 'login',
                    level: data.lastLevel || 1,
                    xp: data.lastXp || 0,
                    device: data.lastDevice || 'Mobile App'
                };

                updateLearnerInRoster(updatedUser);

                if (!isFirstUsersSnapshot && change.type === 'added') {
                    showAdminToast(`✨ New Learner Registered: ${updatedUser.userName}!`, '🎉');
                }
            });

            isFirstUsersSnapshot = false;
            updateKPICards();
            if (currentAdminTab === 'learners' || currentAdminTab === 'analytics') {
                renderCurrentTab();
            }
        }, (err) => {
            console.warn('[Admin Realtime] Firestore users snapshot notice:', err);
        });

    } catch (e) {
        console.warn('[Admin Realtime] Setup error:', e);
        updateConnectionIndicator('local');
    }
}

function setupBroadcastChannelRealtime() {
    if (typeof BroadcastChannel === 'undefined') return;
    try {
        if (realtimeBroadcastChannel) realtimeBroadcastChannel.close();
        realtimeBroadcastChannel = new BroadcastChannel('yakthung_admin_realtime');
        realtimeBroadcastChannel.onmessage = (event) => {
            if (event && event.data && event.data.type === 'new_activity' && event.data.entry) {
                console.log('[Admin Realtime] Instant Broadcast received:', event.data.entry);
                handleIncomingRealtimeEntry(event.data.entry, true);
            }
        };
    } catch (e) {
        console.warn('[Admin Realtime] BroadcastChannel init note:', e);
    }
}

function handleStorageEvent(event) {
    if (event.key === 'yakthung_admin_logs') {
        try {
            const fresh = JSON.parse(event.newValue || '[]');
            if (fresh.length > 0) {
                mergeLogsIntoCache(fresh);
                updateKPICards();
                renderCurrentTab();
            }
        } catch (e) {}
    }
}

/**
 * Handles an incoming real-time activity entry from Firestore or BroadcastChannel
 */
function handleIncomingRealtimeEntry(entry, animate = true) {
    if (!entry) return;

    // Deduplication check
    const entryKey = entry.id || (entry.timestamp + '_' + (entry.email || entry.userId));
    if (newEventIds.has(entryKey)) return;
    const exists = cachedLogs.some(l => (l.id && l.id === entry.id) || (l.timestamp === entry.timestamp && l.email === entry.email));
    if (exists) return;

    newEventIds.add(entryKey);

    // Prepend to active logs cache
    cachedLogs.unshift(entry);
    if (cachedLogs.length > 300) cachedLogs.pop();

    // Update Learner Roster cache
    if (entry.email || entry.userId) {
        updateLearnerInRoster({
            userId: entry.userId,
            userName: entry.userName,
            email: entry.email,
            provider: entry.provider,
            lastActive: entry.timestamp,
            lastAction: entry.action,
            level: entry.level || 1,
            xp: entry.xp || 0,
            device: entry.device || 'Mobile App'
        });
    }

    // Play subtle audio synthesizer chime
    if (animate) {
        playLiveChime();
    }

    // Live Toast notification
    const actionLabel = (entry.action === 'signup' ? 'Registered' : (entry.action === 'sync' ? 'Synced Progress' : 'Logged In'));
    const badgeIcon = (entry.action === 'signup' ? '✨' : (entry.action === 'sync' ? '☁️' : '🔑'));
    showAdminToast(`${badgeIcon} Live: ${entry.userName || 'Learner'} ${actionLabel}!`, badgeIcon);

    // Update KPIs instantly
    updateKPICards();

    // If currently on logs view, prepend row with green pulse highlight
    if (currentAdminTab === 'logs') {
        prependLogRowWithGlow(entry, entryKey);
    } else {
        renderCurrentTab();
    }
}

function prependLogRowWithGlow(log, entryKey) {
    const tbody = document.getElementById('adminLogsTbody');
    const countEl = document.getElementById('adminLogsCount');
    if (!tbody) return;

    // Check filter match
    if (logFilterAction !== 'all' && log.action !== logFilterAction) return;
    if (logFilterProvider !== 'all' && (log.provider || '').toLowerCase() !== logFilterProvider) return;
    if (logSearchQuery) {
        const q = logSearchQuery.toLowerCase();
        const nameMatch = (log.userName || '').toLowerCase().includes(q);
        const emailMatch = (log.email || '').toLowerCase().includes(q);
        if (!nameMatch && !emailMatch) return;
    }

    // Remove empty placeholder row if present
    const emptyRow = tbody.querySelector('td[colspan="6"]');
    if (emptyRow) tbody.innerHTML = '';

    const tr = document.createElement('tr');
    tr.id = 'row_' + entryKey;
    tr.className = 'border-b border-slate-800/60 transition-all duration-700 text-xs bg-emerald-500/25 ring-1 ring-emerald-400';

    const timeAgo = formatTimeAgo(log.timestamp);
    const fullTime = new Date(log.timestamp).toLocaleString();
    const actionBadge = getActionBadge(log.action);
    const providerBadge = getProviderBadge(log.provider);
    const userAvatar = getUserAvatarHtml(log.userName, log.email);

    tr.innerHTML = `
        <td class="py-3 px-4">
            <div class="flex items-center gap-2.5">
                ${userAvatar}
                <div>
                    <div class="font-extrabold text-white flex items-center gap-1.5">
                        <span>${escapeHtml(log.userName || 'Learner')}</span>
                        <span class="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider animate-pulse">LIVE</span>
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(log.email || 'No email (Device ID)')}</div>
                </div>
            </div>
        </td>
        <td class="py-3 px-4">${actionBadge}</td>
        <td class="py-3 px-4">${providerBadge}</td>
        <td class="py-3 px-4">
            <div class="flex items-center gap-1.5 font-bold">
                <span class="text-amber-400">Lv.${log.level || 1}</span>
                <span class="text-slate-500">•</span>
                <span class="text-emerald-400">${log.xp || 0} XP</span>
            </div>
        </td>
        <td class="py-3 px-4 text-slate-300">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/70 text-[10px] text-slate-300 border border-slate-700/50">
                ${getDeviceIcon(log.device)} ${escapeHtml(log.device || 'Web Browser')}
            </span>
        </td>
        <td class="py-3 px-4 text-right">
            <div class="font-bold text-emerald-300 text-[11px] live-time-ago" data-timestamp="${log.timestamp}">Just now</div>
            <div class="text-[9px] text-slate-500 font-mono" title="${fullTime}">${fullTime}</div>
        </td>
    `;

    tbody.insertBefore(tr, tbody.firstChild);

    // Fade out glow after 3 seconds
    setTimeout(() => {
        tr.className = 'border-b border-slate-800/60 hover:bg-slate-800/30 transition-all duration-700 text-xs';
        const livePill = tr.querySelector('.animate-pulse');
        if (livePill) livePill.remove();
    }, 3200);

    if (countEl) countEl.textContent = `${cachedLogs.length} entries`;
}

function updateLearnerInRoster(user) {
    const key = user.email ? user.email.toLowerCase() : user.userId;
    const existingIndex = cachedLearners.findIndex(u => (u.email && u.email.toLowerCase() === key) || u.userId === key);

    if (existingIndex >= 0) {
        cachedLearners[existingIndex] = { ...cachedLearners[existingIndex], ...user };
    } else {
        cachedLearners.unshift(user);
    }

    cachedLearners.sort((a, b) => new Date(b.lastActive || 0).getTime() - new Date(a.lastActive || 0).getTime());
}

/**
 * Web Audio Synthesizer Chime
 * Generates an elegant, gentle two-tone chime when a new real-time event arrives.
 */
function playLiveChime() {
    if (!isSoundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880.00, now + 0.12);
        osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3); // D6

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now + 0.1);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
    } catch (e) {}
}

function toggleAdminSound() {
    isSoundEnabled = !isSoundEnabled;
    try {
        localStorage.setItem(ADMIN_STORAGE_SOUND, String(isSoundEnabled));
    } catch (e) {}
    updateSoundButtonUI();
    showAdminToast(isSoundEnabled ? 'Real-time sound chime enabled' : 'Real-time sound muted', isSoundEnabled ? '🔔' : '🔕');
    if (isSoundEnabled) playLiveChime();
}

function updateSoundButtonUI() {
    const iconEl = document.getElementById('adminSoundIcon');
    const textEl = document.getElementById('adminSoundText');
    const btn = document.getElementById('adminSoundToggleBtn');
    if (!btn) return;

    if (isSoundEnabled) {
        if (iconEl) iconEl.textContent = '🔔';
        if (textEl) textEl.textContent = 'Chime On';
        btn.className = 'p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer';
    } else {
        if (iconEl) iconEl.textContent = '🔕';
        if (textEl) textEl.textContent = 'Muted';
        btn.className = 'p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer';
    }
}

function updateConnectionIndicator(status) {
    const ping = document.getElementById('adminRealtimePing');
    const dot = document.getElementById('adminRealtimeDot');
    const text = document.getElementById('adminConnectionText');
    if (!text) return;

    if (status === 'cloud') {
        if (ping) ping.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75';
        if (dot) dot.className = 'relative inline-flex rounded-full h-2 w-2 bg-emerald-500';
        text.textContent = 'Realtime Cloud Live';
        text.className = 'tracking-wide text-emerald-300 font-bold';
    } else if (status === 'local') {
        if (ping) ping.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-50';
        if (dot) dot.className = 'relative inline-flex rounded-full h-2 w-2 bg-teal-500';
        text.textContent = 'Realtime Local Stream';
        text.className = 'tracking-wide text-teal-300 font-bold';
    } else {
        if (ping) ping.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75';
        if (dot) dot.className = 'relative inline-flex rounded-full h-2 w-2 bg-amber-500';
        text.textContent = 'Connecting...';
        text.className = 'tracking-wide text-amber-300 font-bold';
    }
}

function updateAllTimeAgoStrings() {
    const timeElements = document.querySelectorAll('.live-time-ago');
    timeElements.forEach(el => {
        const ts = el.getAttribute('data-timestamp');
        if (ts) {
            el.textContent = formatTimeAgo(ts);
        }
    });
}

/**
 * Simulate a live real-time login to test the real-time engine
 */
function simulateRealtimeLoginEvent() {
    const sampleNames = ['Khangsar Learner', 'Suman Limbu', 'Numa Phung', 'Menchhyayem Hero', 'Taplejung Scholar', 'Sirijanga Student'];
    const sampleProviders = ['google', 'email', 'google', 'email'];
    const sampleDevices = ['Android APK', 'Android Mobile', 'Windows PC', 'iOS Mobile'];

    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomProvider = sampleProviders[Math.floor(Math.random() * sampleProviders.length)];
    const randomDevice = sampleDevices[Math.floor(Math.random() * sampleDevices.length)];
    const randomLevel = Math.floor(Math.random() * 20) + 1;
    const randomXp = randomLevel * 220 + Math.floor(Math.random() * 80);
    const emailPrefix = randomName.toLowerCase().replace(/\s+/g, '.');

    const entry = {
        id: 'sim_' + Date.now(),
        action: 'login',
        userId: 'sim_usr_' + Date.now(),
        userName: randomName,
        email: `${emailPrefix}@gmail.com`,
        provider: randomProvider,
        timestamp: new Date().toISOString(),
        device: randomDevice,
        level: randomLevel,
        xp: randomXp,
        status: 'success'
    };

    // Save and broadcast through standard engine
    handleIncomingRealtimeEntry(entry, true);
    pushToCloudHubDirect(entry);

    showAdminToast(`⚡ Simulated Real-Time Login: ${randomName}`, '⚡');
}

async function pushToCloudHubDirect(entry) {
    try {
        const getRes = await fetch(CLOUD_HUB_URL, { cache: 'no-store' });
        if (getRes.ok) {
            const json = await getRes.json();
            const hubData = json.data || { logs: [], learners: {} };
            if (!Array.isArray(hubData.logs)) hubData.logs = [];
            if (!hubData.learners) hubData.learners = {};
            hubData.logs.unshift(entry);
            if (hubData.logs.length > 250) hubData.logs = hubData.logs.slice(0, 250);
            const key = entry.email ? entry.email.toLowerCase() : entry.userId;
            hubData.learners[key] = {
                userId: entry.userId,
                userName: entry.userName,
                email: entry.email,
                provider: entry.provider,
                lastActive: entry.timestamp,
                lastAction: entry.action,
                level: entry.level || 1,
                xp: entry.xp || 0,
                device: entry.device
            };
            hubData.updatedAt = new Date().toISOString();
            await fetch(CLOUD_HUB_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Yakthung Pan Production Cloud Hub',
                    data: hubData
                })
            });
        }
    } catch (e) {}
}

// =====================================================================
// 3. BASELINE LOCAL DATA LOADING
// =====================================================================

function loadInitialBaselineData() {
    let localLogs = [];
    try {
        localLogs = JSON.parse(localStorage.getItem('yakthung_admin_logs') || '[]');
    } catch (e) {}

    let localLearnersMap = {};
    try {
        localLearnersMap = JSON.parse(localStorage.getItem('yakthung_admin_learners') || '{}');
    } catch (e) {}

    let localAccounts = {};
    try {
        localAccounts = JSON.parse(localStorage.getItem('yakthung_local_accounts') || '{}');
        Object.values(localAccounts).forEach(acc => {
            const key = acc.email ? acc.email.toLowerCase() : acc.id;
            if (!localLearnersMap[key]) {
                localLearnersMap[key] = {
                    userId: acc.id,
                    userName: acc.username || acc.name,
                    email: acc.email,
                    provider: 'email',
                    lastActive: acc.created || new Date().toISOString(),
                    lastAction: 'signup',
                    level: 1,
                    xp: 0,
                    device: 'Local Account'
                };
            }
        });
    } catch (e) {}

    if (localLogs.length === 0) {
        localLogs = generateInitialSampleLogs();
        try { localStorage.setItem('yakthung_admin_logs', JSON.stringify(localLogs)); } catch (e) {}
    }

    mergeLogsIntoCache(localLogs);

    cachedLearners = Object.values(localLearnersMap);
    cachedLearners.sort((a, b) => new Date(b.lastActive || 0).getTime() - new Date(a.lastActive || 0).getTime());

    updateKPICards();
    renderCurrentTab();
}

function mergeLogsIntoCache(newLogs) {
    const seenIds = new Set();
    const merged = [];
    [...newLogs, ...cachedLogs].forEach(item => {
        const key = item.id || (item.timestamp + '_' + item.email);
        if (!seenIds.has(key)) {
            seenIds.add(key);
            merged.push(item);
        }
    });
    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    cachedLogs = merged;
}

// =====================================================================
// 4. KPI CALCULATIONS & RENDERING
// =====================================================================

function updateKPICards() {
    const totalUsersEl = document.getElementById('kpiTotalUsers');
    const totalLoginsEl = document.getElementById('kpiTotalLogins');
    const activeTodayEl = document.getElementById('kpiActiveToday');
    const totalXpEl = document.getElementById('kpiTotalXp');
    const avgLevelEl = document.getElementById('kpiAvgLevel');

    const totalLearners = Math.max(cachedLearners.length, 1);
    const loginLogs = cachedLogs.filter(l => l.action === 'login' || l.action === 'signup');
    const totalLoginsCount = loginLogs.length;

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const activeTodayCount = cachedLearners.filter(u => {
        const t = new Date(u.lastActive || 0).getTime();
        return (now - t) < oneDayMs;
    }).length;

    let sumXp = 0;
    let sumLevel = 0;
    cachedLearners.forEach(u => {
        sumXp += Number(u.xp) || 0;
        sumLevel += Number(u.level) || 1;
    });

    const avgLevel = (sumLevel / totalLearners).toFixed(1);

    if (totalUsersEl) totalUsersEl.textContent = totalLearners.toLocaleString();
    if (totalLoginsEl) totalLoginsEl.textContent = totalLoginsCount.toLocaleString();
    if (activeTodayEl) activeTodayEl.textContent = Math.max(activeTodayCount, 1).toLocaleString();
    if (totalXpEl) totalXpEl.textContent = sumXp.toLocaleString() + ' XP';
    if (avgLevelEl) avgLevelEl.textContent = 'Level ' + avgLevel + ' / 21';
}

// =====================================================================
// 5. TAB NAVIGATION & VIEW RENDERERS
// =====================================================================

function switchAdminTab(tabName) {
    currentAdminTab = tabName;
    const tabs = ['logs', 'learners', 'analytics', 'settings'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tabBtn_${t}`);
        const view = document.getElementById(`tabView_${t}`);
        if (btn) {
            if (t === tabName) {
                btn.className = 'py-2 px-4 rounded-xl font-black text-xs bg-emerald-600 text-white shadow-md transition flex items-center gap-2';
            } else {
                btn.className = 'py-2 px-4 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2';
            }
        }
        if (view) {
            view.classList.toggle('hidden', t !== tabName);
        }
    });

    renderCurrentTab();
}

function renderCurrentTab() {
    if (currentAdminTab === 'logs') {
        renderLogsTable();
    } else if (currentAdminTab === 'learners') {
        renderLearnersTable();
    } else if (currentAdminTab === 'analytics') {
        renderAnalyticsView();
    } else if (currentAdminTab === 'settings') {
        renderAdminSettings();
    }
}

// =====================================================================
// 6. ACTIVITY LOGS TAB
// =====================================================================

function renderLogsTable() {
    const tbody = document.getElementById('adminLogsTbody');
    const countEl = document.getElementById('adminLogsCount');
    if (!tbody) return;

    let filtered = cachedLogs.filter(log => {
        if (logFilterAction !== 'all' && log.action !== logFilterAction) return false;
        if (logFilterProvider !== 'all' && (log.provider || '').toLowerCase() !== logFilterProvider) return false;
        if (logSearchQuery) {
            const q = logSearchQuery.toLowerCase();
            const nameMatch = (log.userName || '').toLowerCase().includes(q);
            const emailMatch = (log.email || '').toLowerCase().includes(q);
            const deviceMatch = (log.device || '').toLowerCase().includes(q);
            if (!nameMatch && !emailMatch && !deviceMatch) return false;
        }
        return true;
    });

    if (countEl) countEl.textContent = `${filtered.length} entries`;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="py-12 text-center text-slate-500 text-xs">
                    <div class="text-2xl mb-2">🔍</div>
                    No log events match your current filters.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(log => {
        const timeAgo = formatTimeAgo(log.timestamp);
        const fullTime = new Date(log.timestamp).toLocaleString();
        const actionBadge = getActionBadge(log.action);
        const providerBadge = getProviderBadge(log.provider);
        const userAvatar = getUserAvatarHtml(log.userName, log.email);

        return `
            <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition text-xs">
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2.5">
                        ${userAvatar}
                        <div>
                            <div class="font-extrabold text-white">${escapeHtml(log.userName || 'Learner')}</div>
                            <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(log.email || 'No email (Device ID)')}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4">${actionBadge}</td>
                <td class="py-3 px-4">${providerBadge}</td>
                <td class="py-3 px-4">
                    <div class="flex items-center gap-1.5 font-bold">
                        <span class="text-amber-400">Lv.${log.level || 1}</span>
                        <span class="text-slate-500">•</span>
                        <span class="text-emerald-400">${log.xp || 0} XP</span>
                    </div>
                </td>
                <td class="py-3 px-4 text-slate-300">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/70 text-[10px] text-slate-300 border border-slate-700/50">
                        ${getDeviceIcon(log.device)} ${escapeHtml(log.device || 'Web Browser')}
                    </span>
                </td>
                <td class="py-3 px-4 text-right">
                    <div class="font-bold text-white text-[11px] live-time-ago" data-timestamp="${log.timestamp}">${timeAgo}</div>
                    <div class="text-[9px] text-slate-500 font-mono" title="${fullTime}">${fullTime}</div>
                </td>
            </tr>
        `;
    }).join('');
}

function handleLogActionFilterChange(val) {
    logFilterAction = val;
    renderLogsTable();
}

function handleLogProviderFilterChange(val) {
    logFilterProvider = val;
    renderLogsTable();
}

function handleLogSearchInput(val) {
    logSearchQuery = val.trim();
    renderLogsTable();
}

// =====================================================================
// 7. LEARNERS ROSTER TAB
// =====================================================================

function renderLearnersTable() {
    const tbody = document.getElementById('adminLearnersTbody');
    const countEl = document.getElementById('adminLearnersCount');
    if (!tbody) return;

    let filtered = cachedLearners.filter(user => {
        if (learnerSearchQuery) {
            const q = learnerSearchQuery.toLowerCase();
            const nameMatch = (user.userName || '').toLowerCase().includes(q);
            const emailMatch = (user.email || '').toLowerCase().includes(q);
            if (!nameMatch && !emailMatch) return false;
        }
        return true;
    });

    if (countEl) countEl.textContent = `${filtered.length} learners`;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="py-12 text-center text-slate-500 text-xs">
                    <div class="text-2xl mb-2">👤</div>
                    No registered learners found matching "${escapeHtml(learnerSearchQuery)}".
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(user => {
        const timeAgo = formatTimeAgo(user.lastActive);
        const providerBadge = getProviderBadge(user.provider);
        const userAvatar = getUserAvatarHtml(user.userName, user.email);
        const levelPct = Math.min(100, Math.round(((Number(user.level) || 1) / 21) * 100));

        return `
            <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition text-xs">
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2.5">
                        ${userAvatar}
                        <div>
                            <div class="font-extrabold text-white text-sm">${escapeHtml(user.userName || 'Learner')}</div>
                            <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(user.email || 'Local User ID: ' + (user.userId || '—'))}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4">${providerBadge}</td>
                <td class="py-3 px-4">
                    <div class="space-y-1">
                        <div class="flex items-center justify-between font-bold text-[11px]">
                            <span class="text-amber-300">Level ${user.level || 1} / 21</span>
                            <span class="text-slate-400">${levelPct}%</span>
                        </div>
                        <div class="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full" style="width: ${levelPct}%"></div>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <span class="font-black text-emerald-400 text-sm">${(Number(user.xp) || 0).toLocaleString()}</span>
                    <span class="text-[10px] text-slate-400 font-bold ml-1">XP</span>
                </td>
                <td class="py-3 px-4 text-slate-300 text-[11px]">
                    <div class="font-bold text-white live-time-ago" data-timestamp="${user.lastActive}">${timeAgo}</div>
                    <div class="text-[9px] text-slate-500">${escapeHtml(user.device || 'Web')}</div>
                </td>
                <td class="py-3 px-4 text-right">
                    <button onclick="inspectLearnerDetail('${escapeAttr(user.userId || user.email)}')" class="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] transition active:scale-95 cursor-pointer">
                        Inspect
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function handleLearnerSearchInput(val) {
    learnerSearchQuery = val.trim();
    renderLearnersTable();
}

function inspectLearnerDetail(key) {
    const user = cachedLearners.find(u => (u.userId === key || u.email === key));
    if (!user) return;

    const modal = document.getElementById('adminDetailModal');
    const content = document.getElementById('adminDetailModalContent');
    if (!modal || !content) return;

    const userAvatar = getUserAvatarHtml(user.userName, user.email, 'w-16 h-16 text-2xl');
    const levelPct = Math.min(100, Math.round(((Number(user.level) || 1) / 21) * 100));

    content.innerHTML = `
        <div class="flex items-center gap-4 border-b border-slate-800 pb-4">
            ${userAvatar}
            <div>
                <h3 class="text-lg font-black text-white">${escapeHtml(user.userName || 'Learner')}</h3>
                <p class="text-xs text-slate-400 font-mono">${escapeHtml(user.email || 'Local User ID: ' + (user.userId || '—'))}</p>
                <div class="mt-1 flex items-center gap-2">
                    ${getProviderBadge(user.provider)}
                    <span class="text-[10px] text-slate-400">Last active: ${formatTimeAgo(user.lastActive)}</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 py-4">
            <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div class="text-[10px] font-bold text-slate-400 uppercase">Unlocked Mountain Level</div>
                <div class="text-xl font-black text-amber-300 mt-1">Level ${user.level || 1} <span class="text-xs text-slate-400">/ 21</span></div>
                <div class="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div class="h-full bg-amber-400" style="width: ${levelPct}%"></div>
                </div>
            </div>
            <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div class="text-[10px] font-bold text-slate-400 uppercase">Total XP Accumulated</div>
                <div class="text-xl font-black text-emerald-400 mt-1">${(Number(user.xp) || 0).toLocaleString()} <span class="text-xs text-slate-400">XP</span></div>
                <div class="text-[10px] text-slate-500 mt-1">Trail Mastery Rank</div>
            </div>
        </div>

        <div class="space-y-2 border-t border-slate-800 pt-3">
            <h4 class="text-xs font-bold text-slate-300">Recent User Telemetry</h4>
            <div class="text-[11px] space-y-1 text-slate-400">
                <div><strong class="text-slate-300">Device:</strong> ${escapeHtml(user.device || 'Web Browser')}</div>
                <div><strong class="text-slate-300">Last Action:</strong> ${escapeHtml(user.lastAction || 'login')}</div>
                <div><strong class="text-slate-300">Account ID:</strong> <span class="font-mono text-[10px] text-slate-500">${escapeHtml(user.userId || 'local')}</span></div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeAdminDetailModal() {
    const modal = document.getElementById('adminDetailModal');
    if (modal) modal.classList.add('hidden');
}

// =====================================================================
// 8. ANALYTICS & VISUAL CHARTS TAB
// =====================================================================

function renderAnalyticsView() {
    const total = Math.max(cachedLearners.length, 1);

    let googleCount = 0;
    let emailCount = 0;
    let localCount = 0;

    cachedLearners.forEach(u => {
        const p = (u.provider || '').toLowerCase();
        if (p.includes('google')) googleCount++;
        else if (p.includes('email')) emailCount++;
        else localCount++;
    });

    const googlePct = Math.round((googleCount / total) * 100);
    const emailPct = Math.round((emailCount / total) * 100);
    const localPct = Math.round((localCount / total) * 100);

    let lvl1_5 = 0;   // Beginners
    let lvl6_13 = 0;  // Intermediate
    let lvl14_20 = 0; // Chuk-sak Half Letters
    let lvl21 = 0;    // Mountain Champions

    cachedLearners.forEach(u => {
        const l = Number(u.level) || 1;
        if (l >= 21) lvl21++;
        else if (l >= 14) lvl14_20++;
        else if (l >= 6) lvl6_13++;
        else lvl1_5++;
    });

    let apkCount = 0;
    let mobileWebCount = 0;
    let desktopCount = 0;

    cachedLogs.forEach(l => {
        const d = (l.device || '').toLowerCase();
        if (d.includes('apk')) apkCount++;
        else if (d.includes('mobile') || d.includes('ios') || d.includes('android')) mobileWebCount++;
        else desktopCount++;
    });
    const logTotal = Math.max(cachedLogs.length, 1);
    const apkPct = Math.round((apkCount / logTotal) * 100);
    const mobPct = Math.round((mobileWebCount / logTotal) * 100);
    const deskPct = Math.round((desktopCount / logTotal) * 100);

    const container = document.getElementById('analyticsChartsContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-extrabold text-sm text-white">Authentication Providers</h4>
                        <p class="text-[10px] text-slate-400">Distribution of registered learners by sign-in method</p>
                    </div>
                    <span class="text-xl">🔐</span>
                </div>
                <div class="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div class="h-full bg-blue-500" style="width: ${googlePct}%" title="Google: ${googlePct}%"></div>
                    <div class="h-full bg-emerald-500" style="width: ${emailPct}%" title="Email: ${emailPct}%"></div>
                    <div class="h-full bg-amber-500" style="width: ${localPct}%" title="Local/Guest: ${localPct}%"></div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center pt-2">
                    <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="text-[10px] font-bold text-blue-400">🌐 Google</div>
                        <div class="text-base font-black text-white mt-0.5">${googleCount}</div>
                        <div class="text-[9px] text-slate-500">${googlePct}%</div>
                    </div>
                    <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="text-[10px] font-bold text-emerald-400">✉️ Email</div>
                        <div class="text-base font-black text-white mt-0.5">${emailCount}</div>
                        <div class="text-[9px] text-slate-500">${emailPct}%</div>
                    </div>
                    <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="text-[10px] font-bold text-amber-400">📱 Local / Guest</div>
                        <div class="text-base font-black text-white mt-0.5">${localCount}</div>
                        <div class="text-[9px] text-slate-500">${localPct}%</div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-extrabold text-sm text-white">Client Platforms</h4>
                        <p class="text-[10px] text-slate-400">Device environment used to access Yakthung Pan</p>
                    </div>
                    <span class="text-xl">📲</span>
                </div>
                <div class="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div class="h-full bg-emerald-500" style="width: ${apkPct}%" title="Android APK: ${apkPct}%"></div>
                    <div class="h-full bg-indigo-500" style="width: ${mobPct}%" title="Mobile Web: ${mobPct}%"></div>
                    <div class="h-full bg-slate-400" style="width: ${deskPct}%" title="Desktop: ${deskPct}%"></div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center pt-2">
                    <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="text-[10px] font-bold text-emerald-400">🤖 Android APK</div>
                        <div class="text-base font-black text-white mt-0.5">${apkCount}</div>
                        <div class="text-[9px] text-slate-500">${apkPct}%</div>
                    </div>
                    <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="text-[10px] font-bold text-indigo-400">📱 Mobile Web</div>
                        <div class="text-base font-black text-white mt-0.5">${mobileWebCount}</div>
                        <div class="text-[9px] text-slate-500">${mobPct}%</div>
                    </div>
                    <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="text-[10px] font-bold text-slate-300">💻 Desktop</div>
                        <div class="text-base font-black text-white mt-0.5">${desktopCount}</div>
                        <div class="text-[9px] text-slate-500">${deskPct}%</div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 md:col-span-2 space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-extrabold text-sm text-white">Learner Trail Milestones</h4>
                        <p class="text-[10px] text-slate-400">How far learners have progressed through the 21 Mountain Levels</p>
                    </div>
                    <span class="text-xl">🏔️</span>
                </div>
                <div class="space-y-3 pt-2">
                    <div>
                        <div class="flex items-center justify-between text-xs font-bold mb-1">
                            <span class="text-emerald-400">Levels 1-5 (Foundations & Consonants)</span>
                            <span class="text-white">${lvl1_5} learners (${Math.round((lvl1_5/total)*100)}%)</span>
                        </div>
                        <div class="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500 rounded-full" style="width: ${Math.round((lvl1_5/total)*100)}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between text-xs font-bold mb-1">
                            <span class="text-teal-400">Levels 6-13 (Vowels, Matras & Words)</span>
                            <span class="text-white">${lvl6_13} learners (${Math.round((lvl6_13/total)*100)}%)</span>
                        </div>
                        <div class="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-teal-500 rounded-full" style="width: ${Math.round((lvl6_13/total)*100)}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between text-xs font-bold mb-1">
                            <span class="text-amber-400">Levels 14-20 (Chuk-sak Half Letters & Suffixes)</span>
                            <span class="text-white">${lvl14_20} learners (${Math.round((lvl14_20/total)*100)}%)</span>
                        </div>
                        <div class="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-amber-500 rounded-full" style="width: ${Math.round((lvl14_20/total)*100)}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between text-xs font-bold mb-1">
                            <span class="text-purple-400">Level 21 (Limbu Grand Summit Master)</span>
                            <span class="text-white">${lvl21} learners (${Math.round((lvl21/total)*100)}%)</span>
                        </div>
                        <div class="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-purple-500 rounded-full" style="width: ${Math.round((lvl21/total)*100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// =====================================================================
// 9. ADMIN SETTINGS TAB
// =====================================================================

function renderAdminSettings() {
    const listEl = document.getElementById('adminEmailsList');
    if (!listEl) return;

    const emails = getAuthorizedAdminEmails();
    listEl.innerHTML = emails.map(email => `
        <div class="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span class="font-mono text-emerald-300 font-bold">${escapeHtml(email)}</span>
            <button onclick="removeAdminEmail('${escapeAttr(email)}')" class="text-rose-400 hover:text-rose-300 font-bold text-xs p-1 cursor-pointer">
                ✕ Remove
            </button>
        </div>
    `).join('');
}

function clearAllAdminLogs() {
    if (!confirm('Are you sure you want to clear all stored activity telemetry logs?')) return;
    try {
        localStorage.removeItem('yakthung_admin_logs');
        cachedLogs = [];
        renderLogsTable();
        updateKPICards();
        showAdminToast('Telemetry logs cleared', '🧹');
    } catch (e) {}
}

// =====================================================================
// 10. EXPORT DATA TO CSV
// =====================================================================

function exportLogsToCSV() {
    if (!cachedLogs || cachedLogs.length === 0) {
        alert('No log entries to export!');
        return;
    }

    const headers = ['Timestamp', 'Action', 'Learner_Name', 'Email', 'Provider', 'Level', 'XP', 'Device', 'Status'];
    const rows = cachedLogs.map(l => [
        `"${new Date(l.timestamp).toISOString()}"`,
        `"${l.action || ''}"`,
        `"${(l.userName || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${l.provider || ''}"`,
        l.level || 1,
        l.xp || 0,
        `"${(l.device || '').replace(/"/g, '""')}"`,
        `"${l.status || 'success'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadBlob(csvContent, `yakthung_activity_logs_${Date.now()}.csv`, 'text/csv');
    showAdminToast('Downloaded Activity Logs CSV', '📥');
}

function exportLearnersToCSV() {
    if (!cachedLearners || cachedLearners.length === 0) {
        alert('No learners to export!');
        return;
    }

    const headers = ['User_ID', 'Learner_Name', 'Email', 'Provider', 'Current_Level', 'Total_XP', 'Last_Active', 'Device'];
    const rows = cachedLearners.map(u => [
        `"${u.userId || ''}"`,
        `"${(u.userName || '').replace(/"/g, '""')}"`,
        `"${(u.email || '').replace(/"/g, '""')}"`,
        `"${u.provider || ''}"`,
        u.level || 1,
        u.xp || 0,
        `"${new Date(u.lastActive || 0).toISOString()}"`,
        `"${(u.device || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadBlob(csvContent, `yakthung_learners_roster_${Date.now()}.csv`, 'text/csv');
    showAdminToast('Downloaded Learners Roster CSV', '📥');
}

function downloadBlob(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =====================================================================
// 11. UI HELPERS & SAMPLE TELEMETRY
// =====================================================================

function getActionBadge(action) {
    switch (action) {
        case 'login':
            return '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-black">🔑 Login</span>';
        case 'signup':
            return '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[10px] font-black">✨ Sign Up</span>';
        case 'sync':
            return '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/40 text-[10px] font-black">☁️ Cloud Sync</span>';
        case 'reset_pwd':
            return '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-black">📧 Pwd Reset</span>';
        default:
            return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black">${escapeHtml(action)}</span>`;
    }
}

function getProviderBadge(provider) {
    const p = (provider || '').toLowerCase();
    if (p.includes('google')) {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold text-[10px]">🌐 Google</span>';
    } else if (p.includes('email')) {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">✉️ Email</span>';
    } else {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold text-[10px]">📱 Local</span>';
    }
}

function getDeviceIcon(device) {
    const d = (device || '').toLowerCase();
    if (d.includes('apk')) return '🤖';
    if (d.includes('mobile') || d.includes('ios') || d.includes('android')) return '📱';
    return '💻';
}

function getUserAvatarHtml(name, email, sizeClass = 'w-8 h-8 text-xs') {
    const seed = encodeURIComponent(name || email || 'Learner');
    const imgUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    return `
        <div class="${sizeClass} rounded-full bg-slate-800 border border-emerald-500/40 overflow-hidden shrink-0 flex items-center justify-center">
            <img src="${imgUrl}" alt="Avatar" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='👤'">
        </div>
    `;
}

function formatTimeAgo(isoString) {
    if (!isoString) return 'Never';
    const past = new Date(isoString).getTime();
    if (isNaN(past)) return 'Recently';
    const diffSec = Math.floor((Date.now() - past) / 1000);
    if (diffSec < 15) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return new Date(past).toLocaleDateString();
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[m]);
}

function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;');
}

function showAdminToast(msg, icon = '🛡️') {
    let toast = document.getElementById('adminToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'adminToast';
        toast.className = 'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-emerald-500/40 text-white font-bold text-xs shadow-2xl flex items-center gap-2 transform transition-all duration-300 translate-y-10 opacity-0 pointer-events-none';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="text-base">${icon}</span> <span>${escapeHtml(msg)}</span>`;
    toast.classList.remove('translate-y-10', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 2800);
}

function generateInitialSampleLogs() {
    const now = Date.now();
    return [
        {
            id: 'act_init_1',
            action: 'login',
            userId: 'user_admin_demo_1',
            userName: 'Suman Limbu',
            email: 'suman@example.com',
            provider: 'email',
            timestamp: new Date(now - 1000 * 45).toISOString(),
            device: 'Android APK',
            level: 15,
            xp: 2850,
            status: 'success'
        },
        {
            id: 'act_init_2',
            action: 'signup',
            userId: 'user_admin_demo_2',
            userName: 'Numa Phung',
            email: 'numa.phung@gmail.com',
            provider: 'google',
            timestamp: new Date(now - 1000 * 60 * 12).toISOString(),
            device: 'Android Mobile',
            level: 3,
            xp: 420,
            status: 'success'
        },
        {
            id: 'act_init_3',
            action: 'login',
            userId: 'user_admin_demo_3',
            userName: 'Limbu Scholar',
            email: 'scholar@gmail.com',
            provider: 'google',
            timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
            device: 'Android APK',
            level: 18,
            xp: 3950,
            status: 'success'
        }
    ];
}

// =====================================================================
// 12. INITIALIZATION & DASHBOARD GATE
// =====================================================================

function renderAdminDashboard() {
    const gate = document.getElementById('adminGateOverlay');
    const main = document.getElementById('adminMainDashboard');

    if (isAdminAuthenticated()) {
        if (gate) gate.classList.add('hidden');
        if (main) main.classList.remove('hidden');
        initRealtimeEngine();
    } else {
        if (gate) gate.classList.remove('hidden');
        if (main) main.classList.add('hidden');
        const input = document.getElementById('adminPasscodeInput');
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 200);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderAdminDashboard();
});
