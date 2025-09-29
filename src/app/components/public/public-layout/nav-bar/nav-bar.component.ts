import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthentificationService } from '../../../../api/authentication/authentification.service';


@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

    protected readonly auth = inject(AuthentificationService);

}
