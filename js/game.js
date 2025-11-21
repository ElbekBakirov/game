// Global funksiyalarga va obyektlarga kirishni ta'minlash (Entities.js va Input.js dan)
/* global InputState, initInput, generateAsteroidVertices, drawPlanet, drawAsteroid, 
          drawPowerUp, drawSpaceship, drawVirtualJoystick */

// --- Global Konfiguratsiya Va Elementlar ---
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const hpTextEl = document.getElementById('hp-text');
const hpFillEl = document.getElementById('hp-fill');
const restartBtn = document.getElementById('restart');
const levelEl = document.getElementById('level');
const weaponStatusEl = document.getElementById('weapon-status');
const nextLevelBtn = document.getElementById('next-level-btn');

// --- Konstanstalar ---
const INVULNERABILITY_DURATION = 1.5;
const SHIELD_DURATION = 40.0;
const LEVEL_SCORE_THRESHOLD = 100;
const MAX_LEVEL = 100;

// --- O'yin Holati (Game State) ---
let running = false;
let last = 0;
let player, bullets, enemies, score, hp, maxHp, powerUps, particles, stars, planets;
let lastShotTime = 0;
let FIRE_RATE = 0.15;
let invulnerabilityTimer = 0;
let muzzleFlashTimer = 0;
let weaponLevel = 1;
let isPaused = false;
let shakeDuration = 0;
let canvasXOffset = 0;
let canvasYOffset = 0;
let shieldTimer = 0;
let finalScore = 0;
let spawnTimer = 0;
let spawnInterval = 1.0;

// Elementlar yuklanganidan so'ng inputni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    initInput(canvas); // Input.js dan chaqiriladi
    fitCanvas();
    reset();
    requestAnimationFrame(loop);
});

// --- Yordamchi Funksiyalar (Utilities) ---

function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * devicePixelRatio);
    canvas.height = Math.floor(rect.height * devicePixelRatio);
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener('resize', fitCanvas);

function updateHPDisplay() {
    let shieldStatus = shieldTimer > 0 ? ` [S: ${shieldTimer.toFixed(0)}s]` : '';
    hpTextEl.textContent = 'HP: ' + hp + shieldStatus;
    const hpPct = hp / maxHp;
    hpFillEl.style.width = (hpPct * 100) + '%';
    if (hpPct > 0.6) {
        hpFillEl.style.backgroundColor = '#4fff6b';
    } else if (hpPct > 0.3) {
        hpFillEl.style.backgroundColor = '#ffc34f';
    } else {
        hpFillEl.style.backgroundColor = '#ff3b3b';
    }
}

function getCurrentFrameTier(level) {
    const FRAME_TIERS = {
        BRONZE: { maxLevel: 15, color: '#cd7f32', shadow: 'rgba(205, 127, 50, 0.7)', label: 'Bronze Pilot' },
        SILVER: { maxLevel: 30, color: '#c0c0c0', shadow: 'rgba(192, 192, 192, 0.7)', label: 'Silver Ace' },
        GOLD: { maxLevel: 55, color: '#ffd700', shadow: 'rgba(255, 215, 0, 0.8)', label: 'Gold Commander' },
        DIAMOND: { maxLevel: 75, color: '#00ffff', shadow: 'rgba(0, 255, 255, 0.9)', label: 'Diamond Captain' },
        FIRE_DIAMOND: { maxLevel: 100, color: '#ff4500', shadow: 'rgba(255, 69, 0, 1.0)', label: 'Firestorm Legend', fire: true },
    };

    if (level >= FRAME_TIERS.FIRE_DIAMOND.maxLevel) return FRAME_TIERS.FIRE_DIAMOND;
    if (level >= FRAME_TIERS.DIAMOND.maxLevel) return FRAME_TIERS.DIAMOND;
    if (level >= FRAME_TIERS.GOLD.maxLevel) return FRAME_TIERS.GOLD;
    if (level >= FRAME_TIERS.SILVER.maxLevel) return FRAME_TIERS.SILVER;
    if (level >= 1) return FRAME_TIERS.BRONZE;
    return { color: '#8aa0b2', shadow: 'rgba(138, 160, 178, 0.5)', label: 'Trainee' };
}

