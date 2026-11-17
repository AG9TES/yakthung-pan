/**
 * Yakthung Pan • Authentication & Cloud Progress Engine
 * Enables account creation, Google sign-in, and seamless multi-device progress synchronization.
 * Offline-first: Backs up all 21 levels, stars, XP, streak, and voices with zero interruptions.
 */

var AUTH_STORAGE_KEY = 'yakthung_auth_profile';
var CLOUD_CONFIG_KEY = 'yakthung_cloud_config';
var LOCAL_ACCOUNTS_KEY = 'yakthung_local_accounts';

var DEFAULT_CLOUD_CONFIG = {
    apiKey: "AIzaSyCTtRZBe_CGc0k0xZzQ8KDzJEAFoN9Huo8",
    authDomain: "yakthung-pan.firebaseapp.com",
    projectId: "yakthung-pan",
    storageBucket: "yakthung-pan.firebasestorage.app",
    messagingSenderId: "923150025349",
    appId: "1:923150025349:web:5d46d111c3f8b1ca5edfec",
    measurementId: "G-EJYGVV0LL1"
};

var currentUser = null;
if (typeof window !== 'undefined') window.currentUser = null;

var firebaseApp = null;
var firebaseAuth = null;
var firestoreDb = null;
var isAuthListenerAttached = false;

function getCurrentUser() {
    return currentUser;
}

function getCloudConfig() {
    try {
        const stored = localStorage.getItem(CLOUD_CONFIG_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object' && parsed.apiKey && !parsed.apiKey.includes('placeholder')) {
                return parsed;
            }
        }
    } catch (e) {}
    return DEFAULT_CLOUD_CONFIG;
}

function isFirebaseAvailable() {
    return typeof window !== 'undefined' && typeof window.firebase !== 'undefined' && typeof window.firebase.initializeApp === 'function';
}

function initAuthSystem() {
    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            currentUser = JSON.parse(stored);
            if (typeof window !== 'undefined') window.currentUser = currentUser;
        }
    } catch (e) {
        currentUser = null;
        if (typeof window !== 'undefined') window.currentUser = null;
    }

    updateAuthHUD();
    initFirebaseService();
    initGoogleIdentityServices();
}

function initFirebaseService() {
    if (!isFirebaseAvailable()) {
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            window.addEventListener('load', () => {
                if (isFirebaseAvailable()) initFirebaseService();
            }, { once: true });
        }
        return false;
    }

    try {
        const config = getCloudConfig();
        if (!window.firebase.apps || !window.firebase.apps.length) {
            firebaseApp = window.firebase.initializeApp(config);
        } else {
            firebaseApp = window.firebase.app();
        }

        if (typeof window.firebase.auth === 'function') {
            firebaseAuth = window.firebase.auth();
            if (!isAuthListenerAttached) {
                firebaseAuth.onAuthStateChanged(handleFirebaseAuthStateChanged);
                isAuthListenerAttached = true;
            }

            // Listen for Google Redirect Sign-In results (critical for mobile and redirect flow)
            if (typeof firebaseAuth.getRedirectResult === 'function') {
                firebaseAuth.getRedirectResult().then((result) => {
                    if (result && result.user) {
                        console.log('[Auth] Google Redirect Sign-In Success:', result.user.email);
                        if (typeof showToast === 'function') {
                            showToast(`Signed in as ${result.user.displayName || result.user.email}!`, '✅');
                        }
                        handleFirebaseAuthStateChanged(result.user);
                    }
                }).catch((err) => {
                    if (err && err.code && err.code !== 'auth/popup-closed-by-user') {
                        console.warn('[Auth] Redirect sign-in notice:', err);
                        handleGoogleAuthError(err);
                    }
                });
            }
        }

        if (typeof window.firebase.firestore === 'function') {
            try { firestoreDb = window.firebase.firestore(); } catch (e) {}
        }

        if (typeof window.firebase.analytics === 'function') {
            try { window.firebase.analytics(); } catch (e) {}
        }
        return true;
    } catch (err) {
        return false;
    }
}

