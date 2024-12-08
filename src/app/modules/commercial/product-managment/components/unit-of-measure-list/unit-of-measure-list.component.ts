import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { buttonColors } from '../../../../../shared/buttonColors';

/**
 * Componente para listar las unidades de medida
 */
@Component({
  selector: 'app-unit-of-measure-list',
  templateUrl: './unit-of-measure-list.component.html',
  styleUrl: './unit-of-measure-list.component.css'
})
export class UnitOfMeasureListComponent implements OnInit {
  /**
   *  Variables del componente
   */
 unitOfMeasures: UnitOfMeasure[] = [];  // Variable para almacenar las unidades de medida
 localStorageMethods: LocalStorageMethods = new LocalStorageMethods();  // Variable para almacenar los métodos de almacenamiento local
 entData: any | null = null;  // Variable para almacenar los datos de la empresa

  // Variables para la tabla
  displayedColumns: string[] = ['id', 'name', 'description', 'abbreviation', 'actions'];
  dataSource = new MatTableDataSource<UnitOfMeasure>(this.unitOfMeasures);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  form: FormGroup;

  //variables para el doble clic
  selectedUnitId: string | null = null; // Variable para almacenar el ID de la unidad seleccionada
  timer: any; // Variable para almacenar el temporizador

  /**
   * Constructor del componente 
   * @param unitOfMeasureService 
   * @param router 
   * @param fb 
   */
  constructor(
    private unitOfMeasureService: UnitOfMeasureService,
    private router: Router, private fb: FormBuilder
  ){
    this.form = this.fb.group(this.validationsAll());
   }

   validationsAll(){
    return {
      stringSearchUnitOfMeasure: ['']
    };
  }

  /**
   * Método para inicializar el componente
   */
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    if(this.entData){
    this.getUnitOfMeasures();
    }
  }

  /**
   * Método para decodificar una cadena
   * @param value 
   * @return string
   */
  decodeIfNeeded(value: string): string {
    try {
      return decodeURIComponent(escape(value));
    } catch {
      return value;
    }
  }

  /**
   * Método para obtener las unidades de medida
   */
  getUnitOfMeasures(): void {
    this.unitOfMeasureService.getUnitOfMeasures(this.entData).subscribe(
      (data: UnitOfMeasure[]) => {
        this.unitOfMeasures = data.map(unit => ({
          ...unit,
          name: this.decodeIfNeeded(unit.name),
          abbreviation: this.decodeIfNeeded(unit.abbreviation),
          description: this.decodeIfNeeded(unit.description)
        }));

        this.dataSource = new MatTableDataSource<UnitOfMeasure>(this.unitOfMeasures);
        this.dataSource.paginator = this.paginator;
        this.dataSource.data.forEach(unit => {
          console.log(unit.enterpriseId === 'standart');
        });
      },
      error => {
        console.log('Error al obtener las unidades de medida:', error);
      }
    );
  }

  /**
   * Método para redirigir a una ruta
   * @param route 
   */
  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  /**
   * Método para redirigir a la edición de una unidad de medida
   * @param unitId 
   */
  redirectToEdit(unitId: string): void {
    if (this.selectedUnitId === unitId) {
      // Doble clic, navegar a la página de edición
      this.router.navigate(['/general/operations/unities/edit/', unitId]);
      // Reiniciar el temporizador y el ID del producto seleccionado
      clearTimeout(this.timer);
      this.selectedUnitId = null;
    } else {
      // Primer clic, iniciar el temporizador
      this.selectedUnitId = unitId;
      this.timer = setTimeout(() => {
        // Limpiar el temporizador si pasa un tiempo después del primer clic
        clearTimeout(this.timer);
        this.selectedUnitId = null;
      }, 300); // Tiempo en milisegundos para considerar un doble clic
    }
  }

  /**
   * Método para redirigir a la eliminación de una unidad de medida
   * @param unitId 
   */
  redirectToDelete(unitId: string): void {
    // Utilizando SweetAlert para mostrar un cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar esta elemento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: buttonColors.confirmationColor,
      cancelButtonColor: buttonColors.cancelButtonColor,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        this.unitOfMeasureService.deleteUnitOfMeasureId(unitId).subscribe(
          (data: UnitOfMeasure) => {
            console.log('Unidad de medida eliminada con éxito: ', data);
            this.getUnitOfMeasures();
            Swal.fire({
              title: 'Se eliminó con éxito!',
              text: 'Se ha eliminado la Unidad de medida con éxito!',
              icon: 'success',
              confirmButtonColor: buttonColors.confirmationColor,
              confirmButtonText: 'Aceptar'
            });
          },
          error => {
            console.error('Error al eliminar la unidad de medida:', error);
            Swal.fire({
              title: 'No se puede eliminar ',
              text: 'La unidad de medida esta siendo usada',
              icon: 'warning',
              confirmButtonColor: buttonColors.confirmationColor,
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    });
  }

  /**
   * Método para regresar a la lista de unidades de medida
   */
  goBack(): void {
    this.router.navigate(['/general/operations/products']);
  }

}
