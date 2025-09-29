import { Component, inject, OnInit } from '@angular/core';
import { PrivateNavbarComponent } from '../private-navbar/private-navbar.component';
import { PrivateTitleService } from '../../../../services/private-title.service';



@Component({
  selector: 'app-private-header',
  imports: [PrivateNavbarComponent],
  templateUrl: './private-header.component.html',
  styleUrl: './private-header.component.css'
})
export class PrivateHeaderComponent implements OnInit {

  title = '';
  titleService = inject(PrivateTitleService);

  ngOnInit(): void {
      this.titleService.title$.subscribe(title => {
        this.title = title;
      });
  }


}
