

export class LocalStorageMethods{


  public saveEnterpriseData(id:string):void{
    const data = {entId: id}
    localStorage.setItem('entData', JSON.stringify(data));
  }

  public loadEnterpriseData():any{
    const enterpriseData = localStorage.getItem('entData');
    return enterpriseData ? JSON.parse(enterpriseData) : null;
  }

  public clearLocalStoage():void{
    localStorage.clear();
  }

}
