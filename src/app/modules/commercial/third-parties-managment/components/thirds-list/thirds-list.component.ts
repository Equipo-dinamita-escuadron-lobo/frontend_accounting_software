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
import * as XLSX from 'xlsx';
import { ThirdEditModalComponent } from '../third-edit-modal/third-edit-modal.component';
import { ThirdDetailsModalComponent } from '../third-details-modal/third-details-modal.component';
import { ThirdConfigModalComponent } from '../third-config-modal/third-config-modal.component';
import { buttonColors } from '../../../../../shared/buttonColors';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
import { ThirdType } from '../../models/ThirdType';
import { TypeId } from '../../models/TypeId';
import { eThirdGender } from '../../models/eThirdGender';
import { ePersonType } from '../../models/ePersonType';
import { DatePipe } from '@angular/common';
import { ThirdExportComponent } from '../third-export/third-export.component';
import { ThirdImportComponent } from '../third-import/third-import.component';
@Component({
  selector: 'app-thirds-list',
  templateUrl: './thirds-list.component.html',
  providers: [ThirdExportComponent, DatePipe],
  styleUrls: ['./thirds-list.component.css']
})
export class ThirdsListComponent {
  @ViewChild('thirdEditModal') thirdEditModal !: ThirdEditModalComponent;

  form: FormGroup;

  selectedThirdId: string | null = null;
  timer: any;

  data: Third[] = [];
  listExcel: Third[] = [];
  importedThirds: boolean = false;
  thirdTypes: ThirdType[] = [];
  typeIds: TypeId[] = [];
  //columnas para las tablas de vista resumida y completa
  displayedColumnsBrief: any[] = ['personType', 'thirdTypes', 'socialReason', 'typeId', 'idNumber', 'email', /*'state',*/ 'actions'];
  displayedColumnsComplete: any[] = ['personType', 'thirdTypes', 'socialReason', 'typeId', 'idNumber', 'verificationNumber', 'email', 'country', 'province', 'city', 'address', 'phoneNumber', 'state', 'actions'];
  dataSource = new MatTableDataSource<Third>(this.data);

  showDetailTable = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  showModal = false;
  //Crear tercero apartir del PDF del RUT
  createPdfRUT: boolean = false;

  constructor(private thirdService: ThirdServiceService,private thirdServiceConfiguration: ThirdServiceConfigurationService,  private datePipe: DatePipe, private thirdExportComponent: ThirdExportComponent, private fb: FormBuilder, private router: Router, private dialog: MatDialog) {
    this.form = this.fb.group(this.validationsAll());
  }

  validationsAll() {
    return {
      stringSearch: ['']
    };
  }

  ngOnInit() {

    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.getTypesID();
    this.getThirdTypes();

    if (this.entData) {

      this.thirdService.getThirdList(this.entData).subscribe({
        next: (response: Third[])=>{
          this.data = response;
          console.log(response);
          this.dataSource = new MatTableDataSource<Third>(this.data);
          this.dataSource.paginator = this.paginator;
        },
        /*error: (error) => {
          console.log(error)
          Swal.fire({
            title: 'Error',
            text: 'No se han encontrado terceros para esta empresa!',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'error',
          });
        }*/
      });
    }
  }

  showDetailTableFunction(): void {
    this.showDetailTable = !this.showDetailTable;
  }

  openModalDetails(thId: number): void {
    this.openPopUp(thId, 'Detalles del tercero', ThirdDetailsModalComponent)
  }

  openModalEdit(thId: number): void {
    this.openPopUp(thId, 'Editar información del Tercero', ThirdEditModalComponent)
  }
  //Abrir Crear tercero apartir del PDF del RUT
  openCreatePDFRunt(): void {
    this.createPdfRUT = true;
  }
  //cerrar Crear tercero apartir del PDF del RUT
  closeCreatePDFRunt(): void {
    this.createPdfRUT = false;
  }

  redirectToEdit(ThirdId: string): void {
    console.log("El id del tercero es", ThirdId)
    this.router.navigate(['/general/operations/third-parties/edit', ThirdId]);
  }


  openConfigTPModal(): void {
    this.openPopUp(0, 'Configuración de Terceros', ThirdConfigModalComponent)
  }

