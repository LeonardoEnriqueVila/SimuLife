import { needsManager } from './needsManager';
import { usage } from './usage';
import { GameObject } from './gameObject';
import { fun, standardFunDecrease } from './need';

// la idea con el "fun" que proporciona la tv, es una base, a la cual luego se le sumará el servicio que se le añada
// las teles baratas no pueden mejorar su servicio
// en cambio las teles normales y caras, se podran potenciar con un servicio mejor (imaginar como que se paga netflix, etc)

export class Television extends GameObject {
    private listener: CustomEventHandler; // Guardar la referencia al listener
    isTelevisionInUse: boolean = false;
    isTelevisionWorking: boolean = true;
    constructor(id: string, name: string, price: number, initialPrice: number, minPrice: number, objectIndex: number,
        positionX: number, positionY: number, 
        public fun: number, public initialPower: number, public power: number, public minPower: number) {
        super(id, name, price, initialPrice, minPrice, objectIndex, positionX, positionY); // Llamar al constructor de la clase base -> Inicializa la parte de 'GameObject' de esta instancia
        this.listener = (data: any) => {
            console.log(`Evento recibido por ${this.name}`);
            const objectInUse = data as GameObject;
            if (data.id === "chair" && this.isTelevisionInUse) { // soy una tele en uso y me llega una silla
                UIManager.updateText("action", "Watching " +  this.name + " on " + data.name);
            }
            else if (this !== objectInUse && this.isTelevisionInUse) { // soy una tele en uso y me llega un item que no es silla
                this.stopWatching();
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
        return `Watching: ${this.name}`;
    }

    watchTelevision() {
        if (this.isTelevisionWorking === true) {
            EventManager.tvUsed = this.name; // este es el argumento que se le pasa a las sillas nuevas cuando se las compran, entonces pueden saber que esta es la tele en uso
            this.isTelevisionInUse = true; // Marcar la cama como en uso
            EventManager.emit('objectInUse', this);
            UIManager.updateText("action", this.actionText()); // actualizar texto de accion
            EventManager.emit('tvOn', this);
            needsManager.updateEffect("fun", this.televisionInterval.bind(this))
        } else {
            alert(this.name + " Is broken!");
        }      
    }
    televisionInterval() {
        console.log("using: " + this.name);
        fun.value += this.fun;
        if (usage.reduceProperty(this) === false) { // desgastar la tele, y si su funcion de desgaste devuelve falso -> se rompio tv
            this.stopWatching(); // efectuar detencion de uso de objeto
            this.isTelevisionWorking = false; // evitar que se la use
            this.price = 0; // el item pierde valor al romperse (IDEA: al repararse, recuperará su precio minimo)
            // indicar broken en texto del div (el nombre del item no se modifica)
            UIManager.updateText(this.objectIndex + this.name, this.name + " (BROKEN)");
            alert(this.name + " Is broken!");
        }  
        if (fun.value > 100) {
            fun.value = 100; // Asegurar que no exceda los 100
        }
        UIManager.updateText("fun", fun.value.toFixed(1));
    }

    stopWatching() {
        if (this.isTelevisionInUse) { // detener el uso si realmente esta siendo usado
            EventManager.tvUsed = ""; // este es el argumento que se le pasa a las sillas nuevas cuando se las compran, entonces pueden saber que no hay una tele en uso 
            UIManager.updateText("action", "Thinking");
            EventManager.emit('tvOff', this);
            this.isTelevisionInUse = false; // Marcar la silla como no en uso
            needsManager.updateEffect("fun", standardFunDecrease);
        }
    }
}

