let currentContextMenu: HTMLElement | null = null; // permite saber el menu contextual (click derecho) actual en alguna funcion, 
//comprobando su existencia

class UIManager {
    private static instance: UIManager; // permite tener listeners
    private createDivListener: CustomEventHandler;
    private eliminateDivListener: CustomEventHandler;

    constructor() {
        this.createDivListener = (data: any) => { // recive nombre del objeto y su indice
            console.log("recive array in ui: " + data[0] + data[1]);
            addDivToInterface(data[0], data[1]); 
        };

        this.eliminateDivListener = (data: any) => {
            console.log("div id to remove: " + data);
            let div = document.getElementById(data);
            if (div!.dataset.isMap !== 'true') { // si es un div del inventario, se elimina (puede ser porque se coloco en mapa o se vendio)
                div!.remove();
            }
            else if (div!.dataset.isMap === 'true') { // en este caso, es porque se esta vendiendo un item en el mapa
                div!.dataset.hasObject = 'false'; // esto permite saber a la UI que este div no tiene mas un item
                div!.textContent = ""; // de manera provisioria volver a settear el texto en vacio para representar visualmente
                // que no hay item ahi
            }
        };

        this.subscribeToEvents();
    }

    public static getInstance(): UIManager { // esto permite que se puedan usar los this.listener
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
            UIManager.instance.subscribeToEvents();
        }
        return UIManager.instance;
    }

    private subscribeToEvents() {
        EventManager.subscribe('createDiv', this.createDivListener);
        EventManager.subscribe('removeDiv', this.eliminateDivListener);
    }

    static updateText(divId: string, text: string) {
        document.getElementById(divId)!.textContent = text;
    }

    static updateTextInnerHTML(divId: string, textWithHtmlContent: string) {
        const element = document.getElementById(divId);
        element!.innerHTML = textWithHtmlContent; 
    }
    

    static showAlert(text: string) {
        alert(text);
    }

    static addContextMenu(divInMap: HTMLDivElement) {
        addContextMenuEventToInventoryItem(divInMap);
    }
    
}

const uiManager = UIManager.getInstance();

function confirmPurchase(itemName: string) {
    return confirm(`Are you sure you want to buy ${itemName}?`);
}

function addEventToDivMarketItems() { // añadir evento al div predeterminado de items del market
    document.getElementById('sleepingBag')!.addEventListener('click', () => {
        if (confirmPurchase("Sleeping Bag")) {
            EventManager.emit("buy", "sleepingBag");
        }
    });
    document.getElementById('plasticStool')!.addEventListener('click', () => {
        if (confirmPurchase("Plastic Stool")) {
            EventManager.emit("buy", "plasticStool");
        }
    });
    document.getElementById('basicView')!.addEventListener('click', () => {
        if (confirmPurchase("BasicView: Black&White TV")) {
            EventManager.emit("buy", "basicView");
        }
    });
}

// crea un div en el inventariom (interfaz)
function addDivToInterface(objectName: string, objectIndex: string) { // añade div de manera dinamica cuando se compra un objeto
    console.log("in divToInterface: " + objectName + objectIndex);
    // Intentar obtener el elemento 'div' que contendrá los objetos.
    const objectsDiv = document.getElementById('inventory');
    // Crear un nuevo elemento 'div' para el objeto.
    const newObjectDiv = document.createElement('div');
    // Asignar un identificador al 'div' basado en propiedad id del objeto
    //newObjectDiv.id = object.objectIndex + object.name; -> id
    newObjectDiv.id = objectName;
    // Asigna la clase a este nuevo elemento -> esto permite manejarlo desde css
    newObjectDiv.classList.add('inventory-item'); 
    // Establecer el contenido de texto del 'div' como el nombre del objeto.
    newObjectDiv.textContent = objectName;
    // Añadir el nuevo 'div' como un hijo de 'objectsDiv'
    objectsDiv!.appendChild(newObjectDiv);
    // devolver el div
    newObjectDiv.addEventListener('click', () => { 
        //EventManager.emit("logic", objectIndex);
        EventManager.emit("selectInventoryItem", objectIndex); // manda el indice del objeto al market para saber de que objeto se trata
    });
    addContextMenuEventToInventoryItem(newObjectDiv); // manejar el tema del contextMenu
}

function marketVisibility() {
    document.getElementById('openMarket')!.addEventListener('click', () => {
        // Muestra u oculta las categorías del mercado
        toggleVisibility('market');
        toggleVisibility('categories');
        // Asegura que todas las subcategorías estén ocultas cuando se abra el mercado
        resetCategories();
    });

    // Event listeners para las categorías individuales
    document.getElementById('bedsCategory')!.addEventListener('click', () => {
        toggleVisibility('beds');
    });
    document.getElementById('chairsCategory')!.addEventListener('click', () => {
        toggleVisibility('chairs');
    });
    document.getElementById('televisionsCategory')!.addEventListener('click', () => {
        toggleVisibility('televisions');
    });
}

