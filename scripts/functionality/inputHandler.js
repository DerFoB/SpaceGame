const keyMap = {
    " ": "KEY_SPACE",
    "ArrowUp": "KEY_UP",
    "ArrowDown": "KEY_DOWN",
    "ArrowLeft": "KEY_LEFT",
    "ArrowRight": "KEY_RIGHT"
};

const keyState = {
    KEY_SPACE: false,
    KEY_UP: false,
    KEY_DOWN: false,
    KEY_LEFT: false,
    KEY_RIGHT: false
};

document.addEventListener("keydown", (e) => {
    if (keyMap[e.key]) {
        keyState[keyMap[e.key]] = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (keyMap[e.key]) {
        keyState[keyMap[e.key]] = false;
    }
});

export { keyState };