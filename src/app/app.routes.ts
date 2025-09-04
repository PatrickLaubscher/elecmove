import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './components/public/public-layout/public-layout.component';
import { HomepageComponent } from './components/public/public-pages/homepage/homepage.component';
import { LoginComponent } from './components/public/public-pages/login/login.component';
import { SubscribeComponent } from './components/public/public-pages/subscribe/subscribe.component';
import { PrivateLayoutComponent } from './components/private/private-layout/private-layout.component';
import { DashboardHomepageComponent } from './components/private/private-component/private-pages/dashboard-homepage/dashboard-homepage.component';

export const routes: Routes = [
    {path: '', component: PublicLayoutComponent,
        children: [
            {path: '', component: HomepageComponent},
            {path: 'login', component: LoginComponent},
            {path: 'subscribe', component: SubscribeComponent},
        ]
    },
    {path: 'espace-prive', component: PrivateLayoutComponent,
        children: [
            {path: '', component: DashboardHomepageComponent}
        ]
    },
    {path: '**', component: HomepageComponent}

];
