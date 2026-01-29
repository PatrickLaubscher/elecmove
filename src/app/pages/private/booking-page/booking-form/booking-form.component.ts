import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StandardModalComponent } from '../../../../components/standard-modal/standard-modal.component';
import { CarFormComponent } from '../../car-page/car-form/car-form.component';
import { BookingCreationDTO, PreBookingEstimateResquestDTO } from '../../../../api/dto';
import { Car, FavoriteStation, PreBookingEstimate, Station } from '../../../../shared/entities';
import { CarService } from '../../../../api/car/car.service';
import { endAfterStartValidator, futureDateValidator, startTimeInPastValidator } from '../../../../shared/validators';
import { StationService } from '../../../../api/station/station.service';
import { ActivatedRoute } from '@angular/router';
import { BookingStorageService } from '../../../../services/booking-storage.service';
import { TimeConversionService } from '../../../../services/time-conversion.service';
import { InteractiveMapComponent } from "../../../../components/interactive-map/interactive-map.component";
import { FavoriteStationService } from '../../../../api/favorite-station/favorite-station.service';


@Component({
  selector: 'app-booking-form',
  imports: [ReactiveFormsModule, CommonModule, StandardModalComponent, CarFormComponent, InteractiveMapComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})

export class BookingFormComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly isMapModalOpen = signal(false);
  protected readonly isCarModalOpen = signal(false);
  protected readonly isFavoritesModalOpen = signal(false);
  protected readonly carService = inject(CarService);
  protected readonly stationService = inject(StationService);
  protected readonly favoriteStationService = inject(FavoriteStationService);
  protected readonly bookingStorageService = inject(BookingStorageService);
  protected readonly timeConversion = inject(TimeConversionService);

  readonly favoriteStations = this.favoriteStationService.getAll();

  readonly stationId = signal<string>('');
  readonly station = signal<Station | null>(null);
  readonly stationType = this.station()?.freeStanding ? "Murale" : "Sur pied";
  readonly preBookingEstimate = signal<PreBookingEstimate>({
    bookingDuration: 0,
    bookingEstimatePrice: 0
  });
  readonly isLoadingStation = signal(false);
  readonly carSelected = input<Car>();
  readonly bookingFormSubmit = output<{booking: BookingCreationDTO}>();

  readonly cars = this.carService.getAll();
  private readonly now = new Date();
  private readonly formatTime = (d: Date) => d.toTimeString().substring(0, 5);
  readonly minStartTime = signal<string>('');

  private wasOpen = false;

  constructor() {
    effect(() => {
      const isOpen = this.isCarModalOpen();
      
      const savedCar = this.bookingStorageService.getCarId();
      // La modale vient de se fermer
      if (this.wasOpen && !isOpen) {
        this.cars.reload();
        if(savedCar && savedCar.length > 1) {
          this.form.patchValue({
            carId: savedCar
          })
        }
      }
      
      this.wasOpen = isOpen;
    });
}

  private getInitialStart(): Date {
    const start = new Date(this.now);
    const currentMinutes = start.getMinutes();
    
    if (currentMinutes < 30) {
      start.setHours(start.getHours() + 1, 30, 0, 0);
    } else {
      start.setHours(start.getHours() + 2, 0, 0, 0);
    }
    return start;
  }

  private getInitialEnd(): Date {
    const start = this.getInitialStart();
    return new Date(start.getTime() + 30 * 60 * 1000);
  }

  
  get today(): string {
    const tzOffset = this.now.getTimezoneOffset() * 60000;
    return new Date(this.now.getTime() - tzOffset).toISOString().split('T')[0];
  }

  private updateMinStartTime() {
    const selectedDate = this.form.value.date;
    const today = this.today;
    
    // Si la date sélectionnée est aujourd'hui, calculer l'heure minimum
    if (selectedDate === today) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      
      // Arrondir à la prochaine demi-heure
      let minHour = currentHour;
      let minMinutes: number;
      
      if (currentMinutes < 30) {
        minMinutes = 30;
      } else {
        minHour += 1;
        minMinutes = 0;
      }
      
      // Gérer le cas où on dépasse minuit
      if (minHour >= 24) {
        minHour = 23;
        minMinutes = 30;
      }
      
      this.minStartTime.set(`${String(minHour).padStart(2, '0')}:${String(minMinutes).padStart(2, '0')}`);
    } else {
      // Pour les dates futures, pas de restriction d'heure
      this.minStartTime.set('00:00');
    }
  }

  // initialise form group and form controls
  protected readonly form = new FormGroup({
      date: new FormControl<string>(new Date().toISOString().substring(0, 10), {validators: [Validators.required, futureDateValidator]}),
      startTime: new FormControl<string>(this.formatTime(this.getInitialStart()), {validators: [Validators.required]}),
      endTime:  new FormControl<string>(this.formatTime(this.getInitialEnd()), {validators: [Validators.required]}
      ),
      carId: new FormControl<string>('', {validators: [Validators.required]}),
      stationId: new FormControl<string>('', {validators: [Validators.required]})
    },
    { validators: [
      endAfterStartValidator,
      startTimeInPastValidator(() => this.today, () => this.minStartTime())
    ]}
  );

  
  ngOnInit() {

    // input values from session storage
    
    // Carid
    const savedCar = this.bookingStorageService.getCarId();
    if(savedCar && savedCar.length > 1) {
      this.form.patchValue({
        carId: savedCar
      })
    }
    this.form.get('carId')?.valueChanges.subscribe(carId => {
      if (carId) {
        this.bookingStorageService.addCarId(carId);
      }
    });
    
    // Booking time
    const savedDate = this.bookingStorageService.getBookingDate?.() ?? this.today;
    const savedStart = this.bookingStorageService.getBookingStartTime?.() ?? this.formatTime(this.getInitialStart());
    const savedEnd = this.bookingStorageService.getBookingEndTime?.() ?? this.formatTime(this.getInitialEnd());

    this.form.patchValue({
      date: savedDate,
      startTime: savedStart,
      endTime: savedEnd,
    });

    // Initialiser l'heure minimum
    this.updateMinStartTime();

    // Mettre à jour l'heure minimum quand la date change
    this.form.get('date')?.valueChanges.subscribe(date => {
      if (date) {
        this.bookingStorageService.addBookingDate(date);
        this.updateMinStartTime();
        
        // Vérifier si l'heure de début est toujours valide
        const currentStartTime = this.form.value.startTime;
        if (currentStartTime && currentStartTime < this.minStartTime()) {
          // Si l'heure de début est dans le passé, la réinitialiser
          const initialStart = this.formatTime(this.getInitialStart());
          this.form.patchValue({ 
            startTime: initialStart,
            endTime: this.formatTime(new Date(new Date().setHours(
              Number.parseInt(initialStart.split(':')[0]), 
              Number.parseInt(initialStart.split(':')[1]) + 30
            )))
          });
        }
      }
    });

    // Gestion des changements de startTime
    this.form.get('startTime')?.valueChanges.subscribe(start => {
      if (start) {
        // Arrondir à la demi-heure la plus proche
        const [h, m] = start.split(':').map(Number);
        const roundedMinutes = m < 30 ? 0 : 30;
        const roundedTime = `${String(h).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
        
        // Vérifier si l'heure est dans le passé pour aujourd'hui
        if (this.form.value.date === this.today && roundedTime < this.minStartTime()) {
          this.form.patchValue({ startTime: this.minStartTime() }, { emitEvent: false });
          this.bookingStorageService.addBookingStartTime(this.minStartTime());
          return;
        }
        
        // Si l'heure a été arrondie, mettre à jour sans déclencher valueChanges
        if (roundedTime !== start) {
          this.form.patchValue({ startTime: roundedTime }, { emitEvent: false });
          this.bookingStorageService.addBookingStartTime(roundedTime);
          return;
        }

        this.bookingStorageService.addBookingStartTime(start);

        // Auto-remplir endTime avec +30 minutes
        const end = new Date();
        end.setHours(h, roundedMinutes + 30);
        const formattedEnd = end.toTimeString().substring(0, 5);
        this.form.patchValue({ endTime: formattedEnd }, { emitEvent: false });

        this.bookingStorageService.addBookingEndTime(formattedEnd);
        
        // Mettre à jour l'estimation
        this.updatePrebookingEstimate();
      }
    });

    this.form.get('endTime')?.valueChanges.subscribe(end => {
      if (end) {
        // Arrondir à la demi-heure la plus proche
        const [h, m] = end.split(':').map(Number);
        const roundedMinutes = m < 30 ? 0 : 30;
        const roundedTime = `${String(h).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
        
        // Si l'heure a été arrondie, mettre à jour sans déclencher valueChanges
        if (roundedTime !== end) {
          this.form.patchValue({ endTime: roundedTime }, { emitEvent: false });
          this.bookingStorageService.addBookingEndTime(roundedTime);
          return;
        }

        this.bookingStorageService.addBookingEndTime(end);
        this.updatePrebookingEstimate();
      }
    });
    
    // Loading existing station and cars
    this.activatedRoute.queryParams.subscribe(params => {
        const id = params['stationId'];
        if (id) {
          this.stationId.set(id);
          this.form.patchValue({ stationId: id });
          this.isLoadingStation.set(true);
          this.stationService.getOneObservable(id).subscribe({
            next: (station) => {
              this.station.set(station);
              this.isLoadingStation.set(false);
              // Mettre à jour l'estimation après chargement de la station
              this.updatePrebookingEstimate();
            },
            error: () => this.isLoadingStation.set(false)
          });
        }
      });

    if(this.carSelected()?.id){
      this.form.patchValue({ carId: this.carSelected()!.id });
    }

    // Estimation initiale
    this.updatePrebookingEstimate();
  }

  // Méthode pour mettre à jour l'estimation de prebooking
  private updatePrebookingEstimate() {
    const startTime = this.form.value.startTime;
    const endTime = this.form.value.endTime;

    if (!this.stationId() || !startTime || !endTime || this.stationId().trim() === '') {
      return;
    }

    const preBookingRequest: PreBookingEstimateResquestDTO = {
      bookingStartTime: startTime,
      bookingEndTime: endTime
    };

    this.stationService.getPrebookingEstimate(this.stationId(), preBookingRequest).subscribe({
      next: (res) => {
        this.preBookingEstimate.set({
          bookingDuration: res.bookingDuration,
          bookingEstimatePrice: res.bookingEstimatePrice
        });
      },
      error: (err) => {
        console.error("Erreur chargement des données de prebooking", err);
      }
    });
  }

  

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const newBooking:BookingCreationDTO = {
      date: this.form.value.date!,
      startTime: this.form.value.startTime!,
      endTime: this.form.value.endTime!,
      carId: this.form.value.carId!,
      stationId: this.form.value.stationId!
    }
    this.bookingFormSubmit.emit({booking:newBooking});
  }

  selectFavoriteStation(favoriteStation: FavoriteStation) {
    const station = favoriteStation.station;
    this.stationId.set(station.id);
    this.station.set(station);
    this.form.patchValue({ stationId: station.id });
    this.isFavoritesModalOpen.set(false);
    this.updatePrebookingEstimate();
  }

}
