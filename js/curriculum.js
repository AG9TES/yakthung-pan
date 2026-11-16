/**
 * Yakthung Pan • Authentic Sirijonga Curriculum Engine
 * Loads dynamic curriculum from data/curriculum.json (with offline defaults).
 * Dialect: Phedape Limbu (फेदापे याक्थुङ पान)
 */

let SIRIJONGA_25 = [
    {
        "id": "ka",
        "row": 1,
        "category": "Consonant",
        "char": "ᤁ",
        "latin": "Ka",
        "deva": "क",
        "devaBase": "क",
        "wordLimbu": "ᤁᤠᤶ",
        "wordLatin": "Kam",
        "meaning": "Friend / Companion",
        "emoji": "🤝",
        "freq": 261.6
    },
    {
        "id": "kha",
        "row": 1,
        "category": "Consonant",
        "char": "ᤂ",
        "latin": "Kha",
        "deva": "ख",
        "devaBase": "ख",
        "wordLimbu": "ᤂᤠᤶ",
        "wordLatin": "Kham",
        "meaning": "Soil / Earth",
        "emoji": "🌱",
        "freq": 277.2
    },
    {
        "id": "ga",
        "row": 1,
        "category": "Consonant",
        "char": "ᤃ",
        "latin": "Ga",
        "deva": "ग",
        "devaBase": "ग",
        "wordLimbu": "ᤃᤠᤶ",
        "wordLatin": "Gam",
        "meaning": "Step / Pace",
        "emoji": "👣",
        "freq": 293.7
    },
    {
        "id": "nga",
        "row": 1,
        "category": "Consonant",
        "char": "ᤅ",
        "latin": "Nga",
        "deva": "ङ",
        "devaBase": "ङ",
        "wordLimbu": "ᤅᤠ",
        "wordLatin": "Nga",
        "meaning": "Fish",
        "emoji": "🐟",
        "freq": 311.1
    },
    {
        "id": "cha",
        "row": 2,
        "category": "Consonant",
        "char": "ᤆ",
        "latin": "Cha",
        "deva": "च",
        "devaBase": "च",
        "wordLimbu": "ᤆᤠ",
        "wordLatin": "Cha",
        "meaning": "Food / Rice",
        "emoji": "🍚",
        "freq": 329.6
    },
    {
        "id": "chha",
        "row": 2,
        "category": "Consonant",
        "char": "ᤇ",
        "latin": "Chha",
        "deva": "छ/झ",
        "devaBase": "छ",
        "wordLimbu": "ᤇᤠᤱ",
        "wordLatin": "Chhang",
        "meaning": "Child / Offspring",
        "emoji": "🧒",
        "freq": 349.2
    },
    {
        "id": "ja",
        "row": 2,
        "category": "Consonant",
        "char": "ᤈ",
        "latin": "Ja",
        "deva": "ज",
        "devaBase": "ज",
        "wordLimbu": "ᤈᤠᤶ",
        "wordLatin": "Jam",
        "meaning": "Cooked Grain",
        "emoji": "🌾",
        "freq": 370
    },
    {
        "id": "na",
        "row": 2,
        "category": "Consonant",
        "char": "ᤏ",
        "latin": "Na",
        "deva": "न/ण",
        "devaBase": "न",
        "wordLimbu": "ᤏᤠᤶ",
        "wordLatin": "Nam",
        "meaning": "Sun / Sunshine",
        "emoji": "☀️",
        "freq": 392
    },
    {
        "id": "ta",
        "row": 3,
        "category": "Consonant",
        "char": "ᤋ",
        "latin": "Ta",
        "deva": "त/ट",
        "devaBase": "त",
        "wordLimbu": "ᤋᤠᤱ",
        "wordLatin": "Tang",
        "meaning": "Horn / Peak",
        "emoji": "🏔️",
        "freq": 415.3
    },
    {
        "id": "tha",
        "row": 3,
        "category": "Consonant",
        "char": "ᤌ",
        "latin": "Tha",
        "deva": "थ/ठ",
        "devaBase": "थ",
        "wordLimbu": "ᤌᤠᤱ",
        "wordLatin": "Thang",
        "meaning": "Upward / Hill",
        "emoji": "⛰️",
        "freq": 440
    },
    {
        "id": "da",
        "row": 3,
        "category": "Consonant",
        "char": "ᤍ",
        "latin": "Da",
        "deva": "द/ड",
        "devaBase": "द",
        "wordLimbu": "ᤍᤠᤱ",
        "wordLatin": "Dang",
        "meaning": "Pillar / Post",
        "emoji": "🪵",
        "freq": 466.2
    },
    {
        "id": "dha",
        "row": 3,
        "category": "Consonant",
        "char": "ᤎ",
        "latin": "Dha",
        "deva": "ध/ढ",
        "devaBase": "ध",
        "wordLimbu": "ᤎᤠᤏ",
        "wordLatin": "Dhan",
        "meaning": "Harvest / Paddy",
        "emoji": "🌿",
        "freq": 493.9
    },
    {
        "id": "pa",
        "row": 4,
        "category": "Consonant",
        "char": "ᤐ",
        "latin": "Pa",
        "deva": "प",
        "devaBase": "प",
        "wordLimbu": "ᤐᤠᤴ",
        "wordLatin": "Pan",
        "meaning": "Language / Speech",
        "emoji": "🗣️",
        "freq": 523.3
    },
    {
        "id": "pha",
        "row": 4,
        "category": "Consonant",
        "char": "ᤑ",
        "latin": "Pha",
        "deva": "फ",
        "devaBase": "फ",
        "wordLimbu": "ᤑᤢᤱ",
        "wordLatin": "Phung",
        "meaning": "Flower / Blossom",
        "emoji": "🌺",
        "freq": 554.4
    },
    {
        "id": "ba",
        "row": 4,
        "category": "Consonant",
        "char": "ᤒ",
        "latin": "Ba",
        "deva": "ब",
        "devaBase": "ब",
        "wordLimbu": "ᤒᤠᤖᤡ",
        "wordLatin": "Bari",
        "meaning": "Garden / Orchard",
        "emoji": "🏡",
        "freq": 587.3
    },
    {
        "id": "bha",
        "row": 4,
        "category": "Consonant",
        "char": "ᤓ",
        "latin": "Bha",
        "deva": "भ",
        "devaBase": "भ",
        "wordLimbu": "ᤓᤠᤗᤣ",
        "wordLatin": "Bhale",
        "meaning": "Rooster",
        "emoji": "🐓",
        "freq": 622.3
    },
    {
        "id": "ma",
        "row": 5,
        "category": "Consonant",
        "char": "ᤔ",
        "latin": "Ma",
        "deva": "म",
        "devaBase": "म",
        "wordLimbu": "ᤔᤠᤱ",
        "wordLatin": "Mang",
        "meaning": "Deity / Spirit",
        "emoji": "🪔",
        "freq": 659.3
    },
    {
        "id": "ya",
        "row": 5,
        "category": "Consonant",
        "char": "ᤕ",
        "latin": "Ya",
        "deva": "य",
        "devaBase": "य",
        "wordLimbu": "ᤕᤰᤌᤢᤱ",
        "wordLatin": "Yakthung",
        "meaning": "Limbu / Hill Hero",
        "emoji": "🏹",
        "freq": 698.5
    },
    {
        "id": "ra",
        "row": 5,
        "category": "Consonant",
        "char": "ᤖ",
        "latin": "Ra",
        "deva": "र",
        "devaBase": "र",
        "wordLimbu": "ᤖᤠᤶ",
        "wordLatin": "Ram",
        "meaning": "Strength / Grace",
        "emoji": "✨",
        "freq": 740
    },
    {
        "id": "la",
        "row": 5,
        "category": "Consonant",
        "char": "ᤗ",
        "latin": "La",
        "deva": "ल",
        "devaBase": "ल",
        "wordLimbu": "ᤗᤠᤒᤠ",
        "wordLatin": "Laba",
        "meaning": "Moon",
        "emoji": "🌙",
        "freq": 784
    },
    {
        "id": "wa",
        "row": 6,
        "category": "Consonant",
        "char": "ᤘ",
        "latin": "Wa",
        "deva": "व",
        "devaBase": "व",
        "wordLimbu": "ᤘᤠ",
        "wordLatin": "Wa",
        "meaning": "Water / Stream",
        "emoji": "💧",
        "freq": 830.6
    },
    {
        "id": "sha",
        "row": 6,
        "category": "Consonant",
        "char": "ᤙ",
        "latin": "Sha",
        "deva": "श",
        "devaBase": "श",
        "wordLimbu": "ᤙᤠ",
        "wordLatin": "Sha",
        "meaning": "Meat / Feast",
        "emoji": "🍲",
        "freq": 880
    },
    {
        "id": "sa",
        "row": 6,
        "category": "Consonant",
        "char": "ᤛ",
        "latin": "Sa",
        "deva": "स",
        "devaBase": "स",
        "wordLimbu": "ᤛᤣᤘᤠᤖᤥ",
        "wordLatin": "Sewaro",
        "meaning": "Salutation / Hello",
        "emoji": "🙏",
        "freq": 932.3
    },
    {
        "id": "ha",
        "row": 6,
        "category": "Consonant",
        "char": "ᤜ",
        "latin": "Ha",
        "deva": "ह",
        "devaBase": "ह",
        "wordLimbu": "ᤜᤠᤱ",
        "wordLatin": "Hang",
        "meaning": "King / Sovereign",
        "emoji": "👑",
        "freq": 987.8
    },
    {
        "id": "gha",
        "row": 7,
        "category": "Consonant",
        "char": "ᤄ",
        "latin": "Gha",
        "deva": "घ",
        "devaBase": "घ",
        "wordLimbu": "ᤄᤠᤶ",
        "wordLatin": "Gham",
        "meaning": "Warmth / Glow",
        "emoji": "🔥",
        "freq": 1046.5
    }
];

let KUBUNG_VOWELS_9 = [
    {
        "id": "v_a",
        "row": 1,
        "category": "Vowel",
        "char": "ᤀ",
        "latin": "A",
        "deva": "अ",
        "devaBase": "अ",
        "wordLimbu": "ᤀᤱᤃᤠ",
        "wordLatin": "Anga",
        "meaning": "I / Me",
        "emoji": "🙋",
        "freq": 293.7
    },
    {
        "id": "v_aa",
        "row": 1,
        "category": "Vowel",
        "char": "ᤀᤠ",
        "latin": "Aa",
        "deva": "आ",
        "devaBase": "आ",
        "wordLimbu": "ᤀᤠᤶᤒᤠ",
        "wordLatin": "Amba",
        "meaning": "Father",
        "emoji": "👨",
        "freq": 329.6
    },
    {
        "id": "v_i",
        "row": 1,
        "category": "Vowel",
        "char": "ᤀᤡ",
        "latin": "I",
        "deva": "इ",
        "devaBase": "इ",
        "wordLimbu": "ᤀᤡᤶ",
        "wordLatin": "Im",
        "meaning": "Sleep / Rest",
        "emoji": "😴",
        "freq": 349.2
    },
    {
        "id": "v_u",
        "row": 2,
        "category": "Vowel",
        "char": "ᤀᤢ",
        "latin": "U",
        "deva": "उ",
        "devaBase": "उ",
        "wordLimbu": "ᤀᤢᤶ",
        "wordLatin": "Um",
        "meaning": "Sweet / Honey",
        "emoji": "🍯",
        "freq": 392
    },
    {
        "id": "v_e",
        "row": 2,
        "category": "Vowel",
        "char": "ᤀᤣ",
        "latin": "E",
        "deva": "ए",
        "devaBase": "ए",
        "wordLimbu": "ᤀᤣᤰ",
        "wordLatin": "Ek",
        "meaning": "Back / Spine",
        "emoji": "🦴",
        "freq": 440
    },
    {
        "id": "v_ai",
        "row": 2,
        "category": "Vowel",
        "char": "ᤀᤤ",
        "latin": "Ai",
        "deva": "ऐ",
        "devaBase": "ऐ",
        "wordLimbu": "ᤀᤤᤴ",
        "wordLatin": "Ain",
        "meaning": "Today / Now",
        "emoji": "📅",
        "freq": 493.9
    },
    {
        "id": "v_o",
        "row": 3,
        "category": "Vowel",
        "char": "ᤀᤥ",
        "latin": "O",
        "deva": "ओ",
        "devaBase": "ओ",
        "wordLimbu": "ᤀᤥᤰ",
        "wordLatin": "Ok",
        "meaning": "Crow / Call",
        "emoji": "🐦",
        "freq": 523.3
    },
    {
        "id": "v_au",
        "row": 3,
        "category": "Vowel",
        "char": "ᤀᤦ",
        "latin": "Au",
        "deva": "औ",
        "devaBase": "औ",
        "wordLimbu": "ᤀᤦᤱ",
        "wordLatin": "Aung",
        "meaning": "Horse / Steed",
        "emoji": "🐎",
        "freq": 587.3
    },
    {
        "id": "v_ae",
        "row": 3,
        "category": "Vowel",
        "char": "ᤀᤧ",
        "latin": "Ae",
        "deva": "ए़",
        "devaBase": "ए",
        "wordLimbu": "ᤀᤧᤴ",
        "wordLatin": "Aen",
        "meaning": "Song / Melody",
        "emoji": "🎶",
        "freq": 659.3
    }
];

