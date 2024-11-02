import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Third } from '../../models/Third';
import { ThirdServiceService } from '../../services/third-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import Swal from 'sweetalert2';
import { ThirdEditModalComponent } from '../third-edit-modal/third-edit-modal.component';
import { ThirdDetailsModalComponent } from '../third-details-modal/third-details-modal.component';
import { ThirdConfigModalComponent } from '../third-config-modal/third-config-modal.component';
@Component({
  selector: 'app-thirds-list',
  templateUrl: './thirds-list.component.html',
  styleUrls: ['./thirds-list.component.css']
})
export class ThirdsListComponent{
  @ViewChild('thirdEditModal') thirdEditModal !: ThirdEditModalComponent;

  form: FormGroup;

  selectedThirdId: string | null = null;
  timer: any;

  data: Third[] = [];
  //columnas para las tablas de vista resumida y completa
  displayedColumnsBrief: any[] = ['personType', 'thirdTypes', 'socialReason', 'typeId', 'idNumber', 'email', 'state', 'actions'];
  displayedColumnsComplete: any[] = ['personType', 'thirdTypes', 'socialReason', 'typeId', 'idNumber', 'verificationNumber', 'email', 'country', 'province', 'city', 'address', 'phoneNumber', 'state', 'actions'];
  dataSource = new MatTableDataSource<Third>(this.data);

  showDetailTable = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  showModal = false;
  //Crear tercero apartir del PDF del RUT
  createPdfRUT: boolean = false;

  constructor(private thirdService: ThirdServiceService,private fb: FormBuilder,private router: Router, private dialog: MatDialog) {
    this.form = this.fb.group(this.validationsAll());
  }

  validationsAll(){
    return {
      stringSearch: ['']
    };
  }

  ngOnInit() {

    this.entData = this.localStorageMethods.loadEnterpriseData();

    if(this.entData){

      this.thirdService.getThirdParties(this.entData,0).subscribe({
        next: (response: Third[])=>{
          this.data = response;
          console.log(response);
          this.dataSource = new MatTableDataSource<Third>(this.data);
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          console.log(error)
          Swal.fire({
            title: 'Error!',
            text: 'No se han encontrado terceros para esta empresa!',
            icon: 'error',
          });
        }
      });
    }
  }

  showDetailTableFunction():void{
    this.showDetailTable = !this.showDetailTable;
  }

  openModalDetails(thId:number):void{
    this.openPopUp(thId,'Detalles del tercero',ThirdDetailsModalComponent)
  }

  openModalEdit(thId:number):void{
    this.openPopUp(thId, 'Editar información del Tercero', ThirdEditModalComponent)
  }
  //Abrir Crear tercero apartir del PDF del RUT
  openCreatePDFRunt():void{
    this.createPdfRUT = true;
  }
 //cerrar Crear tercero apartir del PDF del RUT
  closeCreatePDFRunt():void{
    this.createPdfRUT = false;
  }

  redirectToEdit(ThirdId: string): void {
    console.log("El id del tercero es", ThirdId)
    this.router.navigate(['/general/operations/third-parties/edit', ThirdId]);  
  }


  openConfigTPModal():void{
    this.openPopUp(0, 'Configuración de Terceros',ThirdConfigModalComponent)
  }

  changeThirdPartieState(thId:number):void{
    this.thirdService.changeThirdPartieState(thId).subscribe({
      next: (response: Boolean)=>{

        if(response){
          let updatedThird = this.data.find(t => t.thId === thId);
          if (updatedThird) {
            updatedThird.state = !updatedThird.state;
          }
          Swal.fire({
            title: 'Exito',
            text: 'Se cambió exitosamente el estado del tercero',
            icon: 'success',
          });
        }
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo cambiar el estado del tercero',
          icon: 'error',
        });
      }
    });
  }
  deleteThirdPartie(thId:number):void{
    
  }

  openPopUp(thId:any, title: any, component: any){
    var _popUp = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data:{
        title: title,
        thId: thId
      }
    });
    _popUp.afterClosed().subscribe()
  }

  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  //metodo para filtrar los datos
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Obtener las columnas por las que se desea filtrar
    const columns = ['socialReason', 'names', 'idNumber',];

    // Crear un nuevo filtro que solo aplique a las columnas seleccionadas
    this.dataSource.filterPredicate = (data:any, filter) => {
      return columns.some(column =>
        data[column].toString().toLowerCase().includes(filter));
      };
    // Aplicar el nuevo filtro
    this.dataSource.filter = filterValue;
  }
}

