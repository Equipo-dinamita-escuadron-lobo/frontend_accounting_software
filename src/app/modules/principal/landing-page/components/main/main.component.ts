import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  fullTitle = 'CONTAPP';
  fullSubtitle = 'Aplicación para gestionar tu información contable';
  displayedTitle = '';
  displayedSubtitle = '';
  titleSpeed = 150; // Adjust typing speed for title
  subtitleSpeed = 60; // Adjust typing speed for subtitle
  intervalId: any;

  constructor( public router: Router){

  }

  ngOnInit() {
    this.startTypingEffect();
    this.intervalId = setInterval(() => {
      this.resetText();
      this.startTypingEffect();
    }, 10000); // 5000 ms = 5 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startTypingEffect() {
    this.typeWriterEffect(this.fullTitle, 'title');
  }

  resetText() {
    this.displayedTitle = '';
    this.displayedSubtitle = '';
  }

  typeWriterEffect(text: string, type: 'title' | 'subtitle', index = 0) {
    if (type === 'title' && index < text.length) {
      this.displayedTitle += text.charAt(index);
      index++;
      setTimeout(
        () => this.typeWriterEffect(text, 'title', index),
        this.titleSpeed
      );
    } else if (type === 'title' && index === text.length) {
      setTimeout(
        () => this.typeWriterEffect(this.fullSubtitle, 'subtitle'),
        this.titleSpeed
      );
    } else if (type === 'subtitle' && index < text.length) {
      this.displayedSubtitle += text.charAt(index);
      index++;
      setTimeout(
        () => this.typeWriterEffect(text, 'subtitle', index),
        this.subtitleSpeed
      );
    }
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
