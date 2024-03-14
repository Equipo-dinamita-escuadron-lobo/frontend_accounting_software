import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-sidebar-selected',
  templateUrl: './sidebar-selected.component.html',
  styleUrl: './sidebar-selected.component.css'
})
export class SidebarSelectedComponent {
  @Input() svgPath: string = ''; // Para el path del SVG
  @Input() href: string = '#'; // Para la URL del enlace, con un valor por defecto
  @Input() linkText: string = 'Terceros'; // Para el texto del enlace, con un valor por defecto

}
