/**
 * Yakthung Pan • Real-Time Enterprise Admin Portal & Activity Telemetry Engine
 * Features:
 *  - 100% Real-time updates via Firebase Firestore `onSnapshot` listeners
 *  - Instant cross-device sync via persistent Cloud Hub
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
var DEFAULT_ADMIN_EMAILS = ['admin@yakthung.com', 'ag9tes@gmail.com', 'ag9tes.yt@gmail.com'];

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
var localRefreshTimer = null;
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

function autofillDefaultPasscode() {
    const input = document.getElementById('adminPasscodeInput');
    if (input) {
        input.value = DEFAULT_ADMIN_PASSCODE;
        input.focus();
    }
}

async function handleAdminLoginSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById('adminEmailInput');
    const passInput = document.getElementById('adminPasscodeInput');
    const errEl = document.getElementById('adminLoginError');
    const errText = document.getElementById('adminLoginErrorText');
    const btnText = document.getElementById('adminLoginSubmitBtnText');

    const enteredEmail = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const enteredPass = passInput ? passInput.value.trim() : '';

    if (!enteredPass && !enteredEmail) {
        if (errEl) {
            errEl.classList.remove('hidden');
            if (errText) errText.textContent = 'Please enter your administrator credentials.';
        }
        return;
    }

    const validPasscode = getStoredAdminPasscode();

    // 1. If Email & Password are provided, authenticate via Firebase Authentication & check Firestore role == 'admin'
    if (enteredEmail && typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
        if (btnText) btnText.textContent = 'Verifying admin role...';
        try {
            const auth = window.firebase.auth();
            const res = await auth.signInWithEmailAndPassword(enteredEmail, enteredPass);
            if (res && res.user) {
                // Check user document in Cloud Firestore
                let isAdmin = false;
                if (window.firebase.firestore) {
                    try {
                        const db = window.firebase.firestore();
                        const userSnap = await db.collection('users').doc(res.user.uid).get();
                        if (userSnap.exists) {
                            const uData = userSnap.data();
                            if (uData && uData.role === 'admin') {
                                isAdmin = true;
                            }
                        }
                    } catch (dbErr) {
                        console.warn('[Admin Auth] Firestore role query note:', dbErr);
                    }
                }

                // If role is admin or email is in authorized admin list
                if (isAdmin || isAuthorizedAdminEmail(enteredEmail)) {
                    sessionStorage.setItem(ADMIN_STORAGE_AUTH, 'true');
                    sessionStorage.setItem('yakthung_admin_role', 'admin');
                    sessionStorage.setItem('yakthung_admin_uid', res.user.uid);
                    sessionStorage.setItem('yakthung_admin_email', enteredEmail);
                    if (errEl) errEl.classList.add('hidden');
                    if (btnText) btnText.textContent = 'Unlock Enterprise Console';
                    if (emailInput) emailInput.value = '';
                    if (passInput) passInput.value = '';
                    renderAdminDashboard();
                    showAdminToast(`Welcome, Administrator (${res.user.displayName || enteredEmail})!`, '🛡️');
                    return;
                } else {
                    // Block access and sign out regular user
                    await auth.signOut();
                    if (btnText) btnText.textContent = 'Unlock Enterprise Console';
                    if (errEl) {
                        errEl.classList.remove('hidden');
                        if (errText) errText.textContent = "Access Denied: Your account does not have administrator privileges (role must be 'admin' in Firestore).";
                    }
                    return;
                }
            }
        } catch (authErr) {
            console.warn('[Admin Auth] Firebase sign-in warning:', authErr);
            if (btnText) btnText.textContent = 'Unlock Enterprise Console';
            // Check if enteredPass matches emergency passcode fallback
            if (enteredPass === validPasscode || enteredPass === DEFAULT_ADMIN_PASSCODE) {
                sessionStorage.setItem(ADMIN_STORAGE_AUTH, 'true');
                if (errEl) errEl.classList.add('hidden');
                if (passInput) passInput.value = '';
                renderAdminDashboard();
                showAdminToast('Console unlocked with master passcode', '🛡️');
                return;
            }
            if (errEl) {
                errEl.classList.remove('hidden');
                if (errText) errText.textContent = authErr.message || 'Invalid administrator email or password.';
            }
            return;
        }
    }

    // 2. Passcode-only fallback authentication
    if (enteredPass === validPasscode || enteredPass === DEFAULT_ADMIN_PASSCODE) {
        sessionStorage.setItem(ADMIN_STORAGE_AUTH, 'true');
        if (errEl) errEl.classList.add('hidden');
        if (passInput) passInput.value = '';
        renderAdminDashboard();
        showAdminToast('Welcome, Administrator!', '🛡️');
    } else {
        if (errEl) {
            errEl.classList.remove('hidden');
            if (errText) errText.textContent = 'Invalid administrator credentials. Please try again.';
        }
        if (passInput) {
            passInput.classList.add('ring-2', 'ring-rose-500');
            setTimeout(() => passInput.classList.remove('ring-2', 'ring-rose-500'), 1500);
            passInput.focus();
        }
    }
}

function logoutAdmin() {
    sessionStorage.removeItem(ADMIN_STORAGE_AUTH);
    sessionStorage.removeItem('yakthung_admin_role');
    sessionStorage.removeItem('yakthung_admin_uid');
    sessionStorage.removeItem('yakthung_admin_email');
    if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
        try { window.firebase.auth().signOut(); } catch (e) {}
    }
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
// 2. REAL-TIME ENGINE (FIRESTORE SNAPSHOTS + CLOUD HUB + AUDIO)
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

    // 3. Connect Universal Cloud Hub (cross-device sync between Phone APK and Admin Dashboard)
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

    // 8. Periodic Live Local Refresh (Every 3 seconds failsafe for instant app link)
    if (!localRefreshTimer) {
        localRefreshTimer = setInterval(syncLatestLocalTelemetry, 3000);
    }
}

function teardownRealtimeListeners() {
    if (cloudHubPollTimer) {
        clearInterval(cloudHubPollTimer);
        cloudHubPollTimer = null;
    }
    if (localRefreshTimer) {
        clearInterval(localRefreshTimer);
        localRefreshTimer = null;
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
var CLOUD_PROGRESS_STORAGE_ID = 'ff808181a09d98f701a1f3bdd6445cbc';
var CLOUD_PROGRESS_URL = 'https://api.restful-api.dev/objects/' + CLOUD_PROGRESS_STORAGE_ID;
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

        // Merge learners from Telemetry Hub
        if (data.learners && typeof data.learners === 'object') {
            Object.values(data.learners).forEach(user => {
                updateLearnerInRoster(user);
            });
            updateKPICards();
            if (currentAdminTab === 'learners' || currentAdminTab === 'analytics') {
                renderCurrentTab();
            }
        }

        // Also query Cloud Progress Hub for live Mountain Trail stages & XP
        try {
            const pRes = await fetch(CLOUD_PROGRESS_URL, { cache: 'no-store' });
            if (pRes.ok) {
                const pJson = await pRes.json();
                const pUsers = (pJson.data && pJson.data.users) || {};
                let hasUpdates = false;
                for (const [key, pUser] of Object.entries(pUsers)) {
                    if (!pUser) continue;
                    const email = (pUser.email || '').toLowerCase().trim();
                    const name = pUser.name || (email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Learner');
                    const lvl = Number(pUser.unlockedLevel || pUser.level) || 1;
                    const xp = Number(pUser.xp) || 0;
                    const lrnId = email || key;
                    updateLearnerInRoster({
                        userId: lrnId,
                        userName: name,
                        email: email,
                        level: lvl,
                        xp: xp,
                        lastActive: pUser.syncedAt || new Date().toISOString(),
                        device: pUser.device || 'Learner App',
                        provider: pUser.provider || 'google'
                    });
                    hasUpdates = true;
                }
                if (hasUpdates) {
                    updateKPICards();
                    if (currentAdminTab === 'learners') {
                        renderLearnersTable();
                    }
                }
            }
        } catch (pe) {}
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
                const parseDateIso = (d) => {
                    if (!d) return null;
                    if (d.toDate && typeof d.toDate === 'function') return d.toDate().toISOString();
                    return String(d);
                };

                const lastLoginIso = parseDateIso(data.lastLoginAt) || parseDateIso(data.lastLogin) || parseDateIso(data.updatedAt) || new Date().toISOString();
                const createdIso = parseDateIso(data.createdAt) || lastLoginIso;

                const userCurrentLevel = Number(data.currentLevel !== undefined ? data.currentLevel : (data.lastLevel || data.level || 1)) || 1;
                const userXp = Number(data.xp !== undefined ? data.xp : (data.lastXp || 0)) || 0;
                const userScore = Number(data.score !== undefined ? data.score : userXp) || 0;

                const updatedUser = {
                    userId: change.doc.id,
                    uid: data.uid || change.doc.id,
                    userName: data.displayName || data.name || data.username || (data.email ? data.email.split('@')[0] : 'Learner'),
                    email: data.email || '',
                    role: data.role || 'user',
                    provider: data.provider || (data.email ? 'email' : 'cloud'),
                    lastLoginAt: lastLoginIso,
                    lastActive: lastLoginIso,
                    createdAt: createdIso,
                    currentLevel: userCurrentLevel,
                    level: userCurrentLevel,
                    xp: userXp,
                    score: userScore,
                    device: data.lastDevice || 'Learner App'
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
                handleIncomingRealtimeEntry(event.data.entry, true);
            }
        };
    } catch (e) {
        console.warn('[Admin Realtime] BroadcastChannel init note:', e);
    }
}

function handleStorageEvent(event) {
    if (!event || !event.key) return;
    const k = event.key;
    if (k === 'yakthung_admin_logs' || k === 'yakthung_admin_learners' || k === 'yakthung_local_accounts' || k === 'yakthung_auth_profile' || k.startsWith('yakthung_progress_')) {
        syncLatestLocalTelemetry();
    }
}

function syncLatestLocalTelemetry() {
    loadInitialBaselineData(false);
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
    let actionLabel = 'Logged In';
    let badgeIcon = '🔑';
    if (entry.action === 'signup') {
        actionLabel = 'Registered';
        badgeIcon = '✨';
    } else if (entry.action === 'level_complete') {
        actionLabel = `Completed Level ${entry.level || ''}`;
        badgeIcon = '🏆';
    } else if (entry.action === 'sync') {
        actionLabel = `Synced Progress (Lv.${entry.level || 1})`;
        badgeIcon = '☁️';
    }
    showAdminToast(`${badgeIcon} Live: ${entry.userName || 'Learner'} ${actionLabel}!`, badgeIcon);

    // Update KPIs instantly
    updateKPICards();

    // If currently on logs view, prepend row with pulse highlight
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
    tr.className = 'border-b border-white/[0.06] transition-all duration-500 text-xs row-live-highlight';

    const timeAgo = formatTimeAgo(log.timestamp);
    const fullTime = new Date(log.timestamp).toLocaleString();
    const actionBadge = getActionBadge(log.action);
    const providerBadge = getProviderBadge(log.provider);
    const userAvatar = getUserAvatarHtml(log.userName, log.email);

    tr.innerHTML = `
        <td class="py-3.5 px-4">
            <div class="flex items-center gap-3">
                ${userAvatar}
                <div>
                    <div class="font-extrabold text-white flex items-center gap-2">
                        <span>${escapeHtml(log.userName || 'Learner')}</span>
                        <span class="px-1.5 py-0.5 rounded-full bg-emerald-500 text-[#080c14] text-[9px] font-black uppercase tracking-wider animate-pulse">LIVE</span>
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5">${escapeHtml(log.email || 'Device ID / Local User')}</div>
                </div>
            </div>
        </td>
        <td class="py-3.5 px-4">${actionBadge}</td>
        <td class="py-3.5 px-4">${providerBadge}</td>
        <td class="py-3.5 px-4">
            <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-black text-[11px] border border-amber-500/20">
                    Lv.${log.level || 1}
                </span>
                <span class="text-xs font-mono font-bold text-emerald-400">
                    ${(Number(log.xp) || 0).toLocaleString()} XP
                </span>
            </div>
        </td>
        <td class="py-3.5 px-4 text-slate-300">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080c14] text-[11px] text-slate-300 border border-white/10 font-medium">
                ${getDeviceIcon(log.device)} <span>${escapeHtml(log.device || 'Web Browser')}</span>
            </span>
        </td>
        <td class="py-3.5 px-4 text-right">
            <div class="font-bold text-emerald-400 text-xs live-time-ago" data-timestamp="${log.timestamp}">Just now</div>
            <div class="text-[10px] text-slate-500 font-mono mt-0.5" title="${fullTime}">${fullTime}</div>
        </td>
    `;

    tbody.insertBefore(tr, tbody.firstChild);

    // Remove pulse after 3.5s
    setTimeout(() => {
        tr.className = 'border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors text-xs';
        const livePill = tr.querySelector('.animate-pulse');
        if (livePill) livePill.remove();
    }, 3500);

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
        btn.className = 'p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#0d1524] hover:bg-[#131e33] text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer';
    } else {
        if (iconEl) iconEl.textContent = '🔕';
        if (textEl) textEl.textContent = 'Muted';
        btn.className = 'p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#080c14] hover:bg-white/[0.05] text-slate-400 border border-white/10 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer';
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

    showAdminToast(`⚡ Real-Time Login Simulated: ${randomName}`, '⚡');
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

function loadInitialBaselineData(allowSampleFallback = true) {
    let localLogs = [];
    try {
        localLogs = JSON.parse(localStorage.getItem('yakthung_admin_logs') || '[]');
    } catch (e) {}

    let localLearnersMap = {};
    try {
        localLearnersMap = JSON.parse(localStorage.getItem('yakthung_admin_learners') || '{}');
    } catch (e) {}

    // 1. Ingest registered accounts from yakthung_local_accounts
    try {
        const localAccounts = JSON.parse(localStorage.getItem('yakthung_local_accounts') || '{}');
        Object.values(localAccounts).forEach(acc => {
            const key = (acc.email || acc.id || '').toLowerCase().trim();
            if (key) {
                if (!localLearnersMap[key]) {
                    localLearnersMap[key] = {
                        userId: acc.id || key,
                        userName: acc.username || acc.name || 'Learner',
                        email: acc.email || '',
                        provider: acc.provider || 'email',
                        lastActive: acc.created || new Date().toISOString(),
                        lastAction: 'signup',
                        level: 1,
                        xp: 0,
                        device: 'Registered Account'
                    };
                }
            }
        });
    } catch (e) {}

    // 2. Ingest active user profile from yakthung_auth_profile
    try {
        const authRaw = localStorage.getItem('yakthung_auth_profile');
        if (authRaw) {
            const u = JSON.parse(authRaw);
            const key = (u.email || u.id || '').toLowerCase().trim();
            if (key) {
                if (!localLearnersMap[key]) {
                    localLearnersMap[key] = {
                        userId: u.id || key,
                        userName: u.name || u.username || 'Active Learner',
                        email: u.email || '',
                        provider: u.provider || 'google',
                        lastActive: u.lastSynced || new Date().toISOString(),
                        lastAction: 'login',
                        level: 1,
                        xp: 0,
                        device: 'Active Session'
                    };
                } else {
                    localLearnersMap[key].userName = u.name || u.username || localLearnersMap[key].userName;
                    localLearnersMap[key].provider = u.provider || localLearnersMap[key].provider;
                }
            }
        }
    } catch (e) {}

    // 3. Scan all user progress keys (yakthung_progress_user_*) and guest progress
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('yakthung_progress_user_')) {
                const cleanId = k.replace('yakthung_progress_user_', '');
                const pRaw = localStorage.getItem(k);
                if (pRaw) {
                    const p = JSON.parse(pRaw);
                    const lvl = Number(p.unlockedLevel) || 1;
                    const xp = Number(p.xp) || 0;

                    // Match to an existing learner
                    let matched = false;
                    for (const [lKey, lVal] of Object.entries(localLearnersMap)) {
                        const cleanKey = lKey.replace(/[^a-z0-9]/g, '_');
                        if (cleanKey === cleanId || cleanId.includes(cleanKey) || cleanKey.includes(cleanId)) {
                            lVal.level = Math.max(Number(lVal.level) || 1, lvl);
                            lVal.xp = Math.max(Number(lVal.xp) || 0, xp);
                            if (p.lastActiveDate) lVal.lastActive = p.lastActiveDate;
                            matched = true;
                            break;
                        }
                    }

                    if (!matched) {
                        const guessedEmail = cleanId.includes('gmail')
                            ? cleanId.replace(/_at_/g, '@').replace(/_dot_/g, '.').replace(/_/g, '.')
                            : '';
                        const formattedName = cleanId.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        localLearnersMap[cleanId] = {
                            userId: cleanId,
                            userName: formattedName,
                            email: guessedEmail,
                            provider: 'google',
                            lastActive: p.lastActiveDate || new Date().toISOString(),
                            lastAction: 'progress',
                            level: lvl,
                            xp: xp,
                            device: 'Learner App'
                        };
                    }
                }
            }
        }
    } catch (e) {}

    // Save consolidated learners roster
    try {
        localStorage.setItem('yakthung_admin_learners', JSON.stringify(localLearnersMap));
    } catch (e) {}

    // 4. Activity Logs reconciliation:
    // If real learners exist and localLogs is empty, generate real baseline logs from these actual learners
    const realLearnerList = Object.values(localLearnersMap);
    if (localLogs.length === 0 && realLearnerList.length > 0) {
        realLearnerList.forEach((lrn, idx) => {
            localLogs.push({
                id: 'act_init_' + (idx + 1),
                action: lrn.lastAction || 'login',
                userId: lrn.userId,
                userName: lrn.userName,
                email: lrn.email,
                provider: lrn.provider,
                timestamp: lrn.lastActive || new Date().toISOString(),
                device: lrn.device || 'Learner App',
                level: lrn.level || 1,
                xp: lrn.xp || 0,
                status: 'success',
                details: `Learner on Level ${lrn.level || 1} • ${lrn.xp || 0} XP`
            });
        });
        try { localStorage.setItem('yakthung_admin_logs', JSON.stringify(localLogs)); } catch (e) {}
    } else if (localLogs.length === 0 && allowSampleFallback) {
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
    const newTodayEl = document.getElementById('kpiNewToday');
    const onlineNowEl = document.getElementById('kpiOnlineNow');
    const dailyLoginsEl = document.getElementById('kpiDailyLogins');
    const totalLoginsEl = document.getElementById('kpiTotalLogins');
    const activeTodayEl = document.getElementById('kpiActiveToday');
    const totalXpEl = document.getElementById('kpiTotalXp');
    const avgLevelEl = document.getElementById('kpiAvgLevel');

    const totalLearners = Math.max(cachedLearners.length, 1);
    
    // Time calculations
    const now = Date.now();
    const fifteenMinsMs = 15 * 60 * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayMs = startOfToday.getTime();

    // 1. Online Right Now (presence within 15 mins)
    const onlineNowCount = cachedLearners.filter(u => {
        const t = new Date(u.lastLoginAt || u.lastActive || 0).getTime();
        return (now - t) < fifteenMinsMs;
    }).length;

    // 2. Active users filtering lastLoginAt for last 24 hours (DAU) & last 7 days (WAU)
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const active24hCount = cachedLearners.filter(u => {
        const t = new Date(u.lastLoginAt || u.lastActive || 0).getTime();
        return (now - t) <= oneDayMs;
    }).length;

    const active7dCount = cachedLearners.filter(u => {
        const t = new Date(u.lastLoginAt || u.lastActive || 0).getTime();
        return (now - t) <= sevenDaysMs;
    }).length;

    // 3. Daily Logins (Today) vs Total Logins
    const todayLogins = cachedLogs.filter(l => {
        const isLogin = l.action === 'login' || l.action === 'app_launch';
        const t = new Date(l.timestamp || 0).getTime();
        return isLogin && t >= startOfTodayMs;
    }).length;

    const totalLoginsCount = cachedLogs.filter(l => l.action === 'login' || l.action === 'signup' || l.action === 'app_launch').length;

    // 4. New Registrations Today (from users createdAt or signup logs)
    const todaySignups = cachedLearners.filter(u => {
        const t = new Date(u.createdAt || 0).getTime();
        return t >= startOfTodayMs;
    }).length || cachedLogs.filter(l => {
        const isSignup = l.action === 'signup';
        const t = new Date(l.timestamp || 0).getTime();
        return isSignup && t >= startOfTodayMs;
    }).length;

    // 5. XP, Score and Mountain Progress
    let sumXp = 0;
    let sumScore = 0;
    let sumLevel = 0;
    cachedLearners.forEach(u => {
        sumXp += Number(u.xp) || 0;
        sumScore += Number(u.score !== undefined ? u.score : (u.xp || 0)) || 0;
        sumLevel += Number(u.currentLevel || u.level) || 1;
    });

    const avgLevel = (sumLevel / totalLearners).toFixed(1);

    if (totalUsersEl) totalUsersEl.textContent = cachedLearners.length.toLocaleString();
    if (newTodayEl) newTodayEl.textContent = `+${todaySignups} Today`;
    if (onlineNowEl) onlineNowEl.textContent = `${onlineNowCount} Online`;
    if (dailyLoginsEl) dailyLoginsEl.textContent = `${todayLogins} Logins`;
    if (totalLoginsEl) totalLoginsEl.textContent = totalLoginsCount.toLocaleString();
    if (activeTodayEl) activeTodayEl.textContent = Math.max(active24hCount, 1).toLocaleString();
    if (totalXpEl) totalXpEl.textContent = sumXp.toLocaleString() + ' XP';
    if (avgLevelEl) avgLevelEl.textContent = 'Level ' + avgLevel;
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
                btn.className = 'py-2 px-3.5 sm:px-4 rounded-xl font-black text-xs bg-emerald-500 text-[#080c14] shadow-md shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer shrink-0';
            } else {
                btn.className = 'py-2 px-3.5 sm:px-4 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] transition flex items-center gap-2 cursor-pointer shrink-0';
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
                <td colspan="6" class="py-14 text-center text-slate-500 text-xs">
                    <div class="text-3xl mb-2">🔍</div>
                    <div class="font-bold text-slate-300">No activity logs found</div>
                    <p class="text-slate-500 text-[11px] mt-1">Try adjusting your search terms or filters</p>
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
            <tr class="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors text-xs">
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                        ${userAvatar}
                        <div>
                            <div class="font-bold text-white text-xs">${escapeHtml(log.userName || 'Learner')}</div>
                            <div class="text-[10px] text-slate-400 font-mono mt-0.5">${escapeHtml(log.email || 'Device ID / Local User')}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3.5 px-4">${actionBadge}</td>
                <td class="py-3.5 px-4">${providerBadge}</td>
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-black text-[11px] border border-amber-500/20">
                            Lv.${log.level || 1}
                        </span>
                        <span class="text-xs font-mono font-bold text-emerald-400">
                            ${(Number(log.xp) || 0).toLocaleString()} XP
                        </span>
                    </div>
                </td>
                <td class="py-3.5 px-4 text-slate-300">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080c14] text-[11px] text-slate-300 border border-white/10 font-medium">
                        ${getDeviceIcon(log.device)} <span>${escapeHtml(log.device || 'Web Browser')}</span>
                    </span>
                </td>
                <td class="py-3.5 px-4 text-right">
                    <div class="font-bold text-white text-xs live-time-ago" data-timestamp="${log.timestamp}">${timeAgo}</div>
                    <div class="text-[10px] text-slate-500 font-mono mt-0.5" title="${fullTime}">${fullTime}</div>
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
// 7. LEARNERS DIRECTORY TAB
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
                <td colspan="6" class="py-14 text-center text-slate-500 text-xs">
                    <div class="text-3xl mb-2">👤</div>
                    <div class="font-bold text-slate-300">No learners found</div>
                    <p class="text-slate-500 text-[11px] mt-1">No registered learners found matching "${escapeHtml(learnerSearchQuery)}"</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(user => {
        const timeAgo = formatTimeAgo(user.lastActive);
        const providerBadge = getProviderBadge(user.provider);
        const userAvatar = getUserAvatarHtml(user.userName, user.email);
        const currentLevel = Number(user.currentLevel !== undefined ? user.currentLevel : (user.level || 1)) || 1;
        const levelPct = Math.min(100, Math.round((currentLevel / 21) * 100));
        const userXp = Number(user.xp !== undefined ? user.xp : (user.lastXp || 0)) || 0;
        const userScore = Number(user.score !== undefined ? user.score : userXp) || 0;
        const roleBadge = user.role === 'admin'
            ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-[10px]">🛡️ Admin</span>`
            : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 font-medium text-[10px]">Learner</span>`;

        const now = Date.now();
        const lastLoginTime = user.lastLoginAt || user.lastActive;
        const lastActiveMs = new Date(lastLoginTime || 0).getTime();
        const isOnline = (now - lastActiveMs) < (15 * 60 * 1000);
        const onlineIndicator = isOnline
            ? `<div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black text-[10px] animate-pulse"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online Now</div>`
            : `<div class="font-bold text-slate-300 text-xs live-time-ago" data-timestamp="${lastLoginTime}">${timeAgo}</div>`;

        return `
            <tr class="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors text-xs">
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                        ${userAvatar}
                        <div>
                            <div class="font-bold text-white text-sm">${escapeHtml(user.userName || 'Learner')}</div>
                            <div class="text-[10px] text-slate-400 font-mono mt-0.5">${escapeHtml(user.email || 'Local User ID: ' + (user.userId || '—'))}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        ${providerBadge}
                        ${roleBadge}
                    </div>
                </td>
                <td class="py-3.5 px-4">
                    <div class="space-y-1.5 min-w-[140px]">
                        <div class="flex items-center justify-between font-bold text-[11px]">
                            <span class="text-amber-300">Stage ${currentLevel} / 21</span>
                            <span class="text-slate-400 font-mono">${levelPct}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-[#080c14] rounded-full overflow-hidden border border-white/[0.06]">
                            <div class="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full" style="width: ${levelPct}%"></div>
                        </div>
                    </div>
                </td>
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span class="font-black text-emerald-400 text-xs font-mono">${userXp.toLocaleString()}</span>
                            <span class="text-[9px] text-emerald-300 font-bold">XP</span>
                        </div>
                        <div class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20">
                            <span class="font-bold text-teal-300 text-[11px] font-mono">${userScore.toLocaleString()}</span>
                            <span class="text-[8px] text-teal-400 font-bold uppercase">Score</span>
                        </div>
                    </div>
                </td>
                <td class="py-3.5 px-4 text-slate-300">
                    ${onlineIndicator}
                    <div class="text-[10px] text-slate-500 mt-0.5 font-mono">${lastLoginTime ? new Date(lastLoginTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (user.device || 'Learner App')}</div>
                </td>
                <td class="py-3.5 px-4 text-right">
                    <button onclick="inspectLearnerDetail('${escapeAttr(user.userId || user.email)}')" class="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-emerald-500 hover:text-[#080c14] text-slate-300 border border-white/10 font-bold text-[11px] transition active:scale-95 cursor-pointer">
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
    const user = cachedLearners.find(u => (u.userId === key || u.email === key || (u.email && key && u.email.toLowerCase() === key.toLowerCase())));
    if (!user) return;

    const modal = document.getElementById('adminDetailModal');
    const content = document.getElementById('adminDetailModalContent');
    if (!modal || !content) return;

    const userAvatar = getUserAvatarHtml(user.userName, user.email, 'w-16 h-16 text-2xl');
    const currentLevel = Number(user.level) || 1;
    const levelPct = Math.min(100, Math.round((currentLevel / 21) * 100));
    const now = Date.now();
    const lastActiveMs = new Date(user.lastActive || 0).getTime();
    const isOnline = (now - lastActiveMs) < (15 * 60 * 1000);

    const onlineBadge = isOnline
        ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-[11px] animate-pulse"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Online Now</span>`
        : `<span class="text-slate-400 text-xs font-semibold">Active ${formatTimeAgo(user.lastActive)}</span>`;

    // 21 Mountain Trail Stage Titles
    const stageTitles = [
        "Row 1: Ka – Nga", "Row 2: Cha – Na", "Row 3: Ta – Na", "Row 4: Ta – Ma",
        "Row 5: Ya – Wa", "Row 6: Sha – Ha", "Vowel Matras: Aa, I, U", "Vowel Matras: E, O, Ai, Au",
        "Subjoined: Ya, Ra", "Subjoined: La, Wa", "Final Consonants 1", "Final Consonants 2",
        "Basic Greetings", "Family & Kinship", "Numbers 1–10", "Colors & Nature",
        "Food & Daily Life", "Time & Calendar", "Short Sentences", "Cultural Dialogue",
        "Sirijonga Summit Mastery"
    ];

    let stagesHtml = '';
    for (let i = 1; i <= 21; i++) {
        const title = stageTitles[i - 1] || `Stage ${i}`;
        let statusBadge = '';
        let cardStyle = '';
        if (i < currentLevel) {
            statusBadge = '<span class="text-emerald-400 font-bold text-[10px]">⭐ Done</span>';
            cardStyle = 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200';
        } else if (i === currentLevel) {
            statusBadge = '<span class="text-amber-300 font-black text-[10px] animate-pulse">🧗 Current</span>';
            cardStyle = 'bg-amber-500/15 border-amber-400/50 text-amber-200 ring-1 ring-amber-400/40 shadow-sm';
        } else {
            statusBadge = '<span class="text-slate-600 font-medium text-[10px]">🔒 Locked</span>';
            cardStyle = 'bg-[#060a12]/70 border-white/5 text-slate-500 opacity-60';
        }

        stagesHtml += `
            <div class="p-2 rounded-xl border ${cardStyle} flex items-center justify-between gap-1.5 transition">
                <div class="min-w-0">
                    <div class="font-bold text-xs truncate">Stg ${i}</div>
                    <div class="text-[9px] text-slate-400 truncate">${title}</div>
                </div>
                <div class="shrink-0">${statusBadge}</div>
            </div>
        `;
    }

    // Filter recent individual audit logs
    const userLogs = cachedLogs.filter(l => (
        l.userId === key || l.email === key || (user.email && l.email && l.email.toLowerCase() === user.email.toLowerCase())
    )).slice(0, 8);

    let logsHtml = '';
    if (userLogs.length > 0) {
        logsHtml = userLogs.map(l => {
            const time = formatTimeAgo(l.timestamp);
            const badge = getActionBadge(l.action);
            return `
                <div class="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                    <div class="flex items-center gap-2 min-w-0">
                        ${badge}
                        <span class="text-slate-300 font-medium truncate">${escapeHtml(l.details || l.action)}</span>
                    </div>
                    <span class="text-[10px] text-slate-500 font-mono shrink-0 pl-2">${time}</span>
                </div>
            `;
        }).join('');
    } else {
        logsHtml = '<div class="text-xs text-slate-500 py-3 text-center">No individual telemetry events recorded yet.</div>';
    }

    content.innerHTML = `
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
            <div class="flex items-center gap-3.5">
                ${userAvatar}
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <h3 class="text-lg font-black text-white tracking-tight">${escapeHtml(user.userName || 'Learner')}</h3>
                        ${getProviderBadge(user.provider)}
                    </div>
                    <p class="text-xs text-slate-400 font-mono">${escapeHtml(user.email || 'Local User ID: ' + (user.userId || '—'))}</p>
                </div>
            </div>
            <div>${onlineBadge}</div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3">
            <div class="p-3 rounded-2xl bg-[#080c14] border border-white/10">
                <div class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Mountain Stage</div>
                <div class="text-xl font-black text-amber-300 mt-0.5">Stage ${currentLevel} <span class="text-xs text-slate-500">/ 21</span></div>
                <div class="text-[10px] text-slate-400 font-mono mt-1">${levelPct}% Completed</div>
            </div>

            <div class="p-3 rounded-2xl bg-[#080c14] border border-white/10">
                <div class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total XP & Score</div>
                <div class="text-xl font-black text-purple-300 mt-0.5">${(Number(user.xp) || 0).toLocaleString()} <span class="text-xs text-slate-500">XP</span></div>
                <div class="text-[10px] text-teal-400 font-semibold mt-1">Score: ${(Number(user.score !== undefined ? user.score : user.xp) || 0).toLocaleString()} Pts</div>
            </div>

            <div class="p-3 rounded-2xl bg-[#080c14] border border-white/10">
                <div class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Account Role</div>
                <div class="text-sm font-bold ${user.role === 'admin' ? 'text-rose-400' : 'text-slate-200'} mt-1 truncate">${user.role === 'admin' ? '🛡️ Administrator' : '👤 Regular User'}</div>
                <div class="text-[10px] text-slate-500 mt-1 font-mono">${escapeHtml(user.provider || 'email')} auth</div>
            </div>

            <div class="p-3 rounded-2xl bg-[#080c14] border border-white/10">
                <div class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Last Login At</div>
                <div class="text-xs font-mono font-bold text-emerald-400 mt-1 truncate">${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</div>
                <div class="text-[10px] text-slate-500 mt-1">${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : formatTimeAgo(user.lastActive)}</div>
            </div>
        </div>

        <div class="space-y-2 py-2">
            <div class="flex items-center justify-between">
                <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏔️</span>
                    <span>Mountain Trail 21-Stage Curriculum Breakdown</span>
                </h4>
                <span class="text-[11px] font-bold text-amber-300">${currentLevel} / 21 Stages Unlocked</span>
            </div>
            <div class="w-full h-1.5 bg-[#080c14] rounded-full overflow-hidden border border-white/10 mb-2">
                <div class="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full" style="width: ${levelPct}%"></div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                ${stagesHtml}
            </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-white/10">
            <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>📋</span>
                <span>Learner Activity & Login Audit Stream</span>
            </h4>
            <div class="max-h-40 overflow-y-auto pr-1">
                ${logsHtml}
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

    let lvl1_5 = 0;   // Foundations & Consonants
    let lvl6_13 = 0;  // Vowels, Matras & Words
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Card 1: Auth Providers -->
            <div class="glass-panel rounded-2xl p-6 space-y-5">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-black text-sm text-white tracking-tight">Authentication Distribution</h4>
                        <p class="text-[11px] text-slate-400 mt-0.5">Learners by sign-in method</p>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm">
                        🔐
                    </div>
                </div>

                <!-- Multi-segment bar -->
                <div class="space-y-2">
                    <div class="h-3 w-full bg-[#080c14] rounded-full overflow-hidden flex border border-white/[0.06]">
                        <div class="h-full bg-blue-500 transition-all duration-700" style="width: ${googlePct}%" title="Google: ${googlePct}%"></div>
                        <div class="h-full bg-emerald-500 transition-all duration-700" style="width: ${emailPct}%" title="Email: ${emailPct}%"></div>
                        <div class="h-full bg-amber-500 transition-all duration-700" style="width: ${localPct}%" title="Local/Guest: ${localPct}%"></div>
                    </div>
                    <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Total: ${total} Learners</span>
                        <span>100% Account Verification</span>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-3 pt-2">
                    <div class="p-3 rounded-xl bg-[#080c14] border border-white/5 space-y-1">
                        <div class="text-[10px] font-bold text-blue-400 flex items-center gap-1">🌐 Google</div>
                        <div class="text-xl font-black text-white">${googleCount}</div>
                        <div class="text-[10px] text-slate-500 font-mono">${googlePct}% share</div>
                    </div>
                    <div class="p-3 rounded-xl bg-[#080c14] border border-white/5 space-y-1">
                        <div class="text-[10px] font-bold text-emerald-400 flex items-center gap-1">✉️ Email</div>
                        <div class="text-xl font-black text-white">${emailCount}</div>
                        <div class="text-[10px] text-slate-500 font-mono">${emailPct}% share</div>
                    </div>
                    <div class="p-3 rounded-xl bg-[#080c14] border border-white/5 space-y-1">
                        <div class="text-[10px] font-bold text-amber-400 flex items-center gap-1">📱 Local</div>
                        <div class="text-xl font-black text-white">${localCount}</div>
                        <div class="text-[10px] text-slate-500 font-mono">${localPct}% share</div>
                    </div>
                </div>
            </div>

            <!-- Card 2: Client Platforms -->
            <div class="glass-panel rounded-2xl p-6 space-y-5">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-black text-sm text-white tracking-tight">Client Platforms & Environments</h4>
                        <p class="text-[11px] text-slate-400 mt-0.5">Device breakdown accessing Yakthung Pan</p>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm">
                        📲
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="h-3 w-full bg-[#080c14] rounded-full overflow-hidden flex border border-white/[0.06]">
                        <div class="h-full bg-emerald-500 transition-all duration-700" style="width: ${apkPct}%" title="Android APK: ${apkPct}%"></div>
                        <div class="h-full bg-purple-500 transition-all duration-700" style="width: ${mobPct}%" title="Mobile Web: ${mobPct}%"></div>
                        <div class="h-full bg-slate-400 transition-all duration-700" style="width: ${deskPct}%" title="Desktop: ${deskPct}%"></div>
                    </div>
                    <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>${apkPct}% Native Mobile App Adoption</span>
                        <span>${logTotal} Events Audited</span>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-3 pt-2">
                    <div class="p-3 rounded-xl bg-[#080c14] border border-white/5 space-y-1">
                        <div class="text-[10px] font-bold text-emerald-400 flex items-center gap-1">🤖 APK App</div>
                        <div class="text-xl font-black text-white">${apkCount}</div>
                        <div class="text-[10px] text-slate-500 font-mono">${apkPct}% share</div>
                    </div>
                    <div class="p-3 rounded-xl bg-[#080c14] border border-white/5 space-y-1">
                        <div class="text-[10px] font-bold text-purple-400 flex items-center gap-1">📱 Mobile</div>
                        <div class="text-xl font-black text-white">${mobileWebCount}</div>
                        <div class="text-[10px] text-slate-500 font-mono">${mobPct}% share</div>
                    </div>
                    <div class="p-3 rounded-xl bg-[#080c14] border border-white/5 space-y-1">
                        <div class="text-[10px] font-bold text-slate-300 flex items-center gap-1">💻 Desktop</div>
                        <div class="text-xl font-black text-white">${desktopCount}</div>
                        <div class="text-[10px] text-slate-500 font-mono">${deskPct}% share</div>
                    </div>
                </div>
            </div>

            <!-- Card 3: Mountain Trail Progression Funnel -->
            <div class="glass-panel rounded-2xl p-6 md:col-span-2 space-y-5">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-black text-sm text-white tracking-tight">Mountain Trail Progression Funnel</h4>
                        <p class="text-[11px] text-slate-400 mt-0.5">Learner distribution across the 21 Mountain trail stages</p>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-sm">
                        🏔️
                    </div>
                </div>

                <div class="space-y-4 pt-1">
                    <div>
                        <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                            <span class="text-emerald-400 flex items-center gap-1.5">
                                <span>●</span> Stages 1–5: Foundations & Consonants (ᤰ–ᤘ)
                            </span>
                            <span class="text-slate-300 font-mono">${lvl1_5} learners (${Math.round((lvl1_5/total)*100)}%)</span>
                        </div>
                        <div class="h-2 w-full bg-[#080c14] rounded-full overflow-hidden border border-white/[0.06]">
                            <div class="h-full bg-emerald-500 rounded-full transition-all duration-700" style="width: ${Math.round((lvl1_5/total)*100)}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                            <span class="text-teal-400 flex items-center gap-1.5">
                                <span>●</span> Stages 6–13: Vowels, Matras & Words (ᤠ–ᤤ)
                            </span>
                            <span class="text-slate-300 font-mono">${lvl6_13} learners (${Math.round((lvl6_13/total)*100)}%)</span>
                        </div>
                        <div class="h-2 w-full bg-[#080c14] rounded-full overflow-hidden border border-white/[0.06]">
                            <div class="h-full bg-teal-400 rounded-full transition-all duration-700" style="width: ${Math.round((lvl6_13/total)*100)}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                            <span class="text-amber-400 flex items-center gap-1.5">
                                <span>●</span> Stages 14–20: Chuk-sak Half Letters & Syllables (ᤵ–᤹)
                            </span>
                            <span class="text-slate-300 font-mono">${lvl14_20} learners (${Math.round((lvl14_20/total)*100)}%)</span>
                        </div>
                        <div class="h-2 w-full bg-[#080c14] rounded-full overflow-hidden border border-white/[0.06]">
                            <div class="h-full bg-amber-400 rounded-full transition-all duration-700" style="width: ${Math.round((lvl14_20/total)*100)}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                            <span class="text-purple-400 flex items-center gap-1.5">
                                <span>●</span> Stage 21: Limbu Grand Summit Champions (ᤕᤰᤌᤢᤱ ᤐᤠᤴ ᤛᤢᤶᤔᤠᤳ)
                            </span>
                            <span class="text-slate-300 font-mono">${lvl21} learners (${Math.round((lvl21/total)*100)}%)</span>
                        </div>
                        <div class="h-2 w-full bg-[#080c14] rounded-full overflow-hidden border border-white/[0.06]">
                            <div class="h-full bg-purple-500 rounded-full transition-all duration-700" style="width: ${Math.round((lvl21/total)*100)}%"></div>
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
        <div class="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#080c14] border border-white/5 text-xs">
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
            return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px] font-bold">🔑 Login</span>';
        case 'signup':
            return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 text-[11px] font-bold">✨ Sign Up</span>';
        case 'level_complete':
            return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">🏆 Level Done</span>';
        case 'app_launch':
            return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/25 text-[11px] font-bold">🚀 App Launch</span>';
        case 'sync':
            return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/25 text-[11px] font-bold">☁️ Cloud Sync</span>';
        case 'reset_pwd':
            return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 text-[11px] font-bold">📧 Pwd Reset</span>';
        default:
            return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-300 border border-white/10 text-[11px] font-bold">${escapeHtml(action)}</span>`;
    }
}

function getProviderBadge(provider) {
    const p = (provider || '').toLowerCase();
    if (p.includes('google')) {
        return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/25 font-bold text-[11px]">🌐 Google GIS</span>';
    } else if (p.includes('email')) {
        return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-bold text-[11px]">✉️ Email</span>';
    } else {
        return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/25 font-bold text-[11px]">📱 Local Guest</span>';
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
        <div class="${sizeClass} rounded-xl bg-[#080c14] border border-white/15 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
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
        toast.className = 'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#0d1524]/95 border border-emerald-500/30 text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 transform transition-all duration-300 translate-y-10 opacity-0 pointer-events-none backdrop-blur-xl';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="text-base">${icon}</span> <span class="tracking-wide">${escapeHtml(msg)}</span>`;
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
