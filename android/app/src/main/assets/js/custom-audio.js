/**
 * Yakthung Pan • Custom Voice Recording & Audio Studio Engine
 * Records authentic voice via MediaRecorder, uploads audio files (.mp3/.wav),
 * persists audio blobs in IndexedDB (YakthungVoiceDB), and provides zero-latency
 * playback throughout all 21 levels, quizzes, Saknam, and the complete chart.
 */

const DB_NAME = 'YakthungVoiceDB';
const DB_VERSION = 1;
const STORE_NAME = 'recordings';

// =========================================================================
// 1. INDEXEDDB PERSISTENCE LAYER
// =========================================================================
const VoiceDB = {
    db: null,

    open() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
                return;
            }

            const req = indexedDB.open(DB_NAME, DB_VERSION);

            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };

            req.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };

            req.onerror = (e) => {
                console.error('[VoiceDB] Failed to open IndexedDB:', e);
                reject(e);
            };
        });
    },

    async getAll() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = (e) => reject(e);
        });
    },

    async get(id) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = (e) => reject(e);
        });
    },

    async put(record) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(record);
            req.onsuccess = () => resolve(true);
            req.onerror = (e) => reject(e);
        });
    },

    async delete(id) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(id);
            req.onsuccess = () => resolve(true);
            req.onerror = (e) => reject(e);
        });
    },

    async clear() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.clear();
            req.onsuccess = () => resolve(true);
            req.onerror = (e) => reject(e);
        });
    }
};

