import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy, SimpleChanges } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  isDtInitialized: boolean = false;

  constructor(private chRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 7,
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      columns: this.columns,
      dom: `
      <'mt-3 m-4 flex flex-row justify-between'
        <'flex flex-row' B>
        <'flex flex-row' f>
      >
      <'row'
        <'col-sm-12'tr>
      >
      <'row mt-1 flex items-center justify-center'
        <'col-sm-5'l><'col-sm-7'p>
      >
    `,
      buttons: [
        /*{
          text: 'Nuevo',
          className: "",
          action: function (e: MouseEvent, dt: DataTables.Api, node: HTMLButtonElement, config: any) {
            // Acción del botón, por ejemplo, mostrar un alerta
            alert('Botón presionado');
          }
        },
       /* {
          text: 'Lista clinton',
          className: "",
          action: function (e: MouseEvent, dt: DataTables.Api, node: HTMLButtonElement, config: any) {
            // Acción del botón, por ejemplo, mostrar un alerta
            alert('Botón presionado');
          }
        }*/
      ],
      language: {
        processing: "Procesando...",
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No se encontraron resultados",
        emptyTable: "Ningún dato disponible en esta tabla",
        info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        infoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        infoFiltered: "(filtrado de un total de _MAX_ registros)",
        infoPostFix: "",
        search: "Buscar:",
        url: "",
        thousands: ",",
        loadingRecords: "Cargando...",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        },
        aria: {
          sortAscending: ": Activar para ordenar la columna de manera ascendente",
          sortDescending: ": Activar para ordenar la columna de manera descendente"
        }
      },


    } as DataTables.Settings & { buttons: any[] };

  }

  ngAfterViewInit(): void {
    this.chRef.detectChanges(); // Asegúrate de que Angular detecta los cambios antes de inicializar DataTables
    this.dtTrigger.next(null); // Ahora emitimos el trigger sin opciones
    this.isDtInitialized = true; // Marcamos DataTables como inicializado
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo actúa si DataTables ha sido inicializado y los datos/columnas cambian
    if (this.isDtInitialized && (changes["data"] || changes["columns"])) {
      this.data = changes["data"].currentValue;
      this.rerender();
    }
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear(); // Limpia la instancia para nuevos datos
      dtInstance.rows.add(this.data); // Agrega los nuevos datos
      dtInstance.draw(); // Redibuja la tabla
      this.isDtInitialized = true; // Actualiza la bandera de inicialización si fuera necesario
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    if (this.isDtInitialized) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy(); // Asegura la destrucción de DataTables
      });
    }
  }
}