function startShake(duration = 0.2, magnitude = 5) {
    shakeDuration = duration;
    canvasXOffset = (Math.random() - 0.5) * magnitude;
    canvasYOffset = (Math.random() - 0.5) * magnitude;
}

function createExplosion(x, y, color, num, minR, maxR, minSpeed, maxSpeed) {
    for (let i = 0; i < num; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({
            x: x, y: y,
            r: minR + Math.random() * (maxR - minR),
            vx: vx, vy: vy,
            color: color,
            life: 1.0,
            decay: 0.8 + Math.random() * 0.4
        });
    }
}

function createPowerUp(x, y, type) {
    let color, icon;
    if (type === 'speed') { color = '#ffdf00'; icon = '⚡'; }
    else if (type === 'shield') { color = '#00aaff'; icon = '🛡️'; }
    else if (type === 'hp') { color = '#4fff6b'; icon = '➕'; }

    powerUps.push({
        x: x, y: y, r: 10,
        type: type, color: color, icon: icon,
        vy: 50
    });
}

function initBackground() {
    const w = canvas.width / devicePixelRatio, h = canvas.height / devicePixelRatio;
    stars = [];
    for (let i = 0; i < 80; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h, r: 1, speed: 5, color: 'rgba(255, 255, 255, 0.5)' });
    }
    for (let i = 0; i < 80; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h, r: 1.5, speed: 20, color: 'rgba(255, 255, 255, 0.8)' });
    }
    for (let i = 0; i < 40; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h, r: 2, speed: 50, color: 'rgba(255, 255, 255, 1)' });
    }

    planets = [
        { x: w * 0.2, y: -h * 0.5, r: 80, color: '#3b3e4f', speed: 5 },
        { x: w * 0.8, y: -h * 1.5, r: 120, color: '#6a3232', speed: 8 }
    ];
}

function spawnEnemy() {
    let x, y;
    const margin = 20;
    const w = canvas.width / devicePixelRatio, h = canvas.height / devicePixelRatio;

    x = Math.random() * w;
    y = -margin;

    const targetX = player.x + (Math.random() - 0.5) * 150;
    const targetY = h + 100;
    const ang = Math.atan2(targetY - y, targetX - x);

    const normalizedLevel = Math.min(MAX_LEVEL, weaponLevel) / MAX_LEVEL;
    const baseSpeed = 80;
    const maxSpeedIncrease = 420;
    const speed = baseSpeed + maxSpeedIncrease * normalizedLevel + Math.random() * 80;

    let vx = Math.cos(ang) * speed;
    let vy = Math.sin(ang) * speed;
    if (vy < 0) vy = -vy;

    const radius = 18 + Math.random() * 12;
    const maxHP = 1 + Math.floor(normalizedLevel * 4);
    const hitpoints = 1 + Math.floor(Math.random() * maxHP);
    const scoreValue = hitpoints * 5;

    enemies.push({
        x, y, vx, vy, r: radius, hp: hitpoints, maxHp: hitpoints,
        vertices: generateAsteroidVertices(radius), // Entities.js dan chaqiriladi
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 2,
        score: scoreValue,
    });

    spawnInterval = Math.max(0.1, 1.2 * (1 - normalizedLevel * 0.9));
}

// --- Game Logic ---

function reset() {
    maxHp = 100;
    const w = canvas.width / (devicePixelRatio), h = canvas.height / (devicePixelRatio);
    player = { x: w / 2, y: h / 1.1, r: 35, speed: 350 };
    bullets = [];
    enemies = [];
    powerUps = [];
    particles = [];
    score = 0;
    hp = maxHp;
    // InputState.mouse va touch holatlarini tozalash (Input.js dan)
    InputState.mouse = { x: player.x, y: player.y, isDown: false };
    InputState.touch = { isMoving: false, moveStart: { x: 0, y: 0 }, moveCurrent: { x: 0, y: 0 }, isShooting: false, shootTarget: null, moveTouchId: null, shootTouchId: null, };
    InputState.keys = {}; // Klaviatura holatini tozalash

    spawnTimer = 0;
    lastShotTime = 0;
    invulnerabilityTimer = 0;
    muzzleFlashTimer = 0;
    weaponLevel = 1;
    isPaused = false;
    shakeDuration = 0;
    shieldTimer = 0;
    finalScore = 0;

    scoreEl.textContent = 'Score: 0';
    updateHPDisplay();
    updateLevel();
    initBackground();
    weaponStatusEl.textContent = 'Weapon: Single Shot';
    nextLevelBtn.style.display = 'none';
}

