import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthentificationService } from '../../../api/authentication/authentification.service';
import { confirmPasswordValidator } from '../../../shared/validators';
import { UserCreationDTO } from '../../../api/dto';



@Component({
  selector: 'app-subscribe',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css'
})


export class SubscribeComponent {

  private readonly auth = inject(AuthentificationService);
  protected readonly router = inject(Router);
  protected readonly serverError = signal('');
  private readonly snackBar = inject(MatSnackBar);


  protected readonly form = new FormGroup({
    firstname: new FormControl<string>('', {validators: [Validators.required]}),
    lastname: new FormControl<string>('', {validators: [Validators.required]}),
    mobile: new FormControl<string>('', {validators: [Validators.required, Validators.pattern('^[0-9]{10}$')]}),
    email: new FormControl<string>('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl<string>('', {validators: [Validators.required, Validators.minLength(4)]}),
    password_confirmation: new FormControl<string>('', {validators: [Validators.required]}),
    
    }, {validators: confirmPasswordValidator},
  );


  
  registerNewUser(newUser: UserCreationDTO) {
    this.serverError.set('');
    this.auth.register(newUser)
      .subscribe({
        next: () => {
          this.snackBar.open('Votre compte été créé avec succès. Veuillez vérifiez votre boîte mail pour valider le compte.', 'Ok', {duration: 5000, verticalPosition:'top'});
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if(err.status == 400) {
            this.serverError.set('L\'email est utilisé dans un autre compte');
          } else {
            this.serverError.set("Error with server");
          }
        }
    });
  }


  submit() {
    if (this.form.invalid) {
      this.form.markAllAsDirty();
      return;
    }
    const newUser:UserCreationDTO = {
        firstname : this.form.value.firstname!,
        lastname: this.form.value.lastname!,
        mobile: this.form.value.mobile!,
        email : this.form.value.email!,
        password : this.form.value.password!
    }

    this.registerNewUser(newUser);
  }

}
