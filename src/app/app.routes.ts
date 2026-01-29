import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { HomepageComponent } from './pages/public/homepage/homepage.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout.component';
import { LoginComponent } from './pages/public/login/login.component';
import { SubscribeComponent } from './pages/public/subscribe/subscribe.component';
import { DashboardHomepageComponent } from './pages/private/dashboard-homepage/dashboard-homepage.component';
import { authGuard } from './api/authentication/auth.guard';
import { StationPageComponent } from './pages/private/station-page/station-page.component';
import { BookingPageComponent } from './pages/private/booking-page/booking-page.component';
import { FindStationPageComponent } from './pages/private/find-station-page/find-station-page.component';
import { CarPageComponent } from './pages/private/car-page/car-page.component';



export const routes: Routes = [
    {path: '', component: PublicLayoutComponent,
        children: [
            {path: '', component: HomepageComponent},
            {path: 'login', component: LoginComponent},
            {path: 'logout', component:LogoutComponent},
            {path: 'subscribe', component: SubscribeComponent},
        ]
    },
    {path: 'private', component: PrivateLayoutComponent,
        children: [
            {path: '', component: DashboardHomepageComponent},
            {path: 'stations', component: StationPageComponent},
            {path: 'bookings', component: BookingPageComponent},
            {path: 'find-station', component: FindStationPageComponent},
            {path: 'cars', component: CarPageComponent},

        ],
    canActivate: [authGuard]},
    {path: '**', component: HomepageComponent}

];
