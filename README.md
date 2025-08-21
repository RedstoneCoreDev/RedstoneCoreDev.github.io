# Basic Website

This project is a simple static website that demonstrates the use of HTML, CSS, and JavaScript. It includes a basic structure and styling, along with some interactive features.

## Project Structure

```
basic-website
├── src
│   ├── index.html      # Main HTML document
│   ├── styles.css      # Styles for the website
│   └── app.js          # JavaScript functionality
├── package.json        # npm configuration file
└── README.md           # Project documentation
```

## Getting Started

To set up and run the website locally, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd basic-website
   ```

2. **Install dependencies** (if any):
   ```
   npm install
   ```

3. **Open the HTML file**:
   Open `src/index.html` in your web browser to view the website.

## Features

- Responsive design
- Basic styling with CSS
- Interactive elements using JavaScript

## License

This project is licensed under the MIT License.


Linktree-en
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>RedstoneCoreDev - Linktrees</title>
  <link rel="icon" type="image/x-icon" href="Red.jpg" />
  <link rel="stylesheet" href="style.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: radial-gradient(circle at top left, rgba(255,0,0,0.2), transparent 60%),
                  radial-gradient(circle at bottom right, rgba(0,0,255,0.2), transparent 60%),
                  radial-gradient(circle at top right, rgba(128,0,128,0.25), transparent 70%),
                  #0d0d0d;
      color: white;
    }

    header {
      background: rgba(0,0,0,0.7);
      padding: 10px;
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: auto;
    }

    .nav-button {
      background: transparent;
      border: 1px solid #fff;
      color: #fff;
      margin: 0 5px;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.3s;
    }

    .nav-button:hover {
      background: #ff0000;
      border-color: #ff0000;
    }

    .header-title h1 {
      font-size: 1.5em;
      margin: 0;
    }

    .content {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 100px;
    }

    .card {
      background: rgba(0,0,0,0.6);
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      text-align: center;
      max-width: 600px;
    }

    .card h3 {
      margin-top: 0;
      color: #ffcc00;
    }

    .card button {
      background: #222;
      border: 1px solid #ff0000;
      color: #fff;
      padding: 10px 20px;
      border-radius: 10px;
      margin-top: 15px;
      cursor: pointer;
      transition: 0.3s;
    }

    .card button:hover {
      background: #ff0000;
    }

    footer {
      background: rgba(0,0,0,0.8);
      padding: 15px;
      text-align: center;
      font-size: 0.9em;
    }

    a {
      color: #4da6ff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <header class="header" id="header">
    <div class="header-content">
      <nav class="nav">
        <button class="nav-button" onclick="location.href='home-en.html'">Home</button>
        <button class="nav-button" onclick="location.href='about-en.html'">Projects</button>
        <button class="nav-button" onclick="location.href='redservices-en.html'">Red Services</button>
        <button class="nav-button" onclick="location.href='websites-en.html'">Websites</button>
        <button class="nav-button">Linktrees</button>
        <button class="nav-button" onclick="location.href='contact-en.html'">RDT</button>
      </nav>
      <div class="header-title">
        <h1>RedstoneCoreDev</h1>
      </div>
    </div>
  </header>

  <div class="content">
    <div class="card">
      <h3>Linktrees</h3>
      <p>Linktrees are just for special "customers".</p>
      <button onclick="location.href='deviltree.html'">Linktree from Devil of Doom</button>
    </div>
  </div>

  <footer>
    <p>Contact</p>
    <p>You can reach me at <a href="mailto:redstone9263@gmail.com">redstone9263@gmail.com</a> or <a href="mailto:RedstoneCoreDev#twoblade.com">RedstoneCoreDev#twoblade.com</a>.</p>
    <p>&copy; 2025 RedstoneCoreDev</p>
  </footer>
</body>
</html>
