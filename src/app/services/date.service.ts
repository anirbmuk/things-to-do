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

  getStatus(date: string): ITodo['additional'] | undefined {
    const now = new Date();
    const duedate = new Date(date);

    const formattedNow = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now
      .getDate()
      .toString()
      .padStart(2, '0')}T00:00:00.000Z`;
    const formattedNowDate = new Date(formattedNow);

    const formattedDue = `${duedate.getFullYear()}-${(duedate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${duedate
      .getDate()
      .toString()
      .padStart(2, '0')}T00:00:00.000Z`;
    const formattedDueDate = new Date(formattedDue);

    if (+formattedDueDate < +formattedNowDate) {
      return {
        state: 'error',
        message: 'Past due date',
        remaining: undefined
      };
    }

    const remaining = Math.round(
      (+formattedDueDate - +formattedNowDate) / (24 * 60 * 60 * 1000)
    );
    if (remaining === 0) {
      return {
        state: 'warn',
        message: 'Due today',
        remaining
      };
    } else if (remaining === 1) {
      return {
        state: 'warn',
        message: 'Due tomorrow',
        remaining
      };
    } else if (remaining > 1 && remaining < 7) {
      return {
        state: 'warn',
        message: `Due in ${remaining} days`,
        remaining
      };
    } else if (remaining >= 7 && remaining < 14) {
      return {
        state: 'info',
        message: `Due by next week`,
        remaining
      };
    }
    return {
      remaining
    };
  }
}
