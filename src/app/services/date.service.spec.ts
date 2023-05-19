import { DateService } from './date.service';

describe('DateService', () => {
  let dateService: DateService;

  beforeEach(() => {
    dateService = new DateService();
  });

  describe('getStorageDate', () => {
    it('should return undefined for empty input', () => {
      const output = dateService.getStorageDate(undefined);
      expect(output).toBeFalsy();
    });

    it('should return undefined for invalid input', () => {
      const output = dateService.getStorageDate('2020-20-20');
      expect(output).toBeFalsy();
    });

    it('should return correct string for correct input', () => {
      const output = dateService.getStorageDate('2020-01-01');
      expect(output).toEqual('2020-01-01T00:00:00.000Z');
    });
  });

  describe('getStatus', () => {
    it(`should return 'Past due date' for past TODOs`, () => {
      const output = dateService.getStatus('2020-01-01');
      expect(output?.message).toBeTruthy();
      expect(output?.message).toEqual('Past due date');
    });

    it(`should return 'Due later' message for future TODOs`, () => {
      const output = dateService.getStatus('2099-01-01');
      expect(output?.message).toEqual('Due later');
    });

    it(`should return 'Due today' message for today's TODOs`, () => {
      const today = new Date();
      const output = dateService.getStatus(
        `${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
      );
      expect(output?.message).toEqual('Due today');
      expect(output?.remaining).toEqual(0);
    });

    it(`should return 'Due tomorrow' message for tomorrow's TODOs`, () => {
      const tomorrow = new Date(+new Date() + 24 * 60 * 60 * 1000);
      const output = dateService.getStatus(
        `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`
      );
      expect(output?.message).toEqual('Due tomorrow');
      expect(output?.remaining).toEqual(1);
    });

    it(`should return 'Due by next week' message for next week's TODOs`, () => {
      const nextWeek = new Date(+new Date() + 8 * 24 * 60 * 60 * 1000);
      const output = dateService.getStatus(
        `${nextWeek.getFullYear()}-${(nextWeek.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${nextWeek.getDate().toString().padStart(2, '0')}`
      );
      expect(output?.message).toEqual('Due by next week');
      expect(output?.remaining).toBeGreaterThanOrEqual(7);
    });
  });

  describe('getPerformance', () => {
    it(`should return 'ontime' for TODOs without completedon`, () => {
      const output = dateService.getPerformance(
        '2020-01-01T00:00:00.000Z',
        undefined
      );
      expect(output?.message).toBeTruthy();
      expect(output?.rating).toEqual('ontime');
      expect(output?.message).toEqual('Completed on time :-)');
    });

    it(`should return 'ontime' for TODOs with completedon within 1 day`, () => {
      const output = dateService.getPerformance(
        '2020-01-01T00:00:00.000Z',
        '2020-01-01T23:59:00.000Z'
      );
      expect(output?.message).toBeTruthy();
      expect(output?.rating).toEqual('ontime');
      expect(output?.message).toEqual('Completed on time :-)');
    });

    it(`should return 'delayed' for TODOs with completedon within 2 days`, () => {
      const output = dateService.getPerformance(
        '2020-01-01T00:00:00.000Z',
        '2020-01-02T23:59:00.000Z'
      );
      expect(output?.message).toBeTruthy();
      expect(output?.rating).toEqual('delayed');
      expect(output?.message).toEqual('Almost on time :-|');
    });

    it(`should return 'late' for TODOs with completedon more than 2 days`, () => {
      const output = dateService.getPerformance(
        '2020-01-01T00:00:00.000Z',
        '2020-01-03T23:59:00.000Z'
      );
      expect(output?.message).toBeTruthy();
      expect(output?.rating).toEqual('late');
      expect(output?.message).toEqual('Task was delayed :-(');
    });
  });
});