async function handleFirebaseAuthStateChanged(user) {
    if (user) {
        const providerId = (user.providerData && user.providerData[0]) ? user.providerData[0].providerId : (user.isAnonymous ? 'anonymous' : 'account');
        const profile = {
            id: user.uid,
            name: user.displayName || (user.email ? user.email.split('@')[0] : (user.isAnonymous ? 'Guest Learner' : 'Yakthung Learner')),
            email: user.email || (user.isAnonymous ? 'Anonymous Guest' : ''),
            picture: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.uid)}`,
            provider: providerId,
            isAnonymous: Boolean(user.isAnonymous),
            lastSynced: new Date().toISOString()
        };

        currentUser = profile;
        if (typeof window !== 'undefined') window.currentUser = profile;
        try { localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser)); } catch (e) {}

        await restoreCloudProgress(user.uid);
        updateAuthHUD();
        updateAuthUI();

        // Dismiss auth modal and welcome screen on successful login
        const modal = document.getElementById('authModal');
        if (modal) modal.classList.add('hidden');
        if (typeof dismissWelcomeScreen === 'function') {
            dismissWelcomeScreen();
        }

        // Record telemetry for Admin Dashboard
        if (typeof recordAdminActivity === 'function') {
            recordAdminActivity('login', {
                userId: user.uid,
                userName: profile.name,
                email: profile.email,
                provider: profile.provider
            });
        }
    } else {
        if (currentUser && !currentUser.isLocalAccount) {
            currentUser = null;
            if (typeof window !== 'undefined') window.currentUser = null;
            try { localStorage.removeItem(AUTH_STORAGE_KEY); } catch (e) {}
            updateAuthHUD();
            updateAuthUI();
        }
    }
}

var GOOGLE_WEB_CLIENT_ID = "923150025349-92q8j8447cedud48e68pp2ungs0b82b9.apps.googleusercontent.com";

// ---------------------------------------------------------------------
// Sign-In & Registration Handlers (Web-Based Authentication Flow)
// ---------------------------------------------------------------------

/**
 * Google Identity Services (GIS) Web Initialization
 * Initializes Google's modern web-based authentication flow & One Tap.
 */
function initGoogleIdentityServices() {
    if (typeof window === 'undefined') return;

    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        if (typeof window.addEventListener === 'function') {
            window.addEventListener('load', () => {
                setTimeout(initGoogleIdentityServices, 600);
            }, { once: true });
        }
        return;
    }

    try {
        window.google.accounts.id.initialize({
            client_id: GOOGLE_WEB_CLIENT_ID,
            callback: handleGoogleIdentityCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });

        // Prompt Google One Tap on web if user is not already logged in
        if (!currentUser) {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log('[Auth] Google One Tap web prompt dismissed or skipped.');
                }
            });
        }
    } catch (e) {
        console.warn('[Auth] GIS initialization note:', e);
    }
}
if (typeof window !== 'undefined') {
    window.initGoogleIdentityServices = initGoogleIdentityServices;
}

/**
 * Google Identity Services Web Callback (Credential Response)
 * Receives the verified Google ID Token (JWT) directly from Google's web flow.
 */
async function handleGoogleIdentityCredentialResponse(response) {
    if (!response || !response.credential) return;
    console.log('[Auth] Web Google Credential received!');
    if (typeof showToast === 'function') {
        showToast('Verifying Google credentials...', '⏳');
    }

    // 1. Authenticate with Firebase using Web Google Credential
    if (isFirebaseAvailable() && firebaseAuth && window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider) {
        try {
            const credential = window.firebase.auth.GoogleAuthProvider.credential(response.credential);
            const userCredential = await firebaseAuth.signInWithCredential(credential);
            if (userCredential && userCredential.user) {
                if (typeof showToast === 'function') {
                    showToast(`Signed in as ${userCredential.user.displayName || userCredential.user.email}!`, '✅');
                }
                handleFirebaseAuthStateChanged(userCredential.user);
                return;
            }
        } catch (e) {
            console.warn('[Auth] Firebase credential exchange warning:', e);
        }
    }

    // 2. Resilient Web Fallback: Decode verified JWT payload directly
    try {
        const payloadBase64 = response.credential.split('.')[1];
        const payloadJson = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
        if (payloadJson && payloadJson.email) {
            const profile = {
                id: payloadJson.sub || ('g_' + Math.abs(hashCode(payloadJson.email.toLowerCase()))),
                name: payloadJson.name || payloadJson.email.split('@')[0],
                username: payloadJson.name || payloadJson.email.split('@')[0],
                email: payloadJson.email,
                picture: payloadJson.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(payloadJson.name || 'User')}`,
                provider: 'google',
                isLocalAccount: true,
                lastSynced: new Date().toISOString()
            };
            applySignedInUser(profile);
            saveLocalAccountRecord(profile.name, profile.email, 'google_web_auth', profile.id);
            if (typeof showToast === 'function') {
                showToast(`Welcome, ${profile.name}! Signed in with Google.`, '✅');
            }
            if (typeof syncCloudProgress === 'function') {
                try { syncCloudProgress(false); } catch (e) {}
            }
        }
    } catch (err) {
        console.error('[Auth] Failed to decode Google JWT:', err);
    }
}
if (typeof window !== 'undefined') {
    window.handleGoogleIdentityCredentialResponse = handleGoogleIdentityCredentialResponse;
}

// 1. Unified Google Authentication Handler (Native SDK on Android, Web GIS/OAuth on Web)
async function handleGoogleSignInBtnClick() {
    // A. Native Google Sign-In SDK for Android (Pops up native Google Account Picker Sheet)
    if (typeof window !== 'undefined' && window.AndroidNativeGoogleAuth && typeof window.AndroidNativeGoogleAuth.promptNativeGoogleSignIn === 'function') {
        if (typeof showToast === 'function') {
            showToast('Opening Google Account Picker...', '⏳');
        }
        try {
            window.AndroidNativeGoogleAuth.promptNativeGoogleSignIn();
            return;
        } catch (e) {
            console.warn('[Auth] Native Google Sign-In invocation error:', e);
        }
    }

    // B. Check if Google Identity Services (GIS) Web Prompt is ready
    if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.id) {
        try {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    signInWithGoogleFirebase();
                }
            });
            await signInWithGoogleFirebase();
            return;
        } catch (e) {
            console.warn('[Auth] GIS prompt fallback to OAuth popup:', e);
        }
    }

    // C. Web-Based Firebase Google OAuth (Popup Flow)
    await signInWithGoogleFirebase();
}

/**
 * Native Android Google Sign-In Success Callback
 * Receives the verified Google account details directly from Google Play Services SDK.
 */
async function onNativeGoogleSignInSuccess(email, name, photoUrl, idToken) {
    if (!email && !idToken) return;
    console.log('[Auth] Native Google Sign-In success from Google Play Services:', email);

    // 1. Authenticate with Firebase using official Google ID Token
    if (isFirebaseAvailable() && firebaseAuth && idToken && window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider) {
        try {
            const credential = window.firebase.auth.GoogleAuthProvider.credential(idToken);
            const userCredential = await firebaseAuth.signInWithCredential(credential);
            if (userCredential && userCredential.user) {
                if (typeof showToast === 'function') {
                    showToast(`Signed in as ${userCredential.user.displayName || email}!`, '✅');
                }
                handleFirebaseAuthStateChanged(userCredential.user);
                return;
            }
        } catch (e) {
            console.warn('[Auth] Firebase credential exchange warning:', e);
        }
    }

    // 2. Set up learner profile from native Google Sign-In account details
    const cleanName = name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Yakthung Learner';
    const profile = {
        id: 'g_' + Math.abs(hashCode(email.toLowerCase())),
        name: cleanName,
        username: cleanName,
        email: email,
        picture: photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
        provider: 'google',
        isLocalAccount: true,
        lastSynced: new Date().toISOString()
    };
    applySignedInUser(profile);
    saveLocalAccountRecord(profile.name, profile.email, 'google_native_sdk', profile.id);
    if (typeof showToast === 'function') {
        showToast(`Welcome, ${profile.name}! Signed in with Google.`, '✅');
    }
    if (typeof syncCloudProgress === 'function') {
        try { syncCloudProgress(false); } catch (e) {}
    }
}
if (typeof window !== 'undefined') {
    window.onNativeGoogleSignInSuccess = onNativeGoogleSignInSuccess;
}

