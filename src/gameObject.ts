export class GameObject {
    constructor(public id: string, public name: string, public price: number, public initialPrice: number, public minPrice: number, public objectIndex: number,) {}
    // Método para obtener la acción asociada con el objeto
    // Este método se puede sobrescribir en las subclases si es necesario
    actionText(): string {
        return `Using: ${this.name}`;
    }
}