function updateLevel() {
    const oldLevel = weaponLevel;
    let newLevel = Math.min(MAX_LEVEL + 1, Math.floor(score / LEVEL_SCORE_THRESHOLD) + 1);

    if (newLevel <= MAX_LEVEL) {
        levelEl.textContent = 'Level: ' + newLevel;
    } else {
        levelEl.textContent = 'Level: VETERAN';
    }

    if (newLevel > oldLevel) {
        weaponLevel = newLevel;

        if (weaponLevel === 2) {
            weaponStatusEl.textContent = 'Weapon: Double Shot (Wing Guns)';
        } else if (weaponLevel === 3) {
            weaponStatusEl.textContent = 'Weapon: TRIPLE SHOT (Max Power)';
        } else if (weaponLevel > 3) {
            weaponStatusEl.textContent = 'Weapon: Maxed Out';
        }

        if (weaponLevel <= MAX_LEVEL) {
            showRewardScreen(weaponLevel);
        }
    }

    FIRE_RATE = Math.max(0.08, 0.15 - Math.min(2, weaponLevel - 1) * 0.02);

    if (score >= LEVEL_SCORE_THRESHOLD * MAX_LEVEL && running) {
        running = false;
        finalScore = score;
        nextLevelBtn.style.display = 'none';
    }
}

function showRewardScreen(newLevel) {
    isPaused = true;
    running = false;

    const rect = canvas.getBoundingClientRect();
    nextLevelBtn.style.display = 'block';
    nextLevelBtn.style.position = 'absolute';
    nextLevelBtn.style.left = `${rect.left + rect.width / 2}px`;
    nextLevelBtn.style.top = `${rect.top + rect.height / 2 + 100}px`;
    nextLevelBtn.style.transform = 'translate(-50%, -50%)';

    if (newLevel > MAX_LEVEL) {
        nextLevelBtn.style.display = 'none';
    }
}
nextLevelBtn.addEventListener('click', () => {
    if (weaponLevel <= MAX_LEVEL) {
        isPaused = false;
        running = true;
        nextLevelBtn.style.display = 'none';
        enemies = [];
        powerUps = [];
        spawnTimer = 0;
    }
});


function shoot(t) {
    if (!running || isPaused) return;
    const now = t / 1000;
    if (now - lastShotTime < FIRE_RATE) return;

    lastShotTime = now;
    muzzleFlashTimer = 0.05;

    // Nishonni aniqlash: Mobil yoki Desktop
    let targetX, targetY;
    if (InputState.touch.isShooting && InputState.touch.shootTarget) {
        targetX = InputState.touch.shootTarget.x;
        targetY = InputState.touch.shootTarget.y;
    } else {
        targetX = InputState.mouse.x;
        targetY = InputState.mouse.y;
    }

    const angle = Math.atan2(targetY - player.y, targetX - player.x);
    const bulletSpeed = 700;
    const rScaled = player.r * 1.5;

    const gunPositions = [
        { x: rScaled * 1.5, y: rScaled * 0.2 },
        { x: -rScaled * 1.5, y: rScaled * 0.2 },
        { x: 0, y: -rScaled * 0.5 }
    ];

    const cosA = Math.cos(angle + Math.PI / 2);
    const sinA = Math.sin(angle + Math.PI / 2);

    const shootBullet = (offsetAngle = 0, gunPosIndex = 0, bulletRadius = 3) => {
        const pos = gunPositions[gunPosIndex % gunPositions.length];

        const rotatedX = pos.x * cosA - pos.y * sinA;
        const rotatedY = pos.x * sinA + pos.y * cosA;

        const effectiveAngle = angle + offsetAngle;

        bullets.push({
            x: player.x + rotatedX,
            y: player.y + rotatedY,
            vx: Math.cos(effectiveAngle) * bulletSpeed,
            vy: Math.sin(effectiveAngle) * bulletSpeed,
            r: bulletRadius,
            color: 'var(--accent)',
            trail: []
        });
    };

    if (weaponLevel === 1) {
        shootBullet(0, 2, 3);
    } else if (weaponLevel === 2) {
        shootBullet(0, 0, 3);
        shootBullet(0, 1, 3);
    } else if (weaponLevel >= 3) {
        shootBullet(-0.08, 0, 3);
        shootBullet(0.08, 1, 3);
        shootBullet(0, 2, 4);
    }
}