// =========================================================================
// 2. IN-MEMORY STORE & ZERO-LATENCY PLAYBACK MAP
// =========================================================================
var CustomAudioStore = {
    urls: new Map(),        // id -> Object URL (blob:http...)
    metadata: new Map(),    // id -> { mime, timestamp, size, label }
    serverAudioFiles: new Set(), // IDs confirmed present on disk in audio/<id>.mp3
    isInitialized: false,

    async init() {
        try {
            const all = await VoiceDB.getAll();
            all.forEach(rec => {
                if (rec && rec.id && rec.blob) {
                    const url = URL.createObjectURL(rec.blob);
                    this.urls.set(rec.id, url);
                    this.metadata.set(rec.id, {
                        mime: rec.mime || 'audio/webm',
                        timestamp: rec.timestamp || Date.now(),
                        size: rec.blob.size || 0,
                        label: rec.label || rec.id
                    });
                }
            });
            this.isInitialized = true;
            await this.syncServerAudioList();
            this.updateBadges();
            console.log(`[CustomAudioStore] Initialized. Loaded ${this.urls.size} local recordings, ${this.serverAudioFiles.size} server files.`);
        } catch (err) {
            console.warn('[CustomAudioStore] Initialization error:', err);
        }
    },

    async syncServerAudioList() {
        try {
            const res = await fetch('/api/audio-list');
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.audioFiles)) {
                    this.serverAudioFiles = new Set(data.audioFiles);
                }
            }
        } catch (e) {
            // Running in static/offline PWA mode
        }
    },

    has(id) {
        if (!id) return false;
        return this.urls.has(id) || this.serverAudioFiles.has(id);
    },

    getUrl(id) {
        if (!id) return null;
        return this.urls.get(id) || null;
    },

    getMetadata(id) {
        return this.metadata.get(id) || null;
    },

    getCount() {
        const unique = new Set([...this.urls.keys(), ...this.serverAudioFiles]);
        return unique.size;
    },

    async save(id, blob, mime = 'audio/webm', label = '') {
        if (!id || !blob) return false;

        // Revoke old object URL if exists
        if (this.urls.has(id)) {
            try {
                URL.revokeObjectURL(this.urls.get(id));
            } catch (e) {}
        }

        const record = {
            id,
            blob,
            mime,
            label: label || id,
            timestamp: Date.now(),
            size: blob.size
        };

        await VoiceDB.put(record);

        const newUrl = URL.createObjectURL(blob);
        this.urls.set(id, newUrl);
        this.serverAudioFiles.add(id);
        this.metadata.set(id, {
            mime,
            timestamp: record.timestamp,
            size: record.size,
            label: record.label
        });

        // Also upload to server's audio/ folder so it's placed directly into audio/<id>.mp3!
        try {
            fetch(`/api/upload-audio?id=${encodeURIComponent(id)}`, {
                method: 'POST',
                headers: { 'Content-Type': mime || 'audio/mpeg' },
                body: blob
            }).then(r => r.json()).then(data => {
                if (data && data.success) {
                    console.log(`[CustomAudioStore] Saved directly to folder: ${data.path}`);
                }
            }).catch(() => {});
        } catch (e) {}

        this.updateBadges();
        if (typeof updateVoiceStudioUI === 'function') updateVoiceStudioUI();
        return true;
    },

    async remove(id) {
        if (!id) return false;
        if (this.urls.has(id)) {
            try {
                URL.revokeObjectURL(this.urls.get(id));
            } catch (e) {}
            this.urls.delete(id);
            this.metadata.delete(id);
        }
        this.serverAudioFiles.delete(id);
        await VoiceDB.delete(id);
        this.updateBadges();
        if (typeof updateVoiceStudioUI === 'function') updateVoiceStudioUI();
        return true;
    },

    updateBadges() {
        const count = this.getCount();
        const badgeEls = document.querySelectorAll('.custom-voice-count-badge');
        badgeEls.forEach(el => {
            el.textContent = count;
        });

        const statusPill = document.getElementById('audioStudioStatusPill');
        if (statusPill) {
            statusPill.textContent = count > 0 ? `${count} Custom Voices` : 'Default Audio';
            statusPill.className = count > 0 
                ? 'text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs'
                : 'text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
        }
    },

    // Download single recorded clip as <id>.mp3 (or native format)
    exportSingle(id) {
        const url = this.getUrl(id);
        if (!url) {
            if (typeof showToast === 'function') showToast('No custom recording found for this item', '⚠️');
            return;
        }
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (typeof showToast === 'function') {
            showToast(`${typeof t === 'function' ? t('audio_exported') : 'Audio clip downloaded as'} ${id}.mp3`, '📥');
        }
    },

    // Export all custom voice recordings into a portable JSON pack
    async exportAudioPack() {
        try {
            const all = await VoiceDB.getAll();
            if (!all || all.length === 0) {
                if (typeof showToast === 'function') showToast('No custom voice recordings to export', '⚠️');
                return;
            }

            const exportObj = {
                app: 'YakthungPan',
                type: 'VoicePack',
                version: 1,
                exportedAt: new Date().toISOString(),
                count: all.length,
                recordings: {}
            };

            for (const rec of all) {
                const base64 = await blobToBase64(rec.blob);
                exportObj.recordings[rec.id] = {
                    base64,
                    mime: rec.mime || 'audio/webm',
                    label: rec.label || rec.id,
                    timestamp: rec.timestamp
                };
            }

            const jsonStr = JSON.stringify(exportObj, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `yakthung_voice_pack_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (typeof showToast === 'function') {
                showToast(typeof t === 'function' ? t('backup_exported') : 'Audio pack exported successfully!', '📦');
            }
        } catch (err) {
            console.error('[CustomAudioStore] Export error:', err);
            if (typeof showToast === 'function') showToast('Failed to export audio pack', '❌');
        }
    },

    // Import a portable JSON voice pack and populate IndexedDB
    async importAudioPack(file) {
        if (!file) return;
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.recordings || typeof data.recordings !== 'object') {
                throw new Error('Invalid voice pack file format');
            }

            const keys = Object.keys(data.recordings);
            let importedCount = 0;

            for (const id of keys) {
                const item = data.recordings[id];
                if (item && item.base64) {
                    const blob = base64ToBlob(item.base64, item.mime || 'audio/webm');
                    await this.save(id, blob, item.mime || 'audio/webm', item.label || id);
                    importedCount++;
                }
            }

            if (typeof showToast === 'function') {
                showToast(`${typeof t === 'function' ? t('backup_imported') : 'Imported'} (${importedCount} recordings)`, '🎉');
            }
        } catch (err) {
            console.error('[CustomAudioStore] Import error:', err);
            if (typeof showToast === 'function') showToast('Failed to import audio pack: ' + err.message, '❌');
        }
    }
};

// Base64 <-> Blob Helpers
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function base64ToBlob(dataUrl, defaultMime = 'audio/webm') {
    const parts = dataUrl.split(';base64,');
    const mime = parts.length > 1 ? parts[0].split(':')[1] : defaultMime;
    const raw = window.atob(parts[1] || parts[0]);
    const uInt8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: mime });
}

// =========================================================================
// 3. HARDWARE MEDIARECORDER ENGINE (MICROPHONE)
// =========================================================================
var HardwareRecorder = {
    mediaRecorder: null,
    audioChunks: [],
    stream: null,
    isRecording: false,
    startTime: null,
    timerInterval: null,
    lastRecordedBlob: null,
    lastRecordedMime: 'audio/webm',
    previewAudio: null,

    async start() {
        if (this.isRecording) return;
        this.audioChunks = [];
        this.lastRecordedBlob = null;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
                else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
                else mimeType = '';
            }

            this.lastRecordedMime = mimeType || 'audio/webm';
            this.mediaRecorder = mimeType ? new MediaRecorder(this.stream, { mimeType }) : new MediaRecorder(this.stream);

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    this.audioChunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.lastRecordedBlob = new Blob(this.audioChunks, { type: this.lastRecordedMime });
                if (this.stream) {
                    this.stream.getTracks().forEach(t => t.stop());
                    this.stream = null;
                }
                this.updateRecordingUIState('stopped');
            };

            this.mediaRecorder.start(100);
            this.isRecording = true;
            this.startTime = Date.now();
            this.updateRecordingUIState('recording');

            // Timer
            if (this.timerInterval) clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                const diff = Math.floor((Date.now() - this.startTime) / 1000);
                const timerEl = document.getElementById('voiceStudioTimer');
                if (timerEl) {
                    const mins = String(Math.floor(diff / 60)).padStart(2, '0');
                    const secs = String(diff % 60).padStart(2, '0');
                    timerEl.textContent = `${mins}:${secs}`;
                }
            }, 250);

        } catch (err) {
            console.error('[HardwareRecorder] Mic permission error:', err);
            this.isRecording = false;
            this.updateRecordingUIState('idle');
            alert('Microphone access is required to record your voice. Please allow microphone permissions in your browser or use the file upload option.');
        }
    },

    stop() {
        if (!this.isRecording) return;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.isRecording = false;
        try {
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }
        } catch (e) {}
    },

    playPreview() {
        if (!this.lastRecordedBlob) return;
        if (this.previewAudio) {
            this.previewAudio.pause();
            this.previewAudio.currentTime = 0;
        }
        const url = URL.createObjectURL(this.lastRecordedBlob);
        this.previewAudio = new Audio(url);
        this.previewAudio.play().catch(e => console.warn('Preview play failed:', e));
    },

    updateRecordingUIState(state) {
        const btn = document.getElementById('voiceStudioRecordBtn');
        const timerEl = document.getElementById('voiceStudioTimer');
        const previewBtn = document.getElementById('voiceStudioPreviewBtn');
        const saveBtn = document.getElementById('voiceStudioSaveBtn');
        const statusEl = document.getElementById('voiceStudioStatusText');
        const pulseRing = document.getElementById('voiceStudioPulseRing');

        if (state === 'recording') {
            if (btn) {
                btn.className = 'w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xl shadow-lg ring-4 ring-rose-400/50 animate-pulse transition active:scale-95';
                btn.innerHTML = '⏹️';
            }
            if (pulseRing) pulseRing.classList.remove('hidden');
            if (statusEl) statusEl.textContent = typeof t === 'function' ? t('recording_now') : 'Recording... Tap to stop';
            if (previewBtn) previewBtn.classList.add('hidden');
            if (saveBtn) saveBtn.classList.add('hidden');
        } else if (state === 'stopped') {
            if (btn) {
                btn.className = 'w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-xl shadow-lg transition active:scale-95';
                btn.innerHTML = '🎙️';
            }
            if (pulseRing) pulseRing.classList.add('hidden');
            if (statusEl) statusEl.textContent = 'Voice captured! Tap Play to listen or Save.';
            if (previewBtn) previewBtn.classList.remove('hidden');
            if (saveBtn) saveBtn.classList.remove('hidden');
        } else { // idle
            if (btn) {
                btn.className = 'w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-xl shadow-lg transition active:scale-95';
                btn.innerHTML = '🎙️';
            }
            if (timerEl) timerEl.textContent = '00:00';
            if (pulseRing) pulseRing.classList.add('hidden');
            if (statusEl) statusEl.textContent = typeof t === 'function' ? t('record_voice') : 'Tap mic to start recording';
            if (previewBtn) previewBtn.classList.add('hidden');
            if (saveBtn) saveBtn.classList.add('hidden');
        }
    }
};

// =========================================================================
// 4. VOICE STUDIO UI CONTROLLER & CURRICULUM CATALOG
// =========================================================================
let currentStudioTarget = null; // Item object being edited/recorded
let currentStudioFilter = 'all'; // 'all', 'consonants', 'vowels', 'extras', 'matras', 'phrases'

function getAllCurriculumItemsForStudio() {
    const items = [];

    // 1. 25 Consonants
    if (typeof SIRIJONGA_25 !== 'undefined' && Array.isArray(SIRIJONGA_25)) {
        SIRIJONGA_25.forEach(c => {
            items.push({
                id: c.id,
                char: c.char,
                latin: c.latin,
                deva: c.deva,
                meaning: c.meaning,
                type: 'consonants',
                groupLabel: 'Consonants (25)'
            });
        });
    }

    // 2. 9 Kubung Vowels
    if (typeof KUBUNG_VOWELS_9 !== 'undefined' && Array.isArray(KUBUNG_VOWELS_9)) {
        KUBUNG_VOWELS_9.forEach(v => {
            items.push({
                id: v.id,
                char: v.char,
                latin: v.latin,
                deva: v.deva,
                meaning: v.meaning,
                type: 'vowels',
                groupLabel: 'Vowels (9)'
            });
        });
    }

    // 3. Saknam-sak 8 Matras (Level 14)
    if (typeof SAKNAM_8_LETTERS !== 'undefined' && Array.isArray(SAKNAM_8_LETTERS)) {
        SAKNAM_8_LETTERS.forEach(s => {
            items.push({
                id: s.id,
                char: s.char,
                latin: s.latin,
                deva: s.deva,
                meaning: s.meaning || `${s.nepaliMatra} ➔ ${s.limbuMatra}`,
                type: 'matras',
                groupLabel: 'Saknam-sak (8 Matras)'
            });
        });
    }

    // 3b. Chuk-sak 7 Finals
    const chukItems = [
        { id: 'chuk_k', char: 'ᤁᤰ', latin: 'Final -k (ᤁᤰ)', deva: '-क् (-k)', meaning: 'Kem-sak Ka (ᤰ)', type: 'extras', groupLabel: 'Chuk-sak 7 Finals' },
        { id: 'chuk_ng', char: 'ᤁᤱ', latin: 'Final -ng (ᤁᤱ)', deva: '-ङ् (-ng)', meaning: 'Kem-sak Nga (ᤱ)', type: 'extras', groupLabel: 'Chuk-sak 7 Finals' },
        { id: 'chuk_t', char: 'ᤁᤳ', latin: 'Final -t (ᤁᤳ)', deva: '-त् (-t)', meaning: 'Kem-sak Ta (ᤳ)', type: 'extras', groupLabel: 'Chuk-sak 7 Finals' },
        { id: 'chuk_p', char: 'ᤁᤵ', latin: 'Final -p (ᤁᤵ)', deva: '-प् (-p)', meaning: 'Kem-sak Pa (ᤵ)', type: 'extras', groupLabel: 'Chuk-sak 7 Finals' },
        { id: 'chuk_m', char: 'ᤁᤶ', latin: 'Final -m (ᤁᤶ)', deva: '-म् (-m)', meaning: 'Kem-sak Ma (ᤶ)', type: 'extras', groupLabel: 'Chuk-sak 7 Finals' },
        { id: 'chuk_r', char: 'ᤁᤷ', latin: 'Final -r (ᤁᤷ)', deva: '-र् (-r)', meaning: 'Kem-sak Ra (ᤷ)', type: 'extras', groupLabel: 'Chuk-sak 7 Finals' },
        { id: 'chuk_l', char: 'ᤁᤸ', latin: 'Final -l (ᤁᤸ)', deva: '-ल् (-l)', meaning: 'Kem-sak La (ᤸ)', type: 'extras', groupLabel: 'Chuk-sak 7 Finals' }
    ];
    chukItems.forEach(ci => items.push(ci));

    // 3c. Ektum Conjuncts & Kusek Sound Marks
    const markItems = [
        { id: 'ektum_ya', char: 'ᤁᤩᤠ', latin: 'Ektum-ya (ᤩ)', deva: 'क्या', meaning: 'Subjoined -ya cluster', type: 'extras', groupLabel: 'Ektum & Kusek Marks' },
        { id: 'ektum_ra', char: 'ᤁᤪᤠ', latin: 'Ektum-ra (ᤪ)', deva: 'क्रा', meaning: 'Subjoined -ra cluster', type: 'extras', groupLabel: 'Ektum & Kusek Marks' },
        { id: 'ektum_wa', char: 'ᤁᤫᤠ', latin: 'Ektum-wa (ᤫ)', deva: 'क्वा', meaning: 'Subjoined -wa cluster', type: 'extras', groupLabel: 'Ektum & Kusek Marks' },
        { id: 'mark_muphreng', char: 'ᤁ᤹', latin: 'Muphreng (᤹)', deva: 'कः', meaning: 'Glottal stop check', type: 'extras', groupLabel: 'Ektum & Kusek Marks' },
        { id: 'mark_kemphreng', char: 'ᤁᤠ᤺', latin: 'Kemphreng (᤺)', deva: 'काː', meaning: 'Vowel lengthener mark', type: 'extras', groupLabel: 'Ektum & Kusek Marks' },
        { id: 'mark_sai', char: 'ᤁ᤻', latin: 'Sa-i (᤻)', deva: 'क्', meaning: 'Halanta killer mark', type: 'extras', groupLabel: 'Ektum & Kusek Marks' }
    ];
    markItems.forEach(mi => items.push(mi));

    // 4. Saknam Matras & Marks
    if (typeof SAKNAM_MATRAS !== 'undefined' && Array.isArray(SAKNAM_MATRAS)) {
        SAKNAM_MATRAS.forEach((m, idx) => {
            const id = m.id || `matra_${idx + 1}`;
            items.push({
                id: id,
                char: m.demo || m.symbol || m.char || 'ᤠ',
                latin: m.latin || m.name || `Matra ${idx + 1}`,
                deva: m.deva || m.nepali || 'मात्रा',
                meaning: m.name || m.sound || 'Vowel Mark',
                type: 'matras',
                groupLabel: 'Saknam Matras'
            });
        });
    }

    // 5. Village Phrases
    if (typeof VILLAGE_PHRASES !== 'undefined' && Array.isArray(VILLAGE_PHRASES)) {
        VILLAGE_PHRASES.forEach((p, idx) => {
            const id = `phrase_${idx + 1}`;
            const fullLimbu = p.tiles ? p.tiles.map(t => t.limbu).join(' ') : (p.pronounce || 'ᤛᤣᤘᤠᤖᤥ');
            items.push({
                id: id,
                char: fullLimbu,
                latin: p.pronounce || 'Phrase',
                deva: p.nepali ? p.nepali.replace('नेपाली: ', '') : 'गाउँले संवाद',
                meaning: p.english || 'Village Greeting',
                type: 'phrases',
                groupLabel: 'Phedape Phrases'
            });
        });
    }

    return items;
}

function openVoiceStudio(targetId = null) {
    const modal = document.getElementById('voiceStudioModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const items = getAllCurriculumItemsForStudio();
    let initialItem = null;
    if (targetId) {
        initialItem = items.find(it => it.id === targetId);
    }
    if (!initialItem && items.length > 0) {
        initialItem = items[0];
    }

    selectItemForRecording(initialItem);
    renderVoiceStudioList();
    CustomAudioStore.updateBadges();
}

function closeVoiceStudio() {
    HardwareRecorder.stop();
    const modal = document.getElementById('voiceStudioModal');
    if (modal) modal.classList.add('hidden');
}

function setVoiceStudioFilter(filter) {
    currentStudioFilter = filter;
    ['all', 'consonants', 'vowels', 'extras', 'matras', 'phrases'].forEach(f => {
        const btn = document.getElementById(`studioFilter_${f}`);
        if (btn) {
            if (f === filter) {
                btn.className = 'px-3 py-1.5 rounded-xl font-extrabold text-xs bg-emerald-600 text-white shadow-xs transition shrink-0';
            } else {
                btn.className = 'px-3 py-1.5 rounded-xl font-bold text-xs bg-white text-slate-700 border border-parchment-300 hover:bg-parchment-100 transition shrink-0';
            }
        }
    });
    renderVoiceStudioList();
}

function selectItemForRecording(item) {
    if (!item) return;
    currentStudioTarget = item;

    // Reset recording hardware state
    HardwareRecorder.stop();
    HardwareRecorder.lastRecordedBlob = null;
    HardwareRecorder.updateRecordingUIState('idle');

    // Update Dock Header
    const glyphEl = document.getElementById('dockTargetGlyph');
    const titleEl = document.getElementById('dockTargetTitle');
    const devaEl = document.getElementById('dockTargetDeva');
    const meaningEl = document.getElementById('dockTargetMeaning');
    const badgeEl = document.getElementById('dockCustomActiveBadge');
    const downloadBtn = document.getElementById('dockDownloadBtn');
    const resetBtn = document.getElementById('dockResetBtn');

    if (glyphEl) glyphEl.textContent = item.char;
    if (titleEl) titleEl.textContent = item.latin;
    if (devaEl) devaEl.textContent = item.deva;
    if (meaningEl) meaningEl.textContent = item.meaning;

    const hasCustom = CustomAudioStore.has(item.id);
    if (badgeEl) {
        if (hasCustom) {
            badgeEl.classList.remove('hidden');
            badgeEl.textContent = typeof t === 'function' ? t('custom_voice_active_badge') : '🎙️ Custom Voice Active';
        } else {
            badgeEl.classList.add('hidden');
        }
    }

    if (downloadBtn) {
        downloadBtn.style.display = hasCustom ? 'flex' : 'none';
    }
    if (resetBtn) {
        resetBtn.style.display = hasCustom ? 'flex' : 'none';
    }
}

function renderVoiceStudioList() {
    const container = document.getElementById('voiceStudioListContainer');
    if (!container) return;

    const searchInput = document.getElementById('voiceStudioSearch');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const allItems = getAllCurriculumItemsForStudio();
    const filtered = allItems.filter(it => {
        const matchesFilter = currentStudioFilter === 'all' || it.type === currentStudioFilter;
        if (!matchesFilter) return false;
        if (!query) return true;
        return (
            (it.latin && it.latin.toLowerCase().includes(query)) ||
            (it.deva && it.deva.toLowerCase().includes(query)) ||
            (it.char && it.char.includes(query)) ||
            (it.meaning && it.meaning.toLowerCase().includes(query)) ||
            it.id.toLowerCase().includes(query)
        );
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center text-slate-500 text-xs">
                <span class="text-2xl block mb-1">🔍</span>
                No characters or items found matching "${query}".
            </div>
        `;
        return;
    }

    let html = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">';
    filtered.forEach(item => {
        const hasCustom = CustomAudioStore.has(item.id);
        const isSelected = currentStudioTarget && currentStudioTarget.id === item.id;
        
        html += `
            <div onclick="selectItemForRecordingById('${item.id}')" class="p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected 
                    ? 'bg-emerald-50/90 border-emerald-500 shadow-sm' 
                    : 'bg-white hover:bg-parchment-100 border-parchment-300'
            }">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div class="w-10 h-10 rounded-xl bg-parchment-100 border border-parchment-300 flex items-center justify-center shrink-0 shadow-inner">
                            <span class="font-limbu text-xl text-slatebrand-900 leading-none">${item.char}</span>
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5">
                                <span class="font-extrabold text-xs text-slatebrand-900 truncate">${item.latin}</span>
                                <span class="font-deva text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">${item.deva}</span>
                            </div>
                            <p class="text-[10px] text-slate-500 truncate mt-0.5">${item.meaning}</p>
                        </div>
                    </div>

                    <div class="text-right shrink-0">
                        <span class="font-mono text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 block">audio/${item.id}.mp3</span>
                        ${hasCustom 
                            ? '<span class="text-[9px] font-extrabold text-emerald-600 flex items-center justify-end gap-1 mt-0.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active</span>' 
                            : '<span class="text-[9px] font-medium text-slate-400 mt-0.5 block">○ Chime</span>'
                        }
                    </div>
                </div>

                <!-- Action Controls: Assign MP3, Record Mic, Listen, Reset -->
                <div class="flex items-center justify-between pt-1 border-t border-parchment-200 text-[11px]">
                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); assignAudioToWord('${item.id}')" class="px-2 py-1 rounded-xl bg-parchment-200 hover:bg-parchment-300 active:scale-95 text-slatebrand-900 font-extrabold text-[10px] transition flex items-center gap-1" title="Select any MP3/audio file on your device to assign to this word">
                            <span>📁</span> Assign MP3
                        </button>
                        <button onclick="event.stopPropagation(); selectItemForRecordingById('${item.id}')" class="px-2 py-1 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} font-bold text-[10px] transition flex items-center gap-1" title="Record your voice with microphone">
                            <span>🎙️</span> Rec
                        </button>
                    </div>

                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); playItemSoundDirect('${item.id}')" class="w-7 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="Hear this sound">
                            ▶
                        </button>
                        ${hasCustom ? `
                            <button onclick="event.stopPropagation(); resetTargetVoiceById('${item.id}')" class="w-7 h-7 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center transition" title="Reset pronunciation to default chime">
                                ↺
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

// 1-Click File Picker to Assign ANY audio file directly to a word
function assignAudioToWord(id) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = async (e) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) return;
        const allItems = getAllCurriculumItemsForStudio();
        const item = allItems.find(it => it.id === id);
        const label = item ? item.latin : id;
        await CustomAudioStore.save(id, file, file.type || 'audio/mp3', label);
        if (typeof showToast === 'function') {
            showToast(`Assigned ${file.name} to ${label} (saved to audio/${id}.mp3)`, '📁');
        }
        selectItemForRecording(item || { id, latin: id, char: id });
        renderVoiceStudioList();
    };
    input.click();
}

async function resetTargetVoiceById(id) {
    const allItems = getAllCurriculumItemsForStudio();
    const item = allItems.find(it => it.id === id);
    await CustomAudioStore.remove(id);
    if (typeof showToast === 'function') {
        showToast(`Reset ${item ? item.latin : id} to default sound`, '↺');
    }
    if (currentStudioTarget && currentStudioTarget.id === id) {
        selectItemForRecording(currentStudioTarget);
    }
    renderVoiceStudioList();
}

// Batch Audio Files Assignment (e.g. from an audio folder)
function triggerBatchAudioUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.onchange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        await handleBatchAudioFiles(files);
    };
    input.click();
}

