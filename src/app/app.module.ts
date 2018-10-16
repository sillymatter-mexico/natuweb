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
import { AvatarComponent } from './layout/avatar/avatar.component';
import {BsDatepickerModule, CollapseModule, ModalModule, TimepickerModule} from 'ngx-bootstrap';
import { HomeComponent } from './dashboard/home/home.component';
import { WorkshopListPreviewComponent } from './workshops/workshop-list-preview/workshop-list-preview.component';
import locale from '@angular/common/locales/es-MX';
import {registerLocaleData} from '@angular/common';
import { WorkshopsComponent } from './workshops/workshops.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { NewsComponent } from './dashboard/news/news.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { ToastrModule } from 'ngx-toastr';
import { HelpComponent } from './dashboard/help/help.component';
import { WorkshopListViewComponent } from './workshops/workshop-list-view/workshop-list-view.component';
import { WorkshopListComponent } from './workshops/workshop-list/workshop-list.component';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { WorkshopCreateComponent } from './workshops/workshop-create/workshop-create.component';
import { WorkshopCreateDetailComponent } from './workshops/workshop-create-detail/workshop-create-detail.component';
import { PreviousButtonDirective } from './directives/previous-button.directive';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { LocationSelectorComponent } from './shared/location-selector/location-selector.component';
import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';
import { WorkshopCreatedComponent } from './workshops/workshop-created/workshop-created.component';
import { WorkshopViewComponent } from './workshops/workshop-view/workshop-view.component';
defineLocale('es', esLocale);

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
    ProfileComponent,
    HelpComponent,
    WorkshopListViewComponent,
    WorkshopListComponent,
    MomentDatePipe,
    WorkshopCreateComponent,
    WorkshopCreateDetailComponent,
    PreviousButtonDirective,
    LocationSelectorComponent,
    WorkshopCreatedComponent,
    WorkshopViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAtOhZyrFpLgYsPxWiuJ9yfOnz097YiKP8',
      libraries: ['places']}),
    AppRoutingModule,
  ],
  entryComponents: [
    LocationSelectorComponent,
    WorkshopCreatedComponent
  ],
  providers: [
    AuthGuard,
    LoggedGuard,
    GoogleMapsAPIWrapper,
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
