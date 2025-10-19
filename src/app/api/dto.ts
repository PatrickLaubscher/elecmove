import { Location } from "../shared/entities";



export interface LoginCredentialsDTO {
    email:string;
    password:string;
}

export interface LoginResponseDTO {
    token:string;
    user:UserConnectedDTO;
}

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

export interface CarCreationDTO {
    type:string;
    registration:string;
    brand:string;
}

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

export interface BookingCreationDTO {
    date:string;
    startTime:string;
    endTime:string;
    carId:string;
    stationId:string;
}