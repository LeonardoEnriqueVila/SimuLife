import { standardHungerDecrease, standardEnergyDecrease, standardComfortDecrease, standardFunDecrease } from './need';

class NeedsManager {
    private activeEffects: {
        hunger: () => void,
        energy: () => void,
        comfort: () => void,
        fun: () => void,
    };
    constructor() {
        this.activeEffects = {
            hunger: standardHungerDecrease,
            energy: standardEnergyDecrease,
            comfort: standardComfortDecrease,
            fun: standardFunDecrease,
        } 
    }
    // Métodos para actualizar y gestionar los efectos activos
    updateEffect(needKey: keyof typeof this.activeEffects, newEffectFunction: () => void) {
        this.activeEffects[needKey] = newEffectFunction;
    }
    // Métodos para iniciar los intervalos que llaman a los efectos activos
    startHungerInterval() {
        setInterval(() => {
            if (this.activeEffects.hunger) {
                this.activeEffects.hunger();
            }
        }, 1000);
    }
    startEnergyInterval() {
        setInterval(() => {
            if (this.activeEffects.energy) {
                this.activeEffects.energy();
            }
        }, 1000);
    }
    startComfortInterval() {
        setInterval(() => {
            if (this.activeEffects.comfort) {
                this.activeEffects.comfort();
            }
        }, 1000);
    }
    startFunInterval() {
        setInterval(() => {
            if (this.activeEffects.fun) {
                this.activeEffects.fun();
            }
        }, 1000);
    }
}

export const needsManager = new NeedsManager();

needsManager.startHungerInterval();
needsManager.startEnergyInterval();
needsManager.startComfortInterval();
needsManager.startFunInterval();














