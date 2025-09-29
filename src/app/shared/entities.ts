
/* User */

export interface User {

    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

/* Role */

export interface Role {

    name:string;
}


/* Charging Stations */
export interface Station {

    type: string;
    location: Location;
}


/* Location */

export interface Location {
    
    latitude: number;
    longitude: number;
    address: number;
}