let SAKNAM_8_LETTERS = [
    {
        "id": "m_aa",
        "char": "ᤠ",
        "latin": "Aa",
        "deva": "ा",
        "devaBase": "आम्मा",
        "pronounce": "Amma",
        "category": "Saknam-sak Matra",
        "nepaliMatra": "ा-आकार",
        "limbuMatraDeva": "आम्मा",
        "limbuMatra": "ᤠ आम्मा",
        "matraName": "Amma (आम्मा)",
        "wordLimbu": "ᤀᤠ",
        "wordLatin": "Amma",
        "meaning": "ा-आकार ➔ ᤠ आम्मा",
        "emoji": "✍️",
        "freq": 261.6
    },
    {
        "id": "m_i",
        "char": "ᤡ",
        "latin": "I",
        "deva": "ि",
        "devaBase": "इक्सु",
        "pronounce": "Iksu",
        "category": "Saknam-sak Matra",
        "nepaliMatra": "ि-इकार",
        "limbuMatraDeva": "इक्सु",
        "limbuMatra": "ᤡ इक्सु",
        "matraName": "Iksu (इक्सु)",
        "wordLimbu": "ᤀᤡ",
        "wordLatin": "Iksu",
        "meaning": "ि-इकार ➔ ᤡ इक्सु",
        "emoji": "✍️",
        "freq": 293.7
    },
    {
        "id": "m_u",
        "char": "ᤢ",
        "latin": "U",
        "deva": "ु",
        "devaBase": "उक्सु",
        "pronounce": "Uksu",
        "category": "Saknam-sak Matra",
        "nepaliMatra": "ु-उकार",
        "limbuMatraDeva": "उक्सु",
        "limbuMatra": "ᤢ उक्सु",
        "matraName": "Uksu (उक्सु)",
        "wordLimbu": "ᤀᤢ",
        "wordLatin": "Uksu",
        "meaning": "ु-उकार ➔ ᤢ उक्सु",
        "emoji": "✍️",
        "freq": 329.6
    },
    {
        "id": "m_e",
        "char": "ᤣ",
        "latin": "E",
        "deva": "े",
        "devaBase": "एत्तु",
        "pronounce": "Ettu",
        "category": "Saknam-sak Matra",
        "nepaliMatra": "े-एकार",
        "limbuMatraDeva": "एत्तु",
        "limbuMatra": "ᤣ एत्तु",
        "matraName": "Ettu (एत्तु)",
        "wordLimbu": "ᤀᤣ",
        "wordLatin": "Ettu",
        "meaning": "े-एकार ➔ ᤣ एत्तु",
        "emoji": "✍️",
        "freq": 349.2
    },
    {
        "id": "m_ai",
        "char": "ᤤ",
        "latin": "Ai",
        "deva": "ै",
        "devaBase": "ऐनु",
        "pronounce": "Ainu",
        "category": "Saknam-sak Matra",
        "nepaliMatra": "ै-ऐकार",
        "limbuMatraDeva": "ऐनु",
        "limbuMatra": "ᤤ ऐनु",
        "matraName": "Ainu (ऐनु)",
        "wordLimbu": "ᤀᤤ",
        "wordLatin": "Ainu",
        "meaning": "ै-ऐकार ➔ ᤤ ऐनु",
        "emoji": "✍️",
        "freq": 392.0
    },
    {
        "id": "m_o",
        "char": "ᤥ",
        "latin": "O",
        "deva": "ो",
        "devaBase": "तुमो",
        "pronounce": "Tumo",
        "category": "Saknam-sak Matra",
        "nepaliMatra": "ो-ओकार",
        "limbuMatraDeva": "तुमो",
        "limbuMatra": "ᤥ तुमो",
        "matraName": "Tumo (तुमो)",
        "wordLimbu": "ᤀᤥ",
        "wordLatin": "Tumo",
        "meaning": "ो-ओकार ➔ ᤥ तुमो",
        "emoji": "✍️",
        "freq": 440.0
    },
    {
        "id": "m_au",
        "char": "ᤦ",
        "latin": "Au",
        "deva": "ौ",
        "devaBase": "तुम्बो",
        "pronounce": "Tumbo",
        "category": "Saknam-sak Matra",
        "nepaliMatra": "ौ-औकार",
        "limbuMatraDeva": "तुम्बो",
        "limbuMatra": "ᤦ तुम्बो",
        "matraName": "Tumbo (तुम्बो)",
        "wordLimbu": "ᤀᤦ",
        "wordLatin": "Tumbo",
        "meaning": "ौ-औकार ➔ ᤦ तुम्बो",
        "emoji": "✍️",
        "freq": 493.9
    },
    {
        "id": "m_ae",
        "char": "ᤧ",
        "latin": "Ae",
        "deva": "े़",
        "devaBase": "पेच्व",
        "pronounce": "Pechwa",
        "category": "Saknam-sak Matra",
        "nepaliMatra": "े़-ए़कार",
        "limbuMatraDeva": "पेच्व",
        "limbuMatra": "ᤧ पेच्व",
        "matraName": "Pechwa (पेच्व)",
        "wordLimbu": "ᤀᤧ",
        "wordLatin": "Pechwa",
        "meaning": "े़-ए़कार ➔ ᤧ पेच्व",
        "emoji": "✍️",
        "freq": 523.25
    }
];

let KHANIN_NUMBERS = [
    {
        "id": "num_0",
        "row": 1,
        "category": "Numeral (0)",
        "char": "᥆",
        "latin": "0",
        "deva": "०",
        "devaBase": "शून्य",
        "wordLimbu": "ᤌᤡᤵ",
        "wordLatin": "Thip",
        "meaning": "Zero (0)",
        "emoji": "0️⃣",
        "freq": 261.6
    },
    {
        "id": "num_1",
        "row": 1,
        "category": "Numeral (1)",
        "char": "᥇",
        "latin": "1",
        "deva": "१",
        "devaBase": "एक",
        "wordLimbu": "ᤌᤡᤰ",
        "wordLatin": "Thik",
        "meaning": "One (1)",
        "emoji": "1️⃣",
        "freq": 293.7
    },
    {
        "id": "num_2",
        "row": 1,
        "category": "Numeral (2)",
        "char": "᥈",
        "latin": "2",
        "deva": "२",
        "devaBase": "दुई",
        "wordLimbu": "ᤏᤣᤳ",
        "wordLatin": "Net",
        "meaning": "Two (2)",
        "emoji": "2️⃣",
        "freq": 329.6
    },
    {
        "id": "num_3",
        "row": 1,
        "category": "Numeral (3)",
        "char": "᥉",
        "latin": "3",
        "deva": "३",
        "devaBase": "तीन",
        "wordLimbu": "ᤛᤢᤶ",
        "wordLatin": "Sum",
        "meaning": "Three (3)",
        "emoji": "3️⃣",
        "freq": 349.2
    },
    {
        "id": "num_4",
        "row": 1,
        "category": "Numeral (4)",
        "char": "᥊",
        "latin": "4",
        "deva": "४",
        "devaBase": "चार",
        "wordLimbu": "ᤗᤡ",
        "wordLatin": "Li",
        "meaning": "Four (4)",
        "emoji": "4️⃣",
        "freq": 392
    },
    {
        "id": "num_5",
        "row": 1,
        "category": "Numeral (5)",
        "char": "᥋",
        "latin": "5",
        "deva": "५",
        "devaBase": "पाँच",
        "wordLimbu": "ᤅᤠ",
        "wordLatin": "Nga",
        "meaning": "Five (5)",
        "emoji": "5️⃣",
        "freq": 440
    },
    {
        "id": "num_6",
        "row": 2,
        "category": "Numeral (6)",
        "char": "᥌",
        "latin": "6",
        "deva": "६",
        "devaBase": "छ",
        "wordLimbu": "ᤋᤢᤰ",
        "wordLatin": "Tuk",
        "meaning": "Six (6)",
        "emoji": "6️⃣",
        "freq": 493.9
    },
    {
        "id": "num_7",
        "row": 2,
        "category": "Numeral (7)",
        "char": "᥍",
        "latin": "7",
        "deva": "७",
        "devaBase": "सात",
        "wordLimbu": "ᤏᤢᤳ",
        "wordLatin": "Nut",
        "meaning": "Seven (7)",
        "emoji": "7️⃣",
        "freq": 523.3
    },
    {
        "id": "num_8",
        "row": 2,
        "category": "Numeral (8)",
        "char": "᥎",
        "latin": "8",
        "deva": "८",
        "devaBase": "आठ",
        "wordLimbu": "ᤕᤣᤳ",
        "wordLatin": "Yet",
        "meaning": "Eight (8)",
        "emoji": "8️⃣",
        "freq": 587.3
    },
    {
        "id": "num_9",
        "row": 2,
        "category": "Numeral (9)",
        "char": "᥏",
        "latin": "9",
        "deva": "९",
        "devaBase": "नौ",
        "wordLimbu": "ᤑᤠᤱ",
        "wordLatin": "Phang",
        "meaning": "Nine (9)",
        "emoji": "9️⃣",
        "freq": 659.3
    },
    {
        "id": "num_10",
        "row": 2,
        "category": "Numeral (10)",
        "char": "᥇᥆",
        "latin": "10",
        "deva": "१०",
        "devaBase": "दस",
        "wordLimbu": "ᤌᤡᤒᤢᤱ",
        "wordLatin": "Thiboong",
        "meaning": "Ten (10)",
        "emoji": "🔟",
        "freq": 784
    }
];

let CHUK_7_LETTERS = [
    {
        "id": "c_k",
        "char": "ᤰ",
        "latin": "Chuk-k",
        "deva": "क्",
        "devaBase": "क",
        "fullLetter": "ᤁ",
        "fullDeva": "क",
        "fontKey": "Z = ट",
        "category": "Chuk-sak Half Letter",
        "nepaliMatra": "क (Ka)",
        "limbuMatra": "ᤰ चुक् (क्) आधा अक्षर",
        "matraName": "Chuk-k (क्)",
        "wordLimbu": "ᤕᤰ",
        "wordLatin": "Yak",
        "meaning": "ᤁ (क) ➔ ᤰ (क्) आधा अक्षर",
        "emoji": "✍️",
        "freq": 300.0
    },
    {
        "id": "c_ng",
        "char": "ᤱ",
        "latin": "Chuk-ng",
        "deva": "ङ्",
        "devaBase": "ङ",
        "fullLetter": "ᤅ",
        "fullDeva": "ङ",
        "fontKey": "उ° = ०",
        "category": "Chuk-sak Half Letter",
        "nepaliMatra": "ङ (Nga)",
        "limbuMatra": "ᤱ चुक् (ङ्) आधा अक्षर",
        "matraName": "Chuk-ng (ङ्)",
        "wordLimbu": "ᤌᤢᤱ",
        "wordLatin": "Thung",
        "meaning": "ᤅ (ङ) ➔ ᤱ (ङ्) आधा अक्षर",
        "emoji": "✍️",
        "freq": 320.0
    },
    {
        "id": "c_t",
        "char": "ᤳ",
        "latin": "Chuk-t",
        "deva": "त्",
        "devaBase": "त",
        "fullLetter": "ᤋ",
        "fullDeva": "त",
        "fontKey": "३ = ⌒",
        "category": "Chuk-sak Half Letter",
        "nepaliMatra": "त (Ta)",
        "limbuMatra": "ᤳ चुक् (त्) आधा अक्षर",
        "matraName": "Chuk-t (त्)",
        "wordLimbu": "ᤕᤳ",
        "wordLatin": "Yat",
        "meaning": "ᤋ (त) ➔ ᤳ (त्) आधा अक्षर",
        "emoji": "✍️",
        "freq": 340.0
    },
    {
        "id": "c_p",
        "char": "ᤵ",
        "latin": "Chuk-p",
        "deva": "प्",
        "devaBase": "प",
        "fullLetter": "ᤐ",
        "fullDeva": "प",
        "fontKey": "w = ч",
        "category": "Chuk-sak Half Letter",
        "nepaliMatra": "प (Pa)",
        "limbuMatra": "ᤵ चुक् (प्) आधा अक्षर",
        "matraName": "Chuk-p (प्)",
        "wordLimbu": "ᤌᤢᤵ",
        "wordLatin": "Thup",
        "meaning": "ᤐ (प) ➔ ᤵ (प्) आधा अक्षर",
        "emoji": "✍️",
        "freq": 360.0
    },
    {
        "id": "c_m",
        "char": "ᤶ",
        "latin": "Chuk-m",
        "deva": "म्",
        "devaBase": "म",
        "fullLetter": "ᤔ",
        "fullDeva": "म",
        "fontKey": "य = ५",
        "category": "Chuk-sak Half Letter",
        "nepaliMatra": "म (Ma)",
        "limbuMatra": "ᤶ चुक् (म्) आधा अक्षर",
        "matraName": "Chuk-m (म्)",
        "wordLimbu": "ᤕᤶ",
        "wordLatin": "Yam",
        "meaning": "ᤔ (म) ➔ ᤶ (म्) आधा अक्षर",
        "emoji": "✍️",
        "freq": 380.0
    },
    {
        "id": "c_r",
        "char": "ᤷ",
        "latin": "Chuk-r",
        "deva": "र्",
        "devaBase": "र",
        "fullLetter": "ᤖ",
        "fullDeva": "र",
        "fontKey": "र = ,",
        "category": "Chuk-sak Half Letter",
        "nepaliMatra": "र (Ra)",
        "limbuMatra": "ᤷ चुक् (र्) आधा अक्षर",
        "matraName": "Chuk-r (र्)",
        "wordLimbu": "ᤌᤢᤷ",
        "wordLatin": "Thur",
        "meaning": "ᤖ (र) ➔ ᤷ (र्) आधा अक्षर",
        "emoji": "✍️",
        "freq": 400.0
    },
    {
        "id": "c_l",
        "char": "ᤸ",
        "latin": "Chuk-l",
        "deva": "ल्",
        "devaBase": "ल",
        "fullLetter": "ᤗ",
        "fullDeva": "ल",
        "fontKey": "u = प",
        "category": "Chuk-sak Half Letter",
        "nepaliMatra": "ल (La)",
        "limbuMatra": "ᤸ चुक् (ल्) आधा अक्षर",
        "matraName": "Chuk-l (ल्)",
        "wordLimbu": "ᤐᤸ",
        "wordLatin": "Pal",
        "meaning": "ᤗ (ल) ➔ ᤸ (ल्) आधा अक्षर",
        "emoji": "✍️",
        "freq": 420.0
    }
];

let ALL_TRACEABLE_ITEMS = [...SIRIJONGA_25, ...KUBUNG_VOWELS_9, ...SAKNAM_8_LETTERS, ...CHUK_7_LETTERS, ...KHANIN_NUMBERS];
let ALL_25_CONSONANT_IDS = SIRIJONGA_25.map(c => c.id);

let NAUKHARI_FORMS = [
    {
        "name": "Inherent",
        "limbuMatra": "",
        "devaMatra": "",
        "latinSuffix": "a",
        "toneOffset": 0
    },
    {
        "name": "Amma",
        "limbuMatra": "ᤠ",
        "devaMatra": "ा",
        "latinSuffix": "aa",
        "toneOffset": 40
    },
    {
        "name": "Iksu",
        "limbuMatra": "ᤡ",
        "devaMatra": "ि",
        "latinSuffix": "i",
        "toneOffset": 80
    },
    {
        "name": "Uksu",
        "limbuMatra": "ᤢ",
        "devaMatra": "ु",
        "latinSuffix": "u",
        "toneOffset": 120
    },
    {
        "name": "Ettu",
        "limbuMatra": "ᤣ",
        "devaMatra": "े",
        "latinSuffix": "e",
        "toneOffset": 160
    },
    {
        "name": "Ainu",
        "limbuMatra": "ᤤ",
        "devaMatra": "ै",
        "latinSuffix": "ai",
        "toneOffset": 200
    },
    {
        "name": "Tumo",
        "limbuMatra": "ᤥ",
        "devaMatra": "ो",
        "latinSuffix": "o",
        "toneOffset": 240
    },
    {
        "name": "Tumbo",
        "limbuMatra": "ᤦ",
        "devaMatra": "ौ",
        "latinSuffix": "au",
        "toneOffset": 280
    },
    {
        "name": "Pechwa",
        "limbuMatra": "ᤧ",
        "devaMatra": "े़",
        "latinSuffix": "ae",
        "toneOffset": 320
    }
];

let SAKNAM_MATRAS = [
    {
        "name": "Amma (आम्मा)",
        "nepali": "ा - आकार",
        "demo": "ᤁᤠ",
        "latin": "Kaa",
        "deva": "का"
    },
    {
        "name": "Iksu (इक्सु)",
        "nepali": "ि - इकार",
        "demo": "ᤁᤡ",
        "latin": "Ki",
        "deva": "कि"
    },
    {
        "name": "Uksu (उक्सु)",
        "nepali": "ु - उकार",
        "demo": "ᤁᤢ",
        "latin": "Ku",
        "deva": "कु"
    },
    {
        "name": "Ettu (एत्तु)",
        "nepali": "े - एकार",
        "demo": "ᤁᤣ",
        "latin": "Ke",
        "deva": "के"
    },
    {
        "name": "Ainu (ऐनु)",
        "nepali": "ै - ऐकार",
        "demo": "ᤁᤤ",
        "latin": "Kai",
        "deva": "कै"
    },
    {
        "name": "Tumo (तुमो)",
        "nepali": "ो - ओकार",
        "demo": "ᤁᤥ",
        "latin": "Ko",
        "deva": "को"
    },
    {
        "name": "Tumbo (तुम्बो)",
        "nepali": "ौ - औकार",
        "demo": "ᤁᤦ",
        "latin": "Kau",
        "deva": "कौ"
    },
    {
        "name": "Pechwa (पेच्व)",
        "nepali": "े़ - ए़कार",
        "demo": "ᤁᤧ",
        "latin": "Kae",
        "deva": "के़"
    }
];

