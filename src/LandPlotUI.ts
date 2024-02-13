
/*// creacion del lote
for (let i = 0; i < 100; i++) { // numero de casillas: filas * columnas
    const cell = document.createElement('div');
    cell.addEventListener('click', () => {
        console.log(`Casilla ${i} clickeada`); // Aquí puedes añadir la lógica de interacción
    });
    landPlotElement!.appendChild(cell);
}*/

// funcion aislada de creación de LandPlot
// crea los divs de tile y les asigna un id de coordenada, pero no les asigna un evento de click. El mismo lo obtienen segun lo que suceda
function makeLandPlot() {
    const landPlotElement = document.getElementById('landPlot');
    const rows = 10; // Asumiendo un mapa de 10x10 para simplificar
    const columns = 10;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const cell = document.createElement('div');
            cell.classList.add('tile'); // Clase CSS para estilizar las casillas 
            let coordinates = [x,y];
            EventManager.emit("setTile", coordinates); // enviar coordenadas a Tile
            //cell.id = `tile-${x}-${y}`; // Asignar ID basado en coordenadas -> podria no ser necesitado en un principio
            // al colocar un objeto en la tile, el id pasaria a ser el objectIndex del objeto
            // luego si se vende el objeto, se puede recuperar el nombre original de la coordenada de la tile
            // usando los valores x e y del objeto antes de venderse
            cell.setAttribute('data-has-object', 'false'); // Asignar un atributo data-has-object a un div
            // usar "data-" parece una mejor forma de saber coordenadas del tile en el ambito de la UI
            cell.setAttribute('data-x', x.toString());
            cell.setAttribute('data-y', y.toString());
            cell.setAttribute('data-is-map', 'true');

            cell.addEventListener('click', () => { 
                console.log(`clicked ${x}, ${y} tile`);
                if (cell.dataset.hasObject === 'true' && landPlotUI.inventoryItemSelected === false) { 
                    // si el tile tiene un objeto colocado y no hay un item del inventario seleccionado
                    let coordinates = [cell.dataset.x, cell.dataset.y];
                    EventManager.emit("logic", coordinates); // enviar al inventario coordenadas de la tile donde esta el item
                    // logica de uso de objeto (de manera temporal, luego tendre que ver el tema del sim yendo hacia la direccion)
                } 
                else if (cell.dataset.hasObject === 'false' && landPlotUI.inventoryItemSelected === true) {
                    // si el tile no tiene un objeto y se tiene un objeto del inventario seleccionado
                    // logica de colocar el item
                    if (confirmPlaceObject(landPlotUI.selectedItemName)) {
                        cell.dataset.hasObject = 'true' //indicar que este tile tiene un objeto en UI
                        EventManager.emit("removeDiv", landPlotUI.selectedItemName); // eliminar div de inventario (cuyo id es el nombre del item)
                        cell.id = landPlotUI.selectedItemName; // asignar nombre del item como id del tile correspondiente
                        let coordinates = [cell.dataset.x, cell.dataset.y]; // crear array con coordenadas donde se quiere colocar item
                        EventManager.emit("objectPlacedInTile", coordinates); // enviar coordenadas a inventory
                        cell.textContent = landPlotUI.selectedItemName; // de forma provisoria, por motivos representativos
                        UIManager.addContextMenu(cell); // añadir contextMenu a div del mapa
                    }
                } 
                else if (cell.dataset.hasObject === 'true' && landPlotUI.inventoryItemSelected === true) {
                    // si el tile tiene un objeto y se tiene un item seleccionad -> no se puede colocar ahi
                    UIManager.showAlert("This tile is already being used!");
                } else {
                    // de momento si no se cumple nada de lo otro, es decir, se hace click "porque si"
                    // no sucede nada -> aunque en un futuro podria implicar que el sim se mueva hacia esa direccion
                    console.log("NO ITEM HERE");
                }
            });
            landPlotElement!.appendChild(cell);
            //landPlotUI.addDivTile(cell);
        }
    }       
}



makeLandPlot();

class LandPlotUI {
    inventoryItemSelected: boolean = false;
    selectedItemName: string = "";
    /*divTiles: HTMLDivElement[];

    constructor() {
        this.divTiles = [];
    }

    // Método para añadir un div a divTiles
    addDivTile(div: HTMLDivElement) {
        this.divTiles.push(div);
    }*/
}

export const landPlotUI = new LandPlotUI();

function confirmPlaceObject(itemName: string) {
    return confirm(`Are you sure you want to place ${itemName} here?`);
}