

/* Authentication */

export interface AllowedUrl {
    url: string;
    methods: string[];
}

export interface Credentials {
    username: string;
    password: string;
}

export interface Token {
    token: string;
    refresh_token: string;
}


/* User */

export interface User {

    firstname: string;
    lastname: string;
    address: string;
    city: string;
    email: string;
    phone: string;
    roles: string;
    creationDate: string;

}

export interface NewUser {

    firstname: string;
    lastname: string;
    birthdate: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    zipcode: string;
    pwd: string;

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