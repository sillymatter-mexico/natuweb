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
  public newAssists: any[];
  public loading: boolean;

  constructor(private _bsModalRef: BsModalRef,
              private workshopService: WorkshopService,
              private toastr: ToastrService) {
    this.showAddInput = false;
    this.loading = false;
  }

  ngOnInit() {
    // this.fetchAssists();
    this.newAssists = this.assists.slice();
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  toggleAddInput() {
    this.showAddInput = true;
  }

  toggleSelection(assist) {
    let index = this.assists.findIndex(x => x.name === assist.name)
    console.log('entro!', assist, index)
    if (index > -1){
      this.assists[index].check_in = false
      this.newAssists.splice(index, 1)
    }
    else {
      this.assists[index].check_in = true
      this.newAssists.push(assist)
    }
  }

  onAddCN() {
    this.loading = true;
    this.workshopService.searchStaff(this.workshop.uuid, this.addInput)
      .subscribe((response: any) => {
        response.map((assist) => {
          this.assists.push({consultant: assist, check_in: false})
          this.newAssists.push({consultant: assist, check_in: false})
          this.addInput = undefined;
          this.loading = false;
        })
      })
  }

  onSaveCheckin() {
    this.loading = true;
    let cn_list = ""
    this.newAssists.map((assist, idx) => {
      cn_list += `${assist.consultant.cn_code},${assist.consultant.full_name}${this.newAssists.length - 1 === idx  ? null : '|'}`
    });
    const data = {
      cn_list: cn_list
    };

    this.workshopService.saveCheckins(data, this.workshop.uuid)
      .subscribe((response: any) => {
        for (const assist of this.newAssists) {
          const newAssist = response.find(x => +x.cn === +assist.cn);
          if (newAssist) {
            assist.name = newAssist.consultant.full_name;
            assist.career_level = newAssist.consultant.career_level.code;
            assist.checkin = newAssist.checkin;
          }
        }
        this.workshop.assists = this.newAssists;
        this.loading = false;
        this.toastr.success('¡Las asistencias se han guardado correctamente!');
      }, (error: any) => {
        console.log(error);
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error al guardar las asistencoas');
      });
  }

}
