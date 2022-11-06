import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tddDisplayDate'
})
export class DisplayDatePipe implements PipeTransform {
  transform(value: string): Date {
    if (!value) {
      return new Date();
    }
    return new Date(value);
  }
}