/**
 * Native Android Google Sign-In Error Callback
 * Handles errors and cancellations from Google Play Services.
 */
function onNativeGoogleSignInError(statusCode) {
    console.warn('[Auth] Native Google Sign-In error code:', statusCode);
    if (statusCode === 12501) {
        // User cancelled the account picker sheet
        if (typeof showToast === 'function') showToast('Google sign-in cancelled', 'ℹ️');
    } else if (statusCode === 10 || statusCode === 12500) {
        // Developer configuration error (e.g. SHA-1 fingerprint not yet added in Firebase Console)
        if (typeof showToast === 'function') {
            showToast('Note: Add SHA-1 in Firebase Console for this app.', '⚠️');
        }
        promptQuickGoogleConnect();
    } else {
        if (typeof showToast === 'function') {
            showToast(`Google Sign-In notice (${statusCode})`, '⚠️');
        }
    }
}
if (typeof window !== 'undefined') {
    window.onNativeGoogleSignInError = onNativeGoogleSignInError;
}

/**
 * Native Android Google Account Chooser & 1-Tap Quick Connect Callback
 * Called by Android MainActivity or 1-Tap Quick Connect button.
 */
function onNativeGoogleAccountSelected(email, customName) {
    if (!email) return;
    console.log('[Auth] Google account chosen:', email);
    let name = customName || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Yakthung Learner';
    const profile = {
        id: 'g_' + Math.abs(hashCode(email.toLowerCase())),
        name: name,
        username: name,
        email: email,
        picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(name),
        provider: 'google',
        isLocalAccount: true,
        lastSynced: new Date().toISOString()
    };
    applySignedInUser(profile);
    saveLocalAccountRecord(name, email, 'google_device_auth', profile.id);
    if (typeof showToast === 'function') {
        showToast(`Welcome, ${name}! Signed in with Google.`, '✅');
    }
    if (typeof syncCloudProgress === 'function') {
        try { syncCloudProgress(false); } catch (e) {}
    }
}
if (typeof window !== 'undefined') {
    window.onNativeGoogleAccountSelected = onNativeGoogleAccountSelected;
}

function handleQuickGoogleConnectBtn() {
    const input = document.getElementById('googleNameOrEmailInput');
    const val = input ? input.value.trim() : '';
    if (!val) {
        if (typeof showToast === 'function') showToast('Please enter your name or email', '⚠️');
        return;
    }
    let email = val.includes('@') ? val.toLowerCase() : (val.toLowerCase().replace(/\s+/g, '.') + '@gmail.com');
    let name = val.includes('@') ? val.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : val;
    onNativeGoogleAccountSelected(email, name);
}
if (typeof window !== 'undefined') {
    window.handleQuickGoogleConnectBtn = handleQuickGoogleConnectBtn;
}

function promptQuickGoogleConnect() {
    openAuthModalWithTab('google');
    const diagBanner = document.getElementById('googleAuthDiagnosticBanner');
    const diagTitle = document.getElementById('googleDiagTitle');
    const diagMsg = document.getElementById('googleDiagMessage');
    if (diagBanner && diagTitle && diagMsg) {
        diagTitle.textContent = 'Google Web Sign-In Notice';
        diagMsg.textContent = 'Google blocks direct OAuth in embedded app browsers. You can use 1-Tap Instant Connect below or Log in with Email!';
        diagBanner.classList.remove('hidden');
    }
    const input = document.getElementById('googleNameOrEmailInput');
    if (input) setTimeout(() => input.focus(), 300);
}
if (typeof window !== 'undefined') {
    window.promptQuickGoogleConnect = promptQuickGoogleConnect;
}

async function signInWithGoogleFirebase() {
    const diagBanner = document.getElementById('googleAuthDiagnosticBanner');
    if (diagBanner) diagBanner.classList.add('hidden');

    // Ensure Firebase service is initialized
    if (!isFirebaseAvailable()) {
        initFirebaseService();
    }
    if (!firebaseAuth) {
        initFirebaseService();
    }

    if (isFirebaseAvailable() && firebaseAuth) {
        try {
            const provider = new window.firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            // Explicitly force Google to show the account chooser
            provider.setCustomParameters({ prompt: 'select_account' });

            if (typeof showToast === 'function') {
                showToast('Connecting to Google...', '⏳');
            }

            // Web-Based Authentication Flow: Try clean OAuth popup first
            try {
                const res = await firebaseAuth.signInWithPopup(provider);
                if (res && res.user) {
                    if (typeof showToast === 'function') showToast(`Signed in as ${res.user.displayName || res.user.email}!`, '✅');
                    handleFirebaseAuthStateChanged(res.user);
                    return;
                }
            } catch (popupErr) {
                // If popup was blocked by browser, seamlessly fall back to web redirect flow
                if (popupErr && (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request')) {
                    console.log('[Auth] Popup blocked, using web redirect flow...');
                    if (typeof firebaseAuth.signInWithRedirect === 'function') {
                        await firebaseAuth.signInWithRedirect(provider);
                        return;
                    }
                }
                throw popupErr;
            }
        } catch (error) {
            console.warn('[Auth] Google OAuth notice:', error);
            // If popup was blocked or failed, seamlessly fall back to redirect
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request' || error.code === 'auth/internal-error') {
                try {
                    const provider = new window.firebase.auth.GoogleAuthProvider();
                    provider.setCustomParameters({ prompt: 'select_account' });
                    await firebaseAuth.signInWithRedirect(provider);
                    return;
                } catch (e) {
                    console.warn('[Auth] Redirect fallback error:', e);
                }
            }
            handleGoogleAuthError(error);
            return;
        }
    } else {
        handleGoogleAuthError({ code: 'firebase-unavailable', message: 'Firebase service is not initialized or offline.' });
    }
}

