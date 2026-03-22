class redfooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
<footer>
    <p>&copy; 2026 RedstoneCoreDev</p>
</footer>
`
    }
}
customElements.define('red-footer', redfooter)