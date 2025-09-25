// Array, das die zuletzt gedrückten Tasten speichert
let keys = [];

let transitioning = false;

// Wörter, auf die wir prüfen wollen
const triggerWords = {
    "awesome": () => triggerAwesome(),
    "pong": () => triggerPong(),
    "snake": () => triggerSnake()
};

// Event Listener für Keypresses
window.addEventListener('keydown', (event) => {
    keys.push(event.key.toLowerCase());

    // Die Länge des Arrays begrenzen, damit es nicht unnötig groß wird
    if (keys.length > 10) {
        keys.shift();
    }

    // Aktuelle Tastenfolge als String
    const currentSequence = keys.join('');

    // Überprüfen, ob eines der Wörter getippt wurde
    Object.keys(triggerWords).forEach((word) => {
        if (currentSequence.includes(word)) {
            triggerWords[word]();  // Die entsprechende Funktion aufrufen
            keys = []; // Reset der Keypress-Liste nach Ausführung
        }
    });
});

// Funktionen, die bei bestimmten Wörtern ausgelöst werden
async function triggerAwesome() {
    await block()
    transitioning = true;
    let str = "I ❤️ EProg"
    await deleteName()
    await wait(1500)
    var title = document.getElementById("title_text")
    for(let i = 0; i < str.length; i++){
        let firstChar = str.substring(i,i+1);
        title.textContent += firstChar;
        await wait(100);
    }
    await wait(RIB(5,15)*1000)
    revert()
    transitioning = false
}

async function block() {
    return;
}

async function triggerPong() {
    await block()
    transitioning = true;
    let str = "Pong 🏓"
    await deleteName()
    await wait(1500)
    var title = document.getElementById("title_text")
    for(let i = 0; i < str.length; i++){
        let firstChar = str.substring(i,i+1);
        title.textContent += firstChar;
        await wait(100);
    }
    title.setAttribute("href", "./pong/index.html")
    title.classList.remove("nolink")
    await wait(RIB(5,15)*1000)
    revert()
    transitioning = false
}

async function triggerSnake() {
    await block()
    transitioning = true;
    let str = "Snake 🐍"
    await deleteName()
    await wait(1500)
    var title = document.getElementById("title_text")
    for(let i = 0; i < str.length; i++){
        let firstChar = str.substring(i,i+1);
        title.textContent += firstChar;
        await wait(100);
    }
    title.setAttribute("href", "./snake/snake.html")
    title.classList.remove("nolink")
    await wait(RIB(5,15)*1000)
    await revert()
    transitioning = false
}

async function deleteName() {
    var title = document.getElementById("sel")
    var cursor = document.getElementById("t1")
    await wait(750); // Warte eine Sekunde
    cursor.className = "hidden"
    await backwardSelect()
    await wait(800);
    cursor.className = "typing"
    title.textContent = ""
    title.style.backgroundColor = "transparent";
}

async function revert(){
    let str = "Henrik Pätzold"
    await deleteName()
    await wait(1500)
    var title = document.getElementById("title_text")
    title.removeAttribute("href")
    title.classList.add("nolink")
    for(let i = 0; i < str.length; i++){
        let firstChar = str.substring(i,i+1);
        title.textContent += firstChar;
        await wait(100);
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function RIB(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function intro(){
    transitioning = true;
    await wait(3000)
    revert()
    transitioning = false
}

async function backwardSelect(){
    const titleText = document.getElementById('title_text');
    const sel = document.getElementById('sel');
    for (let i = titleText.textContent.length; i > 0; i--) {
        let lastChar = titleText.textContent.slice(-1);
        titleText.textContent = titleText.textContent.slice(0, -1);
        sel.textContent = lastChar + sel.textContent;
        await wait(25)
    }
}

intro()