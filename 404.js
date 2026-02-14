
const canvas = document.getElementById('blackhole-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const starCount = 2000;

for (let i = 0; i < starCount; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    baseAlpha: 0.2 + Math.random() * 0.5,
    offset: Math.random() * 100
  });
}

const blackHole = {
    x: canvas.width / 2,
    y: canvas.height / 2 + canvas.height / 5.5,
    radius: 300,
    gravitationalRadius: 250
};

// Particle class
class Particle {
    constructor() {
        // Distance from black hole (0 = event horizon, 1 = edge)
        this.distance = Math.random() * 0.9 + 0.05; // 0.3 to 1.0
        
        // Angle around the black hole
        this.angle = Math.random() * Math.PI * 2;
        
        // Orbital speed (closer = slower due to time dilation, farther = faster)
        // This is counterintuitive but correct for accretion disks!
        this.speed = (1 - this.distance) * 0.004 + this.distance * 0.012;
        
        // Vertical position (creates the disk)
        this.verticalOffset = (Math.random() - 0.5) * 20 * this.distance;
        
        // Size based on distance
        this.size = (1 - this.distance) * 3 + 1;
    }
    
    update() {
        // Rotate around black hole
        this.angle += this.speed;
        
        // Slight vertical oscillation
        this.verticalOffset += Math.sin(this.angle * 3) * 0.0333;
    }
    
    draw() {
        // Calculate 3D position
        const radius = blackHole.radius + this.distance * blackHole.gravitationalRadius;
        
        // X and Y in orbital plane
        const orbitalX = Math.cos(this.angle) * radius;
        const orbitalY = Math.sin(this.angle) * radius;
        
        // Apply perspective (tilt the disk)
        const tilt = 0.3;
        
        // Z-depth for occlusion (behind black hole)
        const z = Math.sin(this.angle) * radius;
        const isBehind = z < 0;
        
        let x, y;
        
        if (isBehind) {
            // GRAVITATIONAL LENSING: particles behind appear ABOVE the black hole
            // The closer to the black hole, the more they bend upward
            const bendFactor = 2.5 - (this.distance * 0.8); // Closer = more bending
            const lensedY = -Math.abs(orbitalY * tilt) * (1 + bendFactor); // Negative = upward
            
            x = blackHole.x + orbitalX;
            y = blackHole.y + lensedY + this.verticalOffset;
        } else {
            // Front particles: normal position
            x = blackHole.x + orbitalX;
            y = blackHole.y + orbitalY * tilt + this.verticalOffset;
        }
        
        // Color based on distance (white -> orange -> red)
        let r, g, b, a;
        if (this.distance < 0.4) {
            const t = this.distance / 0.4;
            r = 255;
            g = 255 - t * 100;
            b = 255 - t * 200;
        } else if (this.distance < 0.7) {
            const t = (this.distance - 0.4) / 0.3;
            r = 255;
            g = 155 - t * 50;
            b = 55 - t * 55;
        } else {
            const t = (this.distance - 0.7) / 0.3;
            r = 255;
            g = 105 - t * 105;
            b = 0;
        }
        
        // Draw particle
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particles = [];
for (let i = 0; i < 1500; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    // Clear canvas with slight trail effect
    ctx.fillStyle = 'rgba(10, 10, 21, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw event horizon (black circle)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let s of stars) {
    const alpha = s.baseAlpha + Math.sin(30 + s.offset) * 0.2;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(s.x, s.y, 1, 1);
  }

  requestAnimationFrame(draw);
}

draw();

// Update black hole position on resize
window.addEventListener('resize', () => {
    blackHole.x = canvas.width / 2;
    blackHole.y = canvas.height / 2;
});