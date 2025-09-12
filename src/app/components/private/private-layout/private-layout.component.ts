import { Component } from '@angular/core';
import { PrivateHeaderComponent } from '../private-component/private-header/private-header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../public/public-layout/footer/footer.component';

@Component({
  selector: 'app-private-layout',
  imports: [PrivateHeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './private-layout.component.html',
  styleUrl: './private-layout.component.css'
})
export class PrivateLayoutComponent {

}