async function handleBatchAudioFiles(files) {
    const allItems = getAllCurriculumItemsForStudio();
    let assignedCount = 0;

    for (const file of files) {
        const guessedId = guessCurriculumIdFromFilename(file.name, allItems);
        if (guessedId) {
            const item = allItems.find(it => it.id === guessedId);
            const label = item ? item.latin : guessedId;
            await CustomAudioStore.save(guessedId, file, file.type || 'audio/mp3', label);
            assignedCount++;
        }
    }

    if (assignedCount > 0) {
        if (typeof showToast === 'function') {
            showToast(`Assigned ${assignedCount} audio files to words!`, '🎉');
        }
        renderVoiceStudioList();
    } else {
        if (typeof showToast === 'function') {
            showToast('No matching filenames found. Name files like ka.mp3, kha.mp3, etc.', '⚠️');
        }
    }
}

function guessCurriculumIdFromFilename(filename, allItems) {
    const base = filename.replace(/\.[^/.]+$/, '').trim().toLowerCase();
    
    // Direct exact match (e.g. "ka", "kha", "v_a", "extra_13_1_0", "phrase_1")
    const exact = allItems.find(it => it.id.toLowerCase() === base);
    if (exact) return exact.id;

    // Latin name match (e.g. "Ka" -> "ka", "Kha" -> "kha")
    const latinMatch = allItems.find(it => it.latin.toLowerCase().replace(/[^a-z0-9]/g, '') === base.replace(/[^a-z0-9]/g, ''));
    if (latinMatch) return latinMatch.id;

    // Contains id surrounded by underscores/hyphens (e.g. "01_ka_sound" -> "ka")
    const partMatch = allItems.find(it => {
        const id = it.id.toLowerCase();
        return base.startsWith(id + '_') || base.endsWith('_' + id) || base.startsWith(id + '-') || base.endsWith('-' + id);
    });
    return partMatch ? partMatch.id : null;
}