// Función para ocultar todas las subcategorías
function resetCategories() {
    const categoriesToReset = ['beds', 'chairs', 'televisions']; // Agregar mas cuando cree nuevas
    categoriesToReset.forEach(categoryId => { // por cada categoria de "categoriesToReset"
        const categoryElement = document.getElementById(categoryId);
        if (categoryElement) {
            categoryElement.style.display = 'none'; // las muestra en "none", es decir las oculta
        }
    });
}

// Función para alternar la visibilidad
function toggleVisibility(elementId: string) {
    const element = document.getElementById(elementId);
    
    if (element) {
        console.log(element!.style.display);
        if (element.style.display === 'none') {
            element.style.display = 'block'; // Mostrar
        } else {
            element.style.display = 'none'; // Ocultar y resetear las categorías
            resetCategories(); // Esto asegurará que las subcategorías se oculten cuando se cierre el mercado
        }
    }
}


// añadir evento de click derecho en el item del inventario
function addContextMenuEventToInventoryItem(newObjectDiv: HTMLDivElement) {
    newObjectDiv.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Previene el menú contextual predeterminado del navegador
        showCustomContextMenu(event.pageX, event.pageY, newObjectDiv); // las coordenadas x e y son donde se hizo el click derecho
    });
}

function addContextMenuEventToMapItem(divInMap: HTMLDivElement) {
    divInMap.addEventListener('contextmenu', (event) => {
        if (divInMap.dataset.hasObject === 'true') { // asegurarse de que el menu se muestra solo si la casilla tiene un objeto
            event.preventDefault(); // Previene el menú contextual predeterminado del navegador
            showCustomContextMenu(event.pageX, event.pageY, divInMap); // las coordenadas x e y son donde se hizo el click derecho
        }
    });
}

function showCustomContextMenu(x: number, y: number, newObjectDiv: HTMLDivElement) {
    // Eliminar el menú contextual actual si existe
    console.log("x y on showCustomContextMenu: " + x + y);
    if (currentContextMenu) {
        currentContextMenu.remove();
    }
    // Crear el menú contextual
    let contextMenu = createContextMenu(x, y);
    // Opción de vender
    const sellOption = document.createElement('div');
    sellOption.textContent = 'Sell';
    sellOption.addEventListener('click', () => { // evento de click para "sell"
        if (confirmSell(newObjectDiv.textContent!)) {
            console.log("this should be sent to sell: " + newObjectDiv.id);
            EventManager.emit("sell", newObjectDiv.id); // envio al inventario el nombre del objeto
        }
    });
    let infoOption = document.createElement('div');
    infoOption.textContent = 'Info';
    infoOption.addEventListener('click', () => { // evento de click para "info"
        infoMenu(x, y, newObjectDiv); // crear menu contextual de informacion del item
    });
    // Agregar la opción de vender al menú
    contextMenu.appendChild(sellOption);
    contextMenu.appendChild(infoOption);
    // Agregar el menú al documento y mostrarlo
    document.body.appendChild(contextMenu);
    // Actualizar la referencia al menú actual (variable global)
    currentContextMenu = contextMenu;
    // Asegurarse de eliminar el menú si se hace clic en otro lugar
    document.addEventListener('click', () => {
        contextMenu.remove();
    }, { once: true });
}

// devuelve un menu contextual (click derecho)
function createContextMenu(x: number, y: number): HTMLDivElement{
    const contextMenu = document.createElement('div');
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.backgroundColor = 'white';
    contextMenu.style.border = '1px solid black';
    contextMenu.style.padding = '10px';
    return contextMenu;
}

function confirmSell(itemName: string) {
    return confirm(`Are you sure you want to sell ${itemName}?`);
}

function infoMenu(x: number, y: number, newObjectDiv: HTMLDivElement) {
    // Asegurarse de eliminar el menú contextual actual
    if (currentContextMenu) {
        currentContextMenu.remove();
        currentContextMenu = null; // Asegurarse de resetear la referencia
    }
    // Retrasar la creación del nuevo menú para evitar conflictos
    setTimeout(() => {
        const itemInfoMenu = createContextMenu(x, y);
        const itemInfo = document.createElement('div');
        itemInfo.id = "itemInfo"; // asigna un id al div de info, para poder pasarle argumento de texto desde Usage
        itemInfoMenu.appendChild(itemInfo);
        document.body.appendChild(itemInfoMenu);
        currentContextMenu = itemInfoMenu;
        let item = [newObjectDiv.id, "itemInfo"]; // el id del div nos permite localizar al objeto, "itemInfo" es el id del div de info
        // el cual es necesario para que Usage pase la información de nuevo al div correspondiente usando updateText de UIManager
        EventManager.emit("info", item); // esto se envia a usage, donde se obtiene la informacion del item
        // Asegurarse de que el menú se elimina en el siguiente clic
        document.addEventListener('click', () => itemInfoMenu.remove(), { once: true });
    }, 10); // Un retraso mínimo para permitir que el DOM se actualice
}

marketVisibility();
addEventToDivMarketItems();











