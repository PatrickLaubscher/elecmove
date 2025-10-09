import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { UserAddress } from '../../shared/entities';
import { UserAddressCreationDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class UserAddressService {

  private readonly http = inject(HttpClient);

  getAll() {
    return httpResource<UserAddress[]>(() => '/api/user-addresses');
  }

  getOne(id:string) {
    return httpResource<UserAddress>(() => '/api//api/user-addresses/' + id);
  }

  add(newUserAddress:UserAddressCreationDTO) {
    return this.http.post<UserAddress>('/api//api/user-addresses', newUserAddress);
  }

  put(id:Signal<number>, userAddress:UserAddressCreationDTO) {
    return this.http.put<UserAddress>('/api//api/user-addresses/'+ id(), userAddress);
  }

  delete(id:Signal<number>) {
    return this.http.delete<null>('/api//api/user-addresses/'+ id());
  }

  
}