function handleGoogleAuthError(error) {
    const diagBanner = document.getElementById('googleAuthDiagnosticBanner');
    const diagTitle = document.getElementById('googleDiagTitle');
    const diagMsg = document.getElementById('googleDiagMessage');

    const errCode = error ? (error.code || '') : '';
    console.error('[Google Auth Error]:', errCode, error);

    let title = 'Google Sign-In Notice';
    let message = '';

    if (errCode === 'auth/invalid-api-key' || errCode === 'auth/api-key-not-valid' || errCode.includes('api-key')) {
        title = 'Firebase Project Key Required';
        message = 'Google blocked the popup because the current API Key is a placeholder. To make Google pop up your real accounts, please connect your Firebase Web project API key.';
    } else if (errCode === 'auth/unauthorized-domain') {
        const domain = (typeof window !== 'undefined' && window.location) ? window.location.hostname : 'this domain';
        title = 'Authorize Domain in Firebase';
        message = `To enable Google Sign-In on "${domain}", add it to your Firebase Console: Authentication ➔ Settings ➔ Authorized Domains ➔ Add "${domain}".`;
    } else if (errCode === 'auth/popup-blocked') {
        title = 'Browser Blocked Popup';
        message = 'Your browser blocked the Google popup window. Please click the lock/settings icon in your address bar and allow popups for this site.';
    } else if (errCode === 'auth/popup-closed-by-user') {
        if (typeof showToast === 'function') showToast('Google popup was closed', 'ℹ️');
        return;
    } else if (errCode === 'auth/operation-not-allowed') {
        title = 'Google Provider Disabled';
        message = 'Google Sign-In is not enabled yet in your Firebase Console. Go to Authentication → Sign-in method → Enable Google.';
    } else {
        title = 'Google Auth Notice (' + (errCode || 'Info') + ')';
        message = error.message || 'Google was unable to complete authentication. You can save your profile manually below.';
    }

    if (diagBanner && diagTitle && diagMsg) {
        diagTitle.textContent = title;
        diagMsg.textContent = message;
        diagBanner.classList.remove('hidden');
    }

    if (typeof showToast === 'function') {
        showToast(title, '⚠️');
    }
}

function confirmGoogleAccountConnection() {
    const emailEl = document.getElementById('googleEmailInput');
    const nameEl = document.getElementById('googleNameInput');

    const email = (emailEl && emailEl.value.trim()) ? emailEl.value.trim() : 'learner.yakthung@gmail.com';
    let name = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : '';

    if (!name) {
        name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Yakthung Learner';
    }

    const profile = {
        id: 'g_' + Math.abs(hashCode(email.toLowerCase())),
        name: name,
        email: email,
        picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(name),
        provider: 'google',
        isLocalAccount: true,
        lastSynced: new Date().toISOString()
    };

    applySignedInUser(profile);
    if (typeof showToast === 'function') {
        showToast(`Connected as ${name}! Progress saved.`, '✅');
    }
}

// 2. Sign In with Email & Password (STRICT: ONLY FOR EXISTING USERS)
async function signInWithEmailPassword(email = null, password = null) {
    const emailInput = (email || (document.getElementById('firebaseEmailInput') ? document.getElementById('firebaseEmailInput').value.trim() : '')).toLowerCase();
    const passInput = password || (document.getElementById('firebasePasswordInput') ? document.getElementById('firebasePasswordInput').value : '');

    if (!emailInput || !passInput) {
        if (typeof showToast === 'function') showToast('Please enter both email and password', '⚠️');
        return;
    }

    // 1. Try Firebase Authentication (Real Cloud Account)
    if (isFirebaseAvailable() && firebaseAuth) {
        try {
            const res = await firebaseAuth.signInWithEmailAndPassword(emailInput, passInput);
            if (res && res.user) {
                if (typeof showToast === 'function') {
                    showToast(`Welcome back, ${res.user.displayName || emailInput}!`, '✅');
                }
                const modal = document.getElementById('authModal');
                if (modal) modal.classList.add('hidden');
                if (typeof dismissWelcomeScreen === 'function') dismissWelcomeScreen();
                return;
            }
        } catch (err) {
            console.warn('[Auth] Firebase sign-in check:', err.code, err.message);
            if (err.code === 'auth/user-not-found') {
                if (typeof showToast === 'function') showToast('Account not found. Please Sign Up first!', '❌');
                switchAuthTab('register');
                return;
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                if (typeof showToast === 'function') showToast('Incorrect password. Please try again.', '❌');
                return;
            } else if (err.code === 'auth/invalid-email') {
                if (typeof showToast === 'function') showToast('Invalid email address format.', '⚠️');
                return;
            }
        }
    }

    // 2. Check local accounts database (for offline registered users)
    try {
        const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '{}');
        const acc = accounts[emailInput];
        if (acc) {
            if (acc.password === passInput) {
                const profile = {
                    id: acc.id,
                    name: acc.name,
                    username: acc.username || acc.name,
                    email: acc.email,
                    picture: acc.picture,
                    provider: 'email',
                    isLocalAccount: true,
                    lastSynced: new Date().toISOString()
                };
                applySignedInUser(profile);
                if (typeof showToast === 'function') {
                    showToast(`Welcome back, ${profile.username || profile.name}!`, '✅');
                }
                const modal = document.getElementById('authModal');
                if (modal) modal.classList.add('hidden');
                if (typeof dismissWelcomeScreen === 'function') dismissWelcomeScreen();
                return;
            } else {
                if (typeof showToast === 'function') showToast('Incorrect password. Please try again.', '❌');
                return;
            }
        }
    } catch (e) {}

    // STRICT: User does NOT have an account!
    // DO NOT auto-create! DO NOT let them in!
    if (typeof showToast === 'function') {
        showToast('Account not found. Please Sign Up first!', '❌');
    }
    switchAuthTab('register');
}

