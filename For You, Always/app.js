const textH1 = "Dearest,";
const textP = "This page is a humble vessel for my feelings.";
const speed = 100; // Speed in milliseconds

function typeWriter(elementId, text, i, callback) {
    if (i < text.length) {
        document.getElementById(elementId).innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(elementId, text, i + 1, callback), speed);
    } else if (callback) {
        callback();
    }
}

// Start the sequence when the window loads
window.onload = () => {
    typeWriter("typewriter-h1", textH1, 0, () => {
        // Start typing the paragraph after the H1 is done
        setTimeout(() => {
            typeWriter("typewriter-p", textP, 0, () => {
                // Show the button after everything is typed
                document.getElementById('start-btn').classList.remove('hidden');
                document.getElementById('start-btn').classList.add('fade-in');
            });
        }, 500);
    });
};

document.getElementById('start-btn').addEventListener('click', function() {
    const music = document.getElementById('bg-music');
    music.play();

    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('hidden');
    
    // Smoothly scroll to the beginning of the main content
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    this.style.display = 'none';
});

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Canvas Animation
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let hearts = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Heart {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 10 + 5;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = 1;
    }
    draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#FF69B4'; // Vintage Burgundy
    ctx.beginPath();
    
    const x = this.x;
    const y = this.y;
    const s = this.size;

    // Move to the top center of the heart
    ctx.moveTo(x, y);
    
    // Left side of the heart
    ctx.bezierCurveTo(x, y - s/3, x - s, y - s/3, x - s, y + s/3);
    ctx.bezierCurveTo(x - s, y + s/1.5, x, y + s, x, y + s * 1.2);
    
    // Right side of the heart
    ctx.bezierCurveTo(x, y + s, x + s, y + s/1.5, x + s, y + s/3);
    ctx.bezierCurveTo(x + s, y - s/3, x, y - s/3, x, y);
    
    ctx.fill();
}
    update() {
        this.y -= this.speed;
        this.opacity -= 0.003;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.05) hearts.push(new Heart());
    hearts.forEach((h, i) => {
        h.update(); h.draw();
        if (h.opacity <= 0) hearts.splice(i, 1);
    });
    requestAnimationFrame(animate);
}
animate();