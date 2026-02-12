// --- State Management ---
let selfRespect = 50;
let attachment = 80;
let singleLevel = 99;

// --- Initialization ---
window.onload = () => {
    const savedMood = localStorage.getItem('user-mood') || 'dark';
    changeMood(savedMood);
    renderTimeline();
    generateMeme();
};

// --- Theme Logic ---
function changeMood(mood) {
    document.body.className = `mood-${mood} font-sans min-h-screen`;
    localStorage.setItem('user-mood', mood);
}

// --- Survival Actions ---
function survivalAction(type) {
    const display = document.getElementById('display-text');
    const list = survivalData[type];
    
    if (list) {
        const random = list[Math.floor(Math.random() * list.length)];
        
        if (type === 'music') {
            // Create a YouTube search query link
            const searchQuery = encodeURIComponent(`Arijit Singh ${random} official song`);
            const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
            
            // Set the HTML to be a clickable link
            display.innerHTML = `🎵 <a href="${youtubeUrl}" target="_blank" class="hover:text-white transition">Now Playing: ${random} <p>{Listen on YouTube}</p></a>`;
        } else {
            // For insults, motivation, etc., just show the text
            display.innerText = random;
        }
        
        // Reset the copy status if you have one
        const statusLabel = document.getElementById('copy-status');
        if(statusLabel) statusLabel.innerHTML = '<i class="far fa-copy"></i> Copy to clipboard';
    }
}

// --- Status Matrix Logic ---
function updateRespect(amount) {
    selfRespect = Math.min(100, selfRespect + amount);
    if (selfRespect > 80) updateAttachment(-5);
    updateBars();
}

function updateAttachment(amount) {
    attachment = Math.max(0, attachment + amount);

    // Trigger God Level if attachment hits 0
    if (attachment === 0) {
        singleLevel = 100;
    } else {
        // Linear logic: singleLevel increases as attachment decreases
        singleLevel = 100 - attachment;
    }

    updateBars();
}

function triggerRelapse() {
    // This now matches the class we added in Step 1
    const container = document.querySelector('.status-matrix-card');

    if (container) {
        container.classList.add('relapse-shake');

        // Reset ALL values including singleLevel
        selfRespect = 10;
        attachment = 95;
        singleLevel = 5;

        updateBars();

        setTimeout(() => {
            container.classList.remove('relapse-shake');
        }, 1500);
    } else {
        console.error("Selector mismatch: .status-matrix-card not found in HTML");
    }
}

// Global update function
function updateBars() {
    const bars = [
        { bar: 'respect-bar', val: 'respect-val', value: selfRespect },
        { bar: 'attach-bar', val: 'attach-val', value: attachment },
        { bar: 'single-bar', val: 'single-val', value: singleLevel, isSingle: true },
        { bar: 'nav-single-bar', val: 'nav-single-val', value: singleLevel, isSingle: true }
    ];

    bars.forEach(item => {
        const barEl = document.getElementById(item.bar);
        const valEl = document.getElementById(item.val);
        
        if (barEl) barEl.style.width = item.value + "%";
        if (valEl) {
            if (item.isSingle && item.value >= 100) {
                valEl.innerText = "GOD LEVEL";
            } else {
                valEl.innerText = item.value + "%";
            }
        }
    });

    if (singleLevel >= 100) {
        showAchievement();
    }
}

// Show the popup
function showAchievement() {
    const popup = document.getElementById('achievement-popup');
    if (popup && popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');

        // Trigger the Confetti Cannon!
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#eab308', '#ffffff', '#dc2626'] // Gold, White, and Red
        });
    }
}
// Burst Effect for the win!
function fireVictoryConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        // Left side
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#eab308', '#dc2626']
        });
        // Right side
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#eab308', '#dc2626']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Hide the popup
function closeAchievement() {
    const popup = document.getElementById('achievement-popup');
    popup.classList.add('hidden');
}

function shareOnX() {
    const tweetText = encodeURIComponent(
        "I just achieved GOD LEVEL SINGLE status on '404: Valentine Not Found'! 💀🔥 My self-respect is at 100% and my attachment issues are gone. Check it out!"
    );
    const tweetUrl = "https://sayantan-pachal.github.io/choses_speciales/404-valentine-not-found";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;

    // Open in a new small window
    window.open(twitterUrl, "_blank", "width=600,height=400");
}

