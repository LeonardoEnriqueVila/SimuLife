// Clase 'Need' que representa una necesidad como hambre o energía
export class Need {
    // Constructor de la clase. Inicializa la necesidad con un valor y un valor máximo.
    constructor(public value: number, private maxValue: number) {}
    // Método para aumentar la necesidad. Asegura que no exceda el valor máximo.
    increase(amount: number): void {
        this.value = Math.min(this.value + amount, this.maxValue);
    }
    // Método para disminuir la necesidad. Asegura que no sea menor que cero.
    decrease(amount: number): void {
        this.value = Math.max(this.value - amount, 0);
    }
    // Método que verifica si la necesidad ha llegado a un estado crítico (0 o menos).
    isCritical(): boolean {
        return this.value <= 0;
    }
}

export const hunger = new Need(50, 200);
export const energy = new Need(50, 100);
export const comfort = new Need(50, 100);
export const fun = new Need(50, 100);

// En needsManager.ts o un archivo separado
export function standardHungerDecrease() {
    hunger.value -= 0.2;
    if (hunger.value < 0) hunger.value = 0;
    document.getElementById('hunger')!.textContent = hunger.value.toFixed(1);
}

export function standardEnergyDecrease() {
    energy.value -= 0.1;
    if (energy.value < 0) energy.value = 0;
    document.getElementById('energy')!.textContent = energy.value.toFixed(1);
}

export function standardComfortDecrease() {
    comfort.value -= 0.2;
    if (comfort.value < 0) comfort.value = 0;
    document.getElementById('comfort')!.textContent = comfort.value.toFixed(1);
}

export function standardFunDecrease() {
    fun.value -= 0.3;
    if (fun.value < 0) fun.value = 0;
    document.getElementById('fun')!.textContent = fun.value.toFixed(1);
}

