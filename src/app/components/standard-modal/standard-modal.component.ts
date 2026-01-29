import { Component, model } from '@angular/core';

@Component({
  selector: 'app-standard-modal',
  imports: [],
  templateUrl: './standard-modal.component.html',
  styleUrl: './standard-modal.component.css'
})
export class StandardModalComponent {

  open = model.required<boolean>();


}
