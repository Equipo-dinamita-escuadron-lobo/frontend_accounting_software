export interface Category {
    id: number; 
    name: string; 
    description: string; 
    //cuentas
    inventory:string; //Todo: Agregar el atributo inventory de tipo inventario
    cost:string //Todo: Agregar el atributo cost de tipo costo
    sale:string //Todo: Agregar el atributo Sale de tipo venta
    return:string //Todo: Agregar el atributo return de tipo devolución
}
  