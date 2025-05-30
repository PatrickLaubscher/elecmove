import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './components/public/public-layout/public-layout.component';
import { HomepageComponent } from './components/public/public-pages/homepage/homepage.component';
import { LoginComponent } from './components/public/public-pages/login/login.component';
import { SubscribeComponent } from './components/public/public-pages/subscribe/subscribe.component';

export const routes: Routes = [
    {path: '', component: PublicLayoutComponent,
        children: [
            {path: '', component: HomepageComponent},
            {path: 'login', component: LoginComponent},
            {path: 'subscribe', component: SubscribeComponent},
        ]
    },
    {path: '**', component: HomepageComponent}

];
