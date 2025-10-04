
/* User */
export interface User {

    firstname:string;
    lastname:string;
    email:string;
    mobile:string;
    role:string;
    createdAt:string;
    updatedAt:string;
}


/* address */ 
interface Location {
    id:string;
    address:string;
    city:string;
    zipcode:string;
    latitude:number;
    longitude:number;
}

/* User address */
export interface UserAddress extends Location {
    addressName?:string;
}


/* Car */
export interface Car {
    id:string;
    type:string;
    registration:string;
    brand:string;
}


/* Charging Stations */
export interface Station {
    id:string;
    type:string;
    location:Location;
}

/* Favorite station */
export interface FavoriteStation {
    user:User;
    station:Station;
}


/* Location */
export interface LocationStation extends Location {

}


/* Booking */
export interface Booking {
    id:string;
    date:Date;
    startTime:string;
    endTime:string;
    totalPrice:number;
    createdAt:Date;
    user:User;
    car:Car;
    station:Station;
    status:BookingStatus;
}


/* Booking status */
export interface BookingStatus {
    id:number;
    name:string;
}