let CHUK_FINALS = [
    {
        "demo": "ᤁᤰ",
        "sound": "-क् (-k)"
    },
    {
        "demo": "ᤁᤱ",
        "sound": "-ङ् (-ng)"
    },
    {
        "demo": "ᤁᤳ",
        "sound": "-त् (-t)"
    },
    {
        "demo": "ᤁᤵ",
        "sound": "-प् (-p)"
    },
    {
        "demo": "ᤁᤶ",
        "sound": "-म् (-m)"
    },
    {
        "demo": "ᤁᤷ",
        "sound": "-र् (-r)"
    },
    {
        "demo": "ᤁᤸ",
        "sound": "-ल् (-l)"
    }
];

let EKTUM_CONJUNCTS = [
    {
        "name": "Ektum-ya (ᤩ)",
        "demo": "ᤁᤩᤠ",
        "meaning": "Subjoined -ya cluster (e.g., Kya / Chya)"
    },
    {
        "name": "Ektum-ra (ᤪ)",
        "demo": "ᤁᤪᤠ",
        "meaning": "Subjoined -ra cluster (e.g., Kra / Pra)"
    },
    {
        "name": "Ektum-wa (ᤫ)",
        "demo": "ᤁᤫᤠ",
        "meaning": "Subjoined -wa cluster (e.g., Kwa / Chwa)"
    }
];

let KUSEK_MARKS = [
    {
        "name": "Muphreng (᤹)",
        "demo": "ᤁ᤹",
        "meaning": "Glottal stop / abrupt check sound"
    },
    {
        "name": "Kemphreng (᤺)",
        "demo": "ᤁᤠ᤺",
        "meaning": "Vowel lengthening / sustained tone"
    },
    {
        "name": "Sa-i (᤻)",
        "demo": "ᤁ᤻",
        "meaning": "Halanta / pure consonant killer mark"
    }
];

let CHUK_LEVEL_13_1_ITEMS = [
    {
        "id": "chuk_k",
        "badge": "✨ Chuk-sak 1/7 • Final -k (-क्)",
        "instruction": "Identify the Subjoined Final -k attached to Ka: ᤁᤰ",
        "targetDeva": "-क् (-k)",
        "targetLatin": "Ka + Final -k (ᤁᤰ)",
        "ruleTitle": "Chuk-sak Ka (ᤰ) • Final -k",
        "ruleDesc": "Attaches to consonant as terminal -k (e.g., 'Yak' ᤕᤰ in Yakthung). Sirijonga font key: Z = ट / ᤰ.",
        "answer": "ᤁᤰ",
        "options": [
            {
                "limbu": "ᤁᤰ",
                "label": "ᤁᤰ (-क् / -k)"
            },
            {
                "limbu": "ᤁᤱ",
                "label": "ᤁᤱ (-ङ् / -ng)"
            },
            {
                "limbu": "ᤁᤳ",
                "label": "ᤁᤳ (-त् / -t)"
            },
            {
                "limbu": "ᤁᤵ",
                "label": "ᤁᤵ (-प् / -p)"
            }
        ]
    },
    {
        "id": "chuk_ng",
        "badge": "✨ Chuk-sak 2/7 • Final -ng (-ङ्)",
        "instruction": "Identify the Subjoined Final -ng attached to Ka: ᤁᤱ",
        "targetDeva": "-ङ् (-ng)",
        "targetLatin": "Ka + Final -ng (ᤁᤱ)",
        "ruleTitle": "Chuk-sak Nga (ᤱ) • Final -ng",
        "ruleDesc": "Attaches above consonant as terminal -ng nasal dot (e.g., 'Thung' ᤌᤢᤱ in Yakthung). Sirijonga font key: उ° = ० / ᤱ.",
        "answer": "ᤁᤱ",
        "options": [
            {
                "limbu": "ᤁᤱ",
                "label": "ᤁᤱ (-ङ् / -ng)"
            },
            {
                "limbu": "ᤁᤶ",
                "label": "ᤁᤶ (-म् / -m)"
            },
            {
                "limbu": "ᤁᤰ",
                "label": "ᤁᤰ (-क् / -k)"
            },
            {
                "limbu": "ᤁᤸ",
                "label": "ᤁᤸ (-ल् / -l)"
            }
        ]
    },
    {
        "id": "chuk_t",
        "badge": "✨ Chuk-sak 3/7 • Final -t (-त्)",
        "instruction": "Identify the Subjoined Final -t attached to Ka: ᤁᤳ",
        "targetDeva": "-त् (-t)",
        "targetLatin": "Ka + Final -t (ᤁᤳ)",
        "ruleTitle": "Chuk-sak Ta (ᤳ) • Final -t",
        "ruleDesc": "Attaches below consonant as bottom curve terminal -t (e.g., 'Net' ᤏᤣᤳ = Two). Sirijonga font key: ३ = ⌒ / ᤳ.",
        "answer": "ᤁᤳ",
        "options": [
            {
                "limbu": "ᤁᤳ",
                "label": "ᤁᤳ (-त् / -t)"
            },
            {
                "limbu": "ᤁᤰ",
                "label": "ᤁᤰ (-क् / -k)"
            },
            {
                "limbu": "ᤁᤵ",
                "label": "ᤁᤵ (-प् / -p)"
            },
            {
                "limbu": "ᤁᤷ",
                "label": "ᤁᤷ (-र् / -r)"
            }
        ]
    },
    {
        "id": "chuk_p",
        "badge": "✨ Chuk-sak 4/7 • Final -p (-प्)",
        "instruction": "Identify the Subjoined Final -p attached to Ka: ᤁᤵ",
        "targetDeva": "-प् (-p)",
        "targetLatin": "Ka + Final -p (ᤁᤵ)",
        "ruleTitle": "Chuk-sak Pa (ᤵ) • Final -p",
        "ruleDesc": "Attaches under the letter as terminal -p (e.g., 'Thip' ᤌᤡᤵ = Zero). Sirijonga font key: w = ч / ᤵ.",
        "answer": "ᤁᤵ",
        "options": [
            {
                "limbu": "ᤁᤵ",
                "label": "ᤁᤵ (-प् / -p)"
            },
            {
                "limbu": "ᤁᤶ",
                "label": "ᤁᤶ (-म् / -m)"
            },
            {
                "limbu": "ᤁᤱ",
                "label": "ᤁᤱ (-ङ् / -ng)"
            },
            {
                "limbu": "ᤁᤳ",
                "label": "ᤁᤳ (-त् / -t)"
            }
        ]
    },
    {
        "id": "chuk_m",
        "badge": "✨ Chuk-sak 5/7 • Final -m (-म्)",
        "instruction": "Identify the Subjoined Final -m attached to Ka: ᤁᤶ",
        "targetDeva": "-म् (-m)",
        "targetLatin": "Ka + Final -m (ᤁᤶ)",
        "ruleTitle": "Chuk-sak Ma (ᤶ) • Final -m",
        "ruleDesc": "Attaches under the letter as terminal -m (e.g., 'Kam' ᤁᤠᤶ = Friend). Sirijonga font key: य = ५ / ᤶ.",
        "answer": "ᤁᤶ",
        "options": [
            {
                "limbu": "ᤁᤶ",
                "label": "ᤁᤶ (-म् / -m)"
            },
            {
                "limbu": "ᤁᤱ",
                "label": "ᤁᤱ (-ङ् / -ng)"
            },
            {
                "limbu": "ᤁᤵ",
                "label": "ᤁᤵ (-प् / -p)"
            },
            {
                "limbu": "ᤁᤰ",
                "label": "ᤁᤰ (-क् / -k)"
            }
        ]
    },
    {
        "id": "chuk_r",
        "badge": "✨ Chuk-sak 6/7 • Final -r (-र्)",
        "instruction": "Identify the Subjoined Final -r attached to Ka: ᤁᤷ",
        "targetDeva": "-र् (-r)",
        "targetLatin": "Ka + Final -r (ᤁᤷ)",
        "ruleTitle": "Chuk-sak Ra (ᤷ) • Final -r",
        "ruleDesc": "Attaches under the stem as terminal -r in authentic Phedape pronunciation. Sirijonga font key: र = , / ᤷ.",
        "answer": "ᤁᤷ",
        "options": [
            {
                "limbu": "ᤁᤷ",
                "label": "ᤁᤷ (-र् / -r)"
            },
            {
                "limbu": "ᤁᤸ",
                "label": "ᤁᤸ (-ल् / -l)"
            },
            {
                "limbu": "ᤁᤳ",
                "label": "ᤁᤳ (-त् / -t)"
            },
            {
                "limbu": "ᤁᤱ",
                "label": "ᤁᤱ (-ङ् / -ng)"
            }
        ]
    },
    {
        "id": "chuk_l",
        "badge": "✨ Chuk-sak 7/7 • Final -l (-ल्)",
        "instruction": "Identify the Subjoined Final -l attached to Ka: ᤁᤸ",
        "targetDeva": "-ल् (-l)",
        "targetLatin": "Ka + Final -l (ᤁᤸ)",
        "ruleTitle": "Chuk-sak La (ᤸ) • Final -l",
        "ruleDesc": "Attaches to the bottom-right as terminal liquid consonant -l. Sirijonga font key: य = u / ᤸ.",
        "answer": "ᤁᤸ",
        "options": [
            {
                "limbu": "ᤁᤸ",
                "label": "ᤁᤸ (-ल् / -l)"
            },
            {
                "limbu": "ᤁᤷ",
                "label": "ᤁᤷ (-र् / -r)"
            },
            {
                "limbu": "ᤁᤰ",
                "label": "ᤁᤰ (-क् / -k)"
            },
            {
                "limbu": "ᤁᤳ",
                "label": "ᤁᤳ (-त् / -t)"
            }
        ]
    }
];

let MARKS_LEVEL_13_2_ITEMS = [
    {
        "id": "ektum_ya",
        "badge": "💫 Ektum-sak 1/6 • Conjunct -ya (एक्टुम-या)",
        "instruction": "Identify Subjoined -ya cluster: Ektum-ya (ᤩ)",
        "targetDeva": "क्या (Kya / Chya)",
        "targetLatin": "Ka + Ektum-ya (ᤩ) + Amma",
        "ruleTitle": "Ektum-ya (ᤩ) • Subjoined -ya Cluster",
        "ruleDesc": "Subjoined -ya cluster (e.g., Kya / Chya). Used in 'Chyabrung' (ᤆᤩᤠᤒᤪᤢᤱ).",
        "answer": "ᤁᤩᤠ",
        "options": [
            {
                "limbu": "ᤁᤩᤠ",
                "label": "ᤁᤩᤠ (Ektum-ya ᤩ)"
            },
            {
                "limbu": "ᤁᤪᤠ",
                "label": "ᤁᤪᤠ (Ektum-ra ᤪ)"
            },
            {
                "limbu": "ᤁᤫᤠ",
                "label": "ᤁᤫᤠ (Ektum-wa ᤫ)"
            },
            {
                "limbu": "ᤁᤠ",
                "label": "ᤁᤠ (Plain Amma)"
            }
        ]
    },
    {
        "id": "ektum_ra",
        "badge": "💫 Ektum-sak 2/6 • Conjunct -ra (एक्टुम-रा)",
        "instruction": "Identify Subjoined -ra cluster: Ektum-ra (ᤪ)",
        "targetDeva": "क्रा (Kra / Pra)",
        "targetLatin": "Ka + Ektum-ra (ᤪ) + Amma",
        "ruleTitle": "Ektum-ra (ᤪ) • Subjoined -ra Cluster",
        "ruleDesc": "Subjoined -ra cluster (e.g., Kra / Pra). Used in 'Chyabrung' (ᤆᤩᤠᤒᤪᤢᤱ).",
        "answer": "ᤁᤪᤠ",
        "options": [
            {
                "limbu": "ᤁᤪᤠ",
                "label": "ᤁᤪᤠ (Ektum-ra ᤪ)"
            },
            {
                "limbu": "ᤁᤩᤠ",
                "label": "ᤁᤩᤠ (Ektum-ya ᤩ)"
            },
            {
                "limbu": "ᤁᤫᤠ",
                "label": "ᤁᤫᤠ (Ektum-wa ᤫ)"
            },
            {
                "limbu": "ᤁᤠ",
                "label": "ᤁᤠ (Plain Amma)"
            }
        ]
    },
    {
        "id": "ektum_wa",
        "badge": "💫 Ektum-sak 3/6 • Conjunct -wa (एक्टुम-वा)",
        "instruction": "Identify Subjoined -wa cluster: Ektum-wa (ᤫ)",
        "targetDeva": "क्वा (Kwa / Chwa)",
        "targetLatin": "Ka + Ektum-wa (ᤫ) + Amma",
        "ruleTitle": "Ektum-wa (ᤫ) • Subjoined -wa Cluster",
        "ruleDesc": "Subjoined -wa cluster (e.g., Kwa / Chwa). Forms labialized consonant blends.",
        "answer": "ᤁᤫᤠ",
        "options": [
            {
                "limbu": "ᤁᤫᤠ",
                "label": "ᤁᤫᤠ (Ektum-wa ᤫ)"
            },
            {
                "limbu": "ᤁᤪᤠ",
                "label": "ᤁᤪᤠ (Ektum-ra ᤪ)"
            },
            {
                "limbu": "ᤁᤩᤠ",
                "label": "ᤁᤩᤠ (Ektum-ya ᤩ)"
            },
            {
                "limbu": "ᤁᤠ",
                "label": "ᤁᤠ (Plain Amma)"
            }
        ]
    },
    {
        "id": "mark_muphreng",
        "badge": "💫 Kusek-sak 4/6 • Muphreng Glottal Stop (मुफ्रेङ्)",
        "instruction": "Identify Glottal Stop Sound Mark: Muphreng (᤹)",
        "targetDeva": "कः (Kaʼ - Glottal Stop)",
        "targetLatin": "Ka + Muphreng (᤹)",
        "ruleTitle": "Muphreng (᤹) • Glottal Stop",
        "ruleDesc": "Glottal stop / abrupt check sound. Characteristic abrupt syllable cutoff in Limbu.",
        "answer": "ᤁ᤹",
        "options": [
            {
                "limbu": "ᤁ᤹",
                "label": "ᤁ᤹ (Muphreng ᤹)"
            },
            {
                "limbu": "ᤁᤠ᤺",
                "label": "ᤁᤠ᤺ (Kemphreng ᤺)"
            },
            {
                "limbu": "ᤁ᤻",
                "label": "ᤁ᤻ (Sa-i ᤻)"
            },
            {
                "limbu": "ᤁᤱ",
                "label": "ᤁᤱ (Chuk-ng ᤱ)"
            }
        ]
    },
    {
        "id": "mark_kemphreng",
        "badge": "💫 Kusek-sak 5/6 • Kemphreng Sustained Tone (केम्फ्रेङ्)",
        "instruction": "Identify Vowel Lengthening Mark: Kemphreng (᤺)",
        "targetDeva": "काː (Kaa: - Sustained Tone)",
        "targetLatin": "Ka + Amma + Kemphreng (᤺)",
        "ruleTitle": "Kemphreng (᤺) • Vowel Lengthening",
        "ruleDesc": "Vowel lengthening / sustained tone mark in spoken Yakthung Pan phonology.",
        "answer": "ᤁᤠ᤺",
        "options": [
            {
                "limbu": "ᤁᤠ᤺",
                "label": "ᤁᤠ᤺ (Kemphreng ᤺)"
            },
            {
                "limbu": "ᤁ᤹",
                "label": "ᤁ᤹ (Muphreng ᤹)"
            },
            {
                "limbu": "ᤁ᤻",
                "label": "ᤁ᤻ (Sa-i ᤻)"
            },
            {
                "limbu": "ᤁᤠ",
                "label": "ᤁᤠ (Amma ᤠ)"
            }
        ]
    },
    {
        "id": "mark_sai",
        "badge": "💫 Kusek-sak 6/6 • Sa-i Halanta Mark (स-इ)",
        "instruction": "Identify Halanta Pure Consonant Mark: Sa-i (᤻)",
        "targetDeva": "क् (K - Halanta)",
        "targetLatin": "Ka + Sa-i (᤻)",
        "ruleTitle": "Sa-i (᤻) • Pure Consonant Killer",
        "ruleDesc": "Halanta / pure consonant killer mark that eliminates the default inherent 'a' vowel.",
        "answer": "ᤁ᤻",
        "options": [
            {
                "limbu": "ᤁ᤻",
                "label": "ᤁ᤻ (Sa-i ᤻ Halanta)"
            },
            {
                "limbu": "ᤁ᤹",
                "label": "ᤁ᤹ (Muphreng ᤹)"
            },
            {
                "limbu": "ᤁᤠ᤺",
                "label": "ᤁᤠ᤺ (Kemphreng ᤺)"
            },
            {
                "limbu": "ᤁᤳ",
                "label": "ᤁᤳ (Chuk-t ᤳ)"
            }
        ]
    }
];

