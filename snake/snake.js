document.body.style.overflow = "hidden";

// ==== GRID / BOARD CONFIG ====
var blockSize = 25;
var rows = 20;
var columns = 25;

var logicalW = columns * blockSize;
var logicalH = (rows + 1) * blockSize; // Spielfeld + HUD

// ==== GAME STATE ====
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var lastX;
var lastY;

var xSpeed = 0;
var ySpeed = 0;

var tempXspeed = 0;
var tempYspeed = 0;

var snakeBody = []; // Array von [x,y], tail -> head

var foodX = 0;
var foodY = 0;
var foodType = "apple"; // "apple" | "orange" | "lemon"

var gameOver = false;
var gameStarted = false;
var failReason = "";
var score = 0;

// Death visuals
var deathFlashAlpha = 0;
var blinkFrameCounter = 0;

// ==== GROWTH VISUAL EFFECT ====
// Wenn ein neues Segment entsteht (durch Fressen), speichern wir einen Geburtseintrag
// Das neue Segment blendet dann weich ein.
var growBirths = []; // [{x, y, t}]
var GROW_FADE_MS = 300; // ms von 0 -> 1 alpha

// ==== INTERPOLATION STATE ====
// Wir halten zwei Kopien vom Snake-Zustand, prev und curr, jeweils tail->head
// renderFrame() macht Lerp für smooth movement
var prevSnakeBody = [];
var currSnakeBody = [];
var prevHeadX = snakeX;
var prevHeadY = snakeY;
var currHeadX = snakeX;
var currHeadY = snakeY;

// timing
var logicIntervalMs = 100; // 10 FPS echte Spiel-Logik
var lastLogicTime = 0;     // performance.now() des letzten logicStep()

// ==== CANVAS / RENDERING ====
var board;
var context;
var dpr;

// vorgerenderter Hintergrund (Gradient + Grid)
var bgBufferCanvas;
var bgBufferCtx;

// Gradients
var bgGradient;
var hudGradient;

// ==== STYLE ====
// Apfel Farben
var fruitColorMain = "#ff4f4f";
var fruitColorEdge = "#a31616";
var leafColorMain = "#4caf50";
var leafColorEdge = "#255f28";

// Orange Farben
var orangeMain = "#FFA227";
var orangeEdge = "#8a4d00";
var orangeLeafMain = "#4caf50";
var orangeLeafEdge = "#255f28";

// Zitrone Farben
var lemonMain = "#F9F871";
var lemonEdge = "#9a962f";
var lemonLeafMain = "#9acd32";
var lemonLeafEdge = "#4a5f1a";

// Snake Farben
var snakeBodyFill = "#29d29a";
var snakeBodyEdge = "#0d3d32";
var snakeHeadFill = "#3cf7bd";
var snakeHeadEdge = "#0f4f3f";
var snakeDeadFill = "tomato";
var snakeDeadEdge = "#4a0000";

var textColor = "#f2f2f7";
var textMuted = "#8a8a9a";

var fontLarge = "600 24px 'Kumbh Sans', system-ui, sans-serif";
var fontMedium = "500 18px 'Kumbh Sans', system-ui, sans-serif";
var fontSmall = "500 14px 'Kumbh Sans', system-ui, sans-serif";

// ===================== INIT =====================

function setupHiDPI(canvas) {
    dpr = window.devicePixelRatio || 1;
    if (dpr > 2) dpr = 2; // Performance clamp

    // CSS-Größe (sichtbar im Layout)
    canvas.style.width = logicalW + "px";
    canvas.style.height = logicalH + "px";

    // Physische Auflösung
    canvas.width = Math.floor(logicalW * dpr);
    canvas.height = Math.floor(logicalH * dpr);

    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    return ctx;
}

