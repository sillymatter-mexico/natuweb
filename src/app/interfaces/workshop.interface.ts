import {AddressPoint} from './address-point.interface';

export interface Workshop {
  id?: number;
  id_name: number; // id only
  name: string; // string
  description: string; // string
  start_date: string; // TZ date string. Example: 2018-10-12T13:00:00Z
  specialist?: number; // id only
  sede?: string; // string
  duration: number; // in minutes
  address_point?: AddressPoint; // Object with latitude and longitude
  address_string?: string; // string
  private?: boolean; // boolean not implemented yet
  [propName: string]: any; // for extra properties
}
