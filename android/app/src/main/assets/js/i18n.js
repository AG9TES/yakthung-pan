/**
 * Yakthung Pan • Internationalization (i18n) Engine
 * Seamless bilingual support: English (🇬🇧) and Nepali (🇳🇵).
 */

const I18N_DICTIONARY = {
    en: {
        // App Branding & Navigation
        app_title: "Yakthung Pan",
        app_subtitle: "Phedape Limbu (फेदापे)",
        home: "Home",
        welcome: "Welcome",
        welcome_sewaro: "ᤛᤣᤘᤠᤖᤥ • Sewaro!",
        welcome_title: "Welcome to Yakthung Pan",
        welcome_tagline: "Master the Sirijonga Script & Authentic Phedape Limbu Dialect",
        welcome_desc: "An interactive, mobile-first learning experience for the Yakthung (Limbu) language — from pure vowels and consonants to Phedape village greetings.",
        start_learning: "Start Learning",
        continue_adventure: "Continue Adventure",
        choose_language: "Choose Language",
        language_label: "Language: English",
        
        // Quick Action Buttons
        credits_btn: "Credits & Team",
        voice_studio_btn: "Voice Studio",
        signin_btn: "Google Sign-In",
        chart_btn: "Chart",
        dev_open: "Dev: Open",
        dev_normal: "Normal",
        
        // HUD stats
        streak_tooltip: "Daily Streak",
        xp_tooltip: "Total XP",
        mastered_tooltip: "Mastered Characters",
        
        // Tracing Mode
        trace_title: "Finger-Tracing Pad",
        trace_guide: "✍️ Trace over the dashed outline",
        goal_60: "Goal: 60%",
        accuracy: "Accuracy",
        great_match: "Great Match",
        off_target: "Off-Target • Stay on Lines",
        ghost_on: "Ghost: On",
        ghost_off: "Ghost: Off",
        clear: "↺ Clear",
        next_letter: "Next Letter",
        done_practicing: "Done Practicing",
        complete_level: "Complete Level",
        trace_unlock_hint: "Trace 60% to Unlock",
        listen: "Listen",
        
        // Boss Quiz Mode
        boss_quiz_title: "Boss Script Quiz",
        boss_quiz_goal: "70% Goal",
        pass_threshold: "Pass Threshold: 70%",
        current_score: "Current Score",
        quiz_identify_prompt: "Identify this Sirijonga character:",
        hear_sound: "Hear Sound",
        quiz_complete_title: "Boss Quiz Passed!",
        quiz_retry_title: "Try Again for 70%",
        
        // Saknam & Marks Mode
        saknam_bhan_title: "Saknam-sak Matras & Marks",
        select_matching: "Select the Matching Form",
        next_challenge: "Next Challenge →",
        complete_challenge: "Complete Challenge →",
        
        // Village Tiles Mode
        village_tiles_title: "Phedape Village Phrases",
        tap_words_prompt: "Tap tiles to build the Limbu phrase:",
        check_phrase: "Check Phrase",
        next_phrase: "Next Phrase →",
        
        // Victory Screen
        victory_complete: "Level Completed!",
        xp_earned: "XP Earned",
        continue_map: "Continue Mountain Trail →",
        
        // Voice Studio
        voice_studio_title: "Yakthung Voice Recording Studio",
        voice_studio_sub: "Record your own authentic pronunciation for every letter and word",
        voice_studio_desc: "Speech synthesis can be imperfect. Record your own voice or upload audio clips to hear your authentic Phedape pronunciation played throughout the entire app!",
        record_voice: "Record Voice",
        recording_now: "Recording... Tap to Stop",
        stop_recording: "Stop Recording",
        test_playback: "▶ Play Recording",
        save_voice: "💾 Save Custom Voice",
        upload_audio_file: "📁 Upload File (.mp3/.wav)",
        download_clip: "📥 Download (<id>.mp3)",
        reset_voice: "↺ Reset to Default",
        recorded_voices_count: "Custom Voices Recorded",
        export_backup: "📦 Export Audio Pack (JSON)",
        import_backup: "📥 Import Audio Pack",
        filter_all: "All Items",
        filter_consonants: "Consonants (25)",
        filter_vowels: "Vowels (9)",
        filter_extras: "Extra Keys",
        filter_matras: "Matras",
        filter_phrases: "Phrases",
        custom_voice_active_badge: "🎙️ Custom Voice Active",
        
        // Account & Progress Backup
        auth_modal_title: "Account & Progress Backup",
        auth_modal_sub: "Create an account or sign in to store and sync your stars, XP, and custom voices across devices",
        signin_with_google: "Continue with Google",
        guest_status: "Playing as Guest (Local Mode)",
        guest_hint: "Create an account or sign in to preserve your streak and sync your level progress when switching phones or laptops.",
        signed_in_badge: "● Account Connected & Synced",
        cloud_synced_badge: "Cloud Sync Active ✓",
        signout_btn: "Sign Out",
        sync_now_btn: "🔄 Sync Cloud Now",
        
        // Credits Modal
        credits_modal_title: "Credits & Contributors",
        credits_modal_sub: "The cultural elders, linguists, voice artists, and builders of Yakthung Pan",
        core_team: "Core Project Team",
        linguistics_voice: "Native Pronunciation & Cultural Guidance",
        script_research: "Sirijonga Script & Orthography",
        dev_design: "Software Architecture & Design",
        special_thanks: "Special Acknowledgments",
        
        // Toast notifications
        lang_switched: "Language switched to English 🇬🇧",
        voice_saved: "Custom voice saved for",
        voice_deleted: "Reset pronunciation to default for",
        audio_exported: "Audio clip downloaded as",
        backup_exported: "Audio pack exported successfully!",
        backup_imported: "Custom audio pack imported successfully!",
        signin_success: "Signed in successfully! Progress synchronized.",
        signout_success: "Signed out. Progress stored locally."
    },
    
    ne: {
        // App Branding & Navigation
        app_title: "याक्थुङ पान",
        app_subtitle: "फेदापे लिम्बू भाषा",
        home: "गृहपृष्ठ",
        welcome: "स्वागतम्",
        welcome_sewaro: "ᤛᤣᤘᤠᤖᤥ • सेवारो!",
        welcome_title: "याक्थुङ पानमा स्वागत छ",
        welcome_tagline: "सिरीजङ्गा लिपि र मौलिक फेदापे याक्थुङ लवज सिक्नुहोस्",
        welcome_desc: "याक्थुङ (लिम्बू) भाषा, लिपि र संस्कृतिको डिजिटल अभ्यास यात्रा — मौलिक स्वर, व्यञ्जनदेखि गाउँले फेदापे संवादसम्म।",
        start_learning: "सुरु गर्नुहोस्",
        continue_adventure: "यात्रा जारी राख्नुहोस्",
        choose_language: "भाषा छान्नुहोस्",
        language_label: "भाषा: नेपाली",
        
        // Quick Action Buttons
        credits_btn: "श्रेय तथा टोली",
        voice_studio_btn: "आवाज स्टुडियो",
        signin_btn: "गुगलबाट साइन-इन",
        chart_btn: "लिपि तालिका",
        dev_open: "डेभ: खुला",
        dev_normal: "सामान्य",
        
        // HUD stats
        streak_tooltip: "दैनिक लय (स्ट्रिक)",
        xp_tooltip: "कुल अङ्क (XP)",
        mastered_tooltip: "कण्ठ भएका अक्षरहरू",
        
        // Tracing Mode
        trace_title: "औँलाले अक्षर कोर्ने पाटी",
        trace_guide: "✍️ धर्सामाथि औँलाले कोर्नुहोस्",
        goal_60: "लक्ष्य: ६०%",
        accuracy: "शुद्धता",
        great_match: "उत्कृष्ट मिल्यो",
        off_target: "धर्सा बाहिर गयो • रेखामै कोर्नुहोस्",
        ghost_on: "छाप: अन",
        ghost_off: "छाप: अफ",
        clear: "↺ सफा",
        next_letter: "अर्को अक्षर",
        done_practicing: "अभ्यास पूरा भयो",
        complete_level: "तह पूरा गर्नुहोस्",
        trace_unlock_hint: "अनलक गर्न ६०% कोर्नुहोस्",
        listen: "सुन्नुहोस्",
        
        // Boss Quiz Mode
        boss_quiz_title: "मुख्य लिपि परीक्षा",
        boss_quiz_goal: "७०% लक्ष्य",
        pass_threshold: "उत्तीर्ण अङ्क: ७०%",
        current_score: "हालको अङ्क",
        quiz_identify_prompt: "यो सिरीजङ्गा अक्षर चिन्नुहोस्:",
        hear_sound: "आवाज सुन्नुहोस्",
        quiz_complete_title: "मुख्य परीक्षा उत्तीर्ण!",
        quiz_retry_title: "७०% का लागि पुनः प्रयास गर्नुहोस्",
        
        // Saknam & Marks Mode
        saknam_bhan_title: "साक्नाम-सक् मात्रा र चिन्ह",
        select_matching: "मिल्दो रूप छान्नुहोस्",
        next_challenge: "अर्को चुनौती →",
        complete_challenge: "चुनौती पूरा भयो →",
        
        // Village Tiles Mode
        village_tiles_title: "फेदापे गाउँले शब्दावली",
        tap_words_prompt: "टुक्राहरू मिलाएर लिम्बू वाक्य बनाउनुहोस्:",
        check_phrase: "वाक्य जाँच गर्नुहोस्",
        next_phrase: "अर्को वाक्य →",
        
        // Victory Screen
        victory_complete: "तह सम्पन्न भयो!",
        xp_earned: "प्राप्त अङ्क",
        continue_map: "पहाडी यात्रा जारी राख्नुहोस् →",
        
        // Voice Studio
        voice_studio_title: "याक्थुङ आवाज रेकर्डिङ स्टुडियो",
        voice_studio_sub: "प्रत्येक अक्षर र शब्दका लागि आफ्नै मौलिक उच्चारण रेकर्ड गर्नुहोस्",
        voice_studio_desc: "कम्प्युटरको आवाज सधैं शुद्ध नहुन सक्छ। आफ्नै आवाज रेकर्ड गर्नुहोस् वा अडियो फाइल अपलोड गर्नुहोस् — एपभरि तपाईंको आफ्नै आवाज बज्नेछ!",
        record_voice: "आवाज रेकर्ड गर्नुहोस्",
        recording_now: "रेकर्ड हुँदैछ... रोक्न थिच्नुहोस्",
        stop_recording: "रेकर्ड रोक्नुहोस्",
        test_playback: "▶ आवाज सुन्नुहोस्",
        save_voice: "💾 आफ्नै आवाज सेभ गर्नुहोस्",
        upload_audio_file: "📁 फाइल अपलोड (.mp3/.wav)",
        download_clip: "📥 डाउनलोड (<id>.mp3)",
        reset_voice: "↺ पूर्वनिर्धारितमा फर्काउनुहोस्",
        recorded_voices_count: "रेकर्ड गरिएका आवाज",
        export_backup: "📦 सबै आवाज प्याक डाउनलोड (JSON)",
        import_backup: "📥 आवाज प्याक आयात गर्नुहोस्",
        filter_all: "सबै",
        filter_consonants: "व्यञ्जन वर्ण (२५)",
        filter_vowels: "स्वर वर्ण (९)",
        filter_extras: "विशेष चिन्हहरू",
        filter_matras: "मात्रा",
        filter_phrases: "गाउँले संवाद",
        custom_voice_active_badge: "🎙️ आफ्नै आवाज सक्रिय",
        
        // Account & Progress Backup
        auth_modal_title: "खाता तथा प्रगति सिङ्क",
        auth_modal_sub: "आफ्नो प्रगति, तारा, XP र आवाज सुरक्षित राख्न खाता बनाउनुहोस् वा साइन-इन गर्नुहोस्",
        signin_with_google: "गुगलबाट साइन-इन गर्नुहोस्",
        guest_status: "अतिथि मोडमा खेल्दै हुनुहुन्छ",
        guest_hint: "मोबाइल परिवर्तन गर्दा प्रगति नगुमोस् भन्नका लागि खाता बनाएर सुरक्षित राख्नुहोस्।",
        signed_in_badge: "● खाता जोडिएको छ",
        cloud_synced_badge: "क्लाउडमा सुरक्षित छ ✓",
        signout_btn: "साइन-आउट गर्नुहोस्",
        sync_now_btn: "🔄 अहिले सिङ्क गर्नुहोस्",
        
        // Credits Modal
        credits_modal_title: "श्रेय तथा योगदानकर्ताहरू",
        credits_modal_sub: "याक्थुङ पान एप निर्माणमा योगदान पुर्याउनुहुने सम्पूर्ण टोली तथा अग्रजहरू",
        core_team: "मूल परियोजना टोली",
        linguistics_voice: "मौलिक उच्चारण तथा सांस्कृतिक सल्लाह",
        script_research: "सिरीजङ्गा लिपि तथा व्याकरण अध्ययन",
        dev_design: "सफ्टवेयर निर्माण तथा अनुभव डिजाइन",
        special_thanks: "विशेष धन्यवाद तथा समुदाय",
        
        // Toast notifications
        lang_switched: "भाषा परिवर्तन भयो: नेपाली 🇳🇵",
        voice_saved: "आफ्नै आवाज सुरक्षित भयो:",
        voice_deleted: "पूर्वनिर्धारित उच्चारणमा फर्काइयो:",
        audio_exported: "अडियो फाइल डाउनलोड भयो:",
        backup_exported: "सबै आवाज ब्याकअप सुरक्षित भयो!",
        backup_imported: "आवाज प्याक सफलतापूर्वक आयात भयो!",
        signin_success: "गुगल साइन-इन सफल भयो! प्रगति सुरक्षित छ।",
        signout_success: "साइन-आउट भयो। प्रगति स्थानीय डिभाइसमा सुरक्षित छ।"
    }
};