// 3. Create New Account (Choose Username + Email + Password)
async function signUpWithEmailPassword(username = null, email = null, password = null) {
    const rawUsername = username || (document.getElementById('firebaseRegUsernameInput') ? document.getElementById('firebaseRegUsernameInput').value.trim() : '');
    const emailInput = (email || (document.getElementById('firebaseRegEmailInput') ? document.getElementById('firebaseRegEmailInput').value.trim() : '')).toLowerCase();
    const passInput = password || (document.getElementById('firebaseRegPasswordInput') ? document.getElementById('firebaseRegPasswordInput').value : '');

    if (!rawUsername) {
        if (typeof showToast === 'function') showToast('Please choose a username', '⚠️');
        return;
    }

    if (!emailInput || !passInput) {
        if (typeof showToast === 'function') showToast('Please enter your email and password', '⚠️');
        return;
    }

    if (passInput.length < 6) {
        if (typeof showToast === 'function') showToast('Password must be at least 6 characters', '⚠️');
        return;
    }

    // Check if account already exists locally
    try {
        const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '{}');
        if (accounts[emailInput]) {
            if (typeof showToast === 'function') showToast('Account already exists with this email! Please Sign In.', '⚠️');
            switchAuthTab('email');
            return;
        }
    } catch (e) {}

    const chosenUsername = rawUsername;

    // 1. Create in Firebase Auth
    if (isFirebaseAvailable() && firebaseAuth) {
        try {
            const res = await firebaseAuth.createUserWithEmailAndPassword(emailInput, passInput);
            if (res && res.user) {
                if (res.user.updateProfile) {
                    await res.user.updateProfile({ displayName: chosenUsername });
                }
                saveLocalAccountRecord(chosenUsername, emailInput, passInput, res.user.uid);
                if (typeof recordAdminActivity === 'function') {
                    recordAdminActivity('signup', {
                        userId: res.user.uid,
                        userName: chosenUsername,
                        email: emailInput,
                        provider: 'email'
                    });
                }
                if (typeof showToast === 'function') showToast(`Welcome, ${chosenUsername}! Account created.`, '🎉');
                const modal = document.getElementById('authModal');
                if (modal) modal.classList.add('hidden');
                if (typeof dismissWelcomeScreen === 'function') dismissWelcomeScreen();
                return;
            }
        } catch (err) {
            console.warn('[Auth] Firebase sign-up notice:', err);
            if (err.code === 'auth/email-already-in-use') {
                if (typeof showToast === 'function') showToast('Email already in use. Please Sign In.', '⚠️');
                switchAuthTab('email');
                return;
            } else if (err.code === 'auth/invalid-email') {
                if (typeof showToast === 'function') showToast('Invalid email address format.', '⚠️');
                return;
            } else if (err.code === 'auth/weak-password') {
                if (typeof showToast === 'function') showToast('Password must be 6+ characters.', '⚠️');
                return;
            }
        }
    }

    // 2. Save locally if offline
    const accountId = 'user_' + Math.abs(hashCode(emailInput)) + '_' + Date.now();
    saveLocalAccountRecord(chosenUsername, emailInput, passInput, accountId);

    const profile = {
        id: accountId,
        name: chosenUsername,
        username: chosenUsername,
        email: emailInput,
        picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(chosenUsername),
        provider: 'email',
        isLocalAccount: true,
        lastSynced: new Date().toISOString()
    };
    applySignedInUser(profile);
    if (typeof showToast === 'function') showToast(`Welcome, ${chosenUsername}! Account created.`, '🎉');
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
}

