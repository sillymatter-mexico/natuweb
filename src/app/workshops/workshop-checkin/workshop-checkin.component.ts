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
    // this.fetchAssists();
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  toggleAddInput() {
    this.showAddInput = true;
  }

  onAddCN() {
    this.loading = true;
    this.workshopService.searchStaff(this.workshop.uuid, this.addInput)
      .subscribe((response: any) => {
        response.map((assist) => {
          this.assists.push({consultant: assist, checkin: true})
          this.addInput = undefined;
          this.loading = false;
        })
      })
  }

  onSaveCheckin() {
    console.log(this.assists)
    this.loading = true;
    let cn_list = ""
    for (const assist of this.assists) {
      this.assists.map((assist, idx) => {
        cn_list += `${assist.consultant.cn_code},${assist.consultant.full_name}${idx + 1 === this.assists.length ? null : '|'}`
      });
    }
    const data = {
      cn_list: cn_list
    };

    console.log(data);
    this.workshopService.saveCheckins(data, this.workshop.uuid)
      .subscribe((response: any) => {
        for (const assist of this.assists) {
          const newAssist = response.find(x => +x.cn === +assist.cn);
          if (newAssist) {
            assist.name = newAssist.consultant.full_name;
            assist.career_level = newAssist.consultant.career_level.code;
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