  changeThirdPartieState(thId: number): void {
    this.thirdService.changeThirdPartieState(thId).subscribe({
      next: (response: Boolean) => {

        if (response) {
          let updatedThird = this.data.find(t => t.thId === thId);
          if (updatedThird) {
            updatedThird.state = !updatedThird.state;
          }
          Swal.fire({
            title: 'Exito',
            text: 'Se cambió exitosamente. el estado del tercero',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'success',
          });
        }
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cambiar el estado del tercero',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    });
  }
  deleteThirdPartie(thId: number): void {

  }

  openPopUp(thId: any, title: any, component: any) {
    var _popUp = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data: {
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
    this.dataSource.filterPredicate = (data: any, filter) => {
      return columns.some(column =>
        data[column].toString().toLowerCase().includes(filter));
    };
    // Aplicar el nuevo filtro
    this.dataSource.filter = filterValue;
  }
  /**
   * Opens a modal dialog for import details.
   */
  openModalDetailsImport(): void {
    this.OpenDetailsImport('Detalles de importación ', ThirdImportComponent)
  }
  /**
   * Opens a modal dialog with a given title and component.
   * @param title The title of the modal dialog.
   * @param component The component to be displayed in the modal dialog.
   */
  OpenDetailsImport(title: any, component: any) {
    var _popUp = this.dialog.open(component, {
      width: '40%',
      height: '100px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data: {
        title: title
      }
    });
    _popUp.afterClosed().subscribe()
  }
  /**
     * Export thirds to an Excel file.
     */
  exportThirdsToExcel() {
    console.log('paso 1')
    this.thirdExportComponent.getThirds().then((success) => {
      if (success) {
        Swal.fire({
          title: 'Éxito!',
          text: 'Se ha generado el archivo correctamente.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'success'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'No se encontraron terceros para exportar.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    });
  }
  // Método que llama al servicio para crear los terceros
  createThirdFromExcel(third: Third) {
    this.thirdService.createThird(third).subscribe({
      next: (response) => {
        console.log('Tercero creado con éxito', response);
        // mostrar alerta
      },
      error: (error) => {
        console.error('Error al crear el tercero', error);
        Swal.fire({
          title: 'Error al crear los terceros',
          text: 'Hubo un error al procesar el archivo, por favor intente nuevamente.',
          icon: 'error',
          confirmButtonColor: buttonColors.confirmationColor
        });
      }
    });
  }
  private getThirdTypes(): void {
    this.thirdServiceConfiguration.getThirdTypes(this.entData).subscribe({
      next: (response: ThirdType[]) => {
        this.thirdTypes = response;
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'No se han encontrado Tipos De Tercero Para esta Empresa',
          icon: 'error',
        });
      }
    });
  }
  private getTypesID(): void {
    this.thirdServiceConfiguration.getTypeIds(this.entData).subscribe({
      next: (response: TypeId[]) => {
        this.typeIds = response;
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'No se han encontrado Tipos De Identifiacion Para esta Empresa',
          icon: 'error',
        });
      }
    });
  }
  excelData: any;
  ReadExcel(event: any) {
    let file = event.target.files[0];

    // Check if the file is of type xlsx
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      console.error('El archivo debe ser de tipo xlsx.');
      return;
    }

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    const currentDate = new Date();

    this.getTypesID();


    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary', cellText: true });
      var sheetNames = workBook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      console.log('Datos: ', this.excelData);

      this.excelData.forEach((row: any) => {
        var third: Third = {
          thId: 0,
          entId: this.entData,
          personType: this.convertirTipoPersona(row["Tipo persona"]),
          thirdTypes: this.convertirTipoTercero(row["Tipos de tercero"]),
          names: row["Nombres"],
          lastNames: row["Apellidos"],
          socialReason: row["Razon social"],
          gender: this.convertirGenero(row["Genero"]),
          typeId: this.convertirTipoId(row["Tipo ID"]),
          idNumber: row["Identificacion"],
          verificationNumber: row["Numero de verificacion"],
          state: this.convertirEstado(row["Estado"]),
          country: row["Pais"],
          province: row["Departamento"],
          city: row["Ciudad"],
          address: row["Direccion"],
          phoneNumber: row["Telefono"],
          email: row["Correo"],
          creationDate: this.datePipe.transform(currentDate, 'yyyy-MM-dd')!,
          updateDate: this.datePipe.transform(currentDate, 'yyyy-MM-dd')!
        }
        this.createThirdFromExcel(third);

      });
    }
  }
  // Función que convierte el valor de "Tipo persona" a un enum
  convertirTipoPersona(tipo: string): ePersonType {
    console.log('TP', tipo);
    switch (tipo.trim().toLowerCase()) {
      case 'natural':
        return ePersonType.natural;
      case 'juridica':
        return ePersonType.juridica;
      default:
        throw new Error(`Tipo de persona desconocido: ${tipo}`);
    }
  }
  convertirGenero(gender: String): eThirdGender | null {
    // Si el campo de género está vacío o no tiene valor válido, devolvemos `null`
    if (!gender || gender.trim() === '') {
      return null; // No asignamos género si el campo está vacío
    }
    switch (gender.trim().toLowerCase()) {
      case 'masculino':
        return eThirdGender.masculino;
      case 'femenino':
        return eThirdGender.femenino;
      case 'Otro':
        return eThirdGender.Otro;
      default:
        throw new Error(`Genero desconocido: ${gender}`);
    }
  }

  convertirEstado(estado: String) {
    switch (estado.trim().toLowerCase()) {
      case 'activo':
        return true;
      case 'inactivo':
        return false;
      default:
        throw new Error(`Estado desconocido: ${estado}`);
    }
  }
  convertirTipoTercero(thirdTypes: String): ThirdType[] {
  
    console.log('tpss', this.thirdTypes);
    const resultado = (thirdTypes as string).split(",").map(item => item.trim());
    // Filtrar los tipos de tercero que coinciden con el nombre
    const coincidencias = this.thirdTypes.filter((tipo) =>
      resultado.includes(tipo.thirdTypeName)
    );
    console.log('coin');
    return coincidencias;
  }
  convertirTipoId(tipoId: String): TypeId {
    // Buscar la primera coincidencia
    const coincidencia = this.typeIds.find((tipo) =>
      tipoId.includes(tipo.typeId)
    );

    // Si no existe una coincidencia, lanzar un error
    if (!coincidencia) {
      throw new Error(`No se encontró el tipo de ID: ${tipoId}`);
    }

    // Si se encontró, devolver la coincidencia
    return coincidencia;
  }

}

