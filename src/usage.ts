import { GameObject } from './gameObject';
import { Bed } from './bed';
import { Chair } from './chair';
import { Television } from './television';
import { getItem } from './inventory';
// ahora lo que sigue es implementar el uso de un item. 
// se me ocurre que el uso podria ser una clase
export class Usage {
    private infoListener: CustomEventHandler;

    constructor() {
        this.infoListener = (data: any) => { // el objetivo del listener es proveer informacion del item a la interfaz
            let item: null | [GameObject, number];
            console.log("recive array in ui: " + data[0] + data[1]);
            item = getItem(data[0]);
            this.getObjectInfo(item[0], data[1]);
            item = null;
        };

        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        EventManager.subscribe('info', this.infoListener);
    }

    reduceProperty(item: GameObject): boolean | void {
        if (item instanceof Bed) {
            reduceBed(item); 
        }
        else if (item instanceof Chair) {
            reduceChair(item);
        }
        else if (item instanceof Television) {
            return reduceTelevision(item); // si esto devuelve falso, la tv se rompió
        }
    }
    getObjectInfo(item: GameObject, infoDivId: string): void {
        if (item instanceof Bed) {
            getBedInfo(item, infoDivId);
        }
        else if (item instanceof Chair) {
            getChairInfo(item, infoDivId);
        }
        else if (item instanceof Television) {
            getTelevisionInfo(item, infoDivId);
        }
    }
}

function reduceBed(item: Bed) {
    if (item.energyRestoration > item.minEnergyRestoration) {
        console.log("item energy: " + item.energyRestoration);
        item.energyRestoration -= 0.00005; // Reducir el bonus de energía
        const currentBonusPercentage = item.energyRestoration / item.initialEnergyRestoration; // Porcentaje de desgaste

        // Aplicar el mismo porcentaje de desgaste al precio
        item.price = item.initialPrice * currentBonusPercentage;
        if (item.price < item.minPrice) {
            item.price = item.minPrice; // Ajustar al precio mínimo si es necesario
        }

        // Aplicar desgaste al confort
        if (item.initialComfortRestoration >= 0) {
            item.comfortRestoration = item.initialComfortRestoration * currentBonusPercentage;
        } else { // Confort inicial negativo
            item.comfortRestoration = item.initialComfortRestoration * (2 - currentBonusPercentage); // Ajuste para hacerlo más incómodo
        }

        // Asegurarse de que el confort no caiga por debajo del mínimo o no supere el mínimo en caso de ser negativo
        if (item.comfortRestoration < item.minComfortRestoration) {
            item.comfortRestoration = item.minComfortRestoration;
        }

        // Asegurar que la energía no caiga por debajo del mínimo
        if (item.energyRestoration < item.minEnergyRestoration) {
            item.energyRestoration = item.minEnergyRestoration;
        }
    }
}

function reduceChair(item: Chair) {
    if (item.comfortRestoration > item.minComfortRestoration) {
        item.comfortRestoration -= 0.00005; // Reducir el bonus de energía
        const currentBonusPercentage = item.comfortRestoration / item.initialComfortRestoration; // Porcentaje de desgaste
        if (item.initialComfortRestoration < 0) { // si el comfort es negativo, se debe aplicar la formula al precio para negativo
            item.price = item.initialPrice * (2 - currentBonusPercentage);
            if (item.price < item.minPrice) {
                item.price = item.minPrice; // Ajustar al precio mínimo si es necesario
            }
        } else {
            item.price = item.initialPrice * currentBonusPercentage;
            if (item.price < item.minPrice) {
                item.price = item.minPrice; // Ajustar al precio mínimo si es necesario
            }
        }
        // Asegurarse de que el confort no caiga por debajo del mínimo o no supere el mínimo en caso de ser negativo
        if (item.comfortRestoration < item.minComfortRestoration) {
            item.comfortRestoration = item.minComfortRestoration;
        }
    }
}

function reduceTelevision(item: Television): boolean {
    if (item.power > item.minPower) {
        item.power -= 0.00005; // Reducir el "power"
        let currentBonusPercentage = item.power / item.initialPower; // Porcentaje de desgaste

        // Aplicar el mismo porcentaje de desgaste al precio
        item.price = item.initialPrice * currentBonusPercentage;
        if (item.price < item.minPrice) {
            item.price = item.minPrice; // Ajustar al precio mínimo si es necesario
        }

        // Asegurarse de que el power no caiga por debajo del mínimo 
        if (item.power < item.minPower) {
            item.power = item.minPower;
        }
    }
    // averiguar cuanto es el porcentaje de devaluacion del item
    let devaluation = ((item.initialPrice - item.price) * 100) / item.initialPrice;
    return tvMalfunction(devaluation); // si esto devuelve falso, el objeto se rompio
}