let EXTRA_LEVEL_13_1_ITEMS = CHUK_LEVEL_13_1_ITEMS;

let SAKNAM_LEVEL_14_ITEMS = [
    {
        "badge": "🔤 Saknam-sak • Amma (आकार)",
        "instruction": "Combine Ka + Amma Matra (आम्मा)",
        "targetDeva": "का (Kaa)",
        "targetLatin": "Ka + Amma (ᤠ)",
        "ruleTitle": "Ka (ᤁ) + Amma (ᤠ) = ᤁᤠ",
        "ruleDesc": "Amma attaches to the right of any consonant to produce the long \"aa\" sound.",
        "answer": "ᤁᤠ",
        "options": [
            {
                "limbu": "ᤁᤠ",
                "label": "Kaa (Amma ᤠ)"
            },
            {
                "limbu": "ᤁᤡ",
                "label": "Ki (Iksu ᤡ)"
            },
            {
                "limbu": "ᤁᤢ",
                "label": "Ku (Uksu ᤢ)"
            },
            {
                "limbu": "ᤁᤣ",
                "label": "Ke (Ettu ᤣ)"
            }
        ]
    },
    {
        "badge": "🔤 Saknam-sak • Iksu (इकार)",
        "instruction": "Combine Pa + Iksu Matra (इक्सु)",
        "targetDeva": "पि (Pi)",
        "targetLatin": "Pa + Iksu (ᤡ)",
        "ruleTitle": "Pa (ᤐ) + Iksu (ᤡ) = ᤐᤡ",
        "ruleDesc": "Iksu sits above the letter to produce the crisp \"i\" vowel.",
        "answer": "ᤐᤡ",
        "options": [
            {
                "limbu": "ᤐᤠ",
                "label": "Paa (Amma)"
            },
            {
                "limbu": "ᤐᤡ",
                "label": "Pi (Iksu ᤡ)"
            },
            {
                "limbu": "ᤐᤥ",
                "label": "Po (Tumo ᤥ)"
            },
            {
                "limbu": "ᤐᤧ",
                "label": "Pae (Pechwa ᤧ)"
            }
        ]
    },
    {
        "badge": "🔤 Saknam-sak • Uksu (उकार)",
        "instruction": "Combine Ma + Uksu Matra (उक्सु)",
        "targetDeva": "मु (Mu)",
        "targetLatin": "Ma + Uksu (ᤢ)",
        "ruleTitle": "Ma (ᤔ) + Uksu (ᤢ) = ᤔᤢ",
        "ruleDesc": "Uksu loops underneath the stem to produce the \"u\" vowel sound.",
        "answer": "ᤔᤢ",
        "options": [
            {
                "limbu": "ᤔᤣ",
                "label": "Me (Ettu ᤣ)"
            },
            {
                "limbu": "ᤔᤤ",
                "label": "Mai (Ainu ᤤ)"
            },
            {
                "limbu": "ᤔᤢ",
                "label": "Mu (Uksu ᤢ)"
            },
            {
                "limbu": "ᤔᤦ",
                "label": "Mau (Tumbo ᤦ)"
            }
        ]
    },
    {
        "badge": "🔤 Saknam-sak • Ettu (एकार)",
        "instruction": "Combine Sa + Ettu Matra (एत्तु)",
        "targetDeva": "से (Se)",
        "targetLatin": "Sa + Ettu (ᤣ)",
        "ruleTitle": "Sa (ᤛ) + Ettu (ᤣ) = ᤛᤣ",
        "ruleDesc": "First syllable of the sacred Phedape greeting \"Sewaro\" (ᤛᤣᤘᤠᤖᤥ).",
        "answer": "ᤛᤣ",
        "options": [
            {
                "limbu": "ᤛᤣ",
                "label": "Se (Ettu ᤣ)"
            },
            {
                "limbu": "ᤛᤤ",
                "label": "Sai (Ainu ᤤ)"
            },
            {
                "limbu": "ᤛᤥ",
                "label": "So (Tumo ᤥ)"
            },
            {
                "limbu": "ᤛᤠ",
                "label": "Saa (Amma ᤠ)"
            }
        ]
    },
    {
        "badge": "🔤 Saknam-sak • Ainu (ऐकार)",
        "instruction": "Combine Ta + Ainu Matra (ऐनु)",
        "targetDeva": "तै (Tai)",
        "targetLatin": "Ta + Ainu (ᤤ)",
        "ruleTitle": "Ta (ᤋ) + Ainu (ᤤ) = ᤋᤤ",
        "ruleDesc": "Ainu adds the double-stroke diphthong mark for the \"ai\" sound.",
        "answer": "ᤋᤤ",
        "options": [
            {
                "limbu": "ᤋᤤ",
                "label": "Tai (Ainu ᤤ)"
            },
            {
                "limbu": "ᤋᤣ",
                "label": "Te (Ettu ᤣ)"
            },
            {
                "limbu": "ᤋᤦ",
                "label": "Tau (Tumbo ᤦ)"
            },
            {
                "limbu": "ᤋᤡ",
                "label": "Ti (Iksu ᤡ)"
            }
        ]
    },
    {
        "badge": "🔤 Saknam-sak • Tumo (ओकार)",
        "instruction": "Combine Ra + Tumo Matra (तुमो)",
        "targetDeva": "रो (Ro)",
        "targetLatin": "Ra + Tumo (ᤥ)",
        "ruleTitle": "Ra (ᤖ) + Tumo (ᤥ) = ᤖᤥ",
        "ruleDesc": "Final syllable of \"Sewaro\" (ᤛᤣᤘᤠᤖᤥ) creating the rich \"o\" vowel.",
        "answer": "ᤖᤥ",
        "options": [
            {
                "limbu": "ᤖᤢ",
                "label": "Ru (Uksu ᤢ)"
            },
            {
                "limbu": "ᤖᤦ",
                "label": "Rau (Tumbo ᤦ)"
            },
            {
                "limbu": "ᤖᤥ",
                "label": "Ro (Tumo ᤥ)"
            },
            {
                "limbu": "ᤖᤧ",
                "label": "Rae (Pechwa ᤧ)"
            }
        ]
    },
    {
        "badge": "🔤 Saknam-sak • Tumbo (औकार)",
        "instruction": "Combine La + Tumbo Matra (तुम्बो)",
        "targetDeva": "लौ (Lau)",
        "targetLatin": "La + Tumbo (ᤦ)",
        "ruleTitle": "La (ᤗ) + Tumbo (ᤦ) = ᤗᤦ",
        "ruleDesc": "Tumbo creates the rounded diphthong \"au\" sound.",
        "answer": "ᤗᤦ",
        "options": [
            {
                "limbu": "ᤗᤥ",
                "label": "Lo (Tumo ᤥ)"
            },
            {
                "limbu": "ᤗᤦ",
                "label": "Lau (Tumbo ᤦ)"
            },
            {
                "limbu": "ᤗᤠ",
                "label": "Laa (Amma ᤠ)"
            },
            {
                "limbu": "ᤗᤢ",
                "label": "Lu (Uksu ᤢ)"
            }
        ]
    },
    {
        "badge": "🔤 Saknam-sak • Pechwa (ए़कार)",
        "instruction": "Combine Na + Pechwa Matra (पेच्व)",
        "targetDeva": "ने़ (Nae)",
        "targetLatin": "Na + Pechwa (ᤧ)",
        "ruleTitle": "Na (ᤏ) + Pechwa (ᤧ) = ᤏᤧ",
        "ruleDesc": "Authentic Limbu open vowel \"ae\" mark distinctive to Yakthung Pan.",
        "answer": "ᤏᤧ",
        "options": [
            {
                "limbu": "ᤏᤣ",
                "label": "Ne (Ettu ᤣ)"
            },
            {
                "limbu": "ᤏᤧ",
                "label": "Nae (Pechwa ᤧ)"
            },
            {
                "limbu": "ᤏᤠ",
                "label": "Naa (Amma ᤠ)"
            },
            {
                "limbu": "ᤏᤡ",
                "label": "Ni (Iksu ᤡ)"
            }
        ]
    }
];

let CHUK_LEVEL_15_ITEMS = [
    {
        "fullLetter": "ᤁ",
        "halfLetter": "ᤰ",
        "devaHalf": "क्",
        "fullDeva": "क",
        "latinName": "Chuk-k",
        "fontKey": "Z = ट",
        "badge": "✨ ᤁ = ᤰ • चुक् (क्) आधा अक्षर",
        "instruction": "Half-Letter क् (Chuk-k): ᤁ (Ka) ➔ ᤰ (क्)",
        "targetDeva": "यक् (Yak)",
        "targetLatin": "Ya (ᤕ) + Chuk-k (ᤰ)",
        "ruleTitle": "ᤁ (Ka) ➔ ᤰ (क्) Half-Letter",
        "ruleDesc": "In Sirijonga script, full letter ᤁ becomes half letter ᤰ (चुक्-साक्). Example: ᤕ (Ya) + ᤰ (-k) = ᤕᤰ (Yak in Yakthung). Book font key: Z = ट.",
        "answer": "ᤕᤰ",
        "options": [
            {
                "limbu": "ᤕᤰ",
                "label": "Yak (ᤰ = क्)"
            },
            {
                "limbu": "ᤕᤱ",
                "label": "Yang (ᤱ = ङ्)"
            },
            {
                "limbu": "ᤕᤶ",
                "label": "Yam (ᤶ = म्)"
            },
            {
                "limbu": "ᤕᤳ",
                "label": "Yat (ᤳ = त्)"
            }
        ]
    },
    {
        "fullLetter": "ᤅ",
        "halfLetter": "ᤱ",
        "devaHalf": "ङ्",
        "fullDeva": "ङ",
        "latinName": "Chuk-ng",
        "fontKey": "उ° = ०",
        "badge": "✨ ᤅ = ᤱ • चुक् (ङ्) आधा अक्षर",
        "instruction": "Half-Letter ङ् (Chuk-ng): ᤅ (Nga) ➔ ᤱ (ङ्)",
        "targetDeva": "थुङ् (Thung)",
        "targetLatin": "Thu (ᤌᤢ) + Chuk-ng (ᤱ)",
        "ruleTitle": "ᤅ (Nga) ➔ ᤱ (ङ्) Half-Letter",
        "ruleDesc": "In Sirijonga script, full letter ᤅ becomes half letter ᤱ (चुक्-साक्). Example: ᤌᤢ (Thu) + ᤱ (-ng) = ᤌᤢᤱ (Thung). Book font key: उ° = ०.",
        "answer": "ᤌᤢᤱ",
        "options": [
            {
                "limbu": "ᤌᤢᤵ",
                "label": "Thup (ᤵ = प्)"
            },
            {
                "limbu": "ᤌᤢᤱ",
                "label": "Thung (ᤱ = ङ्)"
            },
            {
                "limbu": "ᤌᤢᤷ",
                "label": "Thur (ᤷ = र्)"
            },
            {
                "limbu": "ᤌᤢᤸ",
                "label": "Thul (ᤸ = ल्)"
            }
        ]
    },
    {
        "fullLetter": "ᤋ",
        "halfLetter": "ᤳ",
        "devaHalf": "त्",
        "fullDeva": "त",
        "latinName": "Chuk-t",
        "fontKey": "३ = ⌒",
        "badge": "✨ ᤋ = ᤳ • चुक् (त्) आधा अक्षर",
        "instruction": "Half-Letter त् (Chuk-t): ᤋ (Ta) ➔ ᤳ (त्)",
        "targetDeva": "नेत् (Net - Two / ᥈)",
        "targetLatin": "Ne (ᤏᤣ) + Chuk-t (ᤳ)",
        "ruleTitle": "ᤋ (Ta) ➔ ᤳ (त्) Half-Letter",
        "ruleDesc": "In Sirijonga script, full letter ᤋ becomes half letter ᤳ (चुक्-साक्). Example: ᤏᤣ (Ne) + ᤳ (-t) = ᤏᤣᤳ (Net = 2). Book font key: ३ = ⌒.",
        "answer": "ᤏᤣᤳ",
        "options": [
            {
                "limbu": "ᤏᤣᤳ",
                "label": "Net (ᤳ = त्)"
            },
            {
                "limbu": "ᤏᤣᤰ",
                "label": "Nek (ᤰ = क्)"
            },
            {
                "limbu": "ᤏᤣᤵ",
                "label": "Nep (ᤵ = प्)"
            },
            {
                "limbu": "ᤏᤣᤶ",
                "label": "Nem (ᤶ = म्)"
            }
        ]
    },
    {
        "fullLetter": "ᤐ",
        "halfLetter": "ᤵ",
        "devaHalf": "प्",
        "fullDeva": "प",
        "latinName": "Chuk-p",
        "fontKey": "w = ч",
        "badge": "✨ ᤐ = ᤵ • चुक् (प्) आधा अक्षर",
        "instruction": "Half-Letter प् (Chuk-p): ᤐ (Pa) ➔ ᤵ (प्)",
        "targetDeva": "थिप् (Thip - Zero / ᥆)",
        "targetLatin": "Thi (ᤌᤡ) + Chuk-p (ᤵ)",
        "ruleTitle": "ᤐ (Pa) ➔ ᤵ (प्) Half-Letter",
        "ruleDesc": "In Sirijonga script, full letter ᤐ becomes half letter ᤵ (चुक्-साक्). Example: ᤌᤡ (Thi) + ᤵ (-p) = ᤌᤡᤵ (Thip = 0). Book font key: w = ч.",
        "answer": "ᤌᤡᤵ",
        "options": [
            {
                "limbu": "ᤌᤡᤰ",
                "label": "Thik (ᤰ = क्)"
            },
            {
                "limbu": "ᤌᤡᤵ",
                "label": "Thip (ᤵ = प्)"
            },
            {
                "limbu": "ᤌᤡᤱ",
                "label": "Thing (ᤱ = ङ्)"
            },
            {
                "limbu": "ᤌᤡᤳ",
                "label": "Thit (ᤳ = त्)"
            }
        ]
    },
    {
        "fullLetter": "ᤔ",
        "halfLetter": "ᤶ",
        "devaHalf": "म्",
        "fullDeva": "म",
        "latinName": "Chuk-m",
        "fontKey": "य = ५",
        "badge": "✨ ᤔ = ᤶ • चुक् (म्) आधा अक्षर",
        "instruction": "Half-Letter म् (Chuk-m): ᤔ (Ma) ➔ ᤶ (म्)",
        "targetDeva": "काम् (Kam - Friend)",
        "targetLatin": "Kaa (ᤁᤠ) + Chuk-m (ᤶ)",
        "ruleTitle": "ᤔ (Ma) ➔ ᤶ (म्) Half-Letter",
        "ruleDesc": "In Sirijonga script, full letter ᤔ becomes half letter ᤶ (चुक्-साक्). Example: ᤁᤠ (Kaa) + ᤶ (-m) = ᤁᤠᤶ (Kam = Friend). Book font key: य = ५.",
        "answer": "ᤁᤠᤶ",
        "options": [
            {
                "limbu": "ᤁᤠᤶ",
                "label": "Kam (ᤶ = म्)"
            },
            {
                "limbu": "ᤁᤠᤱ",
                "label": "Kang (ᤱ = ङ्)"
            },
            {
                "limbu": "ᤁᤠᤰ",
                "label": "Kak (ᤰ = क्)"
            },
            {
                "limbu": "ᤁᤠᤵ",
                "label": "Kap (ᤵ = प्)"
            }
        ]
    },
    {
        "fullLetter": "ᤖ",
        "halfLetter": "ᤷ",
        "devaHalf": "र्",
        "fullDeva": "र",
        "latinName": "Chuk-r",
        "fontKey": "र = ,",
        "badge": "✨ ᤖ = ᤷ • चुक् (र्) आधा अक्षर",
        "instruction": "Half-Letter र् (Chuk-r): ᤖ (Ra) ➔ ᤷ (Chuk-r)",
        "targetDeva": "सर् (Sar)",
        "targetLatin": "Sa (ᤛ) + Chuk-r (ᤷ)",
        "ruleTitle": "ᤖ (Ra) ➔ ᤷ (र्) Half-Letter",
        "ruleDesc": "In Sirijonga script, full letter ᤖ becomes half letter ᤷ (चुक्-साक्). Example: ᤛ (Sa) + ᤷ (-r) = ᤛᤷ (Sar). Book font key: र = ,.",
        "answer": "ᤛᤷ",
        "options": [
            {
                "limbu": "ᤛᤷ",
                "label": "Sar (ᤷ = र्)"
            },
            {
                "limbu": "ᤛᤸ",
                "label": "Sal (ᤸ = ल्)"
            },
            {
                "limbu": "ᤛᤳ",
                "label": "Sat (ᤳ = त्)"
            },
            {
                "limbu": "ᤛᤶ",
                "label": "Sam (ᤶ = म्)"
            }
        ]
    },
    {
        "fullLetter": "ᤗ",
        "halfLetter": "ᤸ",
        "devaHalf": "ल्",
        "fullDeva": "ल",
        "latinName": "Chuk-l",
        "fontKey": "u = प",
        "badge": "✨ ᤗ = ᤸ • चुक् (ल्) आधा अक्षर",
        "instruction": "Half-Letter ल् (Chuk-l): ᤗ (La) ➔ ᤸ (Chuk-l)",
        "targetDeva": "थुल् (Thul)",
        "targetLatin": "Thu (ᤌᤢ) + Chuk-l (ᤸ)",
        "ruleTitle": "ᤗ (La) ➔ ᤸ (ल्) Half-Letter",
        "ruleDesc": "In Sirijonga script, full letter ᤗ becomes half letter ᤸ (चुक्-साक्). Example: ᤌᤢ (Thu) + ᤸ (-l) = ᤌᤢᤸ (Thul). Book font key: u = प.",
        "answer": "ᤌᤢᤸ",
        "options": [
            {
                "limbu": "ᤌᤢᤸ",
                "label": "Thul (ᤸ = ल्)"
            },
            {
                "limbu": "ᤌᤢᤷ",
                "label": "Thur (ᤷ = र्)"
            },
            {
                "limbu": "ᤌᤢᤱ",
                "label": "Thung (ᤱ = ङ्)"
            },
            {
                "limbu": "ᤌᤢᤰ",
                "label": "Thuk (ᤰ = क्)"
            }
        ]
    }
];

