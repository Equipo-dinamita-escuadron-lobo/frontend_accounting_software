import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() stateHidden :boolean = true;

  entName:string = '';

  constructor(private router: Router){

  }

  ngOnInit(){
    this.getEntData()
  }

  links = [

    {
      iconName: 'groups',
      href: '/general/operations/home',
      linkText: 'Inicio',
      subHref: [
      ]
    },

    {
      iconName: 'groups',
      href: '/general/operations/third-parties',
      linkText: 'Terceros',
      subHref: [
        {linkText: 'Listar', href: '/general/operations/third-parties'}
      ]
    },

    {
      iconName: 'inventory_2',
      href: '/general/operations/products',
      linkText: 'Inventario',
      subHref: [
        {linkText: 'Productos', href: '/general/operations/products'}
      ]
    }

    // Añade tantos enlaces como necesites
  ];

  getEntData(){
    const dataEnt = localStorage.getItem('entData');

    if(dataEnt){
      this.entName = JSON.parse(dataEnt).name;
    }
  }

  goHome(){
    this.router.navigateByUrl('/general/operations/home');
  }
}
