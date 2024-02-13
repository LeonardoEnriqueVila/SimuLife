import { playerInventory, Inventory, getItem } from "./inventory";
import { playerMoney, Money } from "./money";
import { Bed } from "./bed";
import { Chair } from "./chair";
import { Television } from "./television";
import { GameObject } from "./gameObject";
import { landPlotUI } from "./LandPlotUI";

export class Market {
    objectCounter: number = 0; // genera la identificacion unica de cada objeto a medida que se crean, es un indice muy importante
    // ya que se usa este valor asignado para el id del div y luego ese valor se lo utiliza para localizar al objeto
    private buyListener: CustomEventHandler;
    //private addLogicListener: CustomEventHandler;
    private selectItemListener: CustomEventHandler; // en vez de ocuparse de añadir la logica, se ocuparia de seleccionar el item para
    // posicionarlo en el mapa. SEGUIR ACA
    constructor() {
        this.buyListener = (itemId: any) => { // recibe un identificador de item que se desea comprar (ej: sleepingBag)
            console.log("buy listener recived " + itemId);
            switchDataForBuy(itemId); // genera una instancia en base al identificador que se recibe
        };

        this.selectItemListener = (data: any) => { // recibe el objectIndex del item que se desea colocar en el mapa
            console.log("Selected " + data);
            inventorySelection(data); 
        };

        /*this.addLogicListener = (data: any) => { // recibe el objectIndex del objeto (obtenido por el id del div)
            console.log("logic listener recived " + data);
            switchDataForLogic(data); // obtener objeto por su objectIndex y añadir funcionalidad segun que clase sea
        };*/

        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        EventManager.subscribe('buy', this.buyListener);
        //EventManager.subscribe('logic', this.addLogicListener);
        EventManager.subscribe('selectInventoryItem', this.selectItemListener);
    }
}

/*function switchDataForLogic(objectIndex: string) {
    let item: null | [GameObject, number];
    item = getItem(objectIndex); // obtiene el item deseado mediante su objectIndex
    console.log("switch data recived: " + item[0].name);
    if (item[0] instanceof Bed) {
        if (item[0].isBedInUse) {
            item[0].stopResting();
        } else {
            item[0].restInBed();
        }
    }      
    else if (item[0] instanceof Chair) {
        if (item[0].isChairInUse) {
            item[0].stopSitting();
        } else {
            item[0].sit();
        }
    }
    else if (item[0] instanceof Television) {
        if (item[0].isTelevisionInUse) {
            item[0].stopWatching();
        } else {
            item[0].watchTelevision();
        }
    }
    item = null;
}*/

function inventorySelection(objectIndex: string) {
    let item: null | [GameObject, number];
    item = getItem(objectIndex); // obtener el item seleccionado
    landPlotUI.inventoryItemSelected = true; // indica que hay un item seleccionado en el inventario mediante LandPlot
    playerInventory.itemSelected = item[0]; // indica cual es el item seleccionado en el inventario mediante inventario
    landPlotUI.selectedItemName = item[0].name; // indica el nombre del item para que LandPlotUI lo sepa
    item = null;
}

function switchDataForBuy(objectType: string) { 
    console.log("switchDataForBuy: " + objectType);
    switch (objectType) {
        case "sleepingBag":
            if (playerMoney.canAfford(25)) {
                let sleepingBag = new Bed("bed", "Sleeping Bag " + market.objectCounter, 25, 25, 5, market.objectCounter, -1, -1, 0.1, 0.1, 0.02, -0.1, -0.1, -0.18); 
                market.objectCounter++;
                buyItem(sleepingBag, playerInventory, playerMoney);
            }
            else {
                UIManager.showAlert('Not enough money!');
            }
            break;
        case "plasticStool":
            if (playerMoney.canAfford(15)) {
                let plasticStool = new Chair("chair", "Plastic Stool " + market.objectCounter, 15, 15, 3, market.objectCounter, -1, -1, -0.1, -0.1, -0.18);
                market.objectCounter++;
                buyItem(plasticStool, playerInventory, playerMoney); 
            }
            else {
                UIManager.showAlert('Not enough money!');
            }
            break;
        case "basicView":
            if (playerMoney.canAfford(55)) {
                let basicView = new Television("tv", "BasicView: Black&White TV " + market.objectCounter, 55, 55, 11, market.objectCounter, -1, -1, 0.1, 0.1, 0.1, 0.02);
                market.objectCounter++;
                buyItem(basicView, playerInventory, playerMoney); 
            }
            else {
                UIManager.showAlert('Not enough money!');
            }
            break;
    }
}

function buyItem(item: GameObject, playerInventory: Inventory, playerMoney: Money) {
    // Lógica para comprar un objeto y agregarlo al inventario del comprador
    buyObject(item, playerMoney) 
    playerInventory.addItem(item); // añade el item al inventario 
    let objectInfo = [item.name, item.objectIndex.toString()];
    console.log("buy item ok: " + objectInfo[0] + objectInfo[1]);
    EventManager.emit("createDiv", objectInfo);
}

function buyObject(object: GameObject, playerMoney: Money) {
    playerMoney.subtractMoney(object.price); // restar dinero
    UIManager.updateText("money", playerMoney.amount.toFixed(2));
    UIManager.showAlert('Purchased: ' + object.name);
}

const market = new Market();