import { standardHungerDecrease, standardEnergyDecrease, standardComfortDecrease, standardFunDecrease } from './need';

// ahora las funciones que se le pasan a "activeEffecs" mediante "updateEffect" no responden a un intervalo directo generado
// directamente en needsManager, sino que los metodos "HungerInterva()", etc, se actualizan en el clock con updateNeeds
// el cual se llama cada segundo y se multiplica segun la velocidad del juego, lo cual implica que el intervalo del reloj,
// maneja las necesidades, implicando que solo hay un intervalo centralizado. 

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
    HungerInterval() {
        if (this.activeEffects.hunger) {
            this.activeEffects.hunger();
        }
        
    }
    EnergyInterval() {
        if (this.activeEffects.energy) {
            this.activeEffects.energy();
        }
    }
    
    ComfortInterval() {
        if (this.activeEffects.comfort) {
            this.activeEffects.comfort();
        }
    }

    FunInterval() {
        if (this.activeEffects.fun) {
            this.activeEffects.fun();
        }
    }
}

export const needsManager = new NeedsManager();

/*needsManager.startHungerInterval();
needsManager.startEnergyInterval();
needsManager.startComfortInterval();
needsManager.startFunInterval();*/














