import {Component, Input, OnInit} from '@angular/core';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {WorkshopMassiveCreatedComponent} from '../../workshops/workshop-massive-created/workshop-massive-created.component';

@Component({
  selector: 'app-massive-upload',
  templateUrl: './massive-upload.component.html',
  styleUrls: ['./massive-upload.component.scss']
})
export class MassiveUploadComponent implements OnInit {

  @Input() public downloadUrl: string;
  @Input() public uploadName: string;
  @Input() public serviceUrl: string;
  public selectedFile: File;
  public nameFile: string;
  private createdWorkshopModal: BsModalRef;

  constructor(private workshopService: WorkshopService, private toastr: ToastrService, private modalService: BsModalService,) {
    this.selectedFile = null;
  }

  ngOnInit() {
  }

  downloadFile() {
    window.open(this.downloadUrl, '_blank');
  }

  onFileSelected(event) {
    this.nameFile = event.target.files[0].name
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload() {
    this.toastr.success('Se ha subido la lista de ' + this.uploadName);
    // this.selectedFile = null;
    console.log(this.selectedFile)
    const fd = new FormData();
    fd.append('file', this.selectedFile, 'asistencias');
    this.workshopService.uploadWorkshopList(this.serviceUrl, fd)
      .subscribe((data: any) => {
        this.toastr.success('Se ha subido la lista de ' + this.uploadName);
        const initialState = {
          workshop: data,
          confirmName: this.uploadName,
          assistance: this.uploadName === 'asistencias'
        };
        this.createdWorkshopModal = this.modalService.show(WorkshopMassiveCreatedComponent, {initialState});
        this.selectedFile = null;
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Ocurrió un error al subir la lista de ' + this.uploadName);
        this.selectedFile = null;
      });

  }

}