function buildBackgroundBuffer() {
    bgBufferCanvas = document.createElement("canvas");
    bgBufferCanvas.width = Math.floor(logicalW * dpr);
    bgBufferCanvas.height = Math.floor(logicalH * dpr);

    bgBufferCtx = bgBufferCanvas.getContext("2d");
    bgBufferCtx.scale(dpr, dpr);

    // Hintergrund-Gradient
    var localBgGrad = bgBufferCtx.createLinearGradient(0, 0, 0, logicalH);
    localBgGrad.addColorStop(0, "#111315");
    localBgGrad.addColorStop(1, "#0a0b0d");

    bgBufferCtx.fillStyle = localBgGrad;
    bgBufferCtx.fillRect(0, 0, logicalW, logicalH);

    // Grid nur EINMAL zeichnen
    bgBufferCtx.save();
    bgBufferCtx.lineWidth = 1;
    bgBufferCtx.strokeStyle = "rgba(255,255,255,0.04)";

    for (let c = 0; c <= columns; c++) {
        const gx = c * blockSize + 0.5;
        bgBufferCtx.beginPath();
        bgBufferCtx.moveTo(gx, 0);
        bgBufferCtx.lineTo(gx, rows * blockSize);
        bgBufferCtx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
        const gy = r * blockSize + 0.5;
        bgBufferCtx.beginPath();
        bgBufferCtx.moveTo(0, gy);
        bgBufferCtx.lineTo(columns * blockSize, gy);
        bgBufferCtx.stroke();
    }

    bgBufferCtx.restore();
}

function setupGradients() {
    bgGradient = context.createLinearGradient(0, 0, 0, logicalH);
    bgGradient.addColorStop(0, "#111315");
    bgGradient.addColorStop(1, "#0a0b0d");

    hudGradient = context.createLinearGradient(
        0,
        rows * blockSize,
        0,
        rows * blockSize + blockSize
    );
    hudGradient.addColorStop(0, "#1f1f24");
    hudGradient.addColorStop(1, "#24242a");
}

window.onload = function () {
    board = document.getElementById("board");
    context = setupHiDPI(board);

    buildBackgroundBuffer();
    setupGradients();

    // einmal initial zeichnen (aber jetzt existiert drawSplash())
    drawSplash();

    window.addEventListener("keydown", startGame);

    // Renderloop starten
    requestAnimationFrame(renderFrame);
};

// ===================== DRAW HELPERS =====================

