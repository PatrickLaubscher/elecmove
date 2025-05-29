


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




export interface Station {
    lat: number,
    lng: number,
    adresse: string,
    type: string,
  }