// --- Asosiy O'yin Loop (Game Loop) ---

function update(dt) {
    if (!running || isPaused) return;

    // Ekran silkinishi
    if (shakeDuration > 0) {
        shakeDuration -= dt;
        const magnitude = shakeDuration * 5 / 0.2;
        canvasXOffset = (Math.random() - 0.5) * magnitude;
        canvasYOffset = (Math.random() - 0.5) * magnitude;
    } else {
        canvasXOffset = 0;
        canvasYOffset = 0;
    }

    if (invulnerabilityTimer > 0) invulnerabilityTimer -= dt;
    if (muzzleFlashTimer > 0) muzzleFlashTimer -= dt;
    if (shieldTimer > 0) shieldTimer -= dt;

    updateHPDisplay();

    // Player Harakati
    let dx = 0, dy = 0;
    // 1. Klaviatura (Desktop)
    if (InputState.keys['arrowleft'] || InputState.keys['a']) dx -= 1;
    if (InputState.keys['arrowright'] || InputState.keys['d']) dx += 1;
    if (InputState.keys['arrowup'] || InputState.keys['w']) dy -= 1;
    if (InputState.keys['arrowdown'] || InputState.keys['s']) dy += 1;

    // 2. Mobil (Touch Joystick)
    if (InputState.touch.isMoving) {
        const vecX = InputState.touch.moveCurrent.x - InputState.touch.moveStart.x;
        const vecY = InputState.touch.moveCurrent.y - InputState.touch.moveStart.y;
        const len = Math.hypot(vecX, vecY);

        if (len > 0) {
            const ratio = Math.min(len, InputState.JOYSTICK_RADIUS) / len;
            dx += (vecX / len) * ratio;
            dy += (vecY / len) * ratio;
        }
    }

    // Harakatni qo'llash
    const len = Math.hypot(dx, dy);
    if (len > 0) {
        const normalizedDx = dx / len;
        const normalizedDy = dy / len;
        const w = canvas.width / devicePixelRatio;
        const h = canvas.height / devicePixelRatio;

        player.x = Math.min(w - player.r, Math.max(player.r, player.x + normalizedDx * player.speed * dt));
        player.y = Math.min(h - player.r, Math.max(player.r, player.y + normalizedDy * player.speed * dt));
    }

    // Player Otish
    if (InputState.mouse.isDown || InputState.touch.isShooting) {
        shoot(performance.now());
    }

    // Fonni yangilash
    const h = canvas.height / devicePixelRatio;
    for (const s of stars) { s.y += s.speed * dt; if (s.y > h) { s.y = 0; s.x = Math.random() * (canvas.width / devicePixelRatio); } }
    for (const p of planets) { p.y += p.speed * dt; if (p.y > h * 1.5) { p.y = -h * 1.5; } }

    // Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.trail.unshift({ x: b.x, y: b.y });
        if (b.trail.length > 5) b.trail.pop();
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        const w = canvas.width / devicePixelRatio, h = canvas.height / devicePixelRatio;
        if (b.x < -10 || b.x > w + 10 || b.y < -10 || b.y > h + 10) {
            bullets.splice(i, 1);
        }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) particles.splice(i, 1);
    }

    // PowerUps
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const p = powerUps[i];
        p.y += p.vy * dt;

        const dxp = p.x - player.x, dyp = p.y - player.y;
        if (dxp * dxp + dyp * dyp < (p.r + player.r) * (p.r + player.r)) {
            if (p.type === 'speed') {
                FIRE_RATE = Math.max(0.05, FIRE_RATE * 0.7);
                setTimeout(() => { FIRE_RATE = Math.max(0.08, 0.15 - Math.min(2, weaponLevel - 1) * 0.02); }, 5000);
            } else if (p.type === 'shield') {
                shieldTimer = SHIELD_DURATION;
            } else if (p.type === 'hp') {
                hp = Math.min(maxHp, hp + 10);
            }
            powerUps.splice(i, 1);
            updateHPDisplay();
            continue;
        }
        if (p.y > canvas.height / devicePixelRatio + p.r) powerUps.splice(i, 1);
    }

    // Enemies
    spawnTimer += dt;
    if (spawnTimer > spawnInterval) { spawnTimer = 0; spawnEnemy(); }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        e.rotation += e.rotationSpeed * dt;

        const isPlayerCollision = (dxp, dyp) => dxp * dxp + dyp * dyp < (e.r + player.r) * (e.r + player.r);

        // Pastga yetib kelsa
        if (e.y > canvas.height / devicePixelRatio + e.r) {
            if (shieldTimer <= 0) {
                hp -= 1; updateHPDisplay(); startShake(0.15, 5); invulnerabilityTimer = INVULNERABILITY_DURATION / 3;
                if (hp <= 0) { running = false; finalScore = score; return; }
            } else { createExplosion(e.x, e.y, e.maxHp > 1 ? '#ff4500' : '#d1431a', 15, 2, 5, 50, 200); }
            enemies.splice(i, 1); continue;
        }

        // O'yinchi bilan to'qnashuv
        const dxp = e.x - player.x, dyp = e.y - player.y;
        if (invulnerabilityTimer <= 0 && shieldTimer <= 0 && isPlayerCollision(dxp, dyp)) {
            hp -= 1; updateHPDisplay(); invulnerabilityTimer = INVULNERABILITY_DURATION; startShake(0.25, 10);
            createExplosion(e.x, e.y, e.maxHp > 1 ? '#ff4500' : '#d1431a', 20, 3, 6, 80, 250);
            enemies.splice(i, 1);
            if (hp <= 0) { running = false; finalScore = score; return; }
            continue;
        } else if (shieldTimer > 0 && isPlayerCollision(dxp, dyp)) {
            startShake(0.15, 5); createExplosion(e.x, e.y, '#00ffff', 15, 2, 5, 50, 200);
            score += e.score; scoreEl.textContent = 'Score: ' + score; updateLevel(); enemies.splice(i, 1); continue;
        }

        // O'q bilan to'qnashuv
        let hit = false;
        for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            const dx = e.x - b.x, dy = e.y - b.y;
            if (dx * dx + dy * dy < (e.r + b.r) * (e.r + b.r)) {
                bullets.splice(j, 1); e.hp -= 1; hit = true;
                createExplosion(b.x, b.y, 'rgba(255, 255, 255, 0.8)', 5, 1, 3, 20, 80);
                break;
            }
        }

        if (hit && e.hp <= 0) {
            createExplosion(e.x, e.y, e.maxHp > 1 ? '#ff4500' : '#d1431a', 30, 4, 8, 100, 400);
            if (e.maxHp > 1 && Math.random() < 0.5) {
                const type = Math.random() < 0.33 ? 'speed' : (Math.random() < 0.5 ? 'shield' : 'hp');
                createPowerUp(e.x, e.y, type); startShake(0.3, 7);
            }
            score += e.score; scoreEl.textContent = 'Score: ' + score; updateLevel(); enemies.splice(i, 1);
        }
    }
}

