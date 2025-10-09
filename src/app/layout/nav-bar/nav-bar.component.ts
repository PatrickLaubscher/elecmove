import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthentificationService } from '../../api/authentication/authentification.service';
import { ThemeToggleComponent } from "../../components/theme-toggle/theme-toggle.component";



@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [RouterLink, ThemeToggleComponent],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

    protected readonly auth = inject(AuthentificationService);
    isMenuOpen = signal<boolean>(false);

    @ViewChild('menuDropdown') menuDropdown!: ElementRef;
    @ViewChild('menuButton') menuButton!: ElementRef;


    toggleMenu() {
       this.isMenuOpen.update(open => !open);
    }


    @HostListener('document:click', ['$event'])

    onClickOutside(event: MouseEvent) {
      const clickedInsideMenu = this.menuDropdown?.nativeElement.contains(event.target);
      const clickedButton = this.menuButton?.nativeElement.contains(event.target);

      if (!clickedInsideMenu && !clickedButton) {
      this.isMenuOpen.set(false);
      }
    }

}
