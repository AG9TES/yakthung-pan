import os
import subprocess
import tempfile
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SHEETS_DIR = os.path.join(BASE_DIR, 'recording_sheets')
os.makedirs(SHEETS_DIR, exist_ok=True)
ARTIFACT_DIR = r'C:\Users\ag9te\.gemini\antigravity\brain\41d21843-e9cb-47f7-8eab-d663761b2d4f'
CHROME_PATH = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Yakthung Pan • Voice Artist Recording Sheet (Part 4: Chuk-sak & Sound Marks)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@500;700;800&family=Noto+Sans+Limbu&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
    <style>
        .font-limbu { font-family: 'Noto Sans Limbu', sans-serif; }
        .font-deva { font-family: 'Noto Sans Devanagari', sans-serif; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-[#fcfaf5] text-slate-800 p-8 min-h-screen">
    <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-emerald-700/50 flex items-center justify-between">
            <div>
                <span class="text-xs uppercase tracking-widest font-extrabold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                    Voice Recording Studio • Sheet 4 of 4
                </span>
                <h1 class="text-2xl font-black mt-2 tracking-tight">Chuk-sak 7 Finals & Ektum/Kusek Sound Marks</h1>
                <p class="text-xs text-emerald-200 mt-1">फेदापे याक्थुङ चुक्-सक् (७ अन्त्य व्यञ्जन) र एक्टुम तथा कुसेक ध्वनि चिन्हहरू</p>
            </div>
            <div class="text-right">
                <span class="text-3xl font-limbu text-amber-400 font-bold block">ᤁᤰ • ᤁᤩᤠ</span>
                <span class="text-[11px] text-slate-300 font-medium">13 Audio Files (.mp3)</span>
            </div>
        </div>

        <!-- Section 1: Chuk-sak 7 Finals -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
            <div class="flex items-center justify-between border-b border-stone-200 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">A</span>
                    <h2 class="text-base font-extrabold text-slate-900">Chuk-sak • 7 Half / Subjoined Final Consonants (चुक्-सक्)</h2>
                </div>
                <span class="text-xs text-stone-500 font-bold">7 Audio Targets</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-center space-y-1">
                    <span class="font-limbu text-4xl text-slate-900 block font-bold">ᤁᤰ</span>
                    <span class="font-deva text-sm font-extrabold text-emerald-700 block">-क् (-k)</span>
                    <span class="text-[11px] font-bold text-slate-600 block">Kem-sak Ka (ᤰ)</span>
                    <code class="text-[10px] bg-white px-2 py-0.5 rounded border border-stone-200 text-emerald-800 block">chuk_k.mp3</code>
                </div>

                <div class="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-center space-y-1">
                    <span class="font-limbu text-4xl text-slate-900 block font-bold">ᤁᤱ</span>
                    <span class="font-deva text-sm font-extrabold text-emerald-700 block">-ङ् (-ng)</span>
                    <span class="text-[11px] font-bold text-slate-600 block">Kem-sak Nga (ᤱ)</span>
                    <code class="text-[10px] bg-white px-2 py-0.5 rounded border border-stone-200 text-emerald-800 block">chuk_ng.mp3</code>
                </div>

                <div class="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-center space-y-1">
                    <span class="font-limbu text-4xl text-slate-900 block font-bold">ᤁᤳ</span>
                    <span class="font-deva text-sm font-extrabold text-emerald-700 block">-त् (-t)</span>
                    <span class="text-[11px] font-bold text-slate-600 block">Kem-sak Ta (ᤳ)</span>
                    <code class="text-[10px] bg-white px-2 py-0.5 rounded border border-stone-200 text-emerald-800 block">chuk_t.mp3</code>
                </div>

                <div class="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-center space-y-1">
                    <span class="font-limbu text-4xl text-slate-900 block font-bold">ᤁᤵ</span>
                    <span class="font-deva text-sm font-extrabold text-emerald-700 block">-प् (-p)</span>
                    <span class="text-[11px] font-bold text-slate-600 block">Kem-sak Pa (ᤵ)</span>
                    <code class="text-[10px] bg-white px-2 py-0.5 rounded border border-stone-200 text-emerald-800 block">chuk_p.mp3</code>
                </div>

                <div class="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-center space-y-1">
                    <span class="font-limbu text-4xl text-slate-900 block font-bold">ᤁᤶ</span>
                    <span class="font-deva text-sm font-extrabold text-emerald-700 block">-म् (-m)</span>
                    <span class="text-[11px] font-bold text-slate-600 block">Kem-sak Ma (ᤶ)</span>
                    <code class="text-[10px] bg-white px-2 py-0.5 rounded border border-stone-200 text-emerald-800 block">chuk_m.mp3</code>
                </div>

                <div class="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-center space-y-1">
                    <span class="font-limbu text-4xl text-slate-900 block font-bold">ᤁᤷ</span>
                    <span class="font-deva text-sm font-extrabold text-emerald-700 block">-र् (-r)</span>
                    <span class="text-[11px] font-bold text-slate-600 block">Kem-sak Ra (ᤷ)</span>
                    <code class="text-[10px] bg-white px-2 py-0.5 rounded border border-stone-200 text-emerald-800 block">chuk_r.mp3</code>
                </div>

                <div class="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-center space-y-1">
                    <span class="font-limbu text-4xl text-slate-900 block font-bold">ᤁᤸ</span>
                    <span class="font-deva text-sm font-extrabold text-emerald-700 block">-ल् (-l)</span>
                    <span class="text-[11px] font-bold text-slate-600 block">Kem-sak La (ᤸ)</span>
                    <code class="text-[10px] bg-white px-2 py-0.5 rounded border border-stone-200 text-emerald-800 block">chuk_l.mp3</code>
                </div>
            </div>
        </div>

        <!-- Section 2: Ektum Conjuncts & Kusek Sound Marks -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
            <div class="flex items-center justify-between border-b border-stone-200 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">B</span>
                    <h2 class="text-base font-extrabold text-slate-900">Ektum-sak (Conjuncts) & Kusek-sak (Sound Marks)</h2>
                </div>
                <span class="text-xs text-stone-500 font-bold">6 Audio Targets</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                    <div>
                        <div class="text-xs font-extrabold text-slate-900">Ektum-ya (ᤩ)</div>
                        <div class="text-[11px] text-slate-600">Subjoined -ya cluster (e.g. Kya / Chya)</div>
                        <div class="font-deva text-xs font-bold text-emerald-700 mt-0.5">क्या • च्या</div>
                        <code class="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 text-emerald-800 inline-block mt-1">ektum_ya.mp3</code>
                    </div>
                    <span class="font-limbu text-4xl text-slate-900 font-bold">ᤁᤩᤠ</span>
                </div>

                <div class="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                    <div>
                        <div class="text-xs font-extrabold text-slate-900">Ektum-ra (ᤪ)</div>
                        <div class="text-[11px] text-slate-600">Subjoined -ra cluster (e.g. Kra / Pra)</div>
                        <div class="font-deva text-xs font-bold text-emerald-700 mt-0.5">क्रा • प्रा</div>
                        <code class="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 text-emerald-800 inline-block mt-1">ektum_ra.mp3</code>
                    </div>
                    <span class="font-limbu text-4xl text-slate-900 font-bold">ᤁᤪᤠ</span>
                </div>

                <div class="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                    <div>
                        <div class="text-xs font-extrabold text-slate-900">Ektum-wa (ᤫ)</div>
                        <div class="text-[11px] text-slate-600">Subjoined -wa cluster (e.g. Kwa / Chwa)</div>
                        <div class="font-deva text-xs font-bold text-emerald-700 mt-0.5">क्वा • च्वा</div>
                        <code class="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 text-emerald-800 inline-block mt-1">ektum_wa.mp3</code>
                    </div>
                    <span class="font-limbu text-4xl text-slate-900 font-bold">ᤁᤫᤠ</span>
                </div>

                <div class="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                    <div>
                        <div class="text-xs font-extrabold text-slate-900">Muphreng (᤹)</div>
                        <div class="text-[11px] text-slate-600">Glottal stop / abrupt cutoff sound</div>
                        <div class="font-deva text-xs font-bold text-emerald-700 mt-0.5">कः (विरामयुक्त ध्वनि)</div>
                        <code class="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 text-emerald-800 inline-block mt-1">mark_muphreng.mp3</code>
                    </div>
                    <span class="font-limbu text-4xl text-slate-900 font-bold">ᤁ᤹</span>
                </div>

                <div class="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                    <div>
                        <div class="text-xs font-extrabold text-slate-900">Kemphreng (᤺)</div>
                        <div class="text-[11px] text-slate-600">Vowel lengthening / sustained tone</div>
                        <div class="font-deva text-xs font-bold text-emerald-700 mt-0.5">काː (दीर्घ स्वर)</div>
                        <code class="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 text-emerald-800 inline-block mt-1">mark_kemphreng.mp3</code>
                    </div>
                    <span class="font-limbu text-4xl text-slate-900 font-bold">ᤁᤠ᤺</span>
                </div>

                <div class="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                    <div>
                        <div class="text-xs font-extrabold text-slate-900">Sa-i (᤻)</div>
                        <div class="text-[11px] text-slate-600">Halanta / pure consonant killer mark</div>
                        <div class="font-deva text-xs font-bold text-emerald-700 mt-0.5">क् (हलन्त / शुद्ध व्यञ्जन)</div>
                        <code class="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 text-emerald-800 inline-block mt-1">mark_sai.mp3</code>
                    </div>
                    <span class="font-limbu text-4xl text-slate-900 font-bold">ᤁ᤻</span>
                </div>
            </div>
        </div>

        <div class="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div>
                <span class="font-bold">🎙️ Voice Artist Guide:</span>
                Pronounce each syllable crisp and clear in the authentic Phedape dialect (फेदापे याक्थुङ पान).
            </div>
            <span class="font-bold text-emerald-800">Yakthung Pan © 2026</span>
        </div>
    </div>
</body>
</html>
'''

html_file = os.path.join(SHEETS_DIR, 'sheet4_chuk_and_marks.html')
with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

out_png = os.path.join(SHEETS_DIR, '4_Yakthung_Chuk_Sak_and_Marks.png')
temp_png = os.path.join(tempfile.gettempdir(), 'sheet4.png')
if os.path.exists(temp_png):
    os.remove(temp_png)

cmd = [
    CHROME_PATH,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1200,1050',
    '--hide-scrollbars',
    f'--screenshot={temp_png}',
    f'file:///{html_file.replace(os.sep, "/")}'
]

print("Rendering Sheet 4 with Chrome headless...")
subprocess.run(cmd, check=True)

if os.path.exists(temp_png):
    shutil.copy(temp_png, out_png)
    os.remove(temp_png)
    print(f"Generated {out_png} ({os.path.getsize(out_png)} bytes)")

    if os.path.isdir(ARTIFACT_DIR):
        artifact_path = os.path.join(ARTIFACT_DIR, '4_Yakthung_Chuk_Sak_and_Marks.png')
        shutil.copy(out_png, artifact_path)
        print(f"Copied to artifact directory: {artifact_path}")
