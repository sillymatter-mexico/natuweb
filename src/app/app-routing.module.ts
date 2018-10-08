import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoggedGuard} from './guards/logged.guard';
import {AuthGuard} from './guards/auth.guard';
import {HomeComponent} from './home/home.component';
import {WorkshopsComponent} from './workshops/workshops.component';
import {NewsComponent} from './news/news.component';
import {ProfileComponent} from './profile/profile.component';
import {HelpComponent} from './help/help.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoggedGuard]},
  // { path: '**', component: PageNotFoundComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [{
      path: '',
      canActivateChild: [AuthGuard],
      children: [
        {path: 'inicio', component: HomeComponent},
        {path: 'talleres', component: WorkshopsComponent},
        {path: 'boletin', component: NewsComponent},
        {path: 'perfil', component: ProfileComponent},
        {path: 'ayuda', component: HelpComponent},
        // {path: 'exchange/:code', component: ExchangePageComponent},
      ]
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