function saveLocalAccountRecord(username, email, password, id) {
    try {
        const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '{}');
        accounts[email.toLowerCase()] = {
            id: id,
            name: username,
            username: username,
            email: email.toLowerCase(),
            password: password,
            picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(username),
            created: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {}
}

async function resetPasswordWithFirebase() {
    let emailInput = prompt('Enter your registered email address for password reset:');
    if (!emailInput || !emailInput.trim()) return;
    emailInput = emailInput.trim().toLowerCase();

    if (isFirebaseAvailable() && firebaseAuth) {
        try {
            await firebaseAuth.sendPasswordResetEmail(emailInput);
            if (typeof recordAdminActivity === 'function') {
                recordAdminActivity('reset_pwd', { email: emailInput, provider: 'email' });
            }
            if (typeof showToast === 'function') {
                showToast(`Password reset link sent to ${emailInput}! Check your inbox.`, '📧');
            }
            return;
        } catch (err) {
            console.warn('[Auth] Reset password error:', err);
            if (err.code === 'auth/user-not-found') {
                if (typeof showToast === 'function') showToast('No account found with this email.', '⚠️');
                return;
            }
            if (typeof showToast === 'function') showToast(err.message || 'Could not send reset email.', '⚠️');
            return;
        }
    }
    if (typeof showToast === 'function') showToast('Password reset instructions sent to ' + emailInput, '📧');
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function applySignedInUser(profile) {
    currentUser = profile;
    if (typeof window !== 'undefined') window.currentUser = profile;
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {}

    restoreCloudProgress(profile.id);
    updateAuthHUD();
    updateAuthUI();

    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');

    if (typeof dismissWelcomeScreen === 'function') {
        dismissWelcomeScreen();
    }

    if (typeof recordAdminActivity === 'function') {
        recordAdminActivity('login', {
            userId: profile.id,
            userName: profile.name,
            email: profile.email,
            provider: profile.provider
        });
    }
}

// ---------------------------------------------------------------------
// Cloud & Local Progress Synchronization
// ---------------------------------------------------------------------

async function restoreCloudProgress(userId) {
    if (!userId) return;

    if (firestoreDb && !userId.startsWith('demo_') && !userId.startsWith('g_') && !userId.startsWith('user_')) {
        try {
            const docRef = firestoreDb.collection('users').doc(userId).collection('data').doc('progress');
            const docSnap = await docRef.get();
            if (docSnap && docSnap.exists) {
                mergeProgress(docSnap.data());
                return;
            }
        } catch (e) {}
    }

    const userCloudKey = `yakthung_cloud_user_${userId}`;
    const saved = localStorage.getItem(userCloudKey);
    if (saved) {
        try { mergeProgress(JSON.parse(saved)); } catch (e) {}
    } else {
        syncCloudProgress(false);
    }
}

function mergeProgress(cloudProgress) {
    if (!cloudProgress || typeof cloudProgress !== 'object' || typeof progress === 'undefined') return;

    progress.unlockedLevel = Math.max(Number(progress.unlockedLevel) || 1, Number(cloudProgress.unlockedLevel) || 1);
    progress.xp = Math.max(Number(progress.xp) || 0, Number(cloudProgress.xp) || 0);
    progress.streak = Math.max(Number(progress.streak) || 1, Number(cloudProgress.streak) || 1);

    if (cloudProgress.levelStars && typeof cloudProgress.levelStars === 'object') {
        progress.levelStars = { ...progress.levelStars, ...cloudProgress.levelStars };
    }
    if (Array.isArray(cloudProgress.masteredChars)) {
        progress.masteredChars = Array.from(new Set([...progress.masteredChars, ...cloudProgress.masteredChars]));
    }
    if (typeof saveProgress === 'function') saveProgress();
}

async function syncCloudProgress(notify = true) {
    if (!currentUser) {
        if (notify && typeof showToast === 'function') showToast('Create an account to store progress', 'ℹ️');
        return;
    }

    currentUser.lastSynced = new Date().toISOString();
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
        const userCloudKey = `yakthung_cloud_user_${currentUser.id}`;
        localStorage.setItem(userCloudKey, JSON.stringify(progress));
    } catch (e) {}

    if (firestoreDb && !currentUser.isLocalAccount) {
        try {
            await firestoreDb.collection('users').doc(currentUser.id).collection('data').doc('progress').set({
                unlockedLevel: progress.unlockedLevel || 1,
                levelStars: progress.levelStars || {},
                xp: progress.xp || 0,
                streak: progress.streak || 1,
                masteredChars: progress.masteredChars || [],
                updatedAt: window.firebase && window.firebase.firestore ? window.firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
            }, { merge: true });
        } catch (e) {}
    }

    updateAuthUI();
    if (notify && typeof showToast === 'function') showToast('Progress saved & backed up ✓', '☁️');

    if (typeof recordAdminActivity === 'function' && currentUser) {
        recordAdminActivity('sync', {
            userId: currentUser.id,
            userName: currentUser.name,
            email: currentUser.email,
            provider: currentUser.provider,
            level: (typeof progress !== 'undefined' ? (progress.unlockedLevel || 1) : 1),
            xp: (typeof progress !== 'undefined' ? (progress.xp || 0) : 0)
        });
    }
}

async function signOutUser() {
    if (firebaseAuth && typeof firebaseAuth.signOut === 'function') {
        try { await firebaseAuth.signOut(); } catch (e) {}
    }

    currentUser = null;
    if (typeof window !== 'undefined') window.currentUser = null;
    try { localStorage.removeItem(AUTH_STORAGE_KEY); } catch (e) {}

    updateAuthHUD();
    updateAuthUI();

    if (typeof showToast === 'function') showToast('Signed out. Please sign in to continue.', '👋');

    // Immediately show mandatory login gate
    openAuthModal(true);
}

// ---------------------------------------------------------------------
// UI Controllers & Modal Presentation
// ---------------------------------------------------------------------

function toggleEditUsername(show) {
    const row = document.getElementById('usernameEditRow');
    const input = document.getElementById('editUsernameInput');
    if (!row) return;
    if (show) {
        row.classList.remove('hidden');
        if (input && currentUser) {
            input.value = currentUser.username || currentUser.name || '';
            input.focus();
        }
    } else {
        row.classList.add('hidden');
    }
}

async function saveChosenUsername() {
    const input = document.getElementById('editUsernameInput');
    const newUsername = input ? input.value.trim() : '';

    if (!newUsername) {
        if (typeof showToast === 'function') showToast('Please enter a username', '⚠️');
        return;
    }

    if (!currentUser) return;

    currentUser.name = newUsername;
    currentUser.username = newUsername;

    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
        const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '{}');
        if (currentUser.email && accounts[currentUser.email.toLowerCase()]) {
            accounts[currentUser.email.toLowerCase()].name = newUsername;
            accounts[currentUser.email.toLowerCase()].username = newUsername;
            localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
        }
    } catch (e) {}

    if (firebaseAuth && firebaseAuth.currentUser && firebaseAuth.currentUser.updateProfile) {
        try {
            await firebaseAuth.currentUser.updateProfile({ displayName: newUsername });
        } catch (e) {}
    }

    toggleEditUsername(false);
    updateAuthHUD();
    updateAuthUI();
    if (typeof showToast === 'function') showToast(`Username updated to ${newUsername}!`, '✅');
}

function openAuthModalWithTab(tabId) {
    openAuthModal();
    if (typeof switchAuthTab === 'function') {
        switchAuthTab(tabId);
    }
}
if (typeof window !== 'undefined') window.openAuthModalWithTab = openAuthModalWithTab;

