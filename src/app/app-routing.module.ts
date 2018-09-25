import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/home', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent, canActivate: [LoggedGuard]},
  { path: 'login', component: LoginComponent},
  // { path: '**', component: PageNotFoundComponent },
  {
    path: 'inicio',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
    children: [{
      path: '',
      // canActivateChild: [AuthGuard],
      children: [
        // {path: 'home', component: HomeComponent},
        // {path: 'exchanges', component: ExchangeListComponent},
        // {path: 'exchange/:code', component: ExchangePageComponent},
        // {path: 'friends', component: FriendListComponent},
      ]
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