let currentLanguage = 'en';

try {
    const savedLang = localStorage.getItem('yakthung_lang');
    if (savedLang === 'ne' || savedLang === 'en') {
        currentLanguage = savedLang;
    }
} catch (e) {
    currentLanguage = 'en';
}

function t(key, fallback = '') {
    const dict = I18N_DICTIONARY[currentLanguage] || I18N_DICTIONARY.en;
    if (dict && dict[key] !== undefined) {
        return dict[key];
    }
    const enDict = I18N_DICTIONARY.en;
    if (enDict && enDict[key] !== undefined) {
        return enDict[key];
    }
    return fallback || key;
}

function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ne') return;
    currentLanguage = lang;
    try {
        localStorage.setItem('yakthung_lang', lang);
    } catch (e) {}

    applyLanguageToDOM();
    updateLanguageSwitcherUI();

    // Re-render components that display dynamic localized labels
    if (typeof renderWindingMap === 'function') renderWindingMap();
    if (typeof updateHudDisplay === 'function') updateHudDisplay();
    if (typeof renderCreditsModal === 'function') renderCreditsModal();
    if (typeof updateVoiceStudioUI === 'function') updateVoiceStudioUI();
    if (typeof updateAuthUI === 'function') updateAuthUI();

    if (typeof showToast === 'function') {
        showToast(t('lang_switched'), lang === 'ne' ? '🇳🇵' : '🇬🇧');
    }
}

