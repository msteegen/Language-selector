// Function to fetch language data
async function fetchLanguageData(lang) {
    const modules = ['home', 'common', 'world'];

    try {
        const promises = modules.map(async (module) => {
            const res = await fetch(`languages/${lang}/${module}.json`);
            
            if (!res.ok) {
                console.warn(`Could not load module "${module}" for language "${lang}".`);
                return {};
            }

            const text = await res.text();
            // Fall back to empty object if file is empty
            return text.trim() ? JSON.parse(text) : {};
        });

        const dataArrays = await Promise.all(promises);

        // Merge all objects into one
        return Object.assign({}, ...dataArrays);
    } catch (error) {
        console.error("Could not load language files", error);
        return {};
    }
}

// Function to update static text on the page
function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            // Find the associated label if it exists
            const label = document.querySelector(`label[for="${element.id}"]`);
            
            // 1. Always update the label if found
            if (label) {
                label.innerHTML = langData[key];
            }

            // 2. Always update placeholder if the element is an input
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = langData[key];
            }

            // 3. Update innerHTML for standard text tags (h1, p, etc.) 
            // only if they aren't inputs (to avoid overwriting input values)
            if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
                element.innerHTML = langData[key];
            }
        }
    });
}

// Function to change language
async function changeLanguage(lang) {
    // Save language to localStorage
    localStorage.setItem('language', lang);
    
    const langData = await fetchLanguageData(lang);
    window.currentLangData = langData;
    
    // Update direction and HTML attributes
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    updateContent(langData);
    toggleArabicStylesheet(lang);

    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `lang-${lang}`);
    });
}

function toggleArabicStylesheet(lang) {
    const head = document.querySelector('head');
    let link = document.querySelector('#styles-link');
    if (lang === 'ar') {
        if (!link) {
            link = document.createElement('link');
            link.id = 'styles-link';
            link.rel = 'stylesheet';
            link.href = './css/style-ar.css';
            head.appendChild(link);
        }
    } else if (link) {
        link.remove();
    }
}

// Function to bind click events to language selection links
function setupLanguageSwitcher() {
    document.querySelectorAll('.mobile-action[data-type="language"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents the link from scrolling to the top (#)
            
            const selectedLang = link.getAttribute('data-value');
            if (selectedLang) {
                changeLanguage(selectedLang);
            }
        });
    });
}

// Initial load on page start
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Get raw parameter from URL
    const rawUrlLang = new URLSearchParams(window.location.search).get('lang');
    
    let cleanUrlLang = null;

    // 2. Extract strictly 2 plain letters (e.g., extracts "nl" out of malformed URL text)
    if (rawUrlLang) {
        const match = rawUrlLang.match(/[a-zA-Z]{2}/);
        if (match) {
            cleanUrlLang = match[0].toLowerCase();
        }
    }

    const supportedLanguages = ['en', 'nl'];

    // 3. Check if extracted code is supported
    const validUrlLang = supportedLanguages.includes(cleanUrlLang) ? cleanUrlLang : null;
    
    // 4. Priority: Valid URL param -> localStorage -> Default 'en'
    const userPreferredLanguage = validUrlLang || localStorage.getItem('language') || 'en';
    
    // 5. Load modules
    await changeLanguage(userPreferredLanguage);
    
    setupLanguageSwitcher();
});
