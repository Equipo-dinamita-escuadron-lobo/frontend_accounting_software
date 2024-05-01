export interface Category {
    id: number; 
    name: string; 
    description: string; 
    //cuentas
    inventoryId:number; //Todo: Agregar el atributo inventory de tipo inventario
    costId:number //Todo: Agregar el atributo cost de tipo costo
    saleId:number //Todo: Agregar el atributo Sale de tipo venta
    returnId:number //Todo: Agregar el atributo return de tipo devolución
}
  