let MARKS_LEVEL_16_ITEMS = [
    {
        "badge": "✨ Ektum-sak • Conjunct -ya (एक्टुम-या)",
        "instruction": "Select Subjoined -ya Cluster (ᤩ)",
        "targetDeva": "च्या (Chya)",
        "targetLatin": "Cha + Ektum-ya (ᤩ) + Amma",
        "ruleTitle": "Cha (ᤆ) + Ektum-ya (ᤩ) + ᤠ = ᤆᤩᤠ",
        "ruleDesc": "First syllable of the sacred Phedape drum \"Chyabrung\" (ᤆᤩᤠᤒᤪᤢᤱ).",
        "answer": "ᤆᤩᤠ",
        "options": [
            {
                "limbu": "ᤆᤩᤠ",
                "label": "Chya (-ya ᤩ)"
            },
            {
                "limbu": "ᤆᤪᤠ",
                "label": "Chra (-ra ᤪ)"
            },
            {
                "limbu": "ᤆᤫᤠ",
                "label": "Chwa (-wa ᤫ)"
            },
            {
                "limbu": "ᤆᤠ",
                "label": "Chaa (plain)"
            }
        ]
    },
    {
        "badge": "✨ Ektum-sak • Conjunct -ra (एक्टुम-रा)",
        "instruction": "Select Subjoined -ra Cluster (ᤪ)",
        "targetDeva": "ब्रु (Bru)",
        "targetLatin": "Ba + Ektum-ra (ᤪ) + Uksu",
        "ruleTitle": "Ba (ᤒ) + Ektum-ra (ᤪ) + ᤢ = ᤒᤪᤢ",
        "ruleDesc": "Second syllable of the traditional drum \"Chyabrung\" (ᤆᤩᤠᤒᤪᤢᤱ).",
        "answer": "ᤒᤪᤢ",
        "options": [
            {
                "limbu": "ᤒᤪᤢ",
                "label": "Bru (-ra ᤪ)"
            },
            {
                "limbu": "ᤒᤩᤢ",
                "label": "Byu (-ya ᤩ)"
            },
            {
                "limbu": "ᤒᤫᤢ",
                "label": "Bwu (-wa ᤫ)"
            },
            {
                "limbu": "ᤒᤢ",
                "label": "Bu (plain)"
            }
        ]
    },
    {
        "badge": "✨ Ektum-sak • Conjunct -wa (एक्टुम-वा)",
        "instruction": "Select Subjoined -wa Cluster (ᤫ)",
        "targetDeva": "क्वा (Kwa)",
        "targetLatin": "Ka + Ektum-wa (ᤫ) + Amma",
        "ruleTitle": "Ka (ᤁ) + Ektum-wa (ᤫ) + ᤠ = ᤁᤫᤠ",
        "ruleDesc": "Forms labialized consonant clusters like Kwa and Chwa.",
        "answer": "ᤁᤫᤠ",
        "options": [
            {
                "limbu": "ᤁᤫᤠ",
                "label": "Kwa (-wa ᤫ)"
            },
            {
                "limbu": "ᤁᤪᤠ",
                "label": "Kra (-ra ᤪ)"
            },
            {
                "limbu": "ᤁᤩᤠ",
                "label": "Kya (-ya ᤩ)"
            },
            {
                "limbu": "ᤁᤠ",
                "label": "Kaa (plain)"
            }
        ]
    },
    {
        "badge": "✨ Kusek-sak • Muphreng Glottal Stop (मुफ्रेङ्)",
        "instruction": "Identify Muphreng Mark (᤹)",
        "targetDeva": "कः (Kaʼ)",
        "targetLatin": "Ka + Muphreng (᤹)",
        "ruleTitle": "Muphreng Glottal Stop (᤹)",
        "ruleDesc": "Creates a sharp glottal check / abrupt syllable cutoff characteristic of Limbu.",
        "answer": "ᤁ᤹",
        "options": [
            {
                "limbu": "ᤁ᤹",
                "label": "Muphreng (᤹)"
            },
            {
                "limbu": "ᤁᤠ᤺",
                "label": "Kemphreng (᤺)"
            },
            {
                "limbu": "ᤁ᤻",
                "label": "Sa-i (᤻)"
            },
            {
                "limbu": "ᤁᤶ",
                "label": "Chuk-m (ᤶ)"
            }
        ]
    },
    {
        "badge": "✨ Kusek-sak • Kemphreng Sustained Tone (केम्फ्रेङ्)",
        "instruction": "Identify Kemphreng Length Mark (᤺)",
        "targetDeva": "काː (Kaa:)",
        "targetLatin": "Ka + Amma + Kemphreng (᤺)",
        "ruleTitle": "Kemphreng Vowel Lengthener (᤺)",
        "ruleDesc": "Lengthens and sustains the vowel tone in spoken Phedape Limbu.",
        "answer": "ᤁᤠ᤺",
        "options": [
            {
                "limbu": "ᤁᤠ᤺",
                "label": "Kemphreng (᤺)"
            },
            {
                "limbu": "ᤁ᤹",
                "label": "Muphreng (᤹)"
            },
            {
                "limbu": "ᤁ᤻",
                "label": "Sa-i (᤻)"
            },
            {
                "limbu": "ᤁᤠ",
                "label": "Amma (ᤠ)"
            }
        ]
    },
    {
        "badge": "✨ Kusek-sak • Sa-i Pure Consonant Killer (स-इ)",
        "instruction": "Identify Sa-i Halanta Mark (᤻)",
        "targetDeva": "क् (K)",
        "targetLatin": "Ka + Sa-i (᤻)",
        "ruleTitle": "Sa-i Halanta Mark (᤻)",
        "ruleDesc": "Kills the inherent \"a\" vowel to leave a pure bare consonant sound.",
        "answer": "ᤁ᤻",
        "options": [
            {
                "limbu": "ᤁ᤻",
                "label": "Sa-i (᤻ Halanta)"
            },
            {
                "limbu": "ᤁ᤹",
                "label": "Muphreng (᤹)"
            },
            {
                "limbu": "ᤁᤰ",
                "label": "Chuk-k (ᤰ)"
            },
            {
                "limbu": "ᤁᤠ᤺",
                "label": "Kemphreng (᤺)"
            }
        ]
    }
];

