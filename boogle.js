// This file contains JavaScript code that adds interactivity to the Boogle search page.

// Wait for the DOM so element lookups never return null, plus defensive checks

document.addEventListener('DOMContentLoaded', () => {
    // December-only decorations: add class, update title, and generate snowflakes
    try {
        const now = new Date();
        const isDecember = now.getMonth() === 11; // 0 = Jan, 11 = Dec
        if (isDecember) {
            document.body.classList.add('christmas');
            // add a little festive emoji to the page title
            try { document.title = `${document.title} | It's December!`; } catch(e){}

            // tweak visible header title text in a friendly way
            const headerTitle = document.getElementById('boogle-title');
            if (headerTitle) {
                const titleText = headerTitle.querySelector('.title-text');
                if (titleText) titleText.textContent = 'Search page';
            }

            // create decorative lights & falling snow
            (function createDecorations(){
                // lights
                /*const lightsEl = document.getElementById('lights');
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
                }*/

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
            const funTerms = ['cats', 'coding memes', 'retro art', 'quirky facts', 'space wallpapers'];
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
});