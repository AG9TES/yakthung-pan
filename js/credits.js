/**
 * Yakthung Pan • Credits, Contributors & Cultural Acknowledgments Engine
 * Showcases the dedicated team, voice artists, linguists, and community elders
 * who created and guided the Yakthung Pan application.
 * Fully localized in English (🇬🇧) and Nepali (🇳🇵).
 */

var CREDITS_DATA = [
    {
        categoryKey: 'core_team',
        categoryEn: 'Core Project Team & Vision',
        categoryNe: 'मूल परियोजना टोली तथा अवधारणा',
        members: [
            {
                nameEn: 'Yakthung Pan Initiative',
                nameNe: 'याक्थुङ पान अभियान',
                roleEn: 'Project Lead, Cultural Preservation & Creative Direction',
                roleNe: 'परियोजना नेतृत्व, भाषा संरक्षण तथा रचनात्मक परिकल्पना',
                avatar: '🌟',
                badgeEn: 'Founder',
                badgeNe: 'संस्थापक'
            }
        ]
    },
    {
        categoryKey: 'linguistics_voice',
        categoryEn: 'Native Pronunciation & Phedape Voice Artists',
        categoryNe: 'मौलिक उच्चारण तथा फेदापे आवाज कलाकार',
        members: [
            {
                nameEn: 'Phedap Native Speakers & Elders',
                nameNe: 'फेदापे भाषी तथा स्थानीय अग्रजहरू',
                roleEn: 'Authentic Phedape Limbu Dialect Recordings & Oral Pronunciation',
                roleNe: 'मौलिक फेदापे याक्थुङ लवजको ध्वनि तथा वाचिक उच्चारण',
                avatar: '🎙️',
                badgeEn: 'Voice & Dialect',
                badgeNe: 'आवाज र लवज'
            },
            {
                nameEn: 'Community Voice Studio Contributors',
                nameNe: 'समुदाय आवाज स्टुडियो योगदानकर्ताहरू',
                roleEn: 'Crowdsourced Audio Recordings for Consonants, Vowels & Phrases',
                roleNe: 'स्वर, व्यञ्जन र गाउँले संवादका लागि समुदायबाट संकलित आवाज',
                avatar: '🔊',
                badgeEn: 'Contributors',
                badgeNe: 'सहयोगी'
            }
        ]
    },
    {
        categoryKey: 'script_research',
        categoryEn: 'Sirijonga Script & Orthography Masters',
        categoryNe: 'सिरीजङ्गा लिपि तथा व्याकरण अध्ययन',
        members: [
            {
                nameEn: 'Te-ongsi Sirijonga Thebe Heritage',
                nameNe: 'तेअङ्सी सिरीजङ्गा थेबे परम्परा',
                roleEn: 'Historical Sirijonga Sak-sak 25 Consonant & 9 Vowel Orthography',
                roleNe: 'ऐतिहासिक सिरीजङ्गा साक्-साक् २५ व्यञ्जन र ९ स्वर लिपि प्रणाली',
                avatar: '📜',
                badgeEn: 'Script Heritage',
                badgeNe: 'लिपि धरोहर'
            },
            {
                nameEn: 'Limbu Language Academicians & Teachers',
                nameNe: 'याक्थुङ भाषा शिक्षक तथा अध्येताहरू',
                roleEn: 'Saknam-sak (Matras), Kem-sak (Finals) & Naukhari Verification',
                roleNe: 'साक्नाम-सक् (मात्रा), केम्-सक् (वर्णान्त) तथा नौखरी प्रमाणीकरण',
                avatar: '📖',
                badgeEn: 'Linguistics',
                badgeNe: 'भाषाशास्त्र'
            }
        ]
    },
    {
        categoryKey: 'dev_design',
        categoryEn: 'Software Architecture, Audio & UI/UX Design',
        categoryNe: 'सफ्टवेयर निर्माण, अडियो इन्जिन तथा अनुभव डिजाइन',
        members: [
            {
                nameEn: 'Digital Yakthung Software Lab',
                nameNe: 'डिजिटल याक्थुङ सफ्टवेयर ल्याब',
                roleEn: 'Mobile-First PWA, IndexedDB Voice Studio, 60% Tracing Engine & Google Sync',
                roleNe: 'मोबाइल-मैत्री पी.डब्ल्यु.ए, इन्डेक्सड्-डीबी आवाज स्टुडियो, ट्रेकिङ पाटी र गुगल सिङ्क',
                avatar: '💻',
                badgeEn: 'Engineering',
                badgeNe: 'प्रविधि'
            }
        ]
    },
    {
        categoryKey: 'special_thanks',
        categoryEn: 'Special Acknowledgments & Cultural Communities',
        categoryNe: 'विशेष धन्यवाद तथा समुदाय',
        members: [
            {
                nameEn: 'Phedap (Tehrathum / Sankhuwasabha) Community',
                nameNe: 'फेदाप (तेह्रथुम / संखुवासभा) समुदाय',
                roleEn: 'Traditional Idioms, Village Phrases & Cultural Consultation',
                roleNe: 'मौलिक गाउँले संवाद, परम्परागत मुहावरा तथा सांस्कृतिक सल्लाह',
                avatar: '🏔️',
                badgeEn: 'Heritage',
                badgeNe: 'सांस्कृतिक थाक'
            },
            {
                nameEn: 'Google Fonts & Noto Sans Limbu Team',
                nameNe: 'गुगल फन्ट्स र नोटो सान्स लिम्बू टोली',
                roleEn: 'Open-source Unicode Sirijonga (Limbu) Typography',
                roleNe: 'खुला युनिकोड सिरीजङ्गा (लिम्बू) फन्ट संरचना',
                avatar: '🔤',
                badgeEn: 'Open Source',
                badgeNe: 'खुला स्रोत'
            }
        ]
    }
];

function openCreditsModal() {
    const modal = document.getElementById('creditsModal');
    if (!modal) return;
    renderCreditsModal();
    modal.classList.remove('hidden');
}

function closeCreditsModal() {
    const modal = document.getElementById('creditsModal');
    if (modal) modal.classList.add('hidden');
}

function renderCreditsModal() {
    const container = document.getElementById('creditsListContainer');
    if (!container) return;

    const isNe = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ne');

    let html = '';

    CREDITS_DATA.forEach(section => {
        const title = isNe ? section.categoryNe : section.categoryEn;

        html += `
            <div class="space-y-2">
                <div class="flex items-center gap-2 border-b border-parchment-300 pb-1.5 pt-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h3 class="font-extrabold text-xs text-slatebrand-900 uppercase tracking-wide">${title}</h3>
                </div>
                <div class="grid grid-cols-1 gap-2">
        `;

        section.members.forEach(member => {
            const name = isNe ? member.nameNe : member.nameEn;
            const role = isNe ? member.roleNe : member.roleEn;
            const badge = isNe ? member.badgeNe : member.badgeEn;

            html += `
                <div class="p-3 rounded-2xl bg-white border border-parchment-300 shadow-xs flex items-start gap-3 transition hover:border-emerald-400">
                    <div class="w-10 h-10 rounded-2xl bg-parchment-100 border border-parchment-300 flex items-center justify-center text-xl shrink-0 shadow-inner">
                        ${member.avatar}
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-1.5 mb-0.5">
                            <h4 class="font-extrabold text-xs text-slatebrand-900 truncate">${name}</h4>
                            <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                                ${badge}
                            </span>
                        </div>
                        <p class="text-[11px] text-slate-600 leading-snug">${role}</p>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}
