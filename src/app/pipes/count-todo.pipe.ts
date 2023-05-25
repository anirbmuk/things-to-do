import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'tddCountTodo'
})
export class CountTodoPipe implements PipeTransform {
  private ending = 'pending TODO';

  transform(value: number | null | undefined, text = false): string {
    if (!value || value < 0) {
      return text ? 'All caught up ✔' : '';
    }
    if (value === 1) {
      return `1 ${this.ending}`;
    }
    return `${value} ${this.ending}s`;
  }
}