function toggleLanguage() {
    setLanguage(currentLanguage === 'en' ? 'ne' : 'en');
}

function updateLanguageSwitcherUI() {
    // Header language button
    const btnText = document.getElementById('hudLangText');
    const btnFlag = document.getElementById('hudLangFlag');
    if (btnText) btnText.textContent = currentLanguage.toUpperCase();
    if (btnFlag) btnFlag.textContent = currentLanguage === 'ne' ? '🇳🇵' : '🇬🇧';

    // Welcome Screen top-right button
    const wText = document.getElementById('welcomeLangText');
    const wFlag = document.getElementById('welcomeLangFlag');
    if (wText) wText.textContent = currentLanguage.toUpperCase();
    if (wFlag) wFlag.textContent = currentLanguage === 'ne' ? '🇳🇵' : '🇬🇧';

    // Welcome Screen card switchers (if present)
    const btnEn = document.getElementById('welcomeLangEn');
    const btnNe = document.getElementById('welcomeLangNe');
    if (btnEn && btnNe) {
        if (currentLanguage === 'en') {
            btnEn.className = 'flex-1 py-2 px-3 rounded-xl font-extrabold text-xs bg-emerald-600 text-white shadow-md transition flex items-center justify-center gap-1.5';
            btnNe.className = 'flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-slate-300 transition flex items-center justify-center gap-1.5';
        } else {
            btnEn.className = 'flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-slate-300 transition flex items-center justify-center gap-1.5';
            btnNe.className = 'flex-1 py-2 px-3 rounded-xl font-extrabold text-xs bg-emerald-600 text-white shadow-md transition flex items-center justify-center gap-1.5';
        }
    }
}

function applyLanguageToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.textContent = t(key);
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
            el.setAttribute('title', t(key));
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            el.setAttribute('placeholder', t(key));
        }
    });
}

// Automatically apply translations once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    applyLanguageToDOM();
    updateLanguageSwitcherUI();
});
