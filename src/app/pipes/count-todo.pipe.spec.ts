import { CountTodoPipe } from './count-todo.pipe';

describe('CountTodoPipe', () => {
  let pipe: CountTodoPipe;

  beforeEach(() => (pipe = new CountTodoPipe()));

  it('should return correct singluar/plural TODO count for defined values', () => {
    let output = pipe.transform(1);
    expect(output).toEqual('1 pending TODO');

    output = pipe.transform(10);
    expect(output).toEqual('10 pending TODOs');
  });

  it('should return correct message for undefined values', () => {
    let output = pipe.transform(0);
    expect(output).toBeFalsy();

    output = pipe.transform(0, true);
    expect(output).toEqual('All caught up ✔');

    output = pipe.transform(null);
    expect(output).toBeFalsy();

    output = pipe.transform(null, true);
    expect(output).toEqual('All caught up ✔');

    output = pipe.transform(-1);
    expect(output).toBeFalsy();

    output = pipe.transform(-1, true);
    expect(output).toEqual('All caught up ✔');
  });
});
