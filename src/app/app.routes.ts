import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { HomepageComponent } from './pages/public/homepage/homepage.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout.component';
import { LoginComponent } from './pages/public/login/login.component';
import { SubscribeComponent } from './pages/public/subscribe/subscribe.component';
import { DashboardHomepageComponent } from './pages/private/dashboard-homepage/dashboard-homepage.component';



export const routes: Routes = [
    {path: '', component: PublicLayoutComponent,
        children: [
            {path: '', component: HomepageComponent},
            {path: 'login', component: LoginComponent},
            {path: 'logout', component:LogoutComponent},
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
