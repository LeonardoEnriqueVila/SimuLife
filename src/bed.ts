import { needsManager } from './needsManager';
import { usage } from './usage';
import { GameObject } from './gameObject';
import { energy, standardEnergyDecrease, comfort, standardComfortDecrease } from './need';

// Subclase específica para 'Bed', heredando de 'GameObject'
export class Bed extends GameObject {
    private listener: CustomEventHandler; // Guardar la referencia al listener
    isBedInUse: boolean = false; // Inicialmente la cama no está en uso
    // Constructor de 'Bed', que también necesita inicializar 'GameObject'
    constructor(id: string, name: string, price: number, initialPrice: number, minPrice: number, objectIndex: number,
        positionX: number, positionY: number, 
        public initialEnergyRestoration: number, public energyRestoration: number, public minEnergyRestoration: number,
        public initialComfortRestoration: number, public comfortRestoration: number, public minComfortRestoration: number) {
        // minEnergyResortation: sirve para saber el valor minimo de bonus (80% de reduccion)
        super(id, name, price, initialPrice, minPrice, objectIndex, positionX, positionY); // Llamar al constructor de la clase base -> Inicializa la parte de 'GameObject' de esta instancia
        this.listener = (data: any) => {
            const objectInUse = data as GameObject;
            if (this !== objectInUse && this.isBedInUse) {
                this.stopResting();
            }
        };
        this.subscribeToEvents();
    }
    // subscribirse al evento
    private subscribeToEvents() {
        EventManager.subscribe('objectInUse', this.listener);
    }

    public unsubscribeFromEvents() {
        console.log(`Desuscribiendo a ${this.name}`);
        EventManager.unsubscribe('objectInUse', this.listener);
    }
    // Sobrescribir el método 'actionText' para especificar la acción de 'Bed'
    override actionText(): string {
        return `Resting in: ${this.name}`;
    }

    restInBed() {
        this.isBedInUse = true; // Marcar la cama como en uso
        EventManager.emit('objectInUse', this);
        UIManager.updateText("action", this.actionText());
        needsManager.updateEffect("energy", this.bedEnergyInterval.bind(this));
        needsManager.updateEffect("comfort", this.bedComfortInterval.bind(this));
    }
    bedEnergyInterval() {
            energy.value += this.energyRestoration;
            usage.reduceProperty(this); // desgaste del objeto
            if (energy.value > 100) {
                energy.value = 100; // Asegurar que no exceda los 100
            }
            UIManager.updateText("energy", energy.value.toFixed(1));
    }
    bedComfortInterval() {
            comfort.value += this.comfortRestoration;
            if (comfort.value > 100) {
                comfort.value = 100;
            }
            else if (comfort.value < 0) { // manejar caso en donde Bed reduce el comfort
                comfort.value = 0;
            }
            UIManager.updateText("comfort", comfort.value.toFixed(1));
    }

    stopResting() {
        if (this.isBedInUse) { // detener el uso si realmente esta siendo usado
            UIManager.updateText("action", "Thinking");
            this.isBedInUse = false; // Marcar la cama como no en uso
            needsManager.updateEffect("energy", standardEnergyDecrease);
            needsManager.updateEffect("comfort", standardComfortDecrease);
        }
    }
}

 