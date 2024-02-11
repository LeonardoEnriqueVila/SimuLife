import { GameObject } from './gameObject';
import { Bed } from './bed';
import { Chair } from './chair';
import { Television } from './television';
import { Money, playerMoney } from './money';

export class Inventory {
    private sellListener: CustomEventHandler;
    //private infoListener: CustomEventHandler;

    public items: GameObject[]; // Lista de objetos en el inventario
    constructor() {
        this.items = [];
        this.sellListener = (data: any) => {
            let item: null | [GameObject, number];
            item = getItem(data);
            clickOnSell(playerInventory, playerMoney, item[0], item[1]);
            item = null;
        };

        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        EventManager.subscribe('sell', this.sellListener);
    }

    // Método para añadir un objeto al inventario
    addItem(item: GameObject): void {
        this.items.push(item);
    }
    // Método para vender un objeto
    sellItem(item: GameObject, playerMoney: Money) {
        playerMoney.addMoney(item.price); // el usage gestiona la reduccion de precio
        UIManager.updateText("money", playerMoney.amount.toFixed(2));
        EventManager.emit("removeDiv", item.objectIndex.toString());
    }
}

function clickOnSell(playerInventory: Inventory, playerMoney: Money, item: GameObject, itemIndex: number) {
    UIManager.showAlert('Sold: ' + item.name);
    stopInterval(item); // detener el uso del objeto (o bien su intervalo) y desuscribir el objeto al evento
    playerInventory.items.splice(itemIndex, 1); // remover item del array 
    playerInventory.sellItem(item, playerMoney); // añadir dinero, actualizarlo en interfaz, remover div de item
}

// detendra invervalos segun el objeto, llamando a la funcion de detencion de su uso
function stopInterval(item: GameObject) {
    if (item instanceof Bed) {
        item.stopResting();
        item.unsubscribeFromEvents();
    }
    else if (item instanceof Chair) {
        item.stopSitting();
        item.unsubscribeFromEvents();
    }
    else if (item instanceof Television) {
        item.stopWatching();
        item.unsubscribeFromEvents();
    }
    // luego se añadiran las clases de objetos restantes
}

export function getItem(objectIndex: string): [GameObject, number] { // obtener el objeto deseado segun su propiedad "objectIndex"
    let indexToNum = Number(objectIndex);
    for (var i = 0; i < playerInventory.items.length; i++) {
        if (playerInventory.items[i].objectIndex === indexToNum) {
            break;
        }
    }
    return [playerInventory.items[i], i]; // devolver el item
}

export const playerInventory = new Inventory();



