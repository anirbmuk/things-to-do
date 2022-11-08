import { Injectable } from '@angular/core';
import { ITodo } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  getStorageDate(date: string | undefined): string | undefined {
    if (!date) {
      return;
    }
    const now = new Date(date);
    return now.toISOString();
  }

  getStatus(date: number): ITodo['additional'] | undefined {
    const now = Date.now();
    if (date < now) {
      return {
        state: 'error',
        message: 'Past due date'
      };
    }
    const remaining = Math.ceil((date - now) / (24 * 60 * 60 * 1000));
    if (remaining === 1) {
      return {
        state: 'warn',
        message: 'Due tomorrow'
      };
    } else if (remaining > 1 && remaining < 7) {
      return {
        state: 'warn',
        message: `Due in ${remaining} days`
      };
    } else if (remaining >= 7 && remaining < 14) {
      return {
        state: 'info',
        message: `Due by next week`
      };
    }
    return;
  }
}
