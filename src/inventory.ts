import { GameObject } from './gameObject';
import { Bed } from './bed';
import { Chair } from './chair';
import { Television } from './television';
import { Money, playerMoney } from './money';
import { tileConnstructor, Tile } from './Tile';
import { landPlotUI } from './LandPlotUI';

export class Inventory {
    private sellListener: CustomEventHandler;
    private placeItemListener: CustomEventHandler;
    private addLogicListener: CustomEventHandler;

    itemSelected: GameObject | null = null;

    public items: GameObject[]; // Lista de objetos en el inventario
    constructor() {
        this.items = [];
        this.sellListener = (data: any) => { // recibe el nombre del item
            console.log("i recive for selling: " + data);
            let lastCharacter: string = data[data.length - 1]; // obtengo el objectIndex del objeto extrayendo el ultimo char
            let item: [GameObject, number] | null;
            console.log("last char, so the index: " + lastCharacter)
            item = getItem(lastCharacter); // getItem se encarga de pasar a number la data, devuelve el item y su indice
            if (item[0].positionX !== -1) {
                let tile = obtainTile(item[0].positionX.toString(), item[0].positionY.toString(), tileConnstructor.tiles);
                tile.itemPlacedHere = null; // desligar item del tile
            }
            clickOnSell(playerInventory, playerMoney, item[0], item[1]); // funciones de venta de item
            item = null; // me aseguro de eliminar referencia de la tupla -> deberia ser la ultima referencia
        };

        this.placeItemListener = (coordinates: any) => { // llegan las coordenadas desde LandPlotUI
            let tile = obtainTile(coordinates[0], coordinates[1], tileConnstructor.tiles); // obtener tile segun coordenadas
            placeItem(this.itemSelected, tile); // conecta el item con el tile correspondiente
            this.itemSelected = null; // indica que no hay un item seleccionado del inventario para la funcionalidad
            landPlotUI.inventoryItemSelected = false; // indica para la UI que no hay un item seleccionado
        };

        this.addLogicListener = (coordinates: any) => { // recibe coordenadas de objeto que se desea usar
            console.log("logic listener recived " + coordinates);
            let tile = obtainTile(coordinates[0], coordinates[1], tileConnstructor.tiles); // obtiene tile con coordenadas
            let item = tile.itemPlacedHere; // obtiene item posicionado en tile obtenida gracias a coordenadas
            switchDataForLogic(item); // busca logica del item obtenido
        };

        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        EventManager.subscribe('sell', this.sellListener);
        EventManager.subscribe('objectPlacedInTile', this.placeItemListener);
        EventManager.subscribe('logic', this.addLogicListener);
    }

    // Método para añadir un objeto al inventario
    addItem(item: GameObject): void {
        this.items.push(item);
    }
}

function switchDataForLogic(item: GameObject | null) {
    console.log("switch data recived: " + item!.name);
    if (item instanceof Bed) {
        if (item.isBedInUse) {
            item.stopResting();
        } else {
            item.restInBed();
        }
    }      
    else if (item instanceof Chair) {
        if (item.isChairInUse) {
            item.stopSitting();
        } else {
            item.sit();
        }
    }
    else if (item instanceof Television) {
        if (item.isTelevisionInUse) {
            item.stopWatching();
        } else {
            item.watchTelevision();
        }
    }
}

function obtainTile(x: string, y: string, tiles: Tile[]): Tile { // obtener Tile segun coordenadas
    let positionX = Number(x);
    let positionY = Number(y);
    for (var i = 0; tiles.length; i++) {
        if (tiles[i].x === positionX && tiles[i].y === positionY) {
            break;
        }
    }
    console.log("THE TILE IS: " + tiles[i]);
    return tiles[i];
}

function placeItem(item: GameObject | null, tile: Tile) { // conecta el item con el tile correspondiente
    tile.hasObject = true;
    tile.itemPlacedHere = item; // esto permite interactuar con el item, posicionandolo en la tile correspondiente
    // agregar coordenadas al item, esto permitirá encontrar la tile en donde se encuentra el mismo para poder eliminarlo de ahi
    item!.positionX = tile.x;
    item!.positionY = tile.y;
}

function clickOnSell(playerInventory: Inventory, playerMoney: Money, item: GameObject, itemIndex: number) {
    console.log("clickOnSell recives: " + item);
    UIManager.showAlert('Sold: ' + item.name);
    EventManager.emit("removeDiv", item.name); // eliminar div
    playerMoney.addMoney(item.price); // el usage gestiona la reduccion de precio
    UIManager.updateText("money", playerMoney.amount.toFixed(2));
    stopInterval(item); // detener el uso del objeto en caso de haberlo y desuscribirlo de los eventos
    playerInventory.items.splice(itemIndex, 1); // remover item del array del inventario
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
    console.log("getItem will return: " + playerInventory.items[i]);
    return [playerInventory.items[i], i]; // devolver el item
}

export const playerInventory = new Inventory();



