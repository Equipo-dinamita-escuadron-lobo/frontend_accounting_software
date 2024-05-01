import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { navbarData } from './nav-data';
import { SideNavToggle } from './SideNavToggle.interface';
import { INavbarData, fadeInOut } from './helper';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('500ms', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(2turn)', offset: 1 }),
        ]))
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  screenWidth = 0;
  collapsed = true;
  navData = navbarData;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768){
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth});
    }
  }

  constructor(public router: Router){  }

  ngOnInit(): void {
      this.screenWidth = window.innerWidth;
  }

  toggleCollapse():void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth});
  }

  closeSidenav():void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth});
  }

  handleClick(item: INavbarData):void{
    if(!this.multiple){
      for(let modelItem of this.navData){
        if(item !== modelItem && modelItem.expanded){
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
    this.goRoute(item);
  }

  goRoute(data: INavbarData){
    return this.router.navigateByUrl(data.routeLink);
  }

  getActiveClass(data:INavbarData):string{
    return this.router.url.includes(data.routeLink)?'active':'';
  }
}
