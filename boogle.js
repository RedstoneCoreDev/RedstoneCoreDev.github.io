// This file contains JavaScript code that adds interactivity to the Boogle search page.

// Wait for the DOM so element lookups never return null, plus defensive checks

document.addEventListener('DOMContentLoaded', () => {
    // --- Disclaimer Banner ---
    const DISCLAIMER_STORAGE_KEY = 'boogle_disclaimer_accepted';

    function initDisclaimer() {
        const disclaimerBanner = document.getElementById('disclaimer-banner');
        const disclaimerOverlay = document.getElementById('disclaimer-overlay');
        const disclaimerAccept = document.getElementById('disclaimer-accept');

        if (!disclaimerBanner || !disclaimerOverlay || !disclaimerAccept) {
            return;
        }

        const hasAccepted = localStorage.getItem(DISCLAIMER_STORAGE_KEY) === 'true';

        if (!hasAccepted) {
            // Show disclaimer
            disclaimerBanner.classList.add('active');
            disclaimerOverlay.classList.add('active');
        }

        disclaimerAccept.addEventListener('click', () => {
            // Hide disclaimer
            disclaimerBanner.classList.remove('active');
            disclaimerOverlay.classList.remove('active');
            localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
        });
    }

    // Initialize disclaimer on page load
    initDisclaimer();

    // Winter decorations: show snow/lights from November through February
    try {
        const now = new Date();
        const month = now.getMonth(); // 0 = Jan, 11 = Dec
        const isWinter = month === 10 || month === 11 || month === 0 || month === 1; // Nov, Dec, Jan, Feb
        if (isWinter) {
            document.body.classList.add('christmas');
            // add a little festive emoji to the page title
            try { document.title = `${document.title} | It's snowing!`; } catch(e){}

            // tweak visible header title text in a friendly way
            const headerTitle = document.getElementById('boogle-title');
            if (headerTitle) {
                const titleText = headerTitle.querySelector('.title-text');
                if (titleText) titleText.textContent = 'Search page';
            }

            // create decorative lights & falling snow
            (function createDecorations(){
                // lights
                const lightsEl = document.getElementById('lights');
                if (lightsEl) {
                    // create a string of bulbs across the top
                    const colors = ['#ff6b6b','#ffd166','#9be7ff','#a6ffb0','#ffb7f5'];
                    const count = 22;
                    lightsEl.innerHTML = '';
                    for (let i=0;i<count;i++){
                        const bulb = document.createElement('div');
                        bulb.className = 'bulb glow';
                        const color = colors[i % colors.length];
                        bulb.style.background = color;
                        // stagger transform for natural feel
                        bulb.style.transform = `rotate(${(Math.random()*8)-4}deg)`;
                        bulb.style.opacity = `${0.85 + Math.random()*0.15}`;
                        // create small spacing wrapper so bulbs distribute nicely
                        const wrap = document.createElement('div');
                        wrap.style.width = '24px'; wrap.style.display = 'flex'; wrap.style.justifyContent = 'center';
                        wrap.appendChild(bulb);
                        lightsEl.appendChild(wrap);
                    }
                }

                // falling snow (improved)
                const snowEl = document.getElementById('snow');
                if (!snowEl) return;
                snowEl.innerHTML = '';
                const flakes = 40;
                for (let i = 0; i < flakes; i++) {
                    const flake = document.createElement('div');
                    flake.className = 'snowflake';
                    flake.textContent = '❆';
                    const size = 10 + Math.random() * 22; // font size in px
                    flake.style.fontSize = `${size}px`;
                    flake.style.left = `${Math.random() * 100}vw`;
                    // staggered timings
                    const fallDur = 8 + Math.random() * 20; // seconds
                    const swayDur = 3 + Math.random() * 4; // seconds
                    const spinDur = 6 + Math.random() * 12; // seconds
                    flake.style.animationDuration = `${fallDur}s, ${swayDur}s, ${spinDur}s`;
                    flake.style.animationDelay = `${Math.random() * 6}s, 0s, 0s`;
                    flake.style.opacity = `${0.5 + Math.random() * 0.6}`;
                    snowEl.appendChild(flake);
                }
            })();
        }
    } catch (e) {
        // non-critical — don't interfere with the rest of the script if something fails
        console.warn('Boogle: seasonal decorations failed to initialize', e);
    }
    const input = document.getElementById('search-input');
    const button = document.getElementById('search-button');
    const engineSelect = document.getElementById('engine-select');
    const resultsEl = document.getElementById('results');
    const feeling = document.getElementById('feeling');
    const historyDropdown = document.getElementById('history-dropdown');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsClose = document.getElementById('settings-close');
    const openModeSelect = document.getElementById('open-mode');
    const enableHistorySelect = document.getElementById('enable-history');

    // Defensive check — log a helpful error and stop if critical elements are missing
    if (!input || !button || !engineSelect || !resultsEl) {
        console.error('Boogle: missing DOM elements.', { input, button, engineSelect, resultsEl, feeling });
        return;
    }

    // --- Settings + History store (localStorage-backed) ---
    const STORAGE_KEYS = {
        history: 'boogle_history_v1',
        settings: 'boogle_settings_v1'
    };

    function loadSettings(){
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.settings);
            if (!raw) return { openMode: 'new', historyEnabled: true };
            const obj = JSON.parse(raw);
            return { openMode: obj.openMode || 'new', historyEnabled: (typeof obj.historyEnabled === 'boolean' ? obj.historyEnabled : true) };
        } catch(e) { return { openMode: 'new', historyEnabled: true }; }
    }

    function saveSettings(s){
        try { localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(s)); } catch(e) { console.warn('failed to save settings', e); }
    }

    let SETTINGS = loadSettings();
    // populate selects
    if (openModeSelect) openModeSelect.value = SETTINGS.openMode;
    if (enableHistorySelect) enableHistorySelect.value = SETTINGS.historyEnabled ? 'on' : 'off';

    function loadHistory(){
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.history);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr)) return [];
            return arr;
        } catch(e){ return []; }
    }

    function saveHistory(arr){
        try { localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(arr)); } catch(e) { console.warn('failed to save history', e); }
    }

    function addSearchToHistory(term){
        if (!term || !term.trim()) return;
        if (!SETTINGS.historyEnabled) return;
        const history = loadHistory();
        history.push({ term: term.trim(), ts: Date.now() });
        // cap history to last 200 entries
        if (history.length > 200) history.splice(0, history.length - 200);
        saveHistory(history);
        // update any visible dropdown
        if (historyDropdown) renderHistoryDropdown();
    }

    function clearHistory(){ saveHistory([]); }

    // compute last N unique searches (from newest to older)
    function computeLastUnique(count){
        const history = loadHistory();
        const seen = new Set();
        const list = [];
        for (let i = history.length - 1; i >= 0 && list.length < count; i--) {
            const t = history[i].term;
            if (!seen.has(t)) { seen.add(t); list.push(t); }
        }
        return list;
    }

    // compute top terms within the last `days` days, returns array of {term,count,lastTs}
    function computeTopWithinDays(days){
        const history = loadHistory();
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        const counts = new Map();
        for (const item of history){ if (item.ts >= cutoff){ const c = counts.get(item.term) || { count:0, lastTs:0 }; c.count++; c.lastTs = Math.max(c.lastTs, item.ts); counts.set(item.term, c); }}
        const arr = Array.from(counts.entries()).map(([term, data]) => ({ term, count: data.count, lastTs: data.lastTs }));
        arr.sort((a,b)=> (b.count - a.count) || (b.lastTs - a.lastTs));
        return arr;
    }

    // prepare unique list of suggestions following rules: last 3 unique, then top within 4 days, then top within 8 days, avoiding duplicates
    function prepareSuggestions(){
        if (!SETTINGS.historyEnabled) return [];
        const suggestions = [];
        const added = new Set();

        // last 3
        const last3 = computeLastUnique(3);
        for (const t of last3){ if (!added.has(t)){ suggestions.push({ type: 'recent', term: t }); added.add(t); }}

        // top in last 4 days
        const top4 = computeTopWithinDays(4);
        for (const item of top4){ if (!added.has(item.term)){ suggestions.push({ type: 'top-4d', term: item.term, count: item.count }); added.add(item.term); break; }}

        // top in last 8 days
        const top8 = computeTopWithinDays(8);
        for (const item of top8){ if (!added.has(item.term)){ suggestions.push({ type: 'top-8d', term: item.term, count: item.count }); added.add(item.term); break; }}

        return suggestions;
    }

    function renderHistoryDropdown(){
        if (!historyDropdown) return;
        historyDropdown.innerHTML = '';
        if (!SETTINGS.historyEnabled) { historyDropdown.hidden = true; return; }
        const suggestions = prepareSuggestions();
        if (!suggestions.length){ historyDropdown.innerHTML = '<div class="history-section">No recent searches</div>'; historyDropdown.hidden = false; return; }

        for (const s of suggestions){
            const el = document.createElement('div');
            el.className = 'history-item';
            el.setAttribute('role', 'option');
            const left = document.createElement('div');
            left.textContent = s.term;
            const right = document.createElement('div');
            if (s.type === 'recent') right.innerHTML = '<span class="history-count">recent</span>'; else if (s.type === 'top-4d') right.innerHTML = `<span class="history-count">top ${s.count} in 4d</span>`; else if (s.type === 'top-8d') right.innerHTML = `<span class="history-count">top ${s.count} in 8d</span>`;
            el.appendChild(left);
            el.appendChild(right);
            el.addEventListener('click', () => { input.value = s.term; historyDropdown.hidden = true; doSearch(s.term); });
            historyDropdown.appendChild(el);
        }
        historyDropdown.hidden = false;
    }

    // wire settings UI
    const searchContainer = document.querySelector('.search-container');
    if (settingsBtn && settingsPanel){
        settingsBtn.addEventListener('click', () => {
            // toggle settings mode
            const active = searchContainer && searchContainer.classList.contains('settings-active');
            if (active) {
                // close
                if (searchContainer) searchContainer.classList.remove('settings-active');
                settingsPanel.hidden = true; settingsPanel.setAttribute('aria-hidden', 'true');
            } else {
                // open
                if (searchContainer) searchContainer.classList.add('settings-active');
                settingsPanel.hidden = false; settingsPanel.setAttribute('aria-hidden', 'false');
                // hide history dropdown when opening settings
                if (historyDropdown) historyDropdown.hidden = true;
                // keep user on top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    if (settingsClose){
        settingsClose.addEventListener('click', () => {
            settingsPanel.hidden = true; settingsPanel.setAttribute('aria-hidden', 'true');
            if (searchContainer) searchContainer.classList.remove('settings-active');
        });
    }

    if (openModeSelect){
        openModeSelect.addEventListener('change', (e) => { SETTINGS.openMode = openModeSelect.value; saveSettings(SETTINGS); });
    }
    if (enableHistorySelect){
        enableHistorySelect.addEventListener('change', (e) => { SETTINGS.historyEnabled = (enableHistorySelect.value === 'on'); saveSettings(SETTINGS); renderHistoryDropdown(); });
    }

    function sanitize(s){
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function clearResults(){ resultsEl.innerHTML = ''; }

    function showMessage(msg){
        clearResults();
        const p = document.createElement('div');
        p.className = 'small-muted';
        p.textContent = msg;
        resultsEl.appendChild(p);
    }

    async function fetchDuckDuckGo(query){
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1&no_html=1&skip_disambig=1`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error('fetch failed');
        return await res.json();
    }

    function renderResultsFromDDG(data, query){
        clearResults();
        let count = 0;
        if (data.AbstractText) {
            const rc = document.createElement('div');
            rc.className = 'result-card';
            rc.innerHTML = `
                <a class="title" href="${sanitize(data.AbstractURL || 'https://duckduckgo.com/?q='+encodeURIComponent(query))}" target="_blank" rel="noopener noreferrer">${sanitize(data.Heading || query)}</a>
                <div class="snippet">${sanitize(data.AbstractText)}</div>
                ${data.AbstractURL ? `<div class="url">${sanitize(data.AbstractURL)}</div>` : ''}
            `;
            resultsEl.appendChild(rc);
            count++;
        }

        const pushItem = (txt, url) => {
            const rc = document.createElement('div');
            rc.className = 'result-card';
            rc.innerHTML = `
                <a class="title" href="${sanitize(url)}" target="_blank" rel="noopener noreferrer">${sanitize(txt)}</a>
                <div class="url">${sanitize(url)}</div>
            `;
            resultsEl.appendChild(rc);
        };

        if (Array.isArray(data.RelatedTopics)){
            for (const item of data.RelatedTopics){
                if (item.Topics && Array.isArray(item.Topics)){
                    for (const sub of item.Topics){
                        if (sub.Text && sub.FirstURL){
                            pushItem(sub.Text, sub.FirstURL);
                            count++; if (count>=10) break;
                        }
                    }
                } else if (item.Text && item.FirstURL) {
                    pushItem(item.Text, item.FirstURL);
                    count++; if (count>=10) break;
                }
                if (count>=10) break;
            }
        }

        if (!count) {
            showMessage('No instant results found — opening the engine page instead.');
        }
    }

    async function doSearch(query){
        const engine = engineSelect.value;
        if (!query.trim()) return;
        // persist search (if history enabled in settings)
        addSearchToHistory(query);
        clearResults();
        showMessage('Searching...');

        if (engine === 'google') {
            const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            const target = (SETTINGS.openMode === 'new') ? '_blank' : '_self';
            try { window.open(url, target); } catch(e) { window.open(url, '_blank'); }

            try {
                const dd = await fetchDuckDuckGo(query);
                renderResultsFromDDG(dd, query);
            } catch {
                showMessage('Opened Google; DuckDuckGo instant API unavailable.');
            }
        } else {
            try {
                const dd = await fetchDuckDuckGo(query);
                const hasResults = (dd && (dd.AbstractText || (dd.RelatedTopics && dd.RelatedTopics.length)));
                if (!hasResults) {
                    showMessage('No instant answers — opening DuckDuckGo search.');
                    const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                    const target = (SETTINGS.openMode === 'new') ? '_blank' : '_self';
                    try { window.open(url, target); } catch(e) { window.open(url, '_blank'); }
                } else {
                    renderResultsFromDDG(dd, query);
                }
            } catch {
                showMessage('DuckDuckGo API blocked. Opening DuckDuckGo search.');
                const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                const target = (SETTINGS.openMode === 'new') ? '_blank' : '_self';
                try { window.open(url, target); } catch(e) { window.open(url, '_blank'); }
            }
        }
    }

    // events
    button.addEventListener('click', () => doSearch(input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(input.value); });
    input.addEventListener('focus', () => { renderHistoryDropdown(); });
    // hide when user presses Escape
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') historyDropdown && (historyDropdown.hidden = true); });
    // hide dropdown on blur (short delay to allow clicks inside the dropdown)
    input.addEventListener('blur', () => { if (historyDropdown) setTimeout(()=> { historyDropdown.hidden = true; }, 150); });
    // hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!historyDropdown) return;
        const sbar = document.querySelector('.search-bar');
        if (sbar && (sbar.contains(e.target) || historyDropdown.contains(e.target))) return;
        historyDropdown.hidden = true;
    });
    if (feeling) {
        feeling.addEventListener('click', () => {
            const funTerms = ['aesthetic cats', 'coding jokes', 'pixel animations', 'digital doodles', 'cozy desk setups', 'retro sci-fi art', 'space nebula photos', 'galaxy aesthetics', 'weird animal pics', 'glitch wallpapers', 'minimalistic shapes', 'lofi backgrounds', 'cute penguins', 'retro robots', 'geometry patterns', 'floating islands art', 'cosmic vibes', 'cute frogs', 'techcore aesthetics', 'vintage posters', 'rainy window wallpapers', 'sunset skylines', 'abstract clouds', 'space station renders', 'cute foxes', 'cyberpunk streets', 'retro UI concepts', 'nature closeups', 'weird facts', 'illusion patterns', 'led room aesthetics', 'pastel gradients', 'forest wallpapers', 'mountain panoramas', 'vaporwave statues', 'digital landscapes', 'fantasy castles', 'retro neon signs', 'minimal rooms', 'cute owls', 'star trails photography', 'jellyfish photos', 'deep sea creatures', 'robot concept art', 'isometric rooms', 'cute raccoons', 'glowing mushrooms art', 'dreamy skies', 'indie game art'];
            const pick = funTerms[Math.floor(Math.random()*funTerms.length)];
            input.value = pick;
            doSearch(pick);
        });
    }

    // clear history handler
    const clearHistoryBtn = document.getElementById('clear-history');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            clearHistory();
            renderHistoryDropdown();
            showMessage('Search history cleared.');
        });
    }

    // reset all data handler
    const resetAllBtn = document.getElementById('reset-all');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset ALL data? This will clear:\n- Search history\n- Settings\n- Disclaimer acceptance\n\nThis cannot be undone.')) {
                // Clear all localStorage
                localStorage.clear();
                showMessage('All data reset. Refreshing page...');
                // Refresh page after a short delay
                setTimeout(() => location.reload(), 800);
            }
        });
    }

    // --- Fake AI Chatbot ---
    const aiToggleBtn = document.getElementById('ai-toggle');
    const aiPanel = document.getElementById('ai-panel');
    const aiCloseBtn = document.getElementById('ai-close');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-messages');

    // Fixed AI responses based on keywords
    const aiResponses = {
        'hello|hi|hey': [
            'Hello! I\'m Arg the AI Assistant. How can I help ya search today?',
            'Hey there! Ready to search with Boogle? 🔍',
            'Greetings! What would ya like to find?'
        ],
        'help': [
            'I can help ya with searching! Try using the search bar to find information. Ya can also switch between Google and DuckDuckGo engines.',
            'Need help? I\'m here to guide ya through Boogle\'s features. Ask about search engines, history, or settings!',
            'I can assist with: searching, settings, history management, or general questions!'
        ],
        'search|find': [
            'Great! Use the search bar at the top to enter your query. Ya can choose between Google or DuckDuckGo.',
            'To search, simply type in the search box and press Enter or click the Search button!',
            'Searching is easy - type what ya\'re looking for and let Boogle do the work!'
        ],
        'google|duckduckgo|engine': [
            'Boogle supports both Google and DuckDuckGo! Switch between them using the engine selector.',
            'Ya can choose your preferred search engine from the dropdown. Try DuckDuckGo for privacy-focused results!',
            'Google gives broad results, DuckDuckGo prioritizes privacy. Pick your favorite!'
        ],
        'history': [
            'Your search history is stored locally and can be accessed when ya focus on the search bar. Ya can disable it in settings.',
            'History saves your recent searches! Ya can clear it anytime from the settings panel.',
            'Search history helps ya quickly find past searches. It\'s all stored privately on your device.'
        ],
        'settings': [
            'Open Settings (⚙️) to customize how Boogle opens results and manage your search history.',
            'Settings let ya choose to open results in a new tab or same tab, and toggle history on/off.',
            'Adjust preferences like opening behavior and history tracking in the Settings panel!'
        ],
        'feeling|lucky|boogley': [
            'The "I\'m Feeling Boogley" button shows ya random fun searches! Try it for a surprise.',
            'Click "I\'m Feeling Boogley" to get a random aesthetic or fun search term. Great for inspiration!',
            'That button picks a random fun topic for ya to explore. It\'s like Google\'s "I\'m Feeling Lucky"!'
        ],
        'privacy|secure': [
            'Boogle respects your privacy! Search history is stored only on your device, not on any server (there is no server).',
            'Your data stays with ya. Boogle doesn\'t track ya or send data anywhere.',
            'Privacy first! All your search history remains stored locally on your device.'
        ],
        'about|what|who': [
            'Boogle is a fun search interface created by RedstoneCoreDev. It\'s not affiliated with Google!',
            'I\'m Arg the AI of Boogle Search page - a fancy search page that lets ya search with Google or DuckDuckGo but fancy!',
            'Boogle Search page is a custom search interface made just for fun and has no use besides being fancy. Not affiliated with Google, despite the name!'
        ],
        'thanks|thank you|appreciate': [
            'Ya\'re welcome! Happy searching! 😊',
            'Always glad to help! Enjoy using the Boogle Search page!',
            'My pleasure! Let me know if ya need anything else!'
        ],
        'bow|bows': [
            'I like bows!',
            'Bows are so pretty!',
            'Bows are fun to make!'
        ],
        'moon': [
            'The moon is beautiful tonight.',
            'I love looking at the moon!',
            'Moonlight is so calming.'
        ],
        'good night|sleep': [
            'Good night! Sweet dreams! 🌙',
            'Time to rest! See ya later! 😴',
            'Sleep well and recharge for tomorrow!'
        ]
    };

    // Default responses if no keyword matches
    const defaultResponses = [
        'That\'s interesting! How can I help ya with your search?',
        'I\'m here to help! Do ya have any questions about the Boogle Search page?',
        'I didn\'t quite understand, but I\'m happy to help! Ask about searching, settings, or features.',
        'Feel free to ask me anything about the Boogle Search page!',
        'Interesting question! I\'m learning... but I\'m just a simple AI. Try asking about search features!',
        'Zzz...',
        'Let me sleep...',
    ];

    function getAIResponse(userMessage) {
        const lower = userMessage.toLowerCase();
        
        // Check each keyword pattern
        for (const [keywords, responses] of Object.entries(aiResponses)) {
            const patterns = keywords.split('|');
            if (patterns.some(p => lower.includes(p))) {
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        // Return random default response if no keywords match
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    function addAIMessage(text, isUser = false) {
        const msg = document.createElement('div');
        msg.className = `ai-message ${isUser ? 'user' : 'bot'}`;
        msg.textContent = text;
        aiMessages.appendChild(msg);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function sendAIMessage() {
        const userText = aiInput.value.trim();
        if (!userText) return;

        addAIMessage(userText, true);
        aiInput.value = '';

        // Simulate typing delay
        setTimeout(() => {
            const response = getAIResponse(userText);
            addAIMessage(response, false);
        }, 300 + Math.random() * 400);
    }

    // AI Chatbot event listeners
    if (aiToggleBtn && aiPanel && aiCloseBtn && aiSendBtn && aiInput) {
        aiToggleBtn.addEventListener('click', () => {
            const isHidden = aiPanel.hidden;
            aiPanel.hidden = !isHidden;
            aiPanel.setAttribute('aria-hidden', isHidden);
            if (!isHidden) aiInput.focus();
        });

        aiCloseBtn.addEventListener('click', () => {
            aiPanel.hidden = true;
            aiPanel.setAttribute('aria-hidden', 'true');
        });

        aiSendBtn.addEventListener('click', sendAIMessage);
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendAIMessage();
        });

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            const headerControls = document.querySelector('.header-controls');
            if (headerControls && aiPanel && (headerControls.contains(e.target) || aiPanel.contains(e.target))) return;
            if (aiPanel) {
                aiPanel.hidden = true;
                aiPanel.setAttribute('aria-hidden', 'true');
            }
        });

        // Add initial greeting when page loads
        addAIMessage('Howdy! I\'m Arg, the AI Assistant of the Boogle Search page. What would ya like to know?', false);
    }
});