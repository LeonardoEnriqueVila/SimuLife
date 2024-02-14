import { needsManager } from "./needsManager";

class GameClock {
    currentTime: string;
    secondsCounter = 0;
    minutesCounter = 0;
    hoursCounter = 10;
    daysCounter = 0;
    clockInterval: number | undefined
    private speedListener: CustomEventHandler;

    constructor() {
        this.currentTime = "Day 1 - 10:00:00"; // Representa el tiempo en segundos, minutos, horas, etc.
        this.speedListener = (speed: any) => { // recibe la velocidad 
            switchSpeed(speed);
        };
        this.subscribeToEvents();
        this.ClockInNormalSpeed(); // inicializar en velocidad normal
    }

    private subscribeToEvents() {
        EventManager.subscribe('changeSpeed', this.speedListener);
    }

    updateClockSpeed(newInterval: number) {
        // Detener el intervalo actual si ya existe uno
        if (this.clockInterval !== undefined) { // detener intervalo actual si lo hay
            clearInterval(this.clockInterval);
        }
        // Iniciar un nuevo intervalo con la nueva velocidad
        this.clockInterval = setInterval(() => {
            this.updateNeeds(); // actualizar las necesidades en el intervalo
            this.secondsCounter += 1;
            this.currentTime = this.Clock();
            UIManager.updateText("clock", this.currentTime);
            // Actualizar otras mecánicas basadas en el tiempo aquí
        }, newInterval);
    }


    ClockInNormalSpeed() {
        this.updateClockSpeed(75); // 0.075 segundos para velocidad normal
    }

    ClockInFastSpeed() {
        this.updateClockSpeed(37.5); // 0.037 segundos para velocidad rápida
    }

    ClockInVeryFastSpeed() {
        this.updateClockSpeed(18.75); // 0.018 segundos para velocidad muy rapida
    }

    ClockInLightSpeed() {
        this.updateClockSpeed(3); // 0.003 segundos para velocidad de la luz
    }

    stopClock() {
        if (this.clockInterval !== undefined) {
            clearInterval(this.clockInterval);
            this.clockInterval = undefined;
        }
    }

    updateNeeds() {
        // Aquí decides cuándo actualizar las necesidades basado en currentTime
        // Por ejemplo, si currentTime es múltiplo de X, actualiza necesidad Y
        needsManager.HungerInterval();
        needsManager.EnergyInterval();
        needsManager.ComfortInterval();
        needsManager.FunInterval();
    }

    Clock() {
        if (this.secondsCounter === 60) {
            this.secondsCounter = 0;
            this.minutesCounter++;
        }
        if (this.minutesCounter === 60) {
            this.minutesCounter = 0;
            this.hoursCounter++;
        }
        if (this.hoursCounter === 24) {
            this.hoursCounter = 0;
            this.daysCounter++;
        }
        return `Day ${this.daysCounter} - ${this.hoursCounter.toString().padStart(2, '0')}:${this.minutesCounter.toString().padStart(2, '0')}:${this.secondsCounter.toString().padStart(2, '0')}`;

    }
}

function switchSpeed(speed: string) {
    switch (speed) {
        case "normal":
            gameClock.ClockInNormalSpeed();
            break;
        case "fast":
            gameClock.ClockInFastSpeed();
            break;
        case "veryFast":
            gameClock.ClockInVeryFastSpeed();
            break;
        case "light":
            gameClock.ClockInLightSpeed();
            break;
        case "pause":
            gameClock.stopClock();
            break;

    }
}

const gameClock = new GameClock();
//gameClock.ClockInFastSpeed();


