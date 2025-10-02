import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthentificationService } from '../../../app/api/authentication/authentification.service';
import { LoginCredentialsDTO } from '../../../app/api/authentication/dto';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly authApi = inject(AuthentificationService);
  protected readonly router = inject(Router);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly serverError = signal('');
  readonly redirectUrl = input<string>();

  protected readonly form = new FormGroup({
    email: new FormControl<string>('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl<string>('', {validators: [Validators.required, Validators.min(4)]}),
  });

  
  loginUser(credentials: LoginCredentialsDTO) {
    this.serverError.set('');
    this.authApi.login(credentials)
      .subscribe({
        next: () => {
          this.router.navigateByUrl(this.redirectUrl() ?? '/espace-prive');
          this.snackBar.open('Connexion réussie', 'Ok', {duration: 5000, verticalPosition:'top'})
        },
        error: (err) => {
          if (err.status === 401) {
            this.serverError.set('Identifiants incorrects');
          } else if (err.status === 403) {
            this.serverError.set('Vous devez valider votre compte par mail avant de vous connecter.');
          }
        }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsDirty();
      return;
    }
    const credentials:LoginCredentialsDTO = {
      email: this.form.value.email!,
      password: this.form.value.password!
    }

    this.loginUser(credentials);
  }


}
