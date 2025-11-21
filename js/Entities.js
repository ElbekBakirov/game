// Global InputState obyektiga kirishni ta'minlash uchun uni bu yerda e'lon qilishimiz kerak, 
// chunki u Input.js faylida e'lon qilingan.
// ESLint kabi linterlar buni yoqtirmasligi mumkin, ammo oddiy loyiha uchun bu ishlaydi.
/* global InputState */

// --- Yordamchi Funksiyalar (Utilities) ---

function generateAsteroidVertices(radius) {
    const vertices = [];
    const numPoints = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI / numPoints) * 2 * i;
        const minRadius = radius * 0.8;
        const maxRadius = radius * 1.2;
        const dist = minRadius + Math.random() * (maxRadius - minRadius);
        vertices.push({
            x: dist * Math.cos(angle),
            y: dist * Math.sin(angle),
        });
    }
    return vertices;
}

// --- Chizish Funksiyalari (Drawing Functions) ---

function drawPlanet(ctx, p) {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.arc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r, 0, Math.PI * 2);
    ctx.fill();
}

function drawAsteroid(ctx, e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rotation);

    const baseColor = '#4e3a24';
    const detailColor = '#3a2b1f';
    const highlightColor = '#7d6141';

    ctx.beginPath();
    for (let i = 0; i < e.vertices.length; i++) {
        const v = e.vertices[i];
        if (i === 0) {
            ctx.moveTo(v.x, v.y);
        } else {
            ctx.lineTo(v.x, v.y);
        }
    }
    ctx.closePath();

    const gradient = ctx.createRadialGradient(e.r * 0.3, e.r * 0.3, e.r * 0.1, 0, 0, e.r * 1.5);
    gradient.addColorStop(0, highlightColor);
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, detailColor);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#2b1f14';
    ctx.lineWidth = 1;
    ctx.stroke();

    // HP bar
    ctx.fillStyle = '#1c2230';
    ctx.fillRect(-e.r, -e.r - 10, e.r * 2, 4);
    ctx.fillStyle = '#ffc34f';
    const hpPct = Math.max(0, e.hp) / e.maxHp;
    ctx.fillRect(-e.r, -e.r - 10, e.r * 2 * hpPct, 4);

    ctx.restore();
}

function drawPowerUp(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    ctx.shadowBlur = 15;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#111';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.icon, 0, 1);

    ctx.restore();
}

function drawSpaceship(ctx, player, angle, isFlashing, muzzleFlash, hasShield) {
    const { x, y, r } = player;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);

    const FLICKER_COLOR = 'rgba(255, 255, 255, 0.9)';
    const BASE_BLUE = hasShield ? '#0077ff' : '#0033cc';
    const ACCENT_RED = '#cc0000';
    const ACCENT_LIGHT = '#dddddd';
    const mainColor = isFlashing ? FLICKER_COLOR : BASE_BLUE;
    const rScaled = r * 1.5;

    // 1. Kema korpusi
    const mainGradient = ctx.createLinearGradient(0, -rScaled * 1.5, 0, rScaled * 0.8);
    mainGradient.addColorStop(0, BASE_BLUE);
    mainGradient.addColorStop(0.5, '#0055aa');
    mainGradient.addColorStop(1, '#002266');
    ctx.fillStyle = mainColor === BASE_BLUE ? mainGradient : mainColor;

    ctx.beginPath();
    ctx.moveTo(0, -rScaled * 1.5);
    ctx.lineTo(-rScaled * 1.8, -rScaled * 0.8);
    ctx.lineTo(-rScaled * 2.2, rScaled * 0.5);
    ctx.lineTo(0, rScaled * 0.8);
    ctx.lineTo(rScaled * 2.2, rScaled * 0.5);
    ctx.lineTo(rScaled * 1.8, -rScaled * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#33ffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Kabina/Kokpit
    ctx.fillStyle = isFlashing ? FLICKER_COLOR : ACCENT_RED;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'red';
    ctx.beginPath();
    ctx.moveTo(0, -rScaled * 1.5);
    ctx.lineTo(rScaled * 0.4, -rScaled * 0.9);
    ctx.lineTo(0, -rScaled * 0.3);
    ctx.lineTo(-rScaled * 0.4, -rScaled * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3. Dvigatel bo'limi
    const engineY = rScaled * 0.8;
    ctx.fillStyle = ACCENT_LIGHT;
    ctx.fillRect(-rScaled * 0.6, engineY - 5, rScaled * 1.2, 5);

    // Dvigatel Olovi (Bu animatsiya uchun performance.now() ga bog'liq)
    const flameHeight = rScaled * 0.8 + Math.sin(performance.now() / 50) * rScaled * 0.1;
    const flameBase = engineY + 5;

    const drawFlame = (offsetX, scale) => {
        ctx.shadowBlur = 10 * scale;
        ctx.shadowColor = 'orange';

        ctx.fillStyle = `rgba(255, 100, 0, ${0.8 * scale})`;
        ctx.beginPath();
        ctx.moveTo(offsetX + rScaled * 0.1, flameBase);
        ctx.lineTo(offsetX, flameBase + flameHeight * 0.6 * scale);
        ctx.lineTo(offsetX - rScaled * 0.1, flameBase);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 200, 0, ${0.5 * scale})`;
        ctx.beginPath();
        ctx.moveTo(offsetX + rScaled * 0.15, flameBase);
        ctx.lineTo(offsetX, flameBase + flameHeight * scale);
        ctx.lineTo(offsetX - rScaled * 0.15, flameBase);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    drawFlame(rScaled * 0.3, 0.8);
    drawFlame(0, 1.2);
    drawFlame(-rScaled * 0.3, 0.8);

    // 4. Qalqon (Shield)
    if (hasShield) {
        const shieldColor = `rgba(0, 150, 255, ${0.5 + Math.sin(performance.now() / 100) * 0.2})`;
        ctx.fillStyle = shieldColor;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(0, 0, rScaled * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    ctx.restore();
}

function drawVirtualJoystick(ctx) {
    if (InputState.touch.isMoving) {
        const { x: centerX, y: centerY } = InputState.touch.moveStart;
        const { x: currentX, y: currentY } = InputState.touch.moveCurrent;

        const dx = currentX - centerX;
        const dy = currentY - centerY;
        const distance = Math.hypot(dx, dy);

        const ratio = Math.min(distance, InputState.JOYSTICK_RADIUS) / distance;
        const knobX = centerX + dx * (ratio || 0);
        const knobY = centerY + dy * (ratio || 0);

        // 1. Tashqi doira (Asos)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, InputState.JOYSTICK_RADIUS, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Ichki doira (Knob)
        ctx.fillStyle = 'rgba(0, 170, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(knobX, knobY, InputState.JOYSTICK_RADIUS / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}