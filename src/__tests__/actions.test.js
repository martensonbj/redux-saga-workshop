import * as actions from '../actions';

describe('actionCreators', () => {
  it('getImage should return INITIALIZE IMAGE SAGA type', () => {
    const expected = { type: 'INITIALIZE_IMAGE_SAGA' };
    expect(actions.getImage()).toEqual(expected);
  });

  it('catchError should return ERROR type with an error', () => {
    const expected = { type: 'ERROR', error: 'hello' };
    expect(actions.catchError('hello')).toEqual(expected);
  });
});