function roundRect(ctx, x, y, w, h, r) {
    var radius = r || 6;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// statischen Hintergrund auf den Haupt-Canvas kopieren
function drawBackground() {
    context.drawImage(
        bgBufferCanvas,
        0, 0, bgBufferCanvas.width, bgBufferCanvas.height,
        0, 0, logicalW, logicalH
    );
}

// Frucht zeichnen (Apfel, Orange, Zitrone)
function drawFruit(px, py, kind) {
    const size = blockSize;
    const cx = px + size / 2;
    const cy = py + size / 2;

    context.save();

    if (kind === "orange") {
        // Körper (runder)
        context.beginPath();
        context.fillStyle = orangeMain;
        context.strokeStyle = orangeEdge;
        context.lineWidth = 2;
        context.ellipse(
            cx,
            cy + 2,
            size * 0.38,
            size * 0.38,
            0,
            0,
            Math.PI * 2
        );
        context.fill();
        context.stroke();

        // Blatt
        context.beginPath();
        context.fillStyle = orangeLeafMain;
        context.strokeStyle = orangeLeafEdge;
        context.lineWidth = 2;
        context.ellipse(
            cx + size * 0.12,
            cy - size * 0.32,
            size * 0.16,
            size * 0.09,
            -0.4,
            0,
            Math.PI * 2
        );
        context.fill();
        context.stroke();

        // kleine Porenpunkte
        context.fillStyle = "rgba(0,0,0,0.15)";
        context.beginPath();
        context.arc(cx - size * 0.08, cy, size * 0.04, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.arc(cx + size * 0.1, cy + size * 0.07, size * 0.03, 0, Math.PI * 2);
        context.fill();
    }
    else if (kind === "lemon") {
        // Zitrone: etwas länglich / zitronenförmig
        context.beginPath();
        context.fillStyle = lemonMain;
        context.strokeStyle = lemonEdge;
        context.lineWidth = 2;
        context.ellipse(
            cx,
            cy + 2,
            size * 0.42,
            size * 0.30,
            0.2,
            0,
            Math.PI * 2
        );
        context.fill();
        context.stroke();

        // Blatt (helleres Grün)
        context.beginPath();
        context.fillStyle = lemonLeafMain;
        context.strokeStyle = lemonLeafEdge;
        context.lineWidth = 2;
        context.ellipse(
            cx + size * 0.18,
            cy - size * 0.28,
            size * 0.18,
            size * 0.09,
            -0.6,
            0,
            Math.PI * 2
        );
        context.fill();
        context.stroke();
    }
    else {
        // Default: Apfel
        context.beginPath();
        context.fillStyle = fruitColorMain;
        context.strokeStyle = fruitColorEdge;
        context.lineWidth = 2;
        context.ellipse(
            cx,
            cy + 2,
            size * 0.38,
            size * 0.33,
            0,
            0,
            Math.PI * 2
        );
        context.fill();
        context.stroke();

        // Blatt
        context.beginPath();
        context.fillStyle = leafColorMain;
        context.strokeStyle = leafColorEdge;
        context.lineWidth = 2;
        context.ellipse(
            cx + size * 0.15,
            cy - size * 0.3,
            size * 0.18,
            size * 0.1,
            -0.5,
            0,
            Math.PI * 2
        );
        context.fill();
        context.stroke();
    }

    context.restore();
}

// Schlange-Segment (runde Kapsel) mit Scale/Bounce
function drawSnakeSegment(x, y, fill, edge, radiusFrac, alphaOverride, scaleOverride) {
    const pad = blockSize * 0.08;
    const baseW = blockSize - pad * 2;
    const baseH = blockSize - pad * 2;
    const rBase = (radiusFrac || 0.4) * blockSize;

    // Skalierung (für neue Segmente evtl. <1 oder leicht >1)
    const scale = (scaleOverride !== undefined) ? scaleOverride : 1;

    // wir zeichnen relativ zur Mitte des Blocks
    const cx = x + blockSize / 2;
    const cy = y + blockSize / 2;

    const w = baseW * scale;
    const h = baseH * scale;
    const rx = -w / 2;
    const ry = -h / 2;
    const r = rBase * scale;

    context.save();

    // an die Kachelmitte schieben
    context.translate(cx, cy);

    // Alpha für Fade (z.B. bei Spawn) setzen
    if (alphaOverride !== undefined) {
        context.globalAlpha = alphaOverride;
    }

    // eigentliche Form zeichnen (lokale Koordinaten)
    roundRect(context, rx, ry, w, h, r);
    context.fillStyle = fill;
    context.fill();

    // Rand mit skaliertem linewidth, sonst wird er bei tiny zu fett
    context.lineWidth = 2 * scale;
    context.strokeStyle = edge;
    context.stroke();

    context.restore();
}

// Augen auf dem Kopf
function drawSnakeHeadEyes(x, y, dirX, dirY, alive) {
    const eyeColor = alive ? "#0b1b17" : "#1a0000";
    const pupilSize = blockSize * 0.08;
    const offsetSide = blockSize * 0.18;
    const offsetForward = blockSize * 0.18;

    let cx = x + blockSize / 2;
    let cy = y + blockSize / 2;

    let dx = dirX;
    let dy = dirY;

    let fx = cx + dx * offsetForward;
    let fy = cy + dy * offsetForward;

    // senkrecht zur Bewegungsrichtung
    let lx = -dy;
    let ly = dx;

    context.beginPath();
    context.fillStyle = eyeColor;
    context.arc(
        fx + lx * offsetSide,
        fy + ly * offsetSide,
        pupilSize,
        0,
        Math.PI * 2
    );
    context.fill();

    context.beginPath();
    context.arc(
        fx - lx * offsetSide,
        fy - ly * offsetSide,
        pupilSize,
        0,
        Math.PI * 2
    );
    context.fill();
}

// HUD / Score-Bar
function drawHUD() {
    const hudY = rows * blockSize;
    const hudH = blockSize;

    context.fillStyle = hudGradient;
    context.fillRect(0, hudY, columns * blockSize, hudH);

    context.fillStyle = "rgba(255,255,255,0.06)";
    context.fillRect(0, hudY, columns * blockSize, 1);

    context.font = fontMedium;
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = textColor;
    context.fillText("Score: " + score, 16, hudY + hudH / 2);

    context.font = fontSmall;
    context.fillStyle = textMuted;
    context.textAlign = "right";
    context.fillText(
        "WASD / Pfeile steuern",
        columns * blockSize - 16,
        hudY + hudH / 2
    );
}

// roter Flash am Tod
function drawDeathFlash() {
    if (deathFlashAlpha <= 0) return;
    context.save();
    context.globalAlpha = deathFlashAlpha;
    context.fillStyle = "rgba(255,0,0,0.4)";
    context.fillRect(0, 0, logicalW, logicalH);
    context.restore();

    deathFlashAlpha *= 0.92;
    if (deathFlashAlpha < 0.01) deathFlashAlpha = 0;
}

// zentrierte Bubble für Text (Start / Game Over)
function drawCenterText(lines) {
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";

    const cx = (blockSize * columns) / 2;
    const cy = (blockSize * rows) / 2;

    const bubbleW = 300;
    const bubbleH = 140;
    const bubbleX = cx - bubbleW / 2;
    const bubbleY = cy - bubbleH / 2;

    roundRect(context, bubbleX, bubbleY, bubbleW, bubbleH, 16);
    context.fillStyle = "rgba(15,15,20,0.8)";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "rgba(255,255,255,0.08)";
    context.stroke();

    let offsetY = -28;
    context.fillStyle = textColor;
    context.font = fontLarge;
    context.fillText(lines[0], cx, cy + offsetY);

    context.font = fontMedium;
    context.fillStyle = textMuted;
    for (let i = 1; i < lines.length; i++) {
        offsetY += 28;
        context.fillText(lines[i], cx, cy + offsetY);
    }

    context.restore();
}

// Splash Screen pro Frame zeichnen solange das Spiel noch nicht gestartet ist
function drawSplashScreenFrame() {
    drawBackground();

    // kleiner "Demo"-Head und Frucht
    drawSnakeSegment(snakeX, snakeY, snakeHeadFill, snakeHeadEdge, 0.35, 1, 1);
    drawSnakeHeadEyes(snakeX, snakeY, 1, 0, true);
    drawFruit(snakeX + blockSize * 4, snakeY, "apple");

    drawCenterText([
        "Snake",
        "Drücke Leertaste zum Start"
    ]);
}

// kleine Wrapper-Funktion damit onload kein Fehler schmeißt
function drawSplash() {
    drawSplashScreenFrame();
}

// ===================== GROWTH VISUAL HELPERS =====================

// Alpha für frisches Segment bestimmen
function getSpawnAlphaForSegment(segX, segY, nowTs) {
    let bestAlpha = 1;
    for (let i = 0; i < growBirths.length; i++) {
        const b = growBirths[i];
        if (b.x === segX && b.y === segY) {
            const age = nowTs - b.t;
            if (age <= 0) {
                bestAlpha = 0;
            } else if (age < GROW_FADE_MS) {
                const a = age / GROW_FADE_MS;
                if (a < bestAlpha) bestAlpha = a;
            }
        }
    }
    if (bestAlpha < 0) bestAlpha = 0;
    if (bestAlpha > 1) bestAlpha = 1;
    return bestAlpha;
}

// Größe / Bounce für frisches Segment bestimmen
function getSpawnScaleForSegment(segX, segY, nowTs) {
    // Default: normal groß
    let scale = 1;

    for (let i = 0; i < growBirths.length; i++) {
        const b = growBirths[i];
        if (b.x === segX && b.y === segY) {
            const age = nowTs - b.t;

            // ganz neu gespawnt
            if (age <= 0) {
                return 0.2; // winzig am Anfang
            }

            if (age < GROW_FADE_MS) {
                // progress 0..1
                const t = age / GROW_FADE_MS;

                // EaseOutQuad
                const easeOut = 1 - Math.pow(1 - t, 2);

                // 0.2 -> 1.1
                const minScale = 0.2;
                const overshoot = 1.1;
                const s = minScale + (overshoot - minScale) * easeOut;

                // zurückdämpfen Richtung 1.0
                const damp = Math.pow(t, 1.5); // stärkerer Zug zurück zu 1
                scale = s + (1.0 - s) * damp;
            } else {
                // nach der Fade-Zeit: perfekt bei 1.0
                scale = 1;
            }
        }
    }

    if (scale < 0) scale = 0;
    if (scale > 1.2) scale = 1.2; // clamp
    return scale;
}

// alte Birth-Einträge wegräumen (Speicher klein halten)
function pruneOldBirths(nowTs) {
    const cutoff = nowTs - 2000;
    growBirths = growBirths.filter(b => b.t >= cutoff);
}

// ===================== LOGIC STEP (10 FPS) =====================
// echte Spiel-Updates (Koords springen 1 Block pro Tick)

function logicStep() {
    if (!gameStarted) return;
    if (gameOver) return;

    // prevSnapshot vorm Step sichern
    prevSnakeBody = currSnakeBody.map(p => [p[0], p[1]]);
    prevHeadX = currHeadX;
    prevHeadY = currHeadY;

    lastX = snakeX;
    lastY = snakeY;

    // Head verschieben um eine Kachel
    snakeX += tempXspeed * blockSize;
    snakeY += tempYspeed * blockSize;

    // Richtung übernehmen
    xSpeed = tempXspeed;
    ySpeed = tempYspeed;

    // altes Tail merken (vor dem normalen Move)
    var oldTail = snakeBody.length > 0 ? [snakeBody[0][0], snakeBody[0][1]] : [snakeX, snakeY];

    // Haben wir gegessen?
    var ate = (snakeX === foodX && snakeY === foodY);

    if (ate) {
        // Anti-Cheat Event
        const gx = Math.floor(foodX / blockSize);
        const gy = Math.floor(foodY / blockSize);
        const now = Date.now();
        window._ateEvents = window._ateEvents || [];
        window._ateEvents.push({ x: gx, y: gy, t: now });

        // Snake movement mit Wachstum am Schwanz:
        // 1. Kopf anfügen
        snakeBody.push([snakeX, snakeY]);

        // 2. normal tail abschneiden
        if (snakeBody.length > 1) {
            snakeBody.shift();
        }

        // 3. alten Tail wieder dranhängen -> Wachstum am SCHWANZ
        snakeBody.unshift(oldTail);

        // Neues Segment am tail weich einblenden + bounce
        growBirths.push({ x: oldTail[0], y: oldTail[1], t: performance.now() });

        // Neuer Apfel, Score++
        placeCollectables();
        score += 1;
    } else {
        // Kein Essen -> normaler Schritt:
        // Kopf anhängen, Tail ab
        snakeBody.push([snakeX, snakeY]);
        if (snakeBody.length > 1) {
            snakeBody.shift();
        }
    }

    // Kollision mit sich selbst?
    for (let i = 0; i < snakeBody.length - 1; i++) {
        if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
            failReason = "self";
            endGame();
            break;
        }
    }

    // Out-of-bounds?
    if (
        snakeX < 0 ||
        snakeX >= columns * blockSize ||
        snakeY < 0 ||
        snakeY >= rows * blockSize
    ) {
        failReason = "out of bounds";
        endGame();
    }

    // currSnapshot nach dem Step
    currSnakeBody = snakeBody.map(p => [p[0], p[1]]);
    currHeadX = snakeX;
    currHeadY = snakeY;

    lastLogicTime = performance.now();
}

// ===================== RENDER LOOP (~60 FPS) =====================

function renderFrame(ts) {
    // Hintergrund
    drawBackground();

    if (!gameStarted) {
        // solange nicht gestartet, permanent Splash zeichnen
        drawSplashScreenFrame();
        requestAnimationFrame(renderFrame);
        return;
    }

    // Interpolationsfaktor alpha = Progress zwischen zwei logicSteps
    let alpha = 1;
    if (!gameOver) {
        const since = ts - lastLogicTime;
        alpha = since / logicIntervalMs;
        if (alpha < 0) alpha = 0;
        if (alpha > 1) alpha = 1;
    } else {
        alpha = 1;
    }

    // Frucht immer grid-scharf
    drawFruit(foodX, foodY, foodType);

    // Fade-liste trimmen
    pruneOldBirths(ts);

    // Falls Länge sich gerade geändert hat (Wachstumstick),
    // prevSnakeBody und currSnakeBody sind ungleich lang.
    const sameLength = prevSnakeBody.length === currSnakeBody.length;

    // BODY (alle außer letztes Element = Kopf)
    for (let i = 0; i < currSnakeBody.length - 1; i++) {
        let segDrawX, segDrawY;

        if (sameLength) {
            // normaler Frame: wir interpolieren Body
            const [ax, ay] = prevSnakeBody[i];
            const [bx, by] = currSnakeBody[i];
            segDrawX = ax + (bx - ax) * alpha;
            segDrawY = ay + (by - ay) * alpha;
        } else {
            // Wachstumstick: kein Lerp für Body
            const [bx, by] = currSnakeBody[i];
            segDrawX = bx;
            segDrawY = by;
        }

        // Fade-In Alpha falls Segment frisch gespawnt
        const fadeAlpha = getSpawnAlphaForSegment(
            currSnakeBody[i][0],
            currSnakeBody[i][1],
            ts
        );

        // Bounce-Scale für frisches Segment
        const bounceScale = getSpawnScaleForSegment(
            currSnakeBody[i][0],
            currSnakeBody[i][1],
            ts
        );

        drawSnakeSegment(
            segDrawX,
            segDrawY,
            snakeBodyFill,
            snakeBodyEdge,
            0.3,
            fadeAlpha,
            bounceScale
        );
    }

    // KOPF separat (oberste Ebene + Augen) -- immer smooth
    let headDrawX = prevHeadX + (currHeadX - prevHeadX) * alpha;
    let headDrawY = prevHeadY + (currHeadY - prevHeadY) * alpha;

    if (!gameOver) {
        // normal spielen -> Kopf an interpolierter Position, scale = 1
        drawSnakeSegment(
            headDrawX,
            headDrawY,
            snakeHeadFill,
            snakeHeadEdge,
            0.35,
            1,
            1
        );
        drawSnakeHeadEyes(headDrawX, headDrawY, xSpeed, ySpeed, true);

    } else {
        // Game Over Darstellung

        blinkFrameCounter++;

        const blinkPhase = blinkFrameCounter % 40; // langsam blinken
        const aliveColor = blinkPhase < 20;

        // Crash-Pos des Kopfs:
        // - out of bounds: letzte gültige Kachel (lastX/lastY)
        // - self hit: currHeadX/currHeadY
        const gx = (failReason === "out of bounds") ? lastX : currHeadX;
        const gy = (failReason === "out of bounds") ? lastY : currHeadY;

        if (aliveColor) {
            // blinkt zwischen "lebender" Kopf-Farbe ...
            drawSnakeSegment(
                gx,
                gy,
                snakeHeadFill,
                snakeHeadEdge,
                0.35,
                1,
                1
            );
            drawSnakeHeadEyes(gx, gy, xSpeed, ySpeed, true);
        } else {
            // ... und "toter" Kopf-Farbe
            drawSnakeSegment(
                gx,
                gy,
                snakeDeadFill,
                snakeDeadEdge,
                0.35,
                1,
                1
            );
            drawSnakeHeadEyes(gx, gy, xSpeed, ySpeed, false);
        }

        drawDeathFlash();

        drawCenterText([
            "Game Over!",
            "Score: " + score,
            "Leertaste zum Neustart"
        ]);
    }

    // HUD unten
    drawHUD();

    // leaderboard melden + restart-listener bei Tod
    if (gameOver) {
        if (window.leaderboard && typeof window.leaderboard.report === "function") {
            if (!window._reportedToLb) {
                window.leaderboard.report(score);
                window._reportedToLb = true;
            }
        }
        if (!window._restartListenerAdded) {
            window.addEventListener("keydown", game_over_restart);
            window._restartListenerAdded = true;
        }
    }

    requestAnimationFrame(renderFrame);
}

// ===================== GAME START / RESTART =====================

function startGame(e) {
    if (e.code === "Space" || e.code === "Spacebar") {
        score = 0;
        window.removeEventListener("keydown", startGame);
        gameStarted = true;
        initGame();
    }
}

function initGame() {
    gameOver = false;
    failReason = "";
    score = 0;

    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    lastX = snakeX;
    lastY = snakeY;

    xSpeed = 0;
    ySpeed = 0;
    tempXspeed = 0;
    tempYspeed = 0;

    snakeBody = [[snakeX, snakeY]]; // Schlange startet Länge 1

    prevSnakeBody = snakeBody.map(p => [p[0], p[1]]);
    currSnakeBody = snakeBody.map(p => [p[0], p[1]]);
    prevHeadX = snakeX;
    prevHeadY = snakeY;
    currHeadX = snakeX;
    currHeadY = snakeY;

    blinkFrameCounter = 0;
    deathFlashAlpha = 0;
    growBirths = [];

    placeCollectables();

    lastLogicTime = performance.now();

    document.addEventListener("keydown", movement);

    // Logik tickt separat
    setInterval(logicStep, logicIntervalMs);
}

function endGame() {
    gameOver = true;
    blinkFrameCounter = 0;
    deathFlashAlpha = 0.4;
}

function game_over_restart(o) {
    if (o.code === "Space" || o.code === "Spacebar") {
        window.removeEventListener("keydown", game_over_restart);
        window.location.reload();
    }
}

// ===================== SUPPORT FUNKTIONEN =====================

function placeCollectables() {
    // neue zufällige Position + Typ wählen
    const FRUITS = ["apple", "orange", "lemon"];
    // pick random fruit
    foodType = FRUITS[Math.floor(Math.random() * FRUITS.length)];

    foodX = Math.floor(Math.random() * columns) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;

    // nicht IN der Schlange spawnen
    for (let i = 0; i < snakeBody.length; i++) {
        if (foodX === snakeBody[i][0] && foodY === snakeBody[i][1]) {
            // einfach nochmal probieren
            placeCollectables();
            return;
        }
    }
}

// Input wie gehabt
function movement(o) {
    if ((o.code === "KeyW" || o.code === "ArrowUp") && ySpeed !== 1) {
        tempXspeed = 0;
        tempYspeed = -1;
    } else if ((o.code === "KeyS" || o.code === "ArrowDown") && ySpeed !== -1) {
        tempXspeed = 0;
        tempYspeed = 1;
    } else if ((o.code === "KeyA" || o.code === "ArrowLeft") && xSpeed !== 1) {
        tempXspeed = -1;
        tempYspeed = 0;
    } else if ((o.code === "KeyD" || o.code === "ArrowRight") && xSpeed !== -1) {
        tempXspeed = 1;
        tempYspeed = 0;
    }
}
