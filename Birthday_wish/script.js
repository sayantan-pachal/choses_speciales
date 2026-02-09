const audio = document.getElementById('birthday-song');
const musicBtn = document.getElementById('music-control');

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        musicBtn.innerHTML = "⏸️";
    } else {
        audio.pause();
        musicBtn.innerHTML = "🎵";
    }
}

function revealSurprise() {
    // Hide the initial button
    document.getElementById('opener').style.display = 'none';
    
    // Show the birthday card and gallery
    document.getElementById('card').style.display = 'block';
    const gallery = document.getElementById('gallery');
    gallery.style.display = 'block';
    gallery.classList.add('animate__fadeInUp');

    // Auto-play music (browsers allow this after a user click)
    audio.play();
    musicBtn.innerHTML = "⏸️";

    // Launch Confetti
    launchConfetti();
}

function launchConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Confetti from left
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        
        // Confetti from right
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
    }, 250);
}