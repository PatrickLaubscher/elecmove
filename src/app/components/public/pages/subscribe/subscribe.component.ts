import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';
import { UserCreationDTO } from '../../../../shared/dto';
import { AuthentificationService } from '../../../../shared/services/authentification.service';


export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password === control.value.password_confirmation
    ? null
    : { PasswordNoMatch: true };
};


@Component({
  selector: 'app-subscribe',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css'
})


export class SubscribeComponent {

  private readonly authApi = inject(AuthentificationService);


  form: FormGroup = new FormGroup({
    firstname: new FormControl('', {validators: [Validators.required]}),
    lastname: new FormControl('', {validators: [Validators.required]}),
    mobile: new FormControl('', {validators: [Validators.required, Validators.pattern('^[0-9]{10}$')]}),
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    address: new FormControl('', {validators: [Validators.required]}),
    password: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]}),
    password_confirmation: new FormControl('', {validators: [Validators.required]}),
    
    }, {validators: confirmPasswordValidator},
  );

  
  onSubmit() {
    if(this.form.valid) { 

      // Création d'un nouvel utilisateur à partir des valeurs du formulaire
      const newUser:UserCreationDTO = {
        firstname : this.form.value.firstname,
        lastname: this.form.value.lastname,
        mobile: this.form.value.mobile,
        email : this.form.value.email,
        password : this.form.value.password
      };

      // Réinitialisation du formulaire après soumission
      this.form.reset();
      
      //Appel du service pour ajouter un nouvel utilisateur
      this.authApi.register(newUser).subscribe({    
        next: () => console.log('Le compte a bien été créé'),
        error: (error) => console.error('Il y a eu une erreur dans la création de votre compte')
      });
    }
  }

}
