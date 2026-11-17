/**
 * Yakthung Pan • Audio Engine & Sound Orchestrator
 * Checks audio/<id>.mp3 for authentic voice recording;
 * Falls back to built-in harmonic Web Audio chimes & SpeechSynthesis.
 */

let audioCtx = null;

function playTone(freq = 330, mode = 'note') {
    try {
        if (!audioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC) audioCtx = new AC();
        }
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;
        if (mode === 'note') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.24, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.44);
        } else if (mode === 'success') {
            [523.25, 659.25, 783.99].forEach((f, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'sine';
                o.frequency.setValueAtTime(f, now + i * 0.08);
                g.gain.setValueAtTime(0.001, now + i * 0.08);
                g.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.02);
                g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
                o.connect(g);
                g.connect(audioCtx.destination);
                o.start(now + i * 0.08);
                o.stop(now + i * 0.08 + 0.32);
            });
        } else if (mode === 'error') {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.type = 'sawtooth';
            o.frequency.setValueAtTime(165, now);
            o.frequency.linearRampToValueAtTime(125, now + 0.22);
            g.gain.setValueAtTime(0.14, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
            o.connect(g);
            g.connect(audioCtx.destination);
            o.start(now);
            o.stop(now + 0.25);
        }
    } catch (e) {
        console.warn('Audio tone error:', e);
    }
}

function speakText(text, lang = 'hi-IN', freq = 380) {
    playTone(freq, 'note');
    try {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = lang;
            utter.rate = 0.85;
            window.speechSynthesis.speak(utter);
        }
    } catch (e) {}
}

var AudioSystem = {
    audioFolder: 'audio/',
    activeAudio: null,
    audioCache: new Map(),
    missingSet: new Set(),

    playItem(itemOrId, fallbackFreq) {
        let id = '';
        let freq = fallbackFreq || 330;
        let textFallback = '';
        let item = null;

        if (typeof itemOrId === 'string') {
            id = itemOrId;
            item = getLetterById(id);
            if (item) {
                freq = item.freq || freq;
                textFallback = item.devaBase || item.deva || item.latin || '';
            }
        } else if (itemOrId && typeof itemOrId === 'object') {
            item = itemOrId;
            id = item.id || '';
            freq = item.freq || freq;
            textFallback = item.devaBase || item.deva || item.pronounce || item.targetDeva || item.latin || '';
        }

        const fallbackChime = () => {
            playTone(freq, 'note');
            if (textFallback && 'speechSynthesis' in window) {
                try {
                    window.speechSynthesis.cancel();
                    const utter = new SpeechSynthesisUtterance(textFallback);
                    utter.lang = 'hi-IN';
                    utter.rate = 0.85;
                    window.speechSynthesis.speak(utter);
                } catch (e) {}
            }
        };

        if (!id) {
            fallbackChime();
            return;
        }

        // 1. HIGHEST PRIORITY: Authentic user-recorded custom voice from Voice Studio
        if (typeof CustomAudioStore !== 'undefined' && CustomAudioStore.has(id)) {
            const customUrl = CustomAudioStore.getUrl(id);
            if (customUrl) {
                if (this.activeAudio) {
                    try {
                        this.activeAudio.pause();
                        this.activeAudio.currentTime = 0;
                    } catch (e) {}
                }
                const customAudio = new Audio(customUrl);
                this.activeAudio = customAudio;
                customAudio.currentTime = 0;
                const p = customAudio.play();
                if (p !== undefined) {
                    p.catch(err => {
                        console.warn('[AudioSystem] Error playing custom voice, using fallback:', err);
                        fallbackChime();
                    });
                }
                return;
            }
        }

        // 2. SECOND PRIORITY: Static MP3 file from audio/<id>.mp3
        // If known to be missing from audio folder, immediately chime
        if (this.missingSet.has(id)) {
            fallbackChime();
            return;
        }

        // Stop current audio if playing
        if (this.activeAudio) {
            try {
                this.activeAudio.pause();
                this.activeAudio.currentTime = 0;
            } catch (e) {}
        }

        let audio = this.audioCache.get(id);
        if (!audio) {
            audio = new Audio(`${this.audioFolder}${id}.mp3`);
            this.audioCache.set(id, audio);
        }

        this.activeAudio = audio;
        audio.currentTime = 0;

        let triggered = false;
        const triggerFallback = () => {
            if (triggered) return;
            triggered = true;
            this.missingSet.add(id);
            this.audioCache.delete(id);
            fallbackChime();
        };

        audio.onerror = triggerFallback;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                triggerFallback();
            });
        }
    }
};

function speakCurrentCharacter() {
    const letter = getCurrentLetterObj();
    if (letter) {
        AudioSystem.playItem(letter);
    }
}

