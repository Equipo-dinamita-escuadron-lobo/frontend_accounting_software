import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-selected',
  templateUrl: './sidebar-selected.component.html',
  styleUrl: './sidebar-selected.component.css'
})
export class SidebarSelectedComponent {
  @Input() svgPath: string = ''; // Para el path del SVG
  @Input() href: string = '#'; // Para la URL del enlace, con un valor por defecto
  @Input() linkText: string = ''; // Para el texto del enlace, con un valor por defecto
  @Input() subhref: {href:string, linkText: string}[] =[{href:'Crear', linkText: '/'}];
  @Output() isOptionSelected = new EventEmitter<boolean>();

  svgDown: string = "M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z";

  svgUp: string = "M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
  
  stateSubhref: boolean = false;

  selectedItem: string = ''; // Variable para rastrear el ítem seleccionado


  changeStateItems(){
    this.stateSubhref = !this.stateSubhref;
  }

  sendOptionIsSelected() {
    this.isOptionSelected.emit(this.stateSubhref);
  }
}
