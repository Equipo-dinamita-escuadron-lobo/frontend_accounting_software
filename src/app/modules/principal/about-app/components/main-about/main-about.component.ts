import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../../login/services/auth.service';

@Component({
  selector: 'app-main-about',
  templateUrl: './main-about.component.html',
  styleUrl: './main-about.component.css',
})
export class MainAboutComponent {
  fullTitle = 'CONTAPP';
  fullSubtitle =
    'Desarrollada por estudiantes del programa de Ingeniería de sistemas de la Universidad del Cauca';
  displayedTitle = '';
  displayedSubtitle = '';

  titleSpeed = 150; // ms por carácter
  subtitleSpeed = 50; // ms por carácter
  resetInterval = 10000; // 10 segundos

  selectedOption: string = 'Inicio';
  showCursor = true;

  images = [
    {
      src: '../../../../../../assets/landing-page/carousel/5.webp',
      title: 'Estudiantes y Docentes',
      description: 'ContApp fue desarrollada por estudiantes de Ingeniería de Sistemas de la Universidad del Cauca, con el apoyo del docente de Proyecto 1 y profesores de la Facultad de Ciencias Contables. Esta colaboración ha permitido crear una herramienta innovadora para la gestión contable.',
      icon: ''
    },
    {
      src: '../../../../../../assets/landing-page/carousel/2.jpg',
      title: 'Equipo #1',
      description: 'Somos el equipo Alfa Buena Maravilla Onda Dinamita Escuadrón Lobo. Nos especializamos en la creación del CRUD para empresas, gestionando la autenticación, vistas y lógica de usuarios, así como el catálogo de cuentas. Además, desarrollamos el frontend para la facturación de compras.',
      icon: '<path d="..."/>'
    },
    {
      src: '../../../../../../assets/landing-page/carousel/3.jpg',
      title: 'Equipo #2',
      description: 'Nuestro equipo de desarollo se encargó de realizar las soluciones del backend y frontend para el modulo de Terceros, además de colaborar en el microservicio de las facturas, el cual genera de manera automatizada los PDF de las facturas de compra',
      icon: '<path d="..."/>'
    },
    {
      src: '../../../../../../assets/landing-page/carousel/4.jpg',
      title: 'Equipo #3',
      description: 'Somos DevMasters, un equipo de desarrollo de software especializado en soluciones integrales de backend y frontend. Nuestro enfoque principal es el desarrollo y mantenimiento del sistema CRUD de productos y la generación automatizada de facturas de compra en formato PDF.',
      icon: '<path d="..."/>'
    },
  ];

  currentIndex = 0;
  prevIndex = this.images.length - 1;
  intervalId: any;
  isTransitioning = false;

  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private titleIndex: number = 0;
  private subtitleIndex: number = 0;
  private resetTimeoutId: any;

  constructor(public router: Router, private authService: AuthService) {
    this.verifiedStatusUser();
  }

  verifiedStatusUser() {
    if (this.authService.verifiedStatusLogin()) {
      this.router.navigate(['/general/enterprises/list']);
    }
  }

  ngOnInit() {
    this.startAnimation();
    this.scheduleReset();
    this.startAutoSlide();
    this.setInitialClasses()
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  setInitialClasses(): void {
    const images = document.querySelectorAll('.carousel-image');
    images.forEach((img, index) => {
      if (index === this.currentIndex) {
        img.classList.add('active');
      } else {
        img.classList.remove('active', 'prev');
      }
    });
  }

  nextImage(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.prevIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.triggerTransition();
  }

  prevImage(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.prevIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.triggerTransition();
  }

  triggerTransition(): void {
    const images = document.querySelectorAll('.carousel-image');
    images.forEach((img, index) => {
      img.classList.remove('active', 'prev');
      if (index === this.currentIndex) {
        img.classList.add('active');
      } else if (index === this.prevIndex) {
        img.classList.add('prev');
      }
    });
    setTimeout(() => {
      this.isTransitioning = false;
    }, 3000); // Match the CSS transition duration
  }

  animateIn(direction: string): void {
    const image = document.querySelector('.carousel-image') as HTMLElement;
    image.style.transform = `translateX(${direction === 'left' ? '' : '-'
      }100%)`;
    setTimeout(() => {
      image.style.transform = 'translateX(0)';
      this.isTransitioning = false;
    }, 20); // Small delay to trigger the transition
  }
  startAnimation() {
    this.lastTimestamp = 0;
    this.titleIndex = 0;
    this.subtitleIndex = 0;
    this.displayedTitle = '';
    this.displayedSubtitle = '';
    this.showCursor = true;
    this.animate(0);
  }

  animate(timestamp: number) {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }

    const delta = timestamp - this.lastTimestamp;

    if (this.titleIndex < this.fullTitle.length) {
      if (delta >= this.titleSpeed) {
        this.displayedTitle += this.fullTitle[this.titleIndex];
        this.titleIndex++;
        this.lastTimestamp = timestamp;
      }
    } else if (this.subtitleIndex < this.fullSubtitle.length) {
      if (delta >= this.subtitleSpeed) {
        this.displayedSubtitle += this.fullSubtitle[this.subtitleIndex];
        this.subtitleIndex++;
        this.lastTimestamp = timestamp;
      }
    } else {
      this.showCursor = false;
      return;
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  scheduleReset() {
    this.resetTimeoutId = setTimeout(() => {
      this.startAnimation();
      this.scheduleReset();
    }, this.resetInterval);
  }

  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