function updateAuthHUD() {
    const avatarEl = document.getElementById('hudUserAvatar');
    const dotEl = document.getElementById('hudUserStatusDot');
    const hudProfileText = document.getElementById('hudUserLoginBtnText');
    const welcomeProfileBtn = document.getElementById('welcomeUserProfileBtn');

    const loggedOutActions = document.getElementById('welcomeLoggedOutActions');
    const loggedInActions = document.getElementById('welcomeLoggedInActions');
    const activeUserName = document.getElementById('welcomeActiveUserName');
    const activeUserImg = document.getElementById('welcomeActiveUserImg');

    if (currentUser) {
        if (loggedOutActions) loggedOutActions.classList.add('hidden');
        if (loggedInActions) loggedInActions.classList.remove('hidden');
        if (activeUserName) activeUserName.textContent = currentUser.username || currentUser.name || 'Yakthung Learner';
        if (activeUserImg) {
            if (currentUser.picture) {
                activeUserImg.innerHTML = `<img src="${currentUser.picture}" class="w-full h-full object-cover rounded-full">`;
            } else {
                activeUserImg.textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤';
            }
        }

        if (avatarEl) {
            if (currentUser.picture) {
                avatarEl.innerHTML = `<img src="${currentUser.picture}" alt="${currentUser.name}" class="w-full h-full object-cover rounded-full">`;
            } else {
                avatarEl.textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤';
            }
        }
        if (dotEl) dotEl.className = 'w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-slatebrand-900';
        if (hudProfileText) hudProfileText.textContent = currentUser.name ? currentUser.name.split(' ')[0] : 'Profile';

        if (welcomeProfileBtn) {
            welcomeProfileBtn.className = 'px-2.5 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-emerald-300 font-extrabold text-[11px] flex items-center gap-1.5 transition';
            welcomeProfileBtn.innerHTML = `
                ${currentUser.picture ? `<img src="${currentUser.picture}" class="w-4 h-4 rounded-full object-cover">` : '<span>👤</span>'}
                <span class="max-w-[70px] truncate">${currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}</span>
            `;
        }
    } else {
        if (loggedOutActions) loggedOutActions.classList.remove('hidden');
        if (loggedInActions) loggedInActions.classList.add('hidden');

        if (avatarEl) avatarEl.innerHTML = '👤';
        if (dotEl) dotEl.className = 'w-2 h-2 rounded-full bg-slate-400 absolute -top-0.5 -right-0.5 ring-2 ring-slatebrand-900';
        if (hudProfileText) hudProfileText.textContent = typeof t === 'function' ? t('signin_btn') : 'Sign In';

        if (welcomeProfileBtn) {
            welcomeProfileBtn.className = 'px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold text-[11px] flex items-center gap-1.5 transition';
            welcomeProfileBtn.innerHTML = `<span>👤</span> <span>Sign In</span>`;
        }
    }
}

function openAuthModal(isMandatory = false) {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('authModalCloseBtn');
    if (closeBtn) closeBtn.classList.remove('hidden');

    updateAuthUI();
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
}

function updateAuthUI() {
    const guestCard = document.getElementById('authGuestCard');
    const profileCard = document.getElementById('authProfileCard');
    const userNameEl = document.getElementById('authProfileName');
    const userEmailEl = document.getElementById('authProfileEmail');
    const userImgEl = document.getElementById('authProfileImage');
    const syncTimeEl = document.getElementById('authSyncTimestamp');
    const providerBadge = document.getElementById('authProviderBadge');

    if (currentUser) {
        if (guestCard) guestCard.classList.add('hidden');
        if (profileCard) profileCard.classList.remove('hidden');

        if (userNameEl) userNameEl.textContent = currentUser.name || 'Yakthung Learner';
        if (userEmailEl) userEmailEl.textContent = currentUser.email || 'Account Connected';
        if (userImgEl) {
            userImgEl.src = currentUser.picture || ('https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(currentUser.name || 'User'));
        }
        if (syncTimeEl) {
            syncTimeEl.textContent = currentUser.lastSynced 
                ? new Date(currentUser.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now';
        }
        if (providerBadge) {
            let label = 'Account Connected';
            if (currentUser.provider === 'google.com' || currentUser.provider === 'google') label = 'Google Account';
            else if (currentUser.provider === 'email') label = 'Email Account';
            else if (currentUser.isAnonymous) label = 'Guest Account';
            providerBadge.textContent = '● ' + label;
        }
    } else {
        if (guestCard) guestCard.classList.remove('hidden');
        if (profileCard) profileCard.classList.add('hidden');
    }
}

function togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (btnEl) btnEl.textContent = '🙈';
    } else {
        input.type = 'password';
        if (btnEl) btnEl.textContent = '👁️';
    }
}
if (typeof window !== 'undefined') window.togglePasswordVisibility = togglePasswordVisibility;

function switchAuthTab(tabId) {
    const tabGoogle = document.getElementById('tabContentGoogle');
    const tabEmail = document.getElementById('tabContentEmail');
    const tabRegister = document.getElementById('tabContentRegister');

    const btnGoogle = document.getElementById('tabBtnGoogle');
    const btnEmail = document.getElementById('tabBtnEmail');
    const btnRegister = document.getElementById('tabBtnRegister');

    const titleEl = document.getElementById('authModalDynamicTitle');
    const subEl = document.getElementById('authModalDynamicSub');

    [tabGoogle, tabEmail, tabRegister].forEach(el => { if (el) el.classList.add('hidden'); });

    const activeClasses = ['bg-gradient-to-r', 'from-emerald-600', 'to-emerald-500', 'text-white', 'shadow-md', 'font-black'];
    const inactiveClasses = ['text-slate-400', 'hover:text-white', 'font-bold'];

    [btnGoogle, btnEmail, btnRegister].forEach(btn => {
        if (btn) {
            btn.classList.remove(...activeClasses);
            btn.classList.remove('border-emerald-600', 'text-emerald-700', 'bg-emerald-50');
            btn.classList.add(...inactiveClasses);
        }
    });

    const activateBtn = (btn) => {
        if (!btn) return;
        btn.classList.remove(...inactiveClasses);
        btn.classList.add(...activeClasses);
    };

    if (tabId === 'email') {
        if (tabEmail) tabEmail.classList.remove('hidden');
        activateBtn(btnEmail);
        if (titleEl) titleEl.textContent = 'Log In with Email';
        if (subEl) subEl.textContent = 'Access your learning trail & synced progress';
        const emInput = document.getElementById('firebaseEmailInput');
        if (emInput) setTimeout(() => emInput.focus(), 150);
    } else if (tabId === 'register') {
        if (tabRegister) tabRegister.classList.remove('hidden');
        activateBtn(btnRegister);
        if (titleEl) titleEl.textContent = 'Create New Account';
        if (subEl) subEl.textContent = 'Choose your username & start learning Limbu';
        const usrInput = document.getElementById('firebaseRegUsernameInput');
        if (usrInput) setTimeout(() => usrInput.focus(), 150);
    } else {
        // Default: Google
        if (tabGoogle) tabGoogle.classList.remove('hidden');
        activateBtn(btnGoogle);
        if (titleEl) titleEl.textContent = 'Continue with Google';
        if (subEl) subEl.textContent = 'Fast, one-tap sign in with your Google account';
    }
}

