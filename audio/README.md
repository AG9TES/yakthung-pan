# Yakthung Pan - Audio Assets Guide

This directory holds authentic Sirijonga pronunciation audio files for letters, vowels, numbers, and vocabulary phrases.

## How It Works
The audio loader in Yakthung Pan checks for an audio file matching the item's `id`:
```
audio/<id>.mp3
```
- **If `<id>.mp3` exists**: It plays the authentic recorded audio.
- **If `<id>.mp3` is missing or fails**: It automatically falls back to the built-in Web Audio chime tuned to the letter's harmonic frequency (with speech synthesis support).

## Supported File Naming

### 1. 25 Consonants (Kudhuku-sak)
- Row 1: `ka.mp3`, `kha.mp3`, `ga.mp3`, `nga.mp3`
- Row 2: `cha.mp3`, `chha.mp3`, `ja.mp3`, `na.mp3`
- Row 3: `ta.mp3`, `tha.mp3`, `da.mp3`, `dha.mp3`
- Row 4: `pa.mp3`, `pha.mp3`, `ba.mp3`, `bha.mp3`
- Row 5: `ma.mp3`, `ya.mp3`, `ra.mp3`, `la.mp3`
- Rows 6–7: `wa.mp3`, `sha.mp3`, `sa.mp3`, `ha.mp3`, `gha.mp3`

### 2. 9 Vowels (Kubung-sak)
- `v_a.mp3` (ᤀ A)
- `v_aa.mp3` (ᤀᤠ Aa)
- `v_i.mp3` (ᤀᤡ I)
- `v_u.mp3` (ᤀᤢ U)
- `v_e.mp3` (ᤀᤣ E)
- `v_ai.mp3` (ᤀᤤ Ai)
- `v_o.mp3` (ᤀᤥ O)
- `v_au.mp3` (ᤀᤦ Au)
- `v_ae.mp3` (ᤀᤧ Ae)

### 3. 11 Numerals (Khanin)
- `num_0.mp3` (᥆ Thip - 0)
- `num_1.mp3` (᥇ Thik - 1)
- `num_2.mp3` (᥈ Net - 2)
- `num_3.mp3` (᥉ Sum - 3)
- `num_4.mp3` (᥊ Li - 4)
- `num_5.mp3` (᥋ Nga - 5)
- `num_6.mp3` (᥌ Tuk - 6)
- `num_7.mp3` (᥍ Nut - 7)
- `num_8.mp3` (᥎ Yet - 8)
- `num_9.mp3` (᥏ Phang - 9)
- `num_10.mp3` (᥇᥆ Thiboong - 10)

## Audio Recommendations
- **Format**: MP3 (`.mp3`), 44.1 kHz, mono or stereo, 128 kbps.
- **Duration**: 0.5s – 1.5s per character with brief 20ms fade-in/fade-out to avoid clicks.

