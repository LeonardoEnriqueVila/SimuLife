// Definición de un tipo para el manejador de eventos personalizado
type CustomEventHandler = (data: any) => void;

class EventManager {
    private static subscribers: Map<string, Set<CustomEventHandler>> = new Map();
    static tvUsed: string = "";

    // Método para suscribirse a un evento
    static subscribe(event: string, listener: CustomEventHandler) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Set());
        }
        this.subscribers.get(event)!.add(listener); // añadir listener al Map "subscribers"
    }

    // Método para emitir un evento - Esto se llama al iniciar el uso de un objeto
    static emit(event: string, data: any) {
        if (!this.subscribers.has(event)) return;
        for (const listener of this.subscribers.get(event)!) { // iterar por los subscribers y les pasa "data" como argumento a los listeners
            listener(data); // el listener podra comparar esa data para hacer verificaciones
        }
    }

    // Método para cancelar la suscripción
    static unsubscribe(event: string, listener: CustomEventHandler) {
        if (!this.subscribers.has(event)) return;
        this.subscribers.get(event)!.delete(listener); // eliminar listener del Map "subscribers"
    }
}


