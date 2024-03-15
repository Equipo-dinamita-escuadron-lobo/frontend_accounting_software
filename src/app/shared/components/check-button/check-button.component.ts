import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-check-button',
  templateUrl: './check-button.component.html',
  styleUrl: './check-button.component.css'
})
export class CheckButtonComponent {
  @Input() texto: string = "";
  @Input() value: string = "";
  @Input() tailConfig: string = "";
  isChecked = false;
}