function selectItemForRecordingById(id) {
    const items = getAllCurriculumItemsForStudio();
    const target = items.find(it => it.id === id);
    if (target) {
        selectItemForRecording(target);
        renderVoiceStudioList();
    }
}

function playItemSoundDirect(id) {
    if (typeof AudioSystem !== 'undefined' && typeof AudioSystem.playItem === 'function') {
        AudioSystem.playItem(id);
    }
}

function toggleStudioRecord() {
    if (HardwareRecorder.isRecording) {
        HardwareRecorder.stop();
    } else {
        HardwareRecorder.start();
    }
}

async function saveRecordedVoice() {
    if (!currentStudioTarget || !HardwareRecorder.lastRecordedBlob) {
        if (typeof showToast === 'function') showToast('Record your voice first before saving', '⚠️');
        return;
    }

    await CustomAudioStore.save(
        currentStudioTarget.id,
        HardwareRecorder.lastRecordedBlob,
        HardwareRecorder.lastRecordedMime,
        currentStudioTarget.latin
    );

    if (typeof showToast === 'function') {
        const prefix = typeof t === 'function' ? t('voice_saved') : 'Custom voice saved for';
        showToast(`${prefix} ${currentStudioTarget.latin} (${currentStudioTarget.char})`, '🎙️');
    }

    selectItemForRecording(currentStudioTarget);
    renderVoiceStudioList();
}

