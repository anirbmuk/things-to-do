import { Injectable } from '@angular/core';
import { ITodo } from './../models';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  getStorageDate(date: string | undefined): string | undefined {
    if (!date) {
      return;
    }
    try {
      const dateObject = new Date(date);
      return dateObject.toISOString();
    } catch (error) {
      console.error(`Invalid date input: '${date}'`);
      return;
    }
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
    const nextMonth =
      formattedDueDate.getMonth() - formattedNowDate.getMonth() === 1 &&
      formattedDueDate.getFullYear() >= formattedNowDate.getFullYear();
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
        message: 'Due by next week',
        remaining
      };
    } else if (remaining >= 14 && nextMonth) {
      return {
        state: 'safe',
        message: 'Due next month',
        remaining
      };
    }
    return {
      remaining
    };
  }

  getPerformance(
    duedate: string,
    completeddate: string | undefined
  ): ITodo['performance'] | undefined {
    if (!completeddate) {
      return;
    }

    const dueDate = new Date(duedate);
    const completedDate = new Date(completeddate);

    const formattedDueDateString = `${dueDate.getFullYear()}-${(
      dueDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${dueDate
      .getDate()
      .toString()
      .padStart(2, '0')}T00:00:00.000Z`;
    const formattedDueDate = new Date(formattedDueDateString);

    const formattedcompletedDateString = `${completedDate.getFullYear()}-${(
      completedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${completedDate
      .getDate()
      .toString()
      .padStart(2, '0')}T00:00:00.000Z`;
    const formattedcompletedDate = new Date(formattedcompletedDateString);

    const variation =
      Math.round(+formattedcompletedDate - +formattedDueDate) /
      (24 * 60 * 60 * 1000);
    return this.getRating(variation);
  }

  getCurrentFormDateTime(date: string | undefined): string | undefined {
    if (!date) {
      const currentDate = new Date();
      const yyyy = currentDate.getFullYear();
      const mm = `${currentDate.getMonth() + 1}`.padStart(2, '0');
      const dd = `${currentDate.getDate() + 1}`.padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T12:00:00`;
    } else {
      const currentDate = new Date(date);
      const yyyy = currentDate.getFullYear();
      const mm = `${currentDate.getMonth() + 1}`.padStart(2, '0');
      const dd = `${currentDate.getDate()}`.padStart(2, '0');
      const HH = `${currentDate.getHours()}`.padStart(2, '0');
      const MM = `${currentDate.getMinutes()}`.padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T${HH}:${MM}:00`;
    }
  }

  getStorageFormDateTime(date?: string | undefined): string {
    let now = new Date();
    if (date) {
      now = new Date(date);
    }
    return now.toISOString();
  }

  getMinDate() {
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    const dd = `${currentDate.getDate()}`.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T00:00:00`;
  }

  isDateInvalid(inputDateString: string, minDateString: string): boolean {
    const inputDate = +new Date(inputDateString);
    const minDate = +new Date(minDateString);
    return inputDate < minDate;
  }

  getRating(variation: number): ITodo['performance'] {
    if (variation < 0) {
      return {
        variation,
        rating: 'beforetime',
        message: 'Completed before due date :-)'
      };
    } else if (variation < 1) {
      return {
        variation,
        rating: 'ontime',
        message: 'Completed on time :-)'
      };
    }
    return {
      variation,
      rating: 'late',
      message: 'Task was delayed :-('
    };
  }
}
