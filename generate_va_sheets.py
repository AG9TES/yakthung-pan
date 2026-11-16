import os
import json
import subprocess
import tempfile
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SHEETS_DIR = os.path.join(BASE_DIR, 'recording_sheets')
os.makedirs(SHEETS_DIR, exist_ok=True)

ARTIFACT_DIR = r'C:\Users\ag9te\.gemini\antigravity\brain\41d21843-e9cb-47f7-8eab-d663761b2d4f'
CHROME_PATH = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

# Load curriculum
with open(os.path.join(BASE_DIR, 'data', 'curriculum.json'), 'r', encoding='utf-8') as f:
    curriculum = json.load(f)

COMMON_HEAD = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@500;700;800&family=Noto+Sans+Limbu&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0f172a; }
        .font-limbu { font-family: 'Noto Sans Limbu', sans-serif; }
        .font-deva { font-family: 'Noto Sans Devanagari', sans-serif; }
        .dhaka-bg {
            background-color: #064e3b;
            background-image: 
                radial-gradient(#10b981 1px, transparent 1px), 
                radial-gradient(#f59e0b 1px, #064e3b 1px);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
        }
    </style>
</head>
<body class="p-6 flex justify-center">
    <div class="w-[1000px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
'''

COMMON_HEADER = '''
        <!-- Header Banner -->
        <div class="dhaka-bg text-white p-6 border-b-4 border-amber-500">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-lg">
                        <span class="font-limbu text-4xl text-amber-400 font-bold">ᤕ</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-limbu text-2xl text-amber-300 font-bold">ᤕᤰᤌᤢᤱ ᤐᤠᤴ</span>
                            <span class="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">Phedape Limbu</span>
                        </div>
                        <h1 class="text-2xl font-black tracking-tight text-white mt-0.5">{sheet_title}</h1>
                        <p class="text-xs text-emerald-200 font-medium font-deva">फेदापे याक्थुङ मौलिक लवज आवाज रेकर्डिङ मार्गनिर्देशन</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="inline-block text-[11px] font-black uppercase px-3 py-1 rounded-full bg-amber-400 text-slate-900 shadow">Voice Artist Script</span>
                    <p class="text-[11px] text-emerald-200 mt-1 font-semibold">Format: .mp3 • 44.1kHz</p>
                </div>
            </div>

            <!-- Voice Artist Recording Guide Alert -->
            <div class="mt-4 bg-slate-900/90 backdrop-blur rounded-2xl p-3.5 border border-emerald-400/30 flex items-center justify-between text-xs text-slate-200">
                <div class="flex items-center gap-2">
                    <span class="text-xl">🎙️</span>
                    <div>
                        <span class="font-extrabold text-amber-300">Recording Instructions:</span>
                        <span class="text-slate-300 ml-1">Speak clearly in authentic Phedape accent. Duration: 0.5s–1.5s per sound. Save with exact filename shown in green.</span>
                    </div>
                </div>
                <span class="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-600/40 shrink-0">audio/&lt;filename&gt;.mp3</span>
            </div>
        </div>
'''

FOOTER = '''
        <!-- Footer -->
        <div class="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
            <div class="flex items-center gap-2">
                <span class="font-limbu text-lg text-emerald-700">ᤛᤣᤘᤠᤖᤥ</span>
                <span>Yakthung Pan • Phedape Cultural Preservation Project</span>
            </div>
            <span>Page {page_num} of 3 • Save files to: <code class="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">audio/</code></span>
        </div>
    </div>
</body>
</html>
'''

# =========================================================================
# SHEET 1: 25 CONSONANTS (ᤁ - ᤜ)
# =========================================================================
def build_sheet1_html():
    consonants = curriculum.get('consonants', [])
    rows_html = ""
    for idx, c in enumerate(consonants):
        bg = "bg-slate-50/70" if idx % 2 == 1 else "bg-white"
        rows_html += f'''
        <tr class="{bg} border-b border-slate-150 hover:bg-emerald-50/50 transition">
            <td class="py-2.5 px-3 font-mono font-bold text-xs text-slate-400 text-center">{idx + 1}</td>
            <td class="py-2.5 px-3">
                <span class="font-mono text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">{c['id']}.mp3</span>
            </td>
            <td class="py-2.5 px-4 text-center">
                <span class="font-limbu text-4xl text-slate-900 font-bold leading-none">{c['char']}</span>
            </td>
            <td class="py-2.5 px-3">
                <div class="flex items-center gap-2">
                    <span class="font-extrabold text-base text-slate-900">{c['latin']}</span>
                    <span class="font-deva text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">{c['deva']}</span>
                </div>
            </td>
            <td class="py-2.5 px-3">
                <div class="flex items-center gap-2">
                    <span class="font-limbu text-xl text-emerald-800 font-bold">{c.get('wordLimbu', '')}</span>
                    <span class="text-xs font-bold text-slate-700 font-mono">({c.get('wordLatin', '')})</span>
                </div>
            </td>
            <td class="py-2.5 px-3 text-xs text-slate-600 font-medium">
                <span>{c.get('emoji', '')} {c.get('meaning', '')}</span>
            </td>
        </tr>
        '''

    body = f'''
        <div class="p-6">
            <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-emerald-600"></span>
                    Part 1: The 25 Consonants (Kudhuku-sak • कुधुकु-सक २५ व्यञ्जन वर्ण)
                </h2>
                <span class="text-xs font-extrabold text-slate-500">25 Audio Files to Record</span>
            </div>

            <table class="w-full text-left border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <thead>
                    <tr class="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                        <th class="py-3 px-3 text-center w-12">#</th>
                        <th class="py-3 px-3 w-36">Audio File Name</th>
                        <th class="py-3 px-4 text-center w-24">Script</th>
                        <th class="py-3 px-3 w-40">Pronunciation</th>
                        <th class="py-3 px-3 w-44">Anchor Word</th>
                        <th class="py-3 px-3">Meaning / Context</th>
                    </tr>
                </thead>
                <tbody>
                    {rows_html}
                </tbody>
            </table>
        </div>
    '''

    html = COMMON_HEAD.replace('{title}', "Yakthung Pan - Voice Artist Guide - Part 1: 25 Consonants")
    html += COMMON_HEADER.replace('{sheet_title}', "Voice Artist Recording Sheet 1: 25 Consonants")
    html += body
    html += FOOTER.replace('{page_num}', '1')
    return html

# =========================================================================
# SHEET 2: 9 VOWELS & 11 NUMBERS
# =========================================================================
def build_sheet2_html():
    vowels = curriculum.get('vowels', [])
    v_rows = ""
    for idx, v in enumerate(vowels):
        bg = "bg-slate-50/70" if idx % 2 == 1 else "bg-white"
        v_rows += f'''
        <tr class="{bg} border-b border-slate-150 hover:bg-emerald-50/50 transition">
            <td class="py-2.5 px-3 font-mono font-bold text-xs text-slate-400 text-center">{idx + 1}</td>
            <td class="py-2.5 px-3">
                <span class="font-mono text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">{v['id']}.mp3</span>
            </td>
            <td class="py-2.5 px-4 text-center">
                <span class="font-limbu text-3xl text-slate-900 font-bold leading-none">{v['char']}</span>
            </td>
            <td class="py-2.5 px-3">
                <div class="flex items-center gap-2">
                    <span class="font-extrabold text-base text-slate-900">{v['latin']}</span>
                    <span class="font-deva text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">{v['deva']}</span>
                </div>
            </td>
            <td class="py-2.5 px-3">
                <div class="flex items-center gap-2">
                    <span class="font-limbu text-xl text-emerald-800 font-bold">{v.get('wordLimbu', '')}</span>
                    <span class="text-xs font-bold text-slate-700 font-mono">({v.get('wordLatin', '')})</span>
                </div>
            </td>
            <td class="py-2.5 px-3 text-xs text-slate-600 font-medium">
                <span>{v.get('emoji', '')} {v.get('meaning', '')}</span>
            </td>
        </tr>
        '''

    numbers = curriculum.get('numbers', [])
    n_rows = ""
    for idx, n in enumerate(numbers):
        bg = "bg-slate-50/70" if idx % 2 == 1 else "bg-white"
        n_rows += f'''
        <tr class="{bg} border-b border-slate-150 hover:bg-emerald-50/50 transition">
            <td class="py-2 px-3 font-mono font-bold text-xs text-slate-400 text-center">{idx + 1}</td>
            <td class="py-2 px-3">
                <span class="font-mono text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">{n['id']}.mp3</span>
            </td>
            <td class="py-2 px-4 text-center">
                <span class="font-limbu text-3xl text-slate-900 font-bold leading-none">{n['char']}</span>
            </td>
            <td class="py-2 px-3">
                <div class="flex items-center gap-2">
                    <span class="font-extrabold text-base text-slate-900">{n['latin']}</span>
                    <span class="font-deva text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">{n['deva']}</span>
                </div>
            </td>
            <td class="py-2 px-3 text-xs text-slate-700 font-extrabold">
                {n.get('meaning', '')}
            </td>
        </tr>
        '''

    body = f'''
        <div class="p-6 space-y-6">
            <!-- Part 2: Vowels -->
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                        Part 2: 9 Pure Vowels (Kubung-sak • कुबुङ-सक ९ स्वर वर्ण)
                    </h2>
                    <span class="text-xs font-extrabold text-slate-500">9 Audio Files to Record</span>
                </div>
                <table class="w-full text-left border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <thead>
                        <tr class="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                            <th class="py-2.5 px-3 text-center w-12">#</th>
                            <th class="py-2.5 px-3 w-36">Audio File Name</th>
                            <th class="py-2.5 px-4 text-center w-24">Vowel</th>
                            <th class="py-2.5 px-3 w-40">Sound</th>
                            <th class="py-2.5 px-3 w-44">Anchor Word</th>
                            <th class="py-2.5 px-3">Meaning / Context</th>
                        </tr>
                    </thead>
                    <tbody>
                        {v_rows}
                    </tbody>
                </table>
            </div>

            <!-- Part 3: Numerals -->
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-blue-600"></span>
                        Part 3: 11 Limbu Numerals (Khanin • खानिन् ० देखि १० सम्म)
                    </h2>
                    <span class="text-xs font-extrabold text-slate-500">11 Audio Files to Record</span>
                </div>
                <table class="w-full text-left border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <thead>
                        <tr class="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                            <th class="py-2 px-3 text-center w-12">#</th>
                            <th class="py-2 px-3 w-36">Audio File Name</th>
                            <th class="py-2 px-4 text-center w-24">Numeral</th>
                            <th class="py-2 px-3 w-40">Limbu Pronunciation</th>
                            <th class="py-2 px-3">Number Meaning</th>
                        </tr>
                    </thead>
                    <tbody>
                        {n_rows}
                    </tbody>
                </table>
            </div>
        </div>
    '''

    html = COMMON_HEAD.replace('{title}', "Yakthung Pan - Voice Artist Guide - Part 2: Vowels & Numbers")
    html += COMMON_HEADER.replace('{sheet_title}', "Voice Artist Recording Sheet 2: Vowels & Numerals")
    html += body
    html += FOOTER.replace('{page_num}', '2')
    return html

# =========================================================================
# SHEET 3: PHEDAPE PHRASES & SAKNAM MATRAS
# =========================================================================
def build_sheet3_html():
    phrases = curriculum.get('villagePhrases', [])
    p_rows = ""
    for idx, p in enumerate(phrases):
        bg = "bg-slate-50/70" if idx % 2 == 1 else "bg-white"
        tiles_limbu = ' '.join([t.get('limbu', '') for t in p.get('tiles', [])])
        p_rows += f'''
        <tr class="{bg} border-b border-slate-150 hover:bg-emerald-50/50 transition">
            <td class="py-3 px-3 font-mono font-bold text-xs text-slate-400 text-center">{idx + 1}</td>
            <td class="py-3 px-3">
                <span class="font-mono text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">phrase_{idx + 1}.mp3</span>
            </td>
            <td class="py-3 px-4">
                <span class="font-limbu text-2xl text-slate-900 font-bold block">{tiles_limbu}</span>
            </td>
            <td class="py-3 px-3">
                <div class="flex items-center gap-1.5">
                    <span class="font-black text-sm text-slate-900">{p.get('pronounce', '')}</span>
                    <span>{p.get('emoji', '')}</span>
                </div>
            </td>
            <td class="py-3 px-3 font-deva text-xs font-bold text-amber-900">
                {p.get('nepali', '').replace('नेपाली: ', '')}
            </td>
            <td class="py-3 px-3 text-xs text-slate-600 font-medium">
                {p.get('english', '')}
            </td>
        </tr>
        '''

    matras = curriculum.get('saknamMatras', [])
    m_rows = ""
    for idx, m in enumerate(matras):
        bg = "bg-slate-50/70" if idx % 2 == 1 else "bg-white"
        m_rows += f'''
        <tr class="{bg} border-b border-slate-150 hover:bg-emerald-50/50 transition">
            <td class="py-2 px-3 font-mono font-bold text-xs text-slate-400 text-center">{idx + 1}</td>
            <td class="py-2 px-3">
                <span class="font-mono text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">matra_{idx + 1}.mp3</span>
            </td>
            <td class="py-2 px-4 text-center">
                <span class="font-limbu text-3xl text-slate-900 font-bold leading-none">{m.get('demo', '')}</span>
            </td>
            <td class="py-2 px-3 font-black text-sm text-slate-900">
                {m.get('latin', '')} ({m.get('deva', '')})
            </td>
            <td class="py-2 px-3 text-xs font-bold text-slate-700">
                {m.get('name', '')}
            </td>
            <td class="py-2 px-3 font-deva text-xs text-slate-600">
                {m.get('nepali', '')}
            </td>
        </tr>
        '''

    body = f'''
        <div class="p-6 space-y-6">
            <!-- Part 4: Everyday Phrases -->
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-emerald-600"></span>
                        Part 4: Phedape Village Everyday Phrases (गाउँले दैनिक संवाद)
                    </h2>
                    <span class="text-xs font-extrabold text-slate-500">8 Audio Files to Record</span>
                </div>
                <table class="w-full text-left border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <thead>
                        <tr class="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                            <th class="py-3 px-3 text-center w-12">#</th>
                            <th class="py-3 px-3 w-36">Audio File Name</th>
                            <th class="py-3 px-4 w-52">Limbu Script</th>
                            <th class="py-3 px-3 w-40">Phedape Sound</th>
                            <th class="py-3 px-3 w-48 font-deva">नेपाली अर्थ</th>
                            <th class="py-3 px-3">English Meaning</th>
                        </tr>
                    </thead>
                    <tbody>
                        {p_rows}
                    </tbody>
                </table>
            </div>

            <!-- Part 5: Saknam Matras -->
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-purple-600"></span>
                        Part 5: 8 Saknam-sak Matras (साक्नाम-सक ८ मात्रा)
                    </h2>
                    <span class="text-xs font-extrabold text-slate-500">8 Audio Files to Record</span>
                </div>
                <table class="w-full text-left border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <thead>
                        <tr class="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                            <th class="py-2.5 px-3 text-center w-12">#</th>
                            <th class="py-2.5 px-3 w-36">Audio File Name</th>
                            <th class="py-2.5 px-4 text-center w-24">Sample</th>
                            <th class="py-2.5 px-3 w-36">Sound</th>
                            <th class="py-2.5 px-3 w-40">Limbu Matra Name</th>
                            <th class="py-2.5 px-3 font-deva">नेपाली चिन्ह</th>
                        </tr>
                    </thead>
                    <tbody>
                        {m_rows}
                    </tbody>
                </table>
            </div>
        </div>
    '''

    html = COMMON_HEAD.replace('{title}', "Yakthung Pan - Voice Artist Guide - Part 3: Phrases & Matras")
    html += COMMON_HEADER.replace('{sheet_title}', "Voice Artist Recording Sheet 3: Phrases & Matras")
    html += body
    html += FOOTER.replace('{page_num}', '3')
    return html

# Write HTML files
sheet1_html_path = os.path.join(SHEETS_DIR, 'sheet1_consonants.html')
sheet2_html_path = os.path.join(SHEETS_DIR, 'sheet2_vowels_numbers.html')
sheet3_html_path = os.path.join(SHEETS_DIR, 'sheet3_phrases_matras.html')

with open(sheet1_html_path, 'w', encoding='utf-8') as f:
    f.write(build_sheet1_html())
with open(sheet2_html_path, 'w', encoding='utf-8') as f:
    f.write(build_sheet2_html())
with open(sheet3_html_path, 'w', encoding='utf-8') as f:
    f.write(build_sheet3_html())

print("Created HTML files in:", SHEETS_DIR)

# Render screenshots via Chrome headless
sheets = [
    ('sheet1_consonants.html', '1_Yakthung_25_Consonants.png', 1050, 1550),
    ('sheet2_vowels_numbers.html', '2_Yakthung_Vowels_and_Numbers.png', 1050, 1320),
    ('sheet3_phrases_matras.html', '3_Yakthung_Phrases_and_Matras.png', 1050, 1300)
]

for html_file, png_file, w, h in sheets:
    local_html = f"http://localhost:8080/recording_sheets/{html_file}"
    tmp_out = os.path.join(tempfile.gettempdir(), png_file)
    final_sheet_path = os.path.join(SHEETS_DIR, png_file)
    artifact_path = os.path.join(ARTIFACT_DIR, png_file)

    cmd = [
        CHROME_PATH,
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--force-device-scale-factor=2',
        f'--window-size={w},{h}',
        f'--screenshot={tmp_out}',
        local_html
    ]

    print(f"Rendering {png_file}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(tmp_out):
        shutil.copy(tmp_out, final_sheet_path)
        shutil.copy(tmp_out, artifact_path)
        print(f"-> Saved: {final_sheet_path} ({os.path.getsize(final_sheet_path)} bytes)")
    else:
        print(f"Failed to render {png_file}: {res.stderr}")

print("All recording sheets successfully generated!")
