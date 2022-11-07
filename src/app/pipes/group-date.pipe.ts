import { Pipe, PipeTransform } from '@angular/core';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
] as const;

@Pipe({
  name: 'tddGroupDate'
})
export class GroupDatePipe implements PipeTransform {
  transform(value: string | undefined | null): string | undefined {
    if (!value) {
      return;
    }
    const [year, month, day] = value.split('-');
    return day
      ? `${MONTHS[+month - 1]} ${day}, ${year}`
      : `${MONTHS[+month - 1]} ${year}`;
  }
}
