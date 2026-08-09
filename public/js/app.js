// 1. Fetch JSON Data dynamically based on language
async function fetchLanguageData(lang) {
    try {
        const url = `/languages/${lang}/home.json`;
        const res = await fetch(url, { cache: 'no-cache' });
        
        if (!res.ok) {
            console.warn(`Failed to fetch ${url}`);
            return null; // Return null if file is missing
        }
        
        return await res.json();
    } catch (error) {
        console.error("Could not load language files", error);
        return null;
    }
}

// 2. The main translation switch function
async function switchLanguage(lang, event) {
    if (event) event.preventDefault(); // Prevent link jump[cite: 11]

    // Fetch the translation data for the selected language
    const langData = await fetchLanguageData(lang);
    if (!langData) return; // Stop if the fetch failed

    // Save choice and update Document attributes
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    // Update the URL dynamically via pushState[cite: 11]
    const newUrl = `${window.location.pathname}?lang=${lang}`;
    window.history.pushState({ language: lang }, '', newUrl); //[cite: 11]

    // Trigger CSS animation[cite: 11]
    const contentDiv = document.getElementById('dynamic-content');
    contentDiv.classList.remove('content-fade'); //[cite: 11]
    
    // Short timeout to let browser register class removal[cite: 11]
    setTimeout(() => {
        
        // Loop through every element with a data-i18n attribute and update text
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                element.innerText = langData[key];
            }
        });
        
        // Trigger Animation back on[cite: 11]
        contentDiv.classList.add('content-fade'); //[cite: 11]
    }, 50); //[cite: 11]

    // Update Button Styling[cite: 11]
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active'); //[cite: 11]
        if (btn.id === `lang-${lang}`) {
            btn.classList.add('active'); //[cite: 11]
        }
    });
}

// 3. On Page Load Initialization
window.addEventListener('DOMContentLoaded', () => {
    // Check URL parameters first, then localStorage, fallback to English
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const savedLang = localStorage.getItem('language');
    
    const validLangs = ['en', 'nl'];
    let initialLang = 'en';

    if (urlLang && validLangs.includes(urlLang)) {
        initialLang = urlLang;
    } else if (savedLang && validLangs.includes(savedLang)) {
        initialLang = savedLang;
    }

    // Fire the initial load
    switchLanguage(initialLang);
});

// 4. Handle Browser Back/Forward Buttons smoothly[cite: 11]
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.language) { //[cite: 11]
        switchLanguage(event.state.language); //[cite: 11]
    } else {
        switchLanguage('en'); // Default fallback[cite: 11]
    }
});