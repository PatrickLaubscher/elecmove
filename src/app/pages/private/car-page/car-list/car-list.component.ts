import { Component, input, output } from '@angular/core';
import { Car } from '../../../../shared/entities';
import { CarCardComponent } from "../car-card/car-card.component";

@Component({
  selector: 'app-car-list',
  imports: [CarCardComponent],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent {

  readonly cars = input.required<Car[]>();
  readonly editCar = output<Car>();
  readonly deleteCar = output<Car>();

  onEdit(car: Car) {
    this.editCar.emit(car);
  }

  onDelete(car: Car) {
    this.deleteCar.emit(car);
  }

}
