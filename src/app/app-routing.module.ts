import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoggedGuard} from './guards/logged.guard';
import {AuthGuard} from './guards/auth.guard';
import {HomeComponent} from './dashboard/home/home.component';
import {WorkshopsComponent} from './workshops/workshops.component';
import {NewsComponent} from './dashboard/news/news.component';
import {ProfileComponent} from './dashboard/profile/profile.component';
import {HelpComponent} from './dashboard/help/help.component';
import {WorkshopListViewComponent} from './workshops/workshop-list-view/workshop-list-view.component';
import {WorkshopCreateComponent} from './workshops/workshop-create/workshop-create.component';
import {WorkshopCreateDetailComponent} from './workshops/workshop-create-detail/workshop-create-detail.component';

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
        {path: 'talleres/:type', component: WorkshopListViewComponent},
        {path: 'talleres/crear/:type', component: WorkshopCreateComponent},
        {path: 'talleres/crear/:type/:workshop', component: WorkshopCreateDetailComponent},
      ]
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
