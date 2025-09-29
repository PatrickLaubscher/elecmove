import { Component, inject, OnInit } from '@angular/core';
import { AuthentificationService } from '../../../../api/authentication/authentification.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {

  protected readonly auth = inject(AuthentificationService);
  protected readonly router = inject(Router);
  protected readonly snackBar = inject(MatSnackBar);


  ngOnInit(): void {
    this.auth.logout();
    this.snackBar.open('Vous avez été déconnecté', 'Ok', { duration: 5000 });
    this.router.navigate(['/']);
  }

}
