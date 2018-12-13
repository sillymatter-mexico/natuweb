import {Component, OnInit, ɵConsole} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-workshop-checkin',
  templateUrl: './workshop-checkin.component.html',
  styleUrls: ['./workshop-checkin.component.scss']
})
export class WorkshopCheckinComponent implements OnInit {

  public workshop: any;
  public checkin: boolean;
  public showAddInput: boolean;
  public addInput: number;
  public assists: any[];
  public loading: boolean;

  constructor(private _bsModalRef: BsModalRef,
              private workshopService: WorkshopService,
              private toastr: ToastrService) {
    this.showAddInput = false;
    this.loading = false;
  }

  ngOnInit() {
    this.assists = [...this.workshop.assists];
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  toggleAddInput() {
    this.showAddInput = true;
  }

  onAddCN() {
    const assist = {
      cn: String(this.addInput),
      checkin: true
    };
    if (!this.assists.some(x => +x.cn === +this.addInput)) {
      this.assists.push(assist);
    }
    this.addInput = undefined;
  }

  onSaveCheckin() {
    this.loading = true;
    const data = {
      workshop_ids: this.workshop.id,
      cn_code: []
    };

    for (const assist of this.assists) {
      const element = [assist.cn, assist.checkin];
      data.cn_code.push(element);
    }

    console.log(data);

    this.workshopService.saveCheckins(data)
      .subscribe((response: any) => {
        console.log('response', response);
        for (const assist of this.assists) {
          const newAssist = response.assists.find(x => +x.cn === +assist.cn);
          if (newAssist) {
            assist.name = newAssist.name;
            assist.career_level = newAssist.career_level;
            assist.checkin = newAssist.checkin;
          }
        }
        this.workshop.assists = this.assists;
        this.loading = false;
        this.toastr.success('¡Las asistencias se han guardado correctamente!');
      }, (error: any) => {
        console.log(error);
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error al guardar las asistencoas');
      });
  }

}