let BOSS_LEVEL_17_ITEMS = [
    {
        "badge": "👑 Boss Quiz • Question 1/10",
        "instruction": "Which mark creates the long \"aa\" sound in \"ᤁᤠ\" (Kaa)?",
        "targetDeva": "आम्मा (Amma)",
        "targetLatin": "Amma Matra (ᤠ)",
        "ruleTitle": "Amma Matra (ᤠ)",
        "ruleDesc": "Amma adds the primary long \"aa\" vowel to any consonant.",
        "answer": "ᤠ",
        "options": [
            {
                "limbu": "ᤠ",
                "label": "Amma (ᤠ)"
            },
            {
                "limbu": "ᤡ",
                "label": "Iksu (ᤡ)"
            },
            {
                "limbu": "ᤢ",
                "label": "Uksu (ᤢ)"
            },
            {
                "limbu": "ᤣ",
                "label": "Ettu (ᤣ)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 2/10",
        "instruction": "Identify the greeting \"Sewaro\" (ᤛᤣᤘᤠᤖᤥ) opening syllable \"Se\":",
        "targetDeva": "से (Se)",
        "targetLatin": "Sa (ᤛ) + Ettu (ᤣ)",
        "ruleTitle": "Sa + Ettu = ᤛᤣ",
        "ruleDesc": "Ettu (ᤣ) creates the \"e\" vowel sound.",
        "answer": "ᤛᤣ",
        "options": [
            {
                "limbu": "ᤛᤣ",
                "label": "Se (Ettu ᤣ)"
            },
            {
                "limbu": "ᤛᤤ",
                "label": "Sai (Ainu ᤤ)"
            },
            {
                "limbu": "ᤛᤥ",
                "label": "So (Tumo ᤥ)"
            },
            {
                "limbu": "ᤛᤢ",
                "label": "Su (Uksu ᤢ)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 3/10",
        "instruction": "Select the Limbu open vowel \"ae\" mark (Pechwa):",
        "targetDeva": "पेच्व (Pechwa)",
        "targetLatin": "Pechwa Mark (ᤧ)",
        "ruleTitle": "Pechwa Matra (ᤧ)",
        "ruleDesc": "Distinctive to Limbu orthography for open \"ae\" pronunciation.",
        "answer": "ᤁᤧ",
        "options": [
            {
                "limbu": "ᤁᤧ",
                "label": "Kae (Pechwa ᤧ)"
            },
            {
                "limbu": "ᤁᤣ",
                "label": "Ke (Ettu ᤣ)"
            },
            {
                "limbu": "ᤁᤤ",
                "label": "Kai (Ainu ᤤ)"
            },
            {
                "limbu": "ᤁᤥ",
                "label": "Ko (Tumo ᤥ)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 4/10",
        "instruction": "Which Chuk-sak subjoined final is used in \"Yak\" (ᤕᤰ)?",
        "targetDeva": "चुक्-क (Final -k)",
        "targetLatin": "Subjoined -k (ᤰ)",
        "ruleTitle": "Chuk-k (ᤰ)",
        "ruleDesc": "Subjoined small -k final consonant.",
        "answer": "ᤰ",
        "options": [
            {
                "limbu": "ᤰ",
                "label": "Final -k (ᤰ)"
            },
            {
                "limbu": "ᤱ",
                "label": "Final -ng (ᤱ)"
            },
            {
                "limbu": "ᤳ",
                "label": "Final -t (ᤳ)"
            },
            {
                "limbu": "ᤵ",
                "label": "Final -p (ᤵ)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 5/10",
        "instruction": "Identify the final nasal mark in \"Thung\" (ᤌᤢᤱ):",
        "targetDeva": "चुक्-ङ (Final -ng)",
        "targetLatin": "Subjoined -ng (ᤱ)",
        "ruleTitle": "Chuk-ng (ᤱ)",
        "ruleDesc": "Produces the velar nasal final in \"Yakthung\".",
        "answer": "ᤱ",
        "options": [
            {
                "limbu": "ᤱ",
                "label": "Final -ng (ᤱ)"
            },
            {
                "limbu": "ᤶ",
                "label": "Final -m (ᤶ)"
            },
            {
                "limbu": "ᤰ",
                "label": "Final -k (ᤰ)"
            },
            {
                "limbu": "ᤸ",
                "label": "Final -l (ᤸ)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 6/10",
        "instruction": "Select the conjunct -ya (Ektum-ya) in \"Chya\":",
        "targetDeva": "च्या (Chya)",
        "targetLatin": "Cha + Ektum-ya (ᤩ) + Amma",
        "ruleTitle": "Ektum-ya (ᤩ)",
        "ruleDesc": "Subjoined -ya cluster for Chyabrung drum.",
        "answer": "ᤆᤩᤠ",
        "options": [
            {
                "limbu": "ᤆᤩᤠ",
                "label": "Chya (-ya ᤩ)"
            },
            {
                "limbu": "ᤆᤪᤠ",
                "label": "Chra (-ra ᤪ)"
            },
            {
                "limbu": "ᤆᤫᤠ",
                "label": "Chwa (-wa ᤫ)"
            },
            {
                "limbu": "ᤆᤠ",
                "label": "Chaa (plain)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 7/10",
        "instruction": "Identify the Muphreng Glottal Stop mark:",
        "targetDeva": "मुफ्रेङ् (Muphreng)",
        "targetLatin": "Muphreng Check (᤹)",
        "ruleTitle": "Muphreng (᤹)",
        "ruleDesc": "Abrupt glottal stop mark in Limbu speech.",
        "answer": "᤹",
        "options": [
            {
                "limbu": "᤹",
                "label": "Muphreng (᤹)"
            },
            {
                "limbu": "᤺",
                "label": "Kemphreng (᤺)"
            },
            {
                "limbu": "᤻",
                "label": "Sa-i (᤻)"
            },
            {
                "limbu": "ᤶ",
                "label": "Chuk-m (ᤶ)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 8/10",
        "instruction": "Which mark lengthens vowel duration (Kemphreng)?",
        "targetDeva": "केम्फ्रेङ् (Kemphreng)",
        "targetLatin": "Kemphreng (᤺)",
        "ruleTitle": "Kemphreng Sustained Tone (᤺)",
        "ruleDesc": "Sustained tone lengthener.",
        "answer": "᤺",
        "options": [
            {
                "limbu": "᤺",
                "label": "Kemphreng (᤺)"
            },
            {
                "limbu": "᤹",
                "label": "Muphreng (᤹)"
            },
            {
                "limbu": "᤻",
                "label": "Sa-i (᤻)"
            },
            {
                "limbu": "ᤠ",
                "label": "Amma (ᤠ)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 9/10",
        "instruction": "How do you write \"Kam\" (Friend) with final -m?",
        "targetDeva": "काम् (Kam)",
        "targetLatin": "Kaa (ᤁᤠ) + Chuk-m (ᤶ)",
        "ruleTitle": "Ka + Amma + Chuk-m = ᤁᤠᤶ",
        "ruleDesc": "Root word for friend / companion.",
        "answer": "ᤁᤠᤶ",
        "options": [
            {
                "limbu": "ᤁᤠᤶ",
                "label": "Kam (-m ᤶ)"
            },
            {
                "limbu": "ᤁᤠᤱ",
                "label": "Kang (-ng ᤱ)"
            },
            {
                "limbu": "ᤁᤠᤰ",
                "label": "Kak (-k ᤰ)"
            },
            {
                "limbu": "ᤁᤠᤳ",
                "label": "Kat (-t ᤳ)"
            }
        ]
    },
    {
        "badge": "👑 Boss Quiz • Question 10/10",
        "instruction": "What is the role of Sa-i mark (᤻)?",
        "targetDeva": "स-इ हलन्त (Sa-i)",
        "targetLatin": "Halanta Consonant Killer (᤻)",
        "ruleTitle": "Sa-i Halanta (᤻)",
        "ruleDesc": "Cancels the inherent vowel to form pure consonant.",
        "answer": "ᤁ᤻",
        "options": [
            {
                "limbu": "ᤁ᤻",
                "label": "Pure Consonant (Sa-i ᤻)"
            },
            {
                "limbu": "ᤁ᤹",
                "label": "Glottal Stop (Muphreng ᤹)"
            },
            {
                "limbu": "ᤁᤠ᤺",
                "label": "Long Vowel (Kemphreng ᤺)"
            },
            {
                "limbu": "ᤁᤠ",
                "label": "Amma Vowel (ᤠ)"
            }
        ]
    }
];

let VILLAGE_PHRASES = [
    {
        "emoji": "🙏",
        "english": "Respectful Greeting / Hello (Phedape Limbu)",
        "nepali": "नेपाली: नमस्कार / सेवारो",
        "pronounce": "Sewaro",
        "tiles": [
            {
                "limbu": "ᤛᤣᤘᤠᤖᤥ",
                "latin": "Sewaro"
            }
        ],
        "distractors": [
            {
                "limbu": "ᤁᤠᤶ",
                "latin": "Kam"
            },
            {
                "limbu": "ᤘᤠ",
                "latin": "Wa"
            }
        ]
    },
    {
        "emoji": "🤝",
        "english": "My Friend / Companion (Phedape)",
        "nepali": "नेपाली: मेरो साथी",
        "pronounce": "Anga Kam",
        "tiles": [
            {
                "limbu": "ᤀᤱᤃᤠ",
                "latin": "Anga"
            },
            {
                "limbu": "ᤁᤠᤶ",
                "latin": "Kam"
            }
        ],
        "distractors": [
            {
                "limbu": "ᤏᤠᤶ",
                "latin": "Nam"
            },
            {
                "limbu": "ᤛᤣᤘᤠᤖᤥ",
                "latin": "Sewaro"
            }
        ]
    },
    {
        "emoji": "🏔️",
        "english": "Limbu Language (Phedape Yakthung Pan)",
        "nepali": "नेपाली: लिम्बु भाषा (फेदापे)",
        "pronounce": "Yakthung Pan",
        "tiles": [
            {
                "limbu": "ᤕᤰᤌᤢᤱ",
                "latin": "Yakthung"
            },
            {
                "limbu": "ᤐᤠᤴ",
                "latin": "Pan"
            }
        ],
        "distractors": [
            {
                "limbu": "ᤑᤢᤱ",
                "latin": "Phung"
            },
            {
                "limbu": "ᤗᤠᤒᤠ",
                "latin": "Laba"
            }
        ]
    },
    {
        "emoji": "✨",
        "english": "How are you? / Are you well?",
        "nepali": "नेपाली: सन्चै हुनुहुन्छ? / के छ?",
        "pronounce": "Kusang Nuba?",
        "tiles": [
            {
                "limbu": "ᤁᤢᤛᤱ",
                "latin": "Kusang"
            },
            {
                "limbu": "ᤏᤢᤒᤠ",
                "latin": "Nuba"
            }
        ],
        "distractors": [
            {
                "limbu": "ᤐᤠᤴ",
                "latin": "Pan"
            },
            {
                "limbu": "ᤆᤠ",
                "latin": "Cha"
            }
        ]
    },
    {
        "emoji": "💚",
        "english": "I am well / Fine (Phedape)",
        "nepali": "नेपाली: मलाई सन्चै छ",
        "pronounce": "Nubaro",
        "tiles": [
            {
                "limbu": "ᤏᤢᤒᤠᤖᤥ",
                "latin": "Nubaro"
            }
        ],
        "distractors": [
            {
                "limbu": "ᤀᤱᤃᤠ",
                "latin": "Anga"
            },
            {
                "limbu": "ᤘᤠ",
                "latin": "Wa"
            }
        ]
    },
    {
        "emoji": "💧",
        "english": "Drink Water (Phedape Imperative)",
        "nepali": "नेपाली: पानी पिउनुहोस्",
        "pronounce": "Wa Thung-e",
        "tiles": [
            {
                "limbu": "ᤘᤠ",
                "latin": "Wa"
            },
            {
                "limbu": "ᤌᤢᤱᤀᤣ",
                "latin": "Thung-e"
            }
        ],
        "distractors": [
            {
                "limbu": "ᤆᤠ",
                "latin": "Cha"
            },
            {
                "limbu": "ᤂᤠᤶ",
                "latin": "Kham"
            }
        ]
    },
    {
        "emoji": "🍚",
        "english": "Eat Food / Meal (Phedape)",
        "nepali": "नेपाली: खाना खानुहोस्",
        "pronounce": "Cha Cho-e",
        "tiles": [
            {
                "limbu": "ᤆᤠ",
                "latin": "Cha"
            },
            {
                "limbu": "ᤆᤥᤀᤣ",
                "latin": "Cho-e"
            }
        ],
        "distractors": [
            {
                "limbu": "ᤘᤠ",
                "latin": "Wa"
            },
            {
                "limbu": "ᤐᤠᤴ",
                "latin": "Pan"
            }
        ]
    },
    {
        "emoji": "💐",
        "english": "Thank You / Gratitude (Nogen)",
        "nepali": "नेपाली: धन्यवाद",
        "pronounce": "Nogen",
        "tiles": [
            {
                "limbu": "ᤏᤥᤃᤣᤴ",
                "latin": "Nogen"
            }
        ],
        "distractors": [
            {
                "limbu": "ᤁᤠᤶ",
                "latin": "Kam"
            },
            {
                "limbu": "ᤛᤣᤘᤠᤖᤥ",
                "latin": "Sewaro"
            }
        ]
    }
];

let CHAPTERS = [
    {
        "id": 1,
        "title": "Chapter 1: Sirijonga Roots",
        "subtitle": "Rows 1–3 Consonants & Boss Quiz I (70%)",
        "badgeColor": "bg-emerald-700 text-white"
    },
    {
        "id": 2,
        "title": "Chapter 2: Deep Script Mastery",
        "subtitle": "Rows 4–7 (Pa–Gha) & Boss Quiz II (70%)",
        "badgeColor": "bg-terracotta-600 text-white"
    },
    {
        "id": 3,
        "title": "Chapter 3: Grand Script Trials",
        "subtitle": "All 25 Consonants: Forward & Reverse Trials (70%)",
        "badgeColor": "bg-amber-600 text-white"
    },
    {
        "id": 4,
        "title": "Chapter 4: Kubung-sak Vowels & Vowel Boss",
        "subtitle": "9 Pure Vowels (A–Ae) & Vowel Recognition Boss (70%)",
        "badgeColor": "bg-purple-700 text-white"
    },
    {
        "id": 5,
        "title": "Chapter 5: Saknam-sak, Chuk-sak & Marks",
        "subtitle": "8 Matras, 7 Finals, Conjuncts & Marks Trial (70%)",
        "badgeColor": "bg-rose-700 text-white"
    },
    {
        "id": 6,
        "title": "Chapter 6: Khanin & Phedape Greetings",
        "subtitle": "Numerals 0–10, Numbers Boss & Phedape Dialect Phrases",
        "badgeColor": "bg-slatebrand-900 text-goldaccent-400"
    }
];

let ADVENTURE_LEVELS = [
    {
        "levelNum": 1,
        "chapter": 1,
        "type": "trace",
        "title": "Row 1: Ka – Nga",
        "icon": "ᤁ",
        "letterIds": [
            "ka",
            "kha",
            "ga",
            "nga"
        ]
    },
    {
        "levelNum": 2,
        "chapter": 1,
        "type": "trace",
        "title": "Row 2: Cha – Na",
        "icon": "ᤆ",
        "letterIds": [
            "cha",
            "chha",
            "ja",
            "na"
        ]
    },
    {
        "levelNum": 3,
        "chapter": 1,
        "type": "trace",
        "title": "Row 3: Ta – Dha",
        "icon": "ᤋ",
        "letterIds": [
            "ta",
            "tha",
            "da",
            "dha"
        ]
    },
    {
        "levelNum": 4,
        "chapter": 1,
        "type": "quiz",
        "title": "Boss I: Rows 1–3",
        "icon": "👑",
        "isBoss": true,
        "quizMode": "forward",
        "questionCount": 8,
        "passThreshold": 70,
        "xpReward": 60,
        "poolIds": [
            "ka",
            "kha",
            "ga",
            "nga",
            "cha",
            "chha",
            "ja",
            "na",
            "ta",
            "tha",
            "da",
            "dha"
        ]
    },
    {
        "levelNum": 5,
        "chapter": 2,
        "type": "trace",
        "title": "Row 4: Pa – Bha",
        "icon": "ᤐ",
        "letterIds": [
            "pa",
            "pha",
            "ba",
            "bha"
        ]
    },
    {
        "levelNum": 6,
        "chapter": 2,
        "type": "trace",
        "title": "Row 5: Ma – La",
        "icon": "ᤔ",
        "letterIds": [
            "ma",
            "ya",
            "ra",
            "la"
        ]
    },
    {
        "levelNum": 7,
        "chapter": 2,
        "type": "trace",
        "title": "Rows 6–7: Wa – Gha",
        "icon": "ᤘ",
        "letterIds": [
            "wa",
            "sha",
            "sa",
            "ha",
            "gha"
        ]
    },
    {
        "levelNum": 8,
        "chapter": 2,
        "type": "quiz",
        "title": "Boss II: Rows 4–7",
        "icon": "👑",
        "isBoss": true,
        "quizMode": "forward",
        "questionCount": 9,
        "passThreshold": 70,
        "xpReward": 70,
        "poolIds": [
            "pa",
            "pha",
            "ba",
            "bha",
            "ma",
            "ya",
            "ra",
            "la",
            "wa",
            "sha",
            "sa",
            "ha",
            "gha"
        ]
    },
    {
        "levelNum": 9,
        "chapter": 3,
        "type": "quiz",
        "title": "Grand Boss I (All 25)",
        "icon": "🏆",
        "isBoss": true,
        "quizMode": "forward",
        "questionCount": 12,
        "passThreshold": 70,
        "xpReward": 90,
        "poolIds": [
            "ka",
            "kha",
            "ga",
            "nga",
            "cha",
            "chha",
            "ja",
            "na",
            "ta",
            "tha",
            "da",
            "dha",
            "pa",
            "pha",
            "ba",
            "bha",
            "ma",
            "ya",
            "ra",
            "la",
            "wa",
            "sha",
            "sa",
            "ha",
            "gha"
        ]
    },
    {
        "levelNum": 10,
        "chapter": 3,
        "type": "quiz",
        "title": "Grand Boss II (Reverse)",
        "icon": "🔥",
        "isBoss": true,
        "quizMode": "reverse",
        "questionCount": 12,
        "passThreshold": 70,
        "xpReward": 100,
        "poolIds": [
            "ka",
            "kha",
            "ga",
            "nga",
            "cha",
            "chha",
            "ja",
            "na",
            "ta",
            "tha",
            "da",
            "dha",
            "pa",
            "pha",
            "ba",
            "bha",
            "ma",
            "ya",
            "ra",
            "la",
            "wa",
            "sha",
            "sa",
            "ha",
            "gha"
        ]
    },
    {
        "levelNum": 11,
        "chapter": 4,
        "type": "trace",
        "title": "Vowels I: A – E",
        "icon": "ᤀ",
        "letterIds": [
            "v_a",
            "v_aa",
            "v_i",
            "v_u",
            "v_e"
        ]
    },
    {
        "levelNum": 12,
        "chapter": 4,
        "type": "trace",
        "title": "Vowels II: Ai – Ae",
        "icon": "ᤀᤤ",
        "letterIds": [
            "v_ai",
            "v_o",
            "v_au",
            "v_ae"
        ]
    },
    {
        "levelNum": 13,
        "chapter": 4,
        "type": "quiz",
        "title": "Boss Quiz: 9 Vowels",
        "icon": "👑",
        "isBoss": true,
        "quizMode": "forward",
        "questionCount": 9,
        "passThreshold": 70,
        "xpReward": 85,
        "poolIds": [
            "v_a",
            "v_aa",
            "v_i",
            "v_u",
            "v_e",
            "v_ai",
            "v_o",
            "v_au",
            "v_ae"
        ]
    },
    {
        "levelNum": 14,
        "chapter": 5,
        "type": "trace",
        "title": "Saknam-sak: 8 Matras",
        "icon": "ᤠ",
        "letterIds": [
            "m_aa",
            "m_i",
            "m_u",
            "m_e",
            "m_ai",
            "m_o",
            "m_au",
            "m_ae"
        ]
    },
    {
        "levelNum": 15,
        "chapter": 5,
        "type": "saknam",
        "title": "Chuk-sak: 7 Finals",
        "icon": "ᤁᤰ",
        "items": [
            {
                "badge": "✨ Chuk-sak • Final -k (चुक्-सक् -क्)",
                "instruction": "Form syllable \"Yak\" (यक्)",
                "targetDeva": "यक् (Yak)",
                "targetLatin": "Ya (ᤕ) + Chuk-k (ᤰ)",
                "ruleTitle": "Ya + Subjoined -k = ᤕᤰ",
                "ruleDesc": "The opening syllable of our language and identity: \"Yakthung\" (ᤕᤰᤌᤢᤱ).",
                "answer": "ᤕᤰ",
                "options": [
                    {
                        "limbu": "ᤕᤰ",
                        "label": "Yak (-k ᤰ)"
                    },
                    {
                        "limbu": "ᤕᤱ",
                        "label": "Yang (-ng ᤱ)"
                    },
                    {
                        "limbu": "ᤕᤶ",
                        "label": "Yam (-m ᤶ)"
                    },
                    {
                        "limbu": "ᤕᤳ",
                        "label": "Yat (-t ᤳ)"
                    }
                ]
            },
            {
                "badge": "✨ Chuk-sak • Final -ng (चुक्-सक् -ङ्)",
                "instruction": "Form syllable \"Thung\" (थुङ्)",
                "targetDeva": "थुङ् (Thung)",
                "targetLatin": "Thu (ᤌᤢ) + Chuk-ng (ᤱ)",
                "ruleTitle": "Thu + Subjoined -ng = ᤌᤢᤱ",
                "ruleDesc": "Second syllable of \"Yakthung\" (ᤕᤰᤌᤢᤱ) and root of \"Drink\" (ᤌᤢᤱ).",
                "answer": "ᤌᤢᤱ",
                "options": [
                    {
                        "limbu": "ᤌᤢᤵ",
                        "label": "Thup (-p ᤵ)"
                    },
                    {
                        "limbu": "ᤌᤢᤱ",
                        "label": "Thung (-ng ᤱ)"
                    },
                    {
                        "limbu": "ᤌᤢᤷ",
                        "label": "Thur (-r ᤷ)"
                    },
                    {
                        "limbu": "ᤌᤢᤸ",
                        "label": "Thul (-l ᤸ)"
                    }
                ]
            },
            {
                "badge": "✨ Chuk-sak • Final -t (चुक्-सक् -त्)",
                "instruction": "Form word \"Net\" (Two / ᥈)",
                "targetDeva": "नेत् (Net - Two)",
                "targetLatin": "Ne (ᤏᤣ) + Chuk-t (ᤳ)",
                "ruleTitle": "Ne + Subjoined -t = ᤏᤣᤳ",
                "ruleDesc": "The Limbu numeral word for \"Two\" (᥈ Net).",
                "answer": "ᤏᤣᤳ",
                "options": [
                    {
                        "limbu": "ᤏᤣᤳ",
                        "label": "Net (-t ᤳ)"
                    },
                    {
                        "limbu": "ᤏᤣᤰ",
                        "label": "Nek (-k ᤰ)"
                    },
                    {
                        "limbu": "ᤏᤣᤵ",
                        "label": "Nep (-p ᤵ)"
                    },
                    {
                        "limbu": "ᤏᤣᤶ",
                        "label": "Nem (-m ᤶ)"
                    }
                ]
            },
            {
                "badge": "✨ Chuk-sak • Final -p (चुक्-सक् -प्)",
                "instruction": "Form word \"Thip\" (Zero / ᥆)",
                "targetDeva": "थिप् (Thip - Zero)",
                "targetLatin": "Thi (ᤌᤡ) + Chuk-p (ᤵ)",
                "ruleTitle": "Thi + Subjoined -p = ᤌᤡᤵ",
                "ruleDesc": "The Limbu numeral word for \"Zero\" (᥆ Thip).",
                "answer": "ᤌᤡᤵ",
                "options": [
                    {
                        "limbu": "ᤌᤡᤰ",
                        "label": "Thik (-k ᤰ / One)"
                    },
                    {
                        "limbu": "ᤌᤡᤵ",
                        "label": "Thip (-p ᤵ / Zero)"
                    },
                    {
                        "limbu": "ᤌᤡᤱ",
                        "label": "Thing (-ng ᤱ)"
                    },
                    {
                        "limbu": "ᤌᤡᤳ",
                        "label": "Thit (-t ᤳ)"
                    }
                ]
            },
            {
                "badge": "✨ Chuk-sak • Final -m (चुक्-सक् -म्)",
                "instruction": "Form word \"Kam\" (Friend / Companion)",
                "targetDeva": "काम् (Kam - Friend)",
                "targetLatin": "Kaa (ᤁᤠ) + Chuk-m (ᤶ)",
                "ruleTitle": "Kaa + Subjoined -m = ᤁᤠᤶ",
                "ruleDesc": "Used in the phrase \"Anga Kam\" (ᤀᤱᤃᤠ ᤁᤠᤶ = My Friend).",
                "answer": "ᤁᤠᤶ",
                "options": [
                    {
                        "limbu": "ᤁᤠᤶ",
                        "label": "Kam (-m ᤶ)"
                    },
                    {
                        "limbu": "ᤁᤠᤱ",
                        "label": "Kang (-ng ᤱ)"
                    },
                    {
                        "limbu": "ᤁᤠᤰ",
                        "label": "Kak (-k ᤰ)"
                    },
                    {
                        "limbu": "ᤁᤠᤵ",
                        "label": "Kap (-p ᤵ)"
                    }
                ]
            },
            {
                "badge": "✨ Chuk-sak • Final -r (चुक्-सक् -र्)",
                "instruction": "Select Subjoined Final -r (ᤷ)",
                "targetDeva": "सर् (Sar)",
                "targetLatin": "Sa (ᤛ) + Chuk-r (ᤷ)",
                "ruleTitle": "Sa + Subjoined -r = ᤛᤷ",
                "ruleDesc": "Attaches under the letter to represent a terminal -r.",
                "answer": "ᤛᤷ",
                "options": [
                    {
                        "limbu": "ᤛᤷ",
                        "label": "Sar (-r ᤷ)"
                    },
                    {
                        "limbu": "ᤛᤸ",
                        "label": "Sal (-l ᤸ)"
                    },
                    {
                        "limbu": "ᤛᤳ",
                        "label": "Sat (-t ᤳ)"
                    },
                    {
                        "limbu": "ᤛᤶ",
                        "label": "Sam (-m ᤶ)"
                    }
                ]
            },
            {
                "badge": "✨ Chuk-sak • Final -l (चुक्-सक् -ल्)",
                "instruction": "Select Subjoined Final -l (ᤸ)",
                "targetDeva": "थुल् (Thul)",
                "targetLatin": "Thu (ᤌᤢ) + Chuk-l (ᤸ)",
                "ruleTitle": "Thu + Subjoined -l = ᤌᤢᤸ",
                "ruleDesc": "Final liquid consonant mark in authentic Sirijonga orthography.",
                "answer": "ᤌᤢᤸ",
                "options": [
                    {
                        "limbu": "ᤌᤢᤸ",
                        "label": "Thul (-l ᤸ)"
                    },
                    {
                        "limbu": "ᤌᤢᤷ",
                        "label": "Thur (-r ᤷ)"
                    },
                    {
                        "limbu": "ᤌᤢᤱ",
                        "label": "Thung (-ng ᤱ)"
                    },
                    {
                        "limbu": "ᤌᤢᤰ",
                        "label": "Thuk (-k ᤰ)"
                    }
                ]
            }
        ]
    },
    {
        "levelNum": 16,
        "chapter": 5,
        "type": "saknam",
        "title": "Ektum & Kusek Marks",
        "icon": "ᤆᤩᤠ",
        "items": [
            {
                "badge": "✨ Ektum-sak • Conjunct -ya (एक्टुम-या)",
                "instruction": "Select Subjoined -ya Cluster (ᤩ)",
                "targetDeva": "च्या (Chya)",
                "targetLatin": "Cha + Ektum-ya (ᤩ) + Amma",
                "ruleTitle": "Cha (ᤆ) + Ektum-ya (ᤩ) + ᤠ = ᤆᤩᤠ",
                "ruleDesc": "First syllable of the sacred Phedape drum \"Chyabrung\" (ᤆᤩᤠᤒᤪᤢᤱ).",
                "answer": "ᤆᤩᤠ",
                "options": [
                    {
                        "limbu": "ᤆᤩᤠ",
                        "label": "Chya (-ya ᤩ)"
                    },
                    {
                        "limbu": "ᤆᤪᤠ",
                        "label": "Chra (-ra ᤪ)"
                    },
                    {
                        "limbu": "ᤆᤫᤠ",
                        "label": "Chwa (-wa ᤫ)"
                    },
                    {
                        "limbu": "ᤆᤠ",
                        "label": "Chaa (plain)"
                    }
                ]
            },
            {
                "badge": "✨ Ektum-sak • Conjunct -ra (एक्टुम-रा)",
                "instruction": "Select Subjoined -ra Cluster (ᤪ)",
                "targetDeva": "ब्रु (Bru)",
                "targetLatin": "Ba + Ektum-ra (ᤪ) + Uksu",
                "ruleTitle": "Ba (ᤒ) + Ektum-ra (ᤪ) + ᤢ = ᤒᤪᤢ",
                "ruleDesc": "Second syllable of the traditional drum \"Chyabrung\" (ᤆᤩᤠᤒᤪᤢᤱ).",
                "answer": "ᤒᤪᤢ",
                "options": [
                    {
                        "limbu": "ᤒᤪᤢ",
                        "label": "Bru (-ra ᤪ)"
                    },
                    {
                        "limbu": "ᤒᤩᤢ",
                        "label": "Byu (-ya ᤩ)"
                    },
                    {
                        "limbu": "ᤒᤫᤢ",
                        "label": "Bwu (-wa ᤫ)"
                    },
                    {
                        "limbu": "ᤒᤢ",
                        "label": "Bu (plain)"
                    }
                ]
            },
            {
                "badge": "✨ Ektum-sak • Conjunct -wa (एक्टुम-वा)",
                "instruction": "Select Subjoined -wa Cluster (ᤫ)",
                "targetDeva": "क्वा (Kwa)",
                "targetLatin": "Ka + Ektum-wa (ᤫ) + Amma",
                "ruleTitle": "Ka (ᤁ) + Ektum-wa (ᤫ) + ᤠ = ᤁᤫᤠ",
                "ruleDesc": "Forms labialized consonant clusters like Kwa and Chwa.",
                "answer": "ᤁᤫᤠ",
                "options": [
                    {
                        "limbu": "ᤁᤫᤠ",
                        "label": "Kwa (-wa ᤫ)"
                    },
                    {
                        "limbu": "ᤁᤪᤠ",
                        "label": "Kra (-ra ᤪ)"
                    },
                    {
                        "limbu": "ᤁᤩᤠ",
                        "label": "Kya (-ya ᤩ)"
                    },
                    {
                        "limbu": "ᤁᤠ",
                        "label": "Kaa (plain)"
                    }
                ]
            },
            {
                "badge": "✨ Kusek-sak • Muphreng Glottal Stop (मुफ्रेङ्)",
                "instruction": "Identify Muphreng Mark (᤹)",
                "targetDeva": "कः (Kaʼ)",
                "targetLatin": "Ka + Muphreng (᤹)",
                "ruleTitle": "Muphreng Glottal Stop (᤹)",
                "ruleDesc": "Creates a sharp glottal check / abrupt syllable cutoff characteristic of Limbu.",
                "answer": "ᤁ᤹",
                "options": [
                    {
                        "limbu": "ᤁ᤹",
                        "label": "Muphreng (᤹)"
                    },
                    {
                        "limbu": "ᤁᤠ᤺",
                        "label": "Kemphreng (᤺)"
                    },
                    {
                        "limbu": "ᤁ᤻",
                        "label": "Sa-i (᤻)"
                    },
                    {
                        "limbu": "ᤁᤶ",
                        "label": "Chuk-m (ᤶ)"
                    }
                ]
            },
            {
                "badge": "✨ Kusek-sak • Kemphreng Sustained Tone (केम्फ्रेङ्)",
                "instruction": "Identify Kemphreng Length Mark (᤺)",
                "targetDeva": "काː (Kaa:)",
                "targetLatin": "Ka + Amma + Kemphreng (᤺)",
                "ruleTitle": "Kemphreng Vowel Lengthener (᤺)",
                "ruleDesc": "Lengthens and sustains the vowel tone in spoken Phedape Limbu.",
                "answer": "ᤁᤠ᤺",
                "options": [
                    {
                        "limbu": "ᤁᤠ᤺",
                        "label": "Kemphreng (᤺)"
                    },
                    {
                        "limbu": "ᤁ᤹",
                        "label": "Muphreng (᤹)"
                    },
                    {
                        "limbu": "ᤁ᤻",
                        "label": "Sa-i (᤻)"
                    },
                    {
                        "limbu": "ᤁᤠ",
                        "label": "Amma (ᤠ)"
                    }
                ]
            },
            {
                "badge": "✨ Kusek-sak • Sa-i Pure Consonant Killer (स-इ)",
                "instruction": "Identify Sa-i Halanta Mark (᤻)",
                "targetDeva": "क् (K)",
                "targetLatin": "Ka + Sa-i (᤻)",
                "ruleTitle": "Sa-i Halanta Mark (᤻)",
                "ruleDesc": "Kills the inherent \"a\" vowel to leave a pure bare consonant sound.",
                "answer": "ᤁ᤻",
                "options": [
                    {
                        "limbu": "ᤁ᤻",
                        "label": "Sa-i (᤻ Halanta)"
                    },
                    {
                        "limbu": "ᤁ᤹",
                        "label": "Muphreng (᤹)"
                    },
                    {
                        "limbu": "ᤁᤰ",
                        "label": "Chuk-k (ᤰ)"
                    },
                    {
                        "limbu": "ᤁᤠ᤺",
                        "label": "Kemphreng (᤺)"
                    }
                ]
            }
        ]
    },
    {
        "levelNum": 17,
        "chapter": 5,
        "type": "saknam",
        "title": "Boss Quiz: Matras & Marks",
        "icon": "👑",
        "isBoss": true,
        "passThreshold": 70,
        "xpReward": 95,
        "items": [
            {
                "badge": "👑 Boss Quiz • Question 1/10",
                "instruction": "Which mark creates the long \"aa\" sound in \"ᤁᤠ\" (Kaa)?",
                "targetDeva": "आम्मा (Amma)",
                "targetLatin": "Amma Matra (ᤠ)",
                "ruleTitle": "Amma Matra (ᤠ)",
                "ruleDesc": "Amma adds the primary long \"aa\" vowel to any consonant.",
                "answer": "ᤠ",
                "options": [
                    {
                        "limbu": "ᤠ",
                        "label": "Amma (ᤠ)"
                    },
                    {
                        "limbu": "ᤡ",
                        "label": "Iksu (ᤡ)"
                    },
                    {
                        "limbu": "ᤢ",
                        "label": "Uksu (ᤢ)"
                    },
                    {
                        "limbu": "ᤣ",
                        "label": "Ettu (ᤣ)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 2/10",
                "instruction": "Identify the greeting \"Sewaro\" (ᤛᤣᤘᤠᤖᤥ) opening syllable \"Se\":",
                "targetDeva": "से (Se)",
                "targetLatin": "Sa (ᤛ) + Ettu (ᤣ)",
                "ruleTitle": "Sa + Ettu = ᤛᤣ",
                "ruleDesc": "Ettu (ᤣ) creates the \"e\" vowel sound.",
                "answer": "ᤛᤣ",
                "options": [
                    {
                        "limbu": "ᤛᤣ",
                        "label": "Se (Ettu ᤣ)"
                    },
                    {
                        "limbu": "ᤛᤤ",
                        "label": "Sai (Ainu ᤤ)"
                    },
                    {
                        "limbu": "ᤛᤥ",
                        "label": "So (Tumo ᤥ)"
                    },
                    {
                        "limbu": "ᤛᤢ",
                        "label": "Su (Uksu ᤢ)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 3/10",
                "instruction": "Select the Limbu open vowel \"ae\" mark (Pechwa):",
                "targetDeva": "पेच्व (Pechwa)",
                "targetLatin": "Pechwa Mark (ᤧ)",
                "ruleTitle": "Pechwa Matra (ᤧ)",
                "ruleDesc": "Distinctive to Limbu orthography for open \"ae\" pronunciation.",
                "answer": "ᤁᤧ",
                "options": [
                    {
                        "limbu": "ᤁᤧ",
                        "label": "Kae (Pechwa ᤧ)"
                    },
                    {
                        "limbu": "ᤁᤣ",
                        "label": "Ke (Ettu ᤣ)"
                    },
                    {
                        "limbu": "ᤁᤤ",
                        "label": "Kai (Ainu ᤤ)"
                    },
                    {
                        "limbu": "ᤁᤥ",
                        "label": "Ko (Tumo ᤥ)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 4/10",
                "instruction": "Which Chuk-sak subjoined final is used in \"Yak\" (ᤕᤰ)?",
                "targetDeva": "चुक्-क (Final -k)",
                "targetLatin": "Subjoined -k (ᤰ)",
                "ruleTitle": "Chuk-k (ᤰ)",
                "ruleDesc": "Subjoined small -k final consonant.",
                "answer": "ᤰ",
                "options": [
                    {
                        "limbu": "ᤰ",
                        "label": "Final -k (ᤰ)"
                    },
                    {
                        "limbu": "ᤱ",
                        "label": "Final -ng (ᤱ)"
                    },
                    {
                        "limbu": "ᤳ",
                        "label": "Final -t (ᤳ)"
                    },
                    {
                        "limbu": "ᤵ",
                        "label": "Final -p (ᤵ)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 5/10",
                "instruction": "Identify the final nasal mark in \"Thung\" (ᤌᤢᤱ):",
                "targetDeva": "चुक्-ङ (Final -ng)",
                "targetLatin": "Subjoined -ng (ᤱ)",
                "ruleTitle": "Chuk-ng (ᤱ)",
                "ruleDesc": "Produces the velar nasal final in \"Yakthung\".",
                "answer": "ᤱ",
                "options": [
                    {
                        "limbu": "ᤱ",
                        "label": "Final -ng (ᤱ)"
                    },
                    {
                        "limbu": "ᤶ",
                        "label": "Final -m (ᤶ)"
                    },
                    {
                        "limbu": "ᤰ",
                        "label": "Final -k (ᤰ)"
                    },
                    {
                        "limbu": "ᤸ",
                        "label": "Final -l (ᤸ)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 6/10",
                "instruction": "Select the conjunct -ya (Ektum-ya) in \"Chya\":",
                "targetDeva": "च्या (Chya)",
                "targetLatin": "Cha + Ektum-ya (ᤩ) + Amma",
                "ruleTitle": "Ektum-ya (ᤩ)",
                "ruleDesc": "Subjoined -ya cluster for Chyabrung drum.",
                "answer": "ᤆᤩᤠ",
                "options": [
                    {
                        "limbu": "ᤆᤩᤠ",
                        "label": "Chya (-ya ᤩ)"
                    },
                    {
                        "limbu": "ᤆᤪᤠ",
                        "label": "Chra (-ra ᤪ)"
                    },
                    {
                        "limbu": "ᤆᤫᤠ",
                        "label": "Chwa (-wa ᤫ)"
                    },
                    {
                        "limbu": "ᤆᤠ",
                        "label": "Chaa (plain)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 7/10",
                "instruction": "Identify the Muphreng Glottal Stop mark:",
                "targetDeva": "मुफ्रेङ् (Muphreng)",
                "targetLatin": "Muphreng Check (᤹)",
                "ruleTitle": "Muphreng (᤹)",
                "ruleDesc": "Abrupt glottal stop mark in Limbu speech.",
                "answer": "᤹",
                "options": [
                    {
                        "limbu": "᤹",
                        "label": "Muphreng (᤹)"
                    },
                    {
                        "limbu": "᤺",
                        "label": "Kemphreng (᤺)"
                    },
                    {
                        "limbu": "᤻",
                        "label": "Sa-i (᤻)"
                    },
                    {
                        "limbu": "ᤶ",
                        "label": "Chuk-m (ᤶ)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 8/10",
                "instruction": "Which mark lengthens vowel duration (Kemphreng)?",
                "targetDeva": "केम्फ्रेङ् (Kemphreng)",
                "targetLatin": "Kemphreng (᤺)",
                "ruleTitle": "Kemphreng Sustained Tone (᤺)",
                "ruleDesc": "Sustained tone lengthener.",
                "answer": "᤺",
                "options": [
                    {
                        "limbu": "᤺",
                        "label": "Kemphreng (᤺)"
                    },
                    {
                        "limbu": "᤹",
                        "label": "Muphreng (᤹)"
                    },
                    {
                        "limbu": "᤻",
                        "label": "Sa-i (᤻)"
                    },
                    {
                        "limbu": "ᤠ",
                        "label": "Amma (ᤠ)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 9/10",
                "instruction": "How do you write \"Kam\" (Friend) with final -m?",
                "targetDeva": "काम् (Kam)",
                "targetLatin": "Kaa (ᤁᤠ) + Chuk-m (ᤶ)",
                "ruleTitle": "Ka + Amma + Chuk-m = ᤁᤠᤶ",
                "ruleDesc": "Root word for friend / companion.",
                "answer": "ᤁᤠᤶ",
                "options": [
                    {
                        "limbu": "ᤁᤠᤶ",
                        "label": "Kam (-m ᤶ)"
                    },
                    {
                        "limbu": "ᤁᤠᤱ",
                        "label": "Kang (-ng ᤱ)"
                    },
                    {
                        "limbu": "ᤁᤠᤰ",
                        "label": "Kak (-k ᤰ)"
                    },
                    {
                        "limbu": "ᤁᤠᤳ",
                        "label": "Kat (-t ᤳ)"
                    }
                ]
            },
            {
                "badge": "👑 Boss Quiz • Question 10/10",
                "instruction": "What is the role of Sa-i mark (᤻)?",
                "targetDeva": "स-इ हलन्त (Sa-i)",
                "targetLatin": "Halanta Consonant Killer (᤻)",
                "ruleTitle": "Sa-i Halanta (᤻)",
                "ruleDesc": "Cancels the inherent vowel to form pure consonant.",
                "answer": "ᤁ᤻",
                "options": [
                    {
                        "limbu": "ᤁ᤻",
                        "label": "Pure Consonant (Sa-i ᤻)"
                    },
                    {
                        "limbu": "ᤁ᤹",
                        "label": "Glottal Stop (Muphreng ᤹)"
                    },
                    {
                        "limbu": "ᤁᤠ᤺",
                        "label": "Long Vowel (Kemphreng ᤺)"
                    },
                    {
                        "limbu": "ᤁᤠ",
                        "label": "Amma Vowel (ᤠ)"
                    }
                ]
            }
        ]
    },
    {
        "levelNum": 18,
        "chapter": 6,
        "type": "trace",
        "title": "Khanin: Numbers 0–5",
        "icon": "᥇",
        "letterIds": [
            "num_0",
            "num_1",
            "num_2",
            "num_3",
            "num_4",
            "num_5"
        ]
    },
    {
        "levelNum": 19,
        "chapter": 6,
        "type": "trace",
        "title": "Khanin: Numbers 6–10",
        "icon": "᥇᥆",
        "letterIds": [
            "num_6",
            "num_7",
            "num_8",
            "num_9",
            "num_10"
        ]
    },
    {
        "levelNum": 20,
        "chapter": 6,
        "type": "quiz",
        "title": "Boss: Numbers 0–10",
        "icon": "👑",
        "isBoss": true,
        "quizMode": "forward",
        "questionCount": 10,
        "passThreshold": 70,
        "xpReward": 80,
        "poolIds": [
            "num_0",
            "num_1",
            "num_2",
            "num_3",
            "num_4",
            "num_5",
            "num_6",
            "num_7",
            "num_8",
            "num_9",
            "num_10"
        ]
    },
    {
        "levelNum": 21,
        "chapter": 6,
        "type": "tiles",
        "title": "Phedape Conversations",
        "icon": "🏔️",
        "isBoss": true,
        "xpReward": 100
    }
];

let curriculumLoadedFromRemote = false;

function applyCurriculumData(data) {
    if (!data) return;
    if (data.consonants && Array.isArray(data.consonants)) SIRIJONGA_25 = data.consonants;
    if (data.vowels && Array.isArray(data.vowels)) KUBUNG_VOWELS_9 = data.vowels;
    if (data.numbers && Array.isArray(data.numbers)) KHANIN_NUMBERS = data.numbers;
    if (data.saknam8Letters && Array.isArray(data.saknam8Letters)) SAKNAM_8_LETTERS = data.saknam8Letters;
    if (data.naukhariForms && Array.isArray(data.naukhariForms)) NAUKHARI_FORMS = data.naukhariForms;
    if (data.saknamMatras && Array.isArray(data.saknamMatras)) SAKNAM_MATRAS = data.saknamMatras;
    if (data.chukFinals && Array.isArray(data.chukFinals)) CHUK_FINALS = data.chukFinals;
    if (data.ektumConjuncts && Array.isArray(data.ektumConjuncts)) EKTUM_CONJUNCTS = data.ektumConjuncts;
    if (data.kusekMarks && Array.isArray(data.kusekMarks)) KUSEK_MARKS = data.kusekMarks;

    if (data.saknamLevel14Items && Array.isArray(data.saknamLevel14Items)) SAKNAM_LEVEL_14_ITEMS = data.saknamLevel14Items;
    if (data.chukLevel15Items && Array.isArray(data.chukLevel15Items)) CHUK_LEVEL_15_ITEMS = data.chukLevel15Items;
    if (data.marksLevel16Items && Array.isArray(data.marksLevel16Items)) MARKS_LEVEL_16_ITEMS = data.marksLevel16Items;
    if (data.bossLevel17Items && Array.isArray(data.bossLevel17Items)) BOSS_LEVEL_17_ITEMS = data.bossLevel17Items;

    if (data.villagePhrases && Array.isArray(data.villagePhrases)) {
        VILLAGE_PHRASES = data.villagePhrases;
    } else if (data.vocabulary && Array.isArray(data.vocabulary)) {
        VILLAGE_PHRASES = data.vocabulary;
    }

    if (data.chapters && Array.isArray(data.chapters)) CHAPTERS = data.chapters;
    if (data.levels && Array.isArray(data.levels)) {
        ADVENTURE_LEVELS = data.levels;
    } else if (data.adventureLevels && Array.isArray(data.adventureLevels)) {
        ADVENTURE_LEVELS = data.adventureLevels;
    }

    if (data.chuk7Letters && Array.isArray(data.chuk7Letters)) CHUK_7_LETTERS = data.chuk7Letters;
    ALL_TRACEABLE_ITEMS = [...SIRIJONGA_25, ...KUBUNG_VOWELS_9, ...SAKNAM_8_LETTERS, ...CHUK_7_LETTERS, ...KHANIN_NUMBERS];
    ALL_25_CONSONANT_IDS = SIRIJONGA_25.map(c => c.id);

    // Re-link dynamic references
    ADVENTURE_LEVELS.forEach(lvl => {
        if (lvl.levelNum === 15) {
            lvl.type = 'trace';
            lvl.title = 'Chuk-sak: 7 Half Letters (चुक्-साक् - आधा अक्षर)';
            lvl.icon = 'ᤰ';
            lvl.letterIds = ['c_k', 'c_ng', 'c_t', 'c_p', 'c_m', 'c_r', 'c_l'];
        }
        if (lvl.type === 'saknam' && (!lvl.items || lvl.items.length === 0)) {
            if (lvl.levelNum === 14) lvl.items = SAKNAM_LEVEL_14_ITEMS;
            if (lvl.levelNum === 16) lvl.items = MARKS_LEVEL_16_ITEMS;
            if (lvl.levelNum === 17) lvl.items = BOSS_LEVEL_17_ITEMS;
        }
        if (lvl.type === 'quiz' && (!lvl.poolIds || lvl.poolIds.length === 0)) {
            if (lvl.levelNum === 13) {
                lvl.poolIds = ['v_a', 'v_aa', 'v_i', 'v_u', 'v_e', 'v_ai', 'v_o', 'v_au', 'v_ae'];
            } else if (lvl.levelNum === 20) {
                lvl.poolIds = ['num_0', 'num_1', 'num_2', 'num_3', 'num_4', 'num_5', 'num_6', 'num_7', 'num_8', 'num_9', 'num_10'];
            } else {
                lvl.poolIds = ALL_25_CONSONANT_IDS;
            }
        }
    });

    console.log('[Curriculum] Dynamic load complete. Levels:', ADVENTURE_LEVELS.length);
    if (typeof populateDevJumpSelect === 'function') populateDevJumpSelect();
    if (typeof updateHudDisplay === 'function') updateHudDisplay();
}

async function loadCurriculumData() {
    try {
        const res = await fetch('data/curriculum.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        applyCurriculumData(data);
        curriculumLoadedFromRemote = true;
    } catch (err) {
        console.info('[Curriculum] Using built-in curriculum data:', err);
        if (typeof populateDevJumpSelect === 'function') populateDevJumpSelect();
    }
}

function getLetterById(id) {
    return ALL_TRACEABLE_ITEMS.find(item => item.id === id) || SIRIJONGA_25[0];
}

function getCurrentLetterObj() {
    if (session.isSinglePractice) return session.activeLevel.singleItem;
    const id = session.activeLevel.letterIds[session.stepIdx];
    return getLetterById(id);
}
