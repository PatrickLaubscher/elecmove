import { Role } from "./entities";



export interface LoginCredentialsDTO {
    email:string;
    password:string;
}

export interface LoginResponseDTO {
    token:string;
    user:UserConnectedDTO;
}

export interface UserCreationDTO {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    password:string;
}

export interface UserConnectedDTO {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    role: Role;
}
