import { Location } from "../shared/entities";


/* Credentials */
export interface LoginCredentialsDTO {
    email:string;
    password:string;
}

/* Login */
export interface LoginResponseDTO {
    token:string;
    user:UserConnectedDTO;
}

/* User */
export interface UserCreationDTO {
    firstname:string;
    lastname:string;
    email:string;
    mobile:string;
    password:string;
}

export interface UserConnectedDTO {
    firstname:string;
    lastname:string;
    email:string;
    mobile:string;
    role:string;
}

export interface UserAddressCreationDTO extends Location {
    addressName?:string;
}

/* Car */
export interface CarCreationDTO {
    type:string;
    registration:string;
    brand:string;
}

/* Station */
export interface StationCreationDTO {
    name:string;
    tarification:number;
    power:string;
    instruction?:string;
    freeStanding:boolean;
    available:boolean;
    locationStationId:string;
}

export interface FavoriteStationCreationDTO {
    stationId:string;
}



/* Coordinates with radisu */
export interface CoordinatesWithRadiusDTO {
    latitude:number;
    longitude:number;
    rayonMeters:number;
}

/* Coordinates with time slot */
export interface CoordinatesWithRadiusAndTimeSlotDTO extends CoordinatesWithRadiusDTO {
    date:string;
    startTime:string;
    endTime:string;
}


/* BookingEstimate */
export interface PreBookingEstimateResquestDTO {
    bookingStartTime:string;
    bookingEndTime:string;
}

/* Booking */
export interface BookingCreationDTO {
    date:string;
    startTime:string;
    endTime:string;
    carId:string;
    stationId:string;
}