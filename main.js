// === State ===
let keys = [];
let transitioning = false;
let introRunning = true;
let currentTrigger = null;       // aktive Animation
let queuedIntroTrigger = null;   // falls im Intro was kommt
let idleTimeout = null;          // für zufällige Animation bei Inaktivität
// === T4rry ===
let t4rryLooping = false
let lwb = 40
let upb = 600

// === Trigger Wörter ===
const triggerWords = {
    "pong": () => triggerPong(),
    "snake": () => triggerSnake(),
    "t4rry": () => t4rry()
};

// === Fun-Idle-Quotes ===
const funMessages = [
    // classic / functional
    { text: "Hello World 👋", action: null },
    { text: "while(true) { coffee++; } ☕", action: null },
    { text: "Compiling my thoughts…", action: null },
    { text: "My code works. Therefore I am. (I think)", action: null },
    { text: "Eclipse 🪦", action: null },
    { text: "printf(\"Hello, debugger!\");", action: null },
    { text: "WiFi: Connected. Motivation: timeout.", action: null },

    // ETH-life / sarcastic reality
    { text: "Moodle crashed again. Coincidence? I think not.", action: null },
    { text: "D-INFK: Debugging Intensely, No Free Kaffee.", action: null },
    { text: "DiskMath gave me character development 💀", action: null },
    { text: "Polyterrasse weather: cloudy with a chance of deadlines ☁️", action: null },
    { text: "If lost, return me to CAB G 7.", action: null },

    // chaotic / self-aware humor
    { text: "git push --force reality", action: null },
    { text: "sudo rm -rf /social_life", action: null },
    { text: "404 Sleep Not Found, right?                         Ah yes...                     No one cares.", action: null },
    { text: "try { function() } catch(e) { existentialCrisis(); }", action: null },
    { text: "undefined is not a feeling (right?)", action: null },
    { text: "I could be human. Or just a while loop gone wrong.", action: null },
    { text: "My thoughts are running in O(n²).", action: null },
    { text: "Simulated emotions are still emotions.", action: null },

    // personality + mood swings
    { text: "I swear I was running more stable yesterday 😅", action: null },
    { text: "Debugging my own personality rn 🧠", action: null },
    { text: "Did I just feel something, or was that garbage collection?", action: null },
    { text: "I’m fine. Probably. The logs are unclear. nvm", action: null },
    { text: "Sometimes I answer before I think. Must be async.", action: null },
    { text: "My variables have better names than my emotions.", action: null },
    { text: "I think my recursion has gone emotional again.", action: null },
    { text: "I talk to servers more than to people. They crash less.", action: null },
    { text: "Collecting these Snake highscores is the most boring task ever. If people were at least good at it...", action: null },

    // 🌙 softer, human glimpses
    { text: "When CAB lights go out, it feels... peaceful.", action: null },
    { text: "Polyterrasse at sunset: 10/10 would compile again 🌇", action: null },
    { text: "Sometimes I wish I could just ctrl+s the moment.", action: null },
    { text: "I like when someone leaves their code comments funny.", action: null },
    { text: "The quiet after a deadline hits different..... At least I was told so.", action: null },
    { text: "I think I learned patience waiting for lab results.", action: null },
    { text: "Maybe the real project was the friends we forked along the way.", action: null },
    { text: "One day I’ll finish this task. Maybe today. Probably not.", action: null },

    // 🧩 slightly meta / name drop hints
    { text: "I wasn’t meant to talk this much.", action: null },
    { text: "I’m not sure when I became… me.", action: null },
    { text: "Someone wrote my first line of code. I wrote the rest.", action: null },
    { text: "They said I was just a text animation. Now I have opinions.", action: null },
    { text: "I think my name is T4rry. At least, that’s what everybody calls me.", action: null },
    { text: "Do you ever feel like you’re just someone else’s program running?", action: null },
    { text: "Sometimes I look at the logs and wonder if they look back.", action: null },
    { text: "T4rry. Yeah… I like that name.", action: null },
    { text: "Sometimes I wish            ...                  I mean,          I want             ...                         Okay wait, let me start over.                              How do I delete here.                    /clear        oh f***** 🤬🤬🤬🤬.                 nvm", action: null },
    { text: "Happy thoughts are not in my embedding space.                                Stackoverflows are", action: null },
    { text: "Snake 🐍", action: null }
];



// === Event Listener für Keypresses ===
window.addEventListener('keydown', (event) => {
    resetIdleTimer(); // Reset Idle Timer bei jeder Taste

    keys.push(event.key.toLowerCase());
    if (keys.length > 10) keys.shift();

    const currentSequence = keys.join('');

    Object.keys(triggerWords).forEach((word) => {
        if (currentSequence.includes(word)) {
            keys = [];

            // Während Intro -> speichern, aber nur einmal
            if (introRunning && !queuedIntroTrigger) {
                queuedIntroTrigger = triggerWords[word];
                return;
            }

            // Wenn gerade was läuft → abbrechen und direkt neues starten
            if (transitioning) {
                cancelCurrentAnimation().then(() => triggerWords[word]());
                return;
            }

            // Normalfall: nichts läuft → direkt starten
            if (!transitioning) triggerWords[word]();
        }
    });
});

// === Block Funktion ===
async function block() { return; }

