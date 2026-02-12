// app.js

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
        display.style.opacity = 0;
        setTimeout(() => {
            display.innerText = random;
            display.style.opacity = 1;
        }, 150);
    }
}

// --- Status Matrix Logic ---
function updateRespect(amount) {
    selfRespect = Math.min(100, selfRespect + amount);
    if(selfRespect > 80) updateAttachment(-5);
    updateBars();
}

function updateAttachment(amount) {
    attachment = Math.max(0, attachment + amount);
    if(attachment < 20) singleLevel = 100;
    updateBars();
}

function triggerRelapse() {
    // 1. Target the specific container
    // Make sure your HTML div has the class 'status-matrix-card'
    const container = document.querySelector('.status-matrix-card'); 
    
    if (container) {
        // 2. Start the shaking
        container.classList.add('relapse-shake');
        
        // 3. Reset JS Variables (The "State")
        selfRespect = 10;
        attachment = 95;
        singleLevel = 5;

        // 4. Force the UI to match the new variables
        updateBars();

        // 5. Stop shaking after 1.5 seconds
        setTimeout(() => {
            container.classList.remove('relapse-shake');
        }, 1500);
    } else {
        console.error("Could not find the status container to shake!");
    }
}

// Global update function to keep everything in sync
function updateBars() {
    // Update Respect Bar
    const respectBar = document.getElementById('respect-bar');
    const respectVal = document.getElementById('respect-val');
    if(respectBar) respectBar.style.width = selfRespect + "%";
    if(respectVal) respectVal.innerText = selfRespect + "%";
    
    // Update Attachment Bar
    const attachBar = document.getElementById('attach-bar');
    const attachVal = document.getElementById('attach-val');
    if(attachBar) attachBar.style.width = attachment + "%";
    if(attachVal) attachVal.innerText = attachment + "%";
    
    // Update Single Level Bar
    const singleBar = document.getElementById('single-bar');
    const singleVal = document.getElementById('single-val');
    if(singleBar) singleBar.style.width = singleLevel + "%";
    if(singleVal) singleVal.innerText = singleLevel + "%";
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

    for(let n = 0; n < words.length; n++) {
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