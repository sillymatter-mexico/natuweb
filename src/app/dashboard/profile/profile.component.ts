import { Component, OnInit } from '@angular/core';
import {AppService} from '../../services/app.service';
import {UserService} from '../../services/user.service';
import {take} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {ServerService} from '../../services/server.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public loading: boolean;
  public avatars: any[];
  public gender: string;
  public consultant: any;
  public selectedAvatar: number;
  public saving: boolean;
  public _url: string;

  constructor(private appService: AppService, private userService: UserService, private toastr: ToastrService, public serverService: ServerService) {
    this.avatars = [];
    this.loading = false;
    this.saving = false;
    this.consultant = this.userService.consultant;
    this.gender = this.consultant.gender;
    this._url = this.serverService.url;
  }

  ngOnInit() {
    this.fetchAvatars();
  }

  public fetchAvatars() {
    this.loading = true;
    this.avatars = [];
    this.appService.getAvatars(this.gender)
      .pipe(take(1))
      .subscribe((response: any) => {
        this.buildAvatars(response);
        this.loading = false;
      }, (error: any) => {
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error con el servidor', 'Error');
        console.log('error', error);
      });
  }

  private buildAvatars(avatars: any[]) {
    let selectedIndex: number;
    for (const avatar of avatars) {
      const wrapper = {
        avatar: avatar,
        id: avatar.id
      };
      this.avatars.push(wrapper);
    }
    selectedIndex = this.avatars.findIndex(x => x.id === this.consultant.avatar.id);
    if (this.gender === this.consultant.avatar.gender && selectedIndex === -1) {
      this.avatars.push(this.consultant.avatar);
      selectedIndex = this.avatars.length - 1;
    }
    this.selectedAvatar = selectedIndex !== -1 ? selectedIndex : 0;
  }

  public getSelected(position?: string) {
    let index: number = this.selectedAvatar;
    if (position === 'left') {
      index--;
    } else if (position === 'right') {
      index++;
    }
    return this.mod(index, this.avatars.length);
  }

  public mod(n, m): number {
    return ((n % m) + m) % m;
  }

  changeAvatar(direction: string) {
    let index = this.selectedAvatar;
    if (direction === 'previous') {
      index--;
    } else if (direction === 'next') {
      index++;
    }
    this.selectedAvatar = this.mod(index, this.avatars.length);
  }

  public saveAvatar() {
    this.saving = true;
    const avatar = this.avatars[this.selectedAvatar];
    this.consultant.gender = this.gender;


    const data = {
      avatar_uuid: avatar.avatar.uuid,
    };
    this.userService.setAvatar(data)
      .pipe(take(1))
      .subscribe((response: any) => {
        this.saving = false;
        this.consultant.avatar = response.data.avatar;
        console.log('consultan>>>', this.consultant)
        this.userService.consultant = this.consultant;

        this.toastr.success('Se ha guardado el avatar que seleccionaste', 'Exito');
      }, (error: any) => {
        this.toastr.error('Lo sentimos, ocurrió un error con el servidor', 'Error');
        console.log(error);
        this.saving = false;
      });
  }

}