function draw() {
    const w = canvas.width / devicePixelRatio, h = canvas.height / devicePixelRatio;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(canvasXOffset, canvasYOffset);

    // Fon elementlarini chizish (Entities.js dan chaqiriladi)
    for (const p of planets) { drawPlanet(ctx, p); }
    for (const s of stars) {
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    }

    // O'yin elementlarini chizish
    for (const b of bullets) {
        // Traillarni chizish
        for (let i = 0; i < b.trail.length; i++) {
            const trail = b.trail[i];
            const alpha = 1 - (i / b.trail.length);
            ctx.fillStyle = `rgba(255, 69, 0, ${alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, b.r * (1 - i / b.trail.length) * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
        // O'qni chizish
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
    }

    for (const e of enemies) { drawAsteroid(ctx, e); } // Entities.js

    for (const p of powerUps) { drawPowerUp(ctx, p); } // Entities.js

    // Player kemasini chizish
    const targetX = InputState.touch.isShooting && InputState.touch.shootTarget ? InputState.touch.shootTarget.x : InputState.mouse.x;
    const targetY = InputState.touch.isShooting && InputState.touch.shootTarget ? InputState.touch.shootTarget.y : InputState.mouse.y;
    const targetAngle = Math.atan2(targetY - player.y, targetX - player.x);
    const isFlashing = invulnerabilityTimer > 0 && Math.floor(performance.now() / 100) % 2 === 0;

    // Muzzle Flash ni Entities.js ichida emas, bu yerda chizamiz, chunki uning holati (muzzleFlashTimer) Game.js da turadi
    const flashR = 5 + muzzleFlashTimer * 200;
    const drawFlash = (x, y) => {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, flashR, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSpaceship(ctx, player, targetAngle, isFlashing, muzzleFlashTimer, shieldTimer > 0); // Entities.js

    if (muzzleFlashTimer > 0) {
        const rScaled = player.r * 1.5;
        drawFlash(player.x + rScaled * 1.5 * Math.cos(targetAngle + Math.PI / 2) - rScaled * 0.2 * Math.sin(targetAngle + Math.PI / 2),
            player.y + rScaled * 1.5 * Math.sin(targetAngle + Math.PI / 2) + rScaled * 0.2 * Math.cos(targetAngle + Math.PI / 2));
        drawFlash(player.x + (-rScaled * 1.5) * Math.cos(targetAngle + Math.PI / 2) - rScaled * 0.2 * Math.sin(targetAngle + Math.PI / 2),
            player.y + (-rScaled * 1.5) * Math.sin(targetAngle + Math.PI / 2) + rScaled * 0.2 * Math.cos(targetAngle + Math.PI / 2));
        if (weaponLevel >= 3) {
            drawFlash(player.x + 0 * Math.cos(targetAngle + Math.PI / 2) - (-rScaled * 0.5) * Math.sin(targetAngle + Math.PI / 2),
                player.y + 0 * Math.sin(targetAngle + Math.PI / 2) + (-rScaled * 0.5) * Math.cos(targetAngle + Math.PI / 2));
        }
    }


    // Partikllarni chizish
    for (const p of particles) {
        const alpha = p.life;
        ctx.fillStyle = p.color.includes('rgba') ? p.color.replace(/, \d\)/, `, ${alpha.toFixed(2)})`) : `rgba(255, 100, 0, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
        ctx.fill();
    }

    // Virtual Joystickni chizish
    drawVirtualJoystick(ctx); // Entities.js

    ctx.restore(); // Ekran silkinishi holatidan chiqish

    // Game Over va Boshlash ekranlari (o'zgartirilmagan)
    if (!running && finalScore > 0) {
        const tier = getCurrentFrameTier(weaponLevel);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.font = 'bold 64px Inter';
        ctx.shadowColor = 'rgba(255, 0, 0, 1)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', w / 2, h / 2 - 80);

        ctx.shadowBlur = 0;
        ctx.font = 'bold 36px Inter';
        ctx.fillStyle = 'white';
        ctx.fillText(`Final Score: ${finalScore}`, w / 2, h / 2 + 10);

        ctx.font = 'bold 24px Inter';
        ctx.fillStyle = tier.color;
        ctx.fillText(`Achieved Rank: ${tier.label} (Level ${Math.min(MAX_LEVEL, weaponLevel)})`, w / 2, h / 2 + 70);
    }

    if (!running && finalScore === 0) {
        ctx.textAlign = 'center';
        ctx.font = 'bold 48px Inter';
        ctx.fillStyle = '#ff4500';
        ctx.fillText('SPACE SHOOTER', w / 2, h / 2 - 20);

        ctx.font = '20px Inter';
        ctx.fillStyle = 'white';
        ctx.fillText('Press START / RESTART to begin the mission.', w / 2, h / 2 + 30);

        ctx.font = '16px Inter';
        ctx.fillStyle = '#8aa0b2';
        ctx.fillText('Desktop: WASD/Arrows to move, Mouse to aim/shoot.', w / 2, h / 2 + 80);
        ctx.fillText('Mobile: Touch left screen to move, touch right screen to shoot.', w / 2, h / 2 + 110);
    }
}

function loop(t) {
    const dt = (t - last) / 1000;
    last = t;

    update(dt);
    draw();

    if (running || finalScore === 0) {
        requestAnimationFrame(loop);
    }
}

restartBtn.addEventListener('click', () => {
    if (!running) {
        reset();
        running = true;
        requestAnimationFrame(loop);
    }
});