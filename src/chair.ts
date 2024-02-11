import { needsManager } from './needsManager';
import { usage } from './usage';
import { GameObject } from './gameObject';
import { comfort, standardComfortDecrease } from './need';

export class Chair extends GameObject {
    private listener: CustomEventHandler; // listener de uso de objetos generico
    private tvOnListener: CustomEventHandler; // listener de relacion Television - Chair
    private tvOffListener: CustomEventHandler; // informe de tele apagada
    isChairInUse: boolean = false;
    linkedTvName: string = EventManager.tvUsed; // al ser comprada debe saber de base si hay una tele en uso
    constructor(id: string, name: string, price: number, initialPrice: number, minPrice: number, objectIndex: number, 
        public initialComfortRestoration: number, public comfortRestoration: number, public minComfortRestoration: number) {
        super(id, name, price, initialPrice, minPrice, objectIndex); 
        this.listener = (data: any) => { // evento generico de objeto en uso
            console.log(`Evento recibido por ${this.name}`);
            const objectInUse = data as GameObject;
            if (data.id === "tv" && this.isChairInUse) { // si se usa una TV y esta silla esta en uso
                // Bloque vacio -> El proximo listener maneja esta situacion
            }
            else if (this !== objectInUse && this.isChairInUse) {
                this.stopSitting();
            }
        };
        this.tvOnListener = (data: any) => { // al usar una tele, todas las sillas deben saber que esa tele esta en uso
            console.log(`Evento tv chair recibido por ${this.name}`);
            if (data.id === "tv" && this.isChairInUse) { // si esta silla esta en uso y prende una tv 
                UIManager.updateText("action", "Watching " +  data.name + " on " + this.name); // mirar tv en esta silla 
            }
            this.linkedTvName = data.name; // todas las Chair se deben enterar de cual es la tele en uso
        };
        this.tvOffListener = (data: any) => { // se apaga una tele
            console.log(`Evento tv chair recibido por ${this.name}`);
            if (data.id === "tv" && this.isChairInUse) { // si esta silla esta en uso y se apaga la tv 
                UIManager.updateText("action", this.actionText()) // indicar que simplemente se está sentado
            }
            this.linkedTvName = ""; // todas las Chair se deben enterar que no se esta viendo la tele
        }; 
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        EventManager.subscribe('objectInUse', this.listener);
        EventManager.subscribe('tvOn', this.tvOnListener);
        EventManager.subscribe('tvOff', this.tvOffListener);
    }

    public unsubscribeFromEvents() {
        console.log(`Desuscribiendo a ${this.name}`);
        EventManager.unsubscribe('objectInUse', this.listener);
        EventManager.unsubscribe('tvOn', this.tvOnListener);
        EventManager.unsubscribe('tvOff', this.tvOffListener);
    }

    override actionText(): string {
        return `Sitting in: ${this.name}`;
    }

    sit() {
        EventManager.emit('objectInUse', this);
        this.isChairInUse = true; // Marcar la cama como en uso
        console.log("tv linked: " + this.linkedTvName);
        if (this.linkedTvName === "") { // si no hay tele on -> "thinking"
            UIManager.updateText("action", this.actionText()) // actualizar texto de accion
        } else { // sino, me tiene que mostrar que solo mira la tele
            UIManager.updateText("action", "Watching: " + this.linkedTvName + " on " + this.name);
        }
        needsManager.updateEffect("comfort", this.chairInterval.bind(this));       
    }
    chairInterval() {
        console.log("using: " + this.name);
        comfort.value += this.comfortRestoration;
        usage.reduceProperty(this); // desgaste del objeto
        if (comfort.value > 100) {
            comfort.value = 100; // Asegurar que no exceda los 100
        }
        else if (comfort.value < 0) { // casos de sillas incomodas (podria haberlas)
            comfort.value = 0;
        }
        UIManager.updateText("comfort", comfort.value.toFixed(1));
    }
    stopSitting() {
        if (this.isChairInUse) { // detener el uso si realmente esta siendo usado
            if (this.linkedTvName === "") { // No hay tele en uso -> texto predeterminado
                UIManager.updateText("action", "Thinking"); // resetear texto de accion
            } else { // hay tele en uso -> solamente mostrar texto de mirar la tele
                UIManager.updateText("action", "Watching: " + this.linkedTvName);
            }
            this.isChairInUse = false; // Marcar la silla como no en uso
            needsManager.updateEffect("comfort", standardComfortDecrease);
        }
    }
}