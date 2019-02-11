import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AgmMap, MapsAPILoader} from '@agm/core';
import {Subject} from 'rxjs';
import {BsModalRef} from 'ngx-bootstrap';
import {AddressPoint} from '../../interfaces/address-point.interface';

declare var google: any;

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorComponent implements OnInit {


  public location: any = {
    lat: 19.4296344,
    lng: -99.1764823,
    zoom: 13
  };
  public marker: any = {
    lat: 19.4296344,
    lng: -99.1764823,
    draggable: true
  };
  public autoComplete: any;
  public autoCompleteInput: any;
  private geoCoder: any;
  public fullAddress: string;
  private formattedAddress: string;
  public searchSucceded: boolean;
  public onClose: Subject<any>;


  @ViewChild(AgmMap) map: AgmMap;

  constructor(public mapsApiLoader: MapsAPILoader, private ngZone: NgZone, private _bsModalRef: BsModalRef) {
    this.searchSucceded = false;

    this.mapsApiLoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.setSearchBox();
    });
  }


  ngOnInit() {
    this.onClose = new Subject();
    this.marker.draggable = true;
  }

  private setSearchBox() {

    const options = {
      componentRestrictions: {
        country: 'mx',
      }
    };

    this.autoCompleteInput = document.getElementById('fullAddress');
    this.autoComplete = new google.maps.places.Autocomplete(this.autoCompleteInput, options);

    this.autoComplete.addListener('place_changed', () => {

      this.ngZone.run(() => {
        const place = this.autoComplete.getPlace();
        console.log(place);

        if (!place.geometry) {
          alert('No hay detalles para: ' + place.name);
          return;
        }

        this.searchSucceded = true;
        this.location.lat = place.geometry.location.lat();
        this.location.lng = place.geometry.location.lng();
        this.location.zoom = 17;
        this.marker.lat = place.geometry.location.lat();
        this.marker.lng = place.geometry.location.lng();
        this.formattedAddress = place.formatted_address;
      });

    });
  }

  mapClicked(m: any) {
    this.marker.lat = m.coords.lat;
    this.marker.lng = m.coords.lng;
    this.location.lat = m.coords.lat;
    this.location.lng = m.coords.lng;
    this.findAddressByCoordinates();
  }

  markerDragEnd(m: any) {
    this.marker.lat = m.coords.lat;
    this.marker.lng = m.coords.lng;
    this.location.lat = m.coords.lat;
    this.location.lng = m.coords.lng;
    this.findAddressByCoordinates();
  }

  findAddressByCoordinates() {
    this.geoCoder.geocode({
      'location': {
        lat: this.location.lat,
        lng: this.location.lng
      }
    }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.searchSucceded = true;
        this.fullAddress = results[0].formatted_address;
        this.formattedAddress = results[0].formatted_address;
      }
    });
  }

  public onConfirm(): void {
    const location: AddressPoint = {
      latitude: this.location.lat,
      longitude: this.location.lng
    };
    const response = {
      accepted: true,
      addressPoint: location,
      lat: this.location.lat,
      lng: this.location.lng,
      formattedAddress: this.formattedAddress
    };
    this.onClose.next(response);
    this._bsModalRef.hide();
  }

  public onCancel(): void {
    const response = {
      accepted: false
    };
    this.onClose.next(response);
    this._bsModalRef.hide();
  }

}
