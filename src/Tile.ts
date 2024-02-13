import { GameObject } from "./gameObject";

export class Tile {
    
    hasObject: boolean = false;
    itemPlacedHere: GameObject | null = null;

    constructor(public x: number, public y: number) {}
}

class TileConstructor {
    private setTileListener: CustomEventHandler;
    tiles: Tile[] = [];
    constructor() {
        console.log("should create tile in tile.ts");
        this.setTileListener = (coordinates: any) => { // obtiene coordenadas de LandPlotUI
            const tile = new Tile(coordinates[0], coordinates[1]); // crear tile
            this.tiles.push(tile); // añadir tile en array de tiles
        };
        this.subscribeToEvents();

    }

    private subscribeToEvents() {
        EventManager.subscribe("setTile", this.setTileListener); // evento que recibe las coordenadas para settear una nueva Tile
    }
}

export const tileConnstructor = new TileConstructor();

