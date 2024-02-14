// SEGUIR ACA: Llego la hora de implementar la alimentacion, es decir: fridge. 
// voy a tener que almacenar alimentos adentro de la heladera. La misma tiene que ofrecer opciones de alimentos guardados
// la idea es que un alimento sano no aumente la diversion, pero aumente la energía y el comfort muy levemente
// mientras que un alimento chatarra aumente bastante la diversion, pero reduce la energía significativamente
// ademas, la accion de comer, la tendra que llevar a cabo en una silla ligada a una mesa
// por ende la clase Table entra en juego: comer usando una mesa, aumentaria el comfort.
// comer usando solamente una silla no sería muy confortable
// y comer parado generaria una reduccion de confort importante
// voy a tener que ver como ligar todas estas acciones al momento de comer y para ello con lapicera y papel,
// diagramar como puede ser el esquema. Pensar que probablemente la accion de comer va a depender de un evento o bien,
// de una clase que centralice todo el asunto, ya que otras necesidades se veran involucradas y habria 3 variantes: 
// comer parado, comer sentado, comer sentado sin mesa y sentado usando una mesa. 
// ademas, la accion de comer, llevaría cierto tiempo en realizarse. Es decir, un item de comida es un consumible, que al consumirlo
// desaparece. Luego se tendria que comprar nuevos items de comida.

// Tema comida
// el Fridge ofrece 6 opciones
// 
