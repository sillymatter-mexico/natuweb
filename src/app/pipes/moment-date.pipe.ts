import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentDate'
})

export class MomentDatePipe implements PipeTransform {
  transform(value: string, format: string): string {
    moment.locale('es');
    const momentDate = moment(new Date(value));
    if (momentDate.isValid()) {
      return moment(value).utc().format(format);
    } else {
      return value;
    }
  }
}
