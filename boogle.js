// This file contains JavaScript code that adds interactivity to the Boogle search page.

// Wait for the DOM so element lookups never return null, plus defensive checks

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('search-input');
    const button = document.getElementById('search-button');
    const engineSelect = document.getElementById('engine-select');
    const resultsEl = document.getElementById('results');
    const feeling = document.getElementById('feeling');

    // Defensive check — log a helpful error and stop if critical elements are missing
    if (!input || !button || !engineSelect || !resultsEl) {
        console.error('Boogle: missing DOM elements.', { input, button, engineSelect, resultsEl, feeling });
        return;
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
        clearResults();
        showMessage('Searching...');

        if (engine === 'google') {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');

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
                    showMessage('No instant answers — opening DuckDuckGo search in a new tab.');
                    window.open(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, '_blank');
                } else {
                    renderResultsFromDDG(dd, query);
                }
            } catch {
                showMessage('DuckDuckGo API blocked. Opening DuckDuckGo search in a new tab.');
                window.open(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, '_blank');
            }
        }
    }

    // events
    button.addEventListener('click', () => doSearch(input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(input.value); });
    if (feeling) {
        feeling.addEventListener('click', () => {
            const funTerms = ['cats', 'coding memes', 'retro art', 'quirky facts', 'space wallpapers'];
            const pick = funTerms[Math.floor(Math.random()*funTerms.length)];
            input.value = pick;
            doSearch(pick);
        });
    }
});