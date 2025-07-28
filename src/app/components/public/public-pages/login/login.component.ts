import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../../shared/services/authentification.service';
import { Credentials } from '../../../../shared/entities';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  
  form: FormGroup = new FormGroup({
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]})
  });
  router = inject(Router);
  auth = inject(AuthentificationService);
  //userService = inject(UserService);

  //user: User|undefined;
  
  /**
   * This method is called when the form is submitted.
   * It checks if the form is valid, and if so, it retrieves the credentials from the form,
   */
  async onSubmit() {
    if(this.form.valid) {
      const credentials:Credentials = {
        username : this.form.value.email,
        password : this.form.value.password
      };
      this.form.reset();
  
      try {
        const response = await firstValueFrom(this.auth.login(credentials));
          if(response.token != null) {
            /*this.userService.fetchUserLogged().subscribe(
              data => {
                if(data) {
                  this.user = data;
                  this.userService.setUser(this.user);

                }
              }
            )*/
          }
        }
          catch (error) {
          console.log(error, 'Problème de connexion');
      }

    }

  }

}