async function resetCurrentTargetVoice() {
    if (!currentStudioTarget) return;
    const id = currentStudioTarget.id;
    await CustomAudioStore.remove(id);

    if (typeof showToast === 'function') {
        const prefix = typeof t === 'function' ? t('voice_deleted') : 'Reset pronunciation to default for';
        showToast(`${prefix} ${currentStudioTarget.latin}`, '↺');
    }

    selectItemForRecording(currentStudioTarget);
    renderVoiceStudioList();
}

function exportCurrentTargetVoice() {
    if (!currentStudioTarget) return;
    CustomAudioStore.exportSingle(currentStudioTarget.id);
}

function triggerAudioFileUpload() {
    const input = document.getElementById('voiceStudioFileInput');
    if (input) input.click();
}

async function handleAudioFileSelected(e) {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file || !currentStudioTarget) return;

    try {
        await CustomAudioStore.save(
            currentStudioTarget.id,
            file,
            file.type || 'audio/mp3',
            currentStudioTarget.latin
        );

        if (typeof showToast === 'function') {
            const prefix = typeof t === 'function' ? t('voice_saved') : 'Audio uploaded & saved for';
            showToast(`${prefix} ${currentStudioTarget.latin}`, '📁');
        }

        selectItemForRecording(currentStudioTarget);
        renderVoiceStudioList();
    } catch (err) {
        console.error('File upload error:', err);
        alert('Failed to save audio file: ' + err.message);
    }

    e.target.value = ''; // Reset input
}

function triggerAudioPackUpload() {
    const input = document.getElementById('voiceStudioPackInput');
    if (input) input.click();
}

async function handleAudioPackSelected(e) {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    await CustomAudioStore.importAudioPack(file);
    renderVoiceStudioList();
    if (currentStudioTarget) selectItemForRecording(currentStudioTarget);
    e.target.value = '';
}

function updateVoiceStudioUI() {
    CustomAudioStore.updateBadges();
    if (currentStudioTarget) {
        selectItemForRecording(currentStudioTarget);
    }
    renderVoiceStudioList();
}