function tvMalfunction(devaluation: number): boolean {
    // en base al desgaste del objeto, hay una probabilidad de que se rompa
    // se retorna una expresion, a mayor desgaste, menos chance de que la expresion sea falsa y por ende que se genere la rotura del objeto
    let randomNum = Math.random();  // Genera un número aleatorio entre 0 y 1
    if (devaluation <= 5) {
        return randomNum < 0.9999;  // 0.01% de probabilidad de falla
    } else if (devaluation > 5 && devaluation <= 10) {
        return randomNum < 0.9995;  // 0.05% de probabilidad de falla
    } else if (devaluation > 10 && devaluation <= 20) {
        return randomNum < 0.999;  // 0.1% de probabilidad de falla
    } else if (devaluation > 20 && devaluation <= 30) {
        return randomNum < 0.995;  // 0.5% de probabilidad de falla
    } else if (devaluation > 30 && devaluation <= 40) {
        return randomNum < 0.99;  // 1% de probabilidad de falla
    } else if (devaluation > 40 && devaluation <= 50) {
        return randomNum < 0.985;  // 1.5% de probabilidad de falla
    } else if (devaluation > 50 && devaluation <= 60) {
        return randomNum < 0.98;  // 2% de probabilidad de falla
    } else if (devaluation > 60 && devaluation <= 70) {
        return randomNum < 0.97;  // 3% de probabilidad de falla
    } else if (devaluation > 70 && devaluation <= 80) {
        return randomNum < 0.95;  // 5% de probabilidad de falla
    } else {
        // Asumir que por encima del 80% de devaluación la TV se rompe automáticamente
        return false;
    }
}

// obtener la informacion del item solicitado y pasarla a UIManager
function getBedInfo(item: Bed, infoDivId: string) {
    let priceReduction = item.initialPrice - item.price;
    priceReduction *= 100 / item.initialPrice; // calcular devaluacion
    UIManager.updateText(infoDivId, `Price: $${item.price.toFixed(3)}<br>Energy Bonus: 
    ${item.energyRestoration.toFixed(3)}<br>Comfort Bonus: 
    ${item.comfortRestoration.toFixed(3)}<br>Devaluation: ${priceReduction.toFixed(3)}%`); 
}

function getChairInfo(item: Chair, infoDivId: string) {
    let priceReduction = item.initialPrice - item.price;
    priceReduction *= 100 / item.initialPrice;
    UIManager.updateText(infoDivId, `Price: $${item.price.toFixed(3)}<br>Comfort Bonus: 
    ${item.comfortRestoration.toFixed(3)}<br>Devaluation: ${priceReduction.toFixed(3)}%`);
}

function getTelevisionInfo(item: Television, infoDivId: string) {
    let priceReduction = item.initialPrice - item.price;
    priceReduction *= 100 / item.initialPrice;
    let malfuctionChances = calculateMalfunctionChances(priceReduction);
    UIManager.updateText(infoDivId, `Price: $${item.price.toFixed(3)}<br>Power: 
    ${item.power.toFixed(3)}<br>Malfunction Chances: 
    ${malfuctionChances.toFixed(3)}%<br>Devaluation: ${priceReduction.toFixed(3)}%`)
}

function calculateMalfunctionChances(devaluation: number): number {
    // devuelve la probabilidad de que se rompa el objeto segun la devaluacion que tenga
    if (devaluation <= 5) {
        return 0.01;  
    } else if (devaluation > 5 && devaluation <= 10) {
        return 0.05;  
    } else if (devaluation > 10 && devaluation <= 20) {
        return 0.1; 
    } else if (devaluation > 20 && devaluation <= 30) {
        return 0.5;  
    } else if (devaluation > 30 && devaluation <= 40) {
        return 1;  
    } else if (devaluation > 40 && devaluation <= 50) {
        return 1.5;  
    } else if (devaluation > 50 && devaluation <= 60) {
        return 2;  
    } else if (devaluation > 60 && devaluation <= 70) {
        return 3;  
    } else if (devaluation > 70 && devaluation <= 80) {
        return 5;  
    }
    return 100; // esto nunca sucederia
}

export let usage = new Usage();