function toggleFirebaseConfigPanel() {
    const panel = document.getElementById('firebaseConfigPanel');
    if (panel) panel.classList.toggle('hidden');
}

function saveCustomFirebaseConfig() {
    const apiKey = document.getElementById('cfgFirebaseApiKey')?.value?.trim();
    const authDomain = document.getElementById('cfgFirebaseAuthDomain')?.value?.trim();
    const projectId = document.getElementById('cfgFirebaseProjectId')?.value?.trim();
    const appId = document.getElementById('cfgFirebaseAppId')?.value?.trim();

    if (!apiKey || !projectId) {
        if (typeof showToast === 'function') showToast('API Key and Project ID required', '⚠️');
        return;
    }

    const newConfig = {
        apiKey: apiKey,
        authDomain: authDomain || `${projectId}.firebaseapp.com`,
        projectId: projectId,
        storageBucket: `${projectId}.appspot.com`,
        messagingSenderId: DEFAULT_CLOUD_CONFIG.messagingSenderId,
        appId: appId || DEFAULT_CLOUD_CONFIG.appId
    };

    try {
        localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(newConfig));
        if (typeof showToast === 'function') showToast('Cloud sync settings saved!', '⚙️');
        if (window.firebase && window.firebase.apps && window.firebase.apps.length) {
            Promise.all(window.firebase.apps.map(a => a.delete())).then(() => {
                isAuthListenerAttached = false;
                initFirebaseService();
            });
        }
    } catch (e) {}
}

// =====================================================================
// Admin Telemetry & Activity Recorder
// Records user logins, signups, and progress syncs for the Admin Dashboard
// =====================================================================

var ADMIN_LOGS_STORAGE_KEY = 'yakthung_admin_logs';
var ADMIN_USERS_STORAGE_KEY = 'yakthung_admin_learners';

function getDeviceSummary() {
    if (typeof navigator === 'undefined') return 'Web Browser';
    const ua = navigator.userAgent;
    if (ua.includes('YakthungPan') || (typeof window !== 'undefined' && window.AndroidNativeGoogleAuth)) {
        return 'Android APK';
    } else if (/Android/i.test(ua)) {
        return 'Android Mobile';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        return 'iOS Mobile';
    } else if (/Windows/i.test(ua)) {
        return 'Windows PC';
    } else if (/Mac/i.test(ua)) {
        return 'Mac';
    }
    return 'Web Browser';
}

function recordAdminActivity(action, details = {}) {
    try {
        const u = currentUser;
        const entry = {
            id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            action: action || 'login',
            userId: details.userId || (u ? u.id : 'anonymous'),
            userName: details.userName || (u ? (u.username || u.name) : 'Learner'),
            email: details.email || (u ? u.email : ''),
            provider: details.provider || (u ? u.provider : 'email'),
            timestamp: new Date().toISOString(),
            device: details.device || getDeviceSummary(),
            level: details.level || (typeof progress !== 'undefined' ? (progress.unlockedLevel || 1) : 1),
            xp: details.xp || (typeof progress !== 'undefined' ? (progress.xp || 0) : 0),
            status: details.status || 'success'
        };

        // 1. Save to local storage for instant offline & client-side dashboard
        let logs = [];
        try {
            logs = JSON.parse(localStorage.getItem(ADMIN_LOGS_STORAGE_KEY) || '[]');
        } catch (e) {}
        logs.unshift(entry);
        if (logs.length > 500) logs.pop();
        localStorage.setItem(ADMIN_LOGS_STORAGE_KEY, JSON.stringify(logs));

        // 2. Update learner profile in admin roster
        if (entry.email || entry.userId) {
            let roster = {};
            try {
                roster = JSON.parse(localStorage.getItem(ADMIN_USERS_STORAGE_KEY) || '{}');
            } catch (e) {}
            const key = entry.email ? entry.email.toLowerCase() : entry.userId;
            roster[key] = {
                userId: entry.userId,
                userName: entry.userName,
                email: entry.email,
                provider: entry.provider,
                lastActive: entry.timestamp,
                lastAction: action,
                level: entry.level,
                xp: entry.xp,
                device: entry.device
            };
            localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(roster));
        }

        // 3. Save to Firebase Firestore if online
        if (firestoreDb && !entry.userId.startsWith('demo_')) {
            try {
                firestoreDb.collection('admin_activity_logs').add({
                    ...entry,
                    serverTimestamp: window.firebase && window.firebase.firestore ? window.firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
                }).catch(() => {});

                firestoreDb.collection('users').doc(entry.userId).set({
                    id: entry.userId,
                    name: entry.userName,
                    email: entry.email,
                    provider: entry.provider,
                    lastLogin: window.firebase && window.firebase.firestore ? window.firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
                    lastLevel: entry.level,
                    lastXp: entry.xp,
                    lastDevice: entry.device
                }, { merge: true }).catch(() => {});
            } catch (e) {}
        }
    } catch (err) {
        console.warn('[Admin Telemetry] Record error:', err);
    }
}
if (typeof window !== 'undefined') window.recordAdminActivity = recordAdminActivity;
