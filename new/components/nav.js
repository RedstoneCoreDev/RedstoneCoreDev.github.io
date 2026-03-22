class rednav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
<nav>
    <div class="nav-logo"><em>RedstoneCoreDev</em></div>
    <div class="nav-space" id="nav-space"></div>
    <button class="nav-button">Home</button>
    <button class="nav-button" onclick="location.href='#projects'">Projects</button>
    <button class="nav-button" onclick="location.href='#websites'">Websites</button>
    <button class="nav-button" onclick="location.href='#docs'">Documenations</button>
    <div class="nav-search">
        <input type="text" placeholder="Search..." id="search-input" autocomplete="off">
        <div class="search-drop" id="search-drop"></div>
    </div>
</nav>
`
    }
}
customElements.define('red-nav', rednav)