const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];
let planets = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars(count = 150) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3
    });
  }
}

function createPlanets(count = 7) {
  planets = [];
  for (let i = 0; i < count; i++) {
    planets.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 12 + 8,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    });
  }
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  for (let s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let p of planets) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createStars();
  createPlanets();
});

resizeCanvas();
createStars();
//createPlanets();
drawScene();