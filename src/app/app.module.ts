import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import {AuthService} from './services/auth.service';
import {FormsModule} from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServerHttpInterceptor } from './interceptors/server.interceptor';
import { AuthHttpInterceptor } from './interceptors/auth.interceptor';
import {AuthGuard} from './guards/auth.guard';
import {LoggedGuard} from './guards/logged.guard';
import { AvatarComponent } from './avatar/avatar.component';
import {CollapseModule} from 'ngx-bootstrap';
import { HomeComponent } from './home/home.component';
import { WorkshopListPreviewComponent } from './workshop-list-preview/workshop-list-preview.component';
import locale from '@angular/common/locales/es-MX';
import {registerLocaleData} from '@angular/common';
import { WorkshopsComponent } from './workshops/workshops.component';
import { LoaderComponent } from './loader/loader.component';
import { NewsComponent } from './news/news.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';

export function onInit(authService: AuthService) {
  return () => authService.getSavedSession();
}
registerLocaleData(locale, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    AvatarComponent,
    HomeComponent,
    WorkshopListPreviewComponent,
    WorkshopsComponent,
    LoaderComponent,
    NewsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    CollapseModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    LoggedGuard,
    { provide: LOCALE_ID, useValue: 'es-MX' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: onInit,
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
