import { GroupDatePipe } from './group-date.pipe';

describe('GroupDatePipe', () => {
  it('should return falsy value when input is undefined', () => {
    const pipe = new GroupDatePipe();
    const output = pipe.transform(undefined);
    expect(output).toBeFalsy();
  });

  it('should return correct grouped dates', () => {
    const pipe = new GroupDatePipe();
    const outputWithDay = pipe.transform('2022-10-31');
    expect(outputWithDay).toEqual('Oct 31, 2022');

    const outputWithoutDay = pipe.transform('2022-10');
    expect(outputWithoutDay).toEqual('Oct 2022');
  });
});
