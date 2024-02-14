function addEventToDivClock() { // añadir evento al div predeterminado de items del market
    document.getElementById('pause')!.addEventListener('click', () => {
        EventManager.emit("changeSpeed", "pause");
        UIManager.updateText("speed", "Pause");
    });
    document.getElementById('normalSpeed')!.addEventListener('click', () => {
        EventManager.emit("changeSpeed", "normal");
        UIManager.updateText("speed", "Normal Speed");
    });
    document.getElementById('fastSpeed')!.addEventListener('click', () => {
        EventManager.emit("changeSpeed", "fast");
        UIManager.updateText("speed", "Fast Speed!");
    });
    document.getElementById('veryFastSpeed')!.addEventListener('click', () => {
        EventManager.emit("changeSpeed", "veryFast");
        UIManager.updateText("speed", "Very Fast Speed!!");
    });
    document.getElementById('lightSpeed')!.addEventListener('click', () => {
        EventManager.emit("changeSpeed", "light");
        UIManager.updateText("speed", "Light Speed!!!");
    });
}

addEventToDivClock();

// luego implementar el movimiento del sim