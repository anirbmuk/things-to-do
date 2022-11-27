import { DisplayDatePipe } from './display-date.pipe';

describe('DisplayDatePipe', () => {
  it('should return correct display date', () => {
    const pipe = new DisplayDatePipe();
    const output = +pipe.transform('2022-12-31');
    expect(output).toEqual(+new Date('2022-12-31'));
  });
});