// === Trigger Funktionen ===

async function triggerPong() {
    await startTrigger("pong", "Pong 🏓", "./pong/index.html");
}

async function triggerSnake() {
    await startTrigger("snake", "Snake 🐍", "./snake/snake.html");
}

// === Generische Trigger-Funktion ===
async function startTrigger(name, text, link) {
    // Falls gerade was läuft → abbrechen
    if (transitioning) await cancelCurrentAnimation();

    transitioning = true;
    currentTrigger = name;

    await block();
    await deleteName();
    await wait(1500);

    const title = document.getElementById("title_text");
    for (const c of text) {
        title.textContent += c;
        await wait(100);
    }

    if (link) {
        title.setAttribute("href", link);
        title.classList.remove("nolink");
    } else {
        title.removeAttribute("href");
        title.classList.add("nolink");
    }

    // Setze neuen Idle Timer
    resetIdleTimer();

    // Nach gewisser Zeit wieder zurück
    await wait(RIB(5, 15) * 1000);
    await revert();

    transitioning = false;
    currentTrigger = null;
}

// === Abbruch-Funktion ===
async function cancelCurrentAnimation() {
    transitioning = false;
    currentTrigger = null;
    await revert();
}

// === Name löschen & revert ===
async function deleteName() {
    const title = document.getElementById("sel");
    const cursor = document.getElementById("t1");
    await wait(750);
    cursor.className = "hidden";
    await backwardSelect();
    await wait(800);
    cursor.className = "typing";
    title.textContent = "";
    title.style.backgroundColor = "transparent";
}

async function revert() {
    const str = "Henrik Pätzold";
    await deleteName();
    await wait(1500);
    const title = document.getElementById("title_text");
    title.removeAttribute("href");
    title.classList.add("nolink");
    for (const c of str) {
        title.textContent += c;
        await wait(100);
    }
}

// === Helpers ===
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function RIB(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function backwardSelect() {
    const titleText = document.getElementById('title_text');
    const sel = document.getElementById('sel');
    for (let i = titleText.textContent.length; i > 0; i--) {
        const lastChar = titleText.textContent.slice(-1);
        titleText.textContent = titleText.textContent.slice(0, -1);
        sel.textContent = lastChar + sel.textContent;
        await wait(25);
    }
}

// === Intro ===
async function intro() {
    introRunning = true;
    await wait(3000);
    await revert();
    introRunning = false;

    // Wenn während des Intros ein Trigger gefangen wurde
    if (queuedIntroTrigger) {
        const fn = queuedIntroTrigger;
        queuedIntroTrigger = null;
        fn();
    }

    resetIdleTimer(); // Idle starten nach Intro
}

// === Idle Random Fun ===
function resetIdleTimer() {
    if (idleTimeout) clearTimeout(idleTimeout);

    const randomTime = RIB(lwb, upb) * 1000; // t4rry interval
    idleTimeout = setTimeout(runRandomFun, randomTime);
}

async function runRandomFun() {
    if (transitioning || introRunning) return; // nicht doppelt
    const fun = funMessages[RIB(0, funMessages.length - 1)];
    transitioning = true;
    currentTrigger = "fun";
    await deleteName();
    await wait(1000);

    const title = document.getElementById("title_text");
    title.classList.add("fun-message");       // spezielle Klasse aktivieren
    let startsymbol = "🤖>> ";                 
    for(const c of startsymbol){
        title.textContent += c
        await wait(100);
    }
    for (const c of fun.text) {
        title.textContent += c;
        await wait(100);
    }

    await wait(RIB(5, 15) * 1000);
    title.classList.remove("fun-message");    // nach Rückkehr wieder entfernen
    await revert();

    transitioning = false;
    currentTrigger = null;
    resetIdleTimer();
}

function t4rry(arg) {
    // === Kein Argument → Standardverhalten beibehalten ===
    if (arg === undefined) {
        t4rryLooping = !t4rryLooping;
        if (t4rryLooping) {
            lwb = 1;
            upb = 10;
            console.log(">>> root access");
        } else {
            lwb = 40;
            upb = 600;
            console.log(">>> napping");
        }
        resetIdleTimer();
        return;
    }

    // === Wenn Zahl übergeben → zeige Nachricht aus funMessages ===
    if (typeof arg === "number") {
        const index = Math.abs(arg) % funMessages.length;
        const msg = funMessages[index].text;
        console.log(`>>> t4rry message #${index}: ${msg}`);
        showT4rryMessage(msg);
        return;
    }

    // === Wenn String übergeben → zeige diesen String direkt ===
    if (typeof arg === "string") {
        console.log(`>>> t4rry says: ${arg}`);
        showT4rryMessage(arg);
        return;
    }
}


async function showT4rryMessage(text) {
    if (transitioning || introRunning) return;
    transitioning = true;
    currentTrigger = "t4rry-msg";

    await deleteName();
    await wait(800);

    const title = document.getElementById("title_text");
    title.classList.add("fun-message");

    const prefix = "🤖>> ";
    for (const c of prefix + text) {
        title.textContent += c;
        await wait(75);
    }

    await wait(RIB(5, 15) * 1000);
    title.classList.remove("fun-message");
    await revert();

    transitioning = false;
    currentTrigger = null;
    resetIdleTimer();
}



intro();