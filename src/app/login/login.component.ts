import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public requestError: string;
  public consultant: any;
  public user: any;
  public loading: boolean;
  public rememberSession: boolean;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {
    this.loading = false;
    this.rememberSession = false;
    this.user = {};
  }

  ngOnInit() {
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.loading = true;

      this.authService.login(this.user).subscribe(
        (data: any) => {
          this.loginSuccessHandler(data);
        },
        (err: any) => {
          this.loginErrorHandler(err);
        }
      );
    }
  }

  loginSuccessHandler(response: any) {
    const data = response.data;

    this.loading = false;
    this.requestError = null;

    this.consultant = data.consultant;
    this.consultant.token = 'Token ' + data.token;
    this.consultant.FMN = data.FMN;
    this.consultant.isDRV = data.isDRV;
    this.authService.rememberSession = this.rememberSession;
    this.authService.saveSession(this.consultant);

    this.router.navigate(['/inicio']);
  }

  loginErrorHandler(data: any) {
    const passwordError = '¿Tienes problemas para iniciar sesión?, escríbenos a:' +
      ' <a href="mailto:appminatura@natura.net">' +
      'appminatura@natura.net' +
      '</a>';

    console.log('error', data);

    this.loading = false;
    const e = data.error;
    this.requestError
      = (e.detail === 'Contraseña incorrecta.') ? passwordError : e.detail;
  }
}