// --- Timeline Rendering ---
function renderTimeline() {
    const timelineBody = document.getElementById('timeline-body');
    if (!timelineBody) return;

    timelineBody.innerHTML = survivalData.timeline.map(item => `
        <tr class="border-b border-zinc-800">
            <td class="p-4 font-bold">${item.day}</td>
            <td class="p-4 line-through text-zinc-500">${item.lie}</td>
            <td class="p-4 text-green-400">${item.reality}</td>
        </tr>
    `).join('');
}

// --- Meme Generator Logic ---
function generateMeme() {
    const canvas = document.getElementById('memeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const quote = survivalData.memes[Math.floor(Math.random() * survivalData.memes.length)];

    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("VALENTINE SURVIVOR 2026", canvas.width / 2, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 24px Georgia";
    wrapText(ctx, quote, canvas.width / 2, canvas.height / 2, 400, 30);

    document.getElementById('downloadBtn').href = canvas.toDataURL("image/png");
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testY = y;

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            context.fillText(line, x, testY);
            line = words[n] + ' ';
            testY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, testY);
}

// 1. Secret Key Sequence
let inputSequence = "";
const secretCode = "sayantan";

// 2. Event Listener for Keyboard
document.addEventListener('keydown', (e) => {
    // Add the pressed key to our sequence string
    inputSequence += e.key.toLowerCase();

    // Keep only the last few characters (matching the length of the secret code)
    if (inputSequence.length > secretCode.length) {
        inputSequence = inputSequence.substring(inputSequence.length - secretCode.length);
    }

    // Check if the sequence matches
    if (inputSequence === secretCode) {
        activateDevMode();
        inputSequence = ""; // Reset after activation
    }
});

// 3. The "God Mode" Function
function activateDevMode() {
    console.log("Dev Mode Activated: Respect Maxed Out! 🚀");

    // Set variables to maximum
    selfRespect = 100;
    attachment = 0;
    singleLevel = 100;

    // Update UI
    updateBars();

    // Add a cool visual flash to the body
    document.body.style.filter = "invert(1)";
    setTimeout(() => {
        document.body.style.filter = "invert(0)";
    }, 200);
}


// --- Click to Copy Clipboard Logic ---
function copyToClipboard() {
    const textToCopy = document.getElementById('display-text').innerText;
    const statusLabel = document.getElementById('copy-status');

    // Prevent copying the default placeholder text
    if (textToCopy.includes("Click a button")) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual feedback
        statusLabel.innerText = "Copied! ✅";
        statusLabel.classList.add('text-green-400');

        // Reset text after 2 seconds
        setTimeout(() => {
            statusLabel.innerText = "Copy to clipboard";
            statusLabel.classList.remove('text-green-400');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// --- Achievement Badge Download Logic ---
function downloadAchievementBadge() {
    const canvas = document.getElementById('hiddenDownloadCanvas');
    const ctx = canvas.getContext('2d');

    // 1. Background (Dark Zinc)
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Border (Yellow Gold)
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // 3. Trophy Emoji (Drawn as Text)
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🏆", canvas.width / 2, 110);

    // 4. Header Text
    ctx.fillStyle = "#eab308";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("ACHIEVEMENT UNLOCKED", canvas.width / 2, 170);

    // 5. Status Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText("GOD LEVEL SINGLE", canvas.width / 2, 230);

    // 6. Quote Text
    ctx.fillStyle = "#71717a";
    ctx.font = "italic 20px Georgia";
    ctx.fillText('"Self-respect higher than the Burj Khalifa"', canvas.width / 2, 280);
    
    // 7. Site Branding
    ctx.fillStyle = "#52525b";
    ctx.font = "14px Arial";
    ctx.fillText("sayantanpachal.vercel.app", canvas.width / 2, 350);

    // 8. Trigger the Actual Download
    const link = document.createElement('a');
    link.download = 'God-Level-Single-Badge.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// --- Back to Top Button Logic ---
const backToTopBtn = document.getElementById('backToTop');

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        // Show button
        backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
        // Hide button
        backToTopBtn.classList.add('opacity-0', 'translate-y-10');
        setTimeout(() => {
            if(backToTopBtn.classList.contains('opacity-0')) {
                backToTopBtn.classList.add('invisible');
            }
        }, 0); // Wait for transition to finish
    }
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// --- Set Current Year in Footer ---
document.getElementById('year').textContent = new Date().getFullYear();