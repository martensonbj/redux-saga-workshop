import reducer from '../reducers/image.js';
import * as actions from '../actions';

const initialState = {
  loading: false,
  error: null,
  data: {
    explanation: '',
    hdurl: '',
    title: ''
  },
};

describe('image reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('type ERROR', () => {
    const error = 'Something went wrong';
    const action = actions.catchError(error);
    const expected = {
      loading: false,
      error: error,
      data: {explanation: '', hdurl: '', title: ''},
    };

    expect(reducer(undefined, action)).toEqual(expected);
  });

});
