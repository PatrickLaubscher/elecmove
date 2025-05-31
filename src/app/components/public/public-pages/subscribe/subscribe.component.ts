import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';
import { NewUser } from '../../../../shared/entities';


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

  userService = inject(UserService);

  // Définition du formulaire réactif avec les contrôles et leurs validations
  form: FormGroup = new FormGroup({
    firstname: new FormControl('', {validators: [Validators.required]}),
    lastname: new FormControl('', {validators: [Validators.required]}),
    birthdate: new FormControl('', {validators: [Validators.required]}),
    mobile: new FormControl('', {validators: [Validators.required, Validators.pattern('^[0-9]{10}$')]}),
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    address: new FormControl('', {validators: [Validators.required]}),
    city: new FormControl('', {validators: [Validators.required]}),
    cp: new FormControl('', {validators: [Validators.required, Validators.pattern('^[0-9]{5}$')]}),
    password: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]}),
    password_confirmation: new FormControl('', {validators: [Validators.required]}),
    
    }, {validators: confirmPasswordValidator},
  );

  
  onSubmit() {
    if(this.form.valid) { 

      // Création d'un nouvel utilisateur à partir des valeurs du formulaire
      const newUser:NewUser = {
        firstname : this.form.value.firstname,
        lastname: this.form.value.lastname,
        birthdate: this.form.value.birthdate,
        mobile: this.form.value.mobile,
        email : this.form.value.email,
        address: this.form.value.address,
        city: this.form.value.city,
        cp: this.form.value.cp,
        pwd : this.form.value.password
      };

      console.log(newUser);
      // Réinitialisation du formulaire après soumission
      this.form.reset();
      
      // Appel du service pour ajouter un nouvel utilisateur
      // this.userService.addNewUser(newUser).subscribe({    
      //   next: () => console.log('Le compte a bien été créé'),
      //   error: (error) => console.error('Il y a eu une erreur dans la création de votre compte'),
      //   complete() {
      //     (prompt:string) => prompt = "Votre compte client a bien été créé, merci!" 
      //   },
      // });
    }
  }

}
