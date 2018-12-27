import { Component, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-general-modal-alert',
  templateUrl: './general-modal-alert.component.html',
  styleUrls: ['./general-modal-alert.component.scss']
})


export class GeneralModalAlertComponent implements OnInit {

  public messages: string;

  constructor(private _bsModalRef: BsModalRef,
              private router: Router) {
  }

  ngOnInit() {
  }

  onClose() {
    this._bsModalRef.hide();
  }

}
