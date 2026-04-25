import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { SpaComponent } from './components/spa/spa.component';
import { AdminComponent } from './components/admin/admin.component';
import { ReceptionistComponent } from './components/receptionist/receptionist.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },  
  { path: 'login', component: LoginComponent },
  {path: 'spa', component: SpaComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'receptionist', component: ReceptionistComponent },
  { path: 'user-dashboard', component: UserDashboardComponent }
];