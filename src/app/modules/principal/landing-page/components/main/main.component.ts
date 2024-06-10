import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  fullTitle = 'CONTAPP';
  fullSubtitle = 'Aplicación para gestionar tu información contable';
  displayedTitle = '';
  displayedSubtitle = '';
  titleSpeed = 150; // ms por carácter
  subtitleSpeed = 60; // ms por carácter
  resetInterval = 10000; // 10 segundos
  
  selectedOption: string = 'Inicio';
  showCursor = true;

  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private titleIndex: number = 0;
  private subtitleIndex: number = 0;
  private resetTimeoutId: any;

  constructor(public router: Router) {}

  ngOnInit() {
    this.startAnimation();
    this.scheduleReset();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
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

  selectOption(option: string) {
    this.selectedOption = option;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}