// --- Global Kirish Holati (InputState) ---
const InputState = {
    keys: {}, // Klaviatura holati
    mouse: { x: 0, y: 0, isDown: false }, // Sichqoncha holati
    touch: {
        isMoving: false, // Harakatlanish faolmi? (Chap tomon)
        moveStart: { x: 0, y: 0 },
        moveCurrent: { x: 0, y: 0 },
        isShooting: false, // Otish faolmi? (O'ng tomon)
        shootTarget: null,
        moveTouchId: null,
        shootTouchId: null,
    },
    JOYSTICK_RADIUS: 50,
};

// --- Input Event Listenerlar ---
function initInput(canvas) {
    // Klaviatura
    window.addEventListener('keydown', e => InputState.keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => InputState.keys[e.key.toLowerCase()] = false);

    // Sichqoncha yordamchi funksiyasi
    function getCanvasPoint(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left),
            y: (clientY - rect.top),
        };
    }

    // Sichqoncha (Desktop)
    canvas.addEventListener('mousemove', e => {
        // Agar touch input faol bo'lmasa, mouse harakatini kuzatish
        if (!InputState.touch.isMoving && !InputState.touch.isShooting) {
            InputState.mouse = { ...InputState.mouse, ...getCanvasPoint(e.clientX, e.clientY) };
        }
    });
    canvas.addEventListener('mousedown', e => {
        if (!InputState.touch.isMoving && !InputState.touch.isShooting) {
            InputState.mouse.isDown = true;
        }
    });
    canvas.addEventListener('mouseup', e => {
        InputState.mouse.isDown = false;
    });

    // Mobil (Touch)
    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const w = canvas.width / devicePixelRatio;

        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            const p = getCanvasPoint(t.clientX, t.clientY);

            // Chap tomon (Harakat)
            if (p.x < w / 2 && !InputState.touch.isMoving) {
                InputState.touch.isMoving = true;
                InputState.touch.moveStart = p;
                InputState.touch.moveCurrent = p;
                InputState.touch.moveTouchId = t.identifier;
            }
            // O'ng tomon (Otish)
            else if (p.x >= w / 2 && !InputState.touch.isShooting) {
                InputState.touch.isShooting = true;
                InputState.touch.shootTarget = p;
                InputState.touch.shootTouchId = t.identifier;
            }
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            const p = getCanvasPoint(t.clientX, t.clientY);

            if (t.identifier === InputState.touch.moveTouchId) {
                InputState.touch.moveCurrent = p;
            }

            if (t.identifier === InputState.touch.shootTouchId && InputState.touch.isShooting) {
                InputState.touch.shootTarget = p;
            }
        }
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];

            if (t.identifier === InputState.touch.moveTouchId) {
                InputState.touch.isMoving = false;
                InputState.touch.moveTouchId = null;
            }

            if (t.identifier === InputState.touch.shootTouchId) {
                InputState.touch.isShooting = false;
                InputState.touch.shootTouchId = null;
                InputState.touch.shootTarget = null;
            }
        }
    });
}