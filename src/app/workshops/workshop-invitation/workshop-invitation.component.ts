import {Component, Injector, OnInit} from '@angular/core';
import {WorkshopService} from '../../services/workshop.service';
import {BsModalRef} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ServerService} from '../../services/server.service';

@Component({
  selector: 'app-workshop-invitation',
  templateUrl: './workshop-invitation.component.html',
  styleUrls: ['./workshop-invitation.component.scss']
})
export class WorkshopInvitationComponent implements OnInit {

  public workshop: any;
  public loading: boolean;
  public modal: boolean;
  public shareURL: string;
  public showShare: boolean;
  public _url: string;
  public workshopType: any;

  constructor(private workshopService: WorkshopService,
              public serverService: ServerService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private injector: Injector) {
    this.loading = false;
    this.modal = false;
    this.showShare = false;
    this._url = this.serverService.url;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.fetchWorkshop(id);
      } else {
        this.fetchWorkshop(this.workshop.uuid);
      }
    });
  }

  getMapsURI() {
    return 'https://maps.google.com/?q=' + encodeURI(this.workshop.position_string);
  }

  closeModal() {
    const bsModalRef = this.injector.get(BsModalRef);
    bsModalRef.hide();
  }

  public toggleShare() {
    this.showShare = !this.showShare;
  }

  fetchWorkshop(id: string) {
    this.loading = true;
    this.workshopService.getWorkshop(id)
      .subscribe((response: any) => {
        this.workshop = response;
        this.workshopType = this.workshopService.getWorkshopTypeByNameAlias(response.name_workshop.type_workshop.name_workshop);
        this.workshop.type_workshop = this.workshopType.name;
        this.workshop.image = this.workshopType ? this.workshopType.picture : ''
        this.shareURL = window.location.origin + '/talleres/invitacion/' + this.workshop.uuid;
        this.loading = false;
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Lo sentimos, ocurrió un error al cargar detalles del taller');
        this.loading = false;
      });
  }

}
