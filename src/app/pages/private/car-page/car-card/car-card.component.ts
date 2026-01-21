import { Component, input, output } from '@angular/core';
import { Car } from '../../../../shared/entities';

@Component({
  selector: 'app-car-card',
  imports: [],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.css'
})
export class CarCardComponent {

  readonly car = input.required<Car>();
  readonly editCar = output<Car>();
  readonly deleteCar = output<Car>();

  onEdit() {
    this.editCar.emit(this.car());
  }

  onDelete() {
    this.deleteCar.emit(this.car());
  }

}
