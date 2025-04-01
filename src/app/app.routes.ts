import { Routes } from '@angular/router';
import { HomepageComponent } from './components/public/homepage/homepage.component';
import { PublicLayoutComponent } from './components/public/public-layout/public-layout.component';

export const routes: Routes = [
    {path: '', component: PublicLayoutComponent,
        children: [
            {path: '', component: HomepageComponent},
        ]
    },
    {path: '**', component: HomepageComponent}

];
