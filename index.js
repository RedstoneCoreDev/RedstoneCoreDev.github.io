// This file contains the JavaScript code for the website. 
// It may include functionality such as event handling, DOM manipulation, and other interactive features.

document.addEventListener('DOMContentLoaded', () => {
    const greeting = document.createElement('h1');
    greeting.textContent = 'Welcome to My Basic Website!';
    document.body.appendChild(greeting);

    const button = document.createElement('button');
    button.textContent = 'Click Me!';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        alert('Button was clicked!');
    });
});