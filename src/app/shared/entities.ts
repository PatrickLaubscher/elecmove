/* Api MapTiler */

export interface MapTilerSuggestion {
    type: "Feature";
    id: string;
    place_type: string[];
    place_type_name: string[];
    relevance: number;
    text: string;
    text_fr?: string;
    place_name: string;
    place_name_fr?: string;
    address?: string;
    bbox?: [number, number, number, number];
    center: [number, number];
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
    context?: [{
        id: string;
        text: string;
        text_fr?: string;
        wikidata?: string;
        short_code?: string;
    }];
    properties?: {
        ref?: string;
        country_code?: string;
        wikidata?: string;
        kind?: string;
        place_type_name?: string[];
        [key: string]: unknown;
    };
}

export interface MapTilerSuggestionsResponse {
    type: "FeatureCollection";
    query: string[];
    features: MapTilerSuggestion[];
}


export interface GeolocalisationResponse {
    country_code:string,
    country:string,
    country_bounds:number[],
    country_languages:string[],
    continent: string,
    continent_code: string,
    eu: boolean,
    city: string,
    latitude: number,
    longitude: number,
    postal: string,
    region: string,
    region_code: string,
    timezone: string
}



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


/* Location */ 
export interface Location {
    address:string;
    city:string;
    zipcode:string;
    latitude:number;
    longitude:number;
}

/* User address */
export interface UserAddress extends Location {
    id:string;
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
    name?:string;
    power:string;
    available:boolean;
    freeStanding:boolean;
    type:string;
    tarification:number;
    location:Location;
    availableAtGivenSlot?:boolean;
}

/* Favorite station */
export interface FavoriteStation {
    user:User;
    station:Station;
}


/* LocationStation */
export interface LocationStation extends Location {
    id:string;
}

/* BookingEstimate */
export interface PreBookingEstimate {
    bookingDuration:number;
    bookingEstimatePrice:number;
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