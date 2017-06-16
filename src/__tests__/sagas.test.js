import { takeEvery } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';

import { requestImage, setImage, catchError } from '../actions';
import { fetchImage } from '../fetch';

import { testSaga, getImageAsync, watchGetImage } from '../sagas';

describe('test saga', () => {

  it('calls the test saga function', () => {
    const generator = testSaga();
    const testValue = generator.next().value;

    expect(testValue).toEqual('WIRED UP!');
  });
});

describe('getImageAsync', () => {
  it('handles a successful function', () => {
    const generator = getImageAsync();

    const data = { hdurl: 'some url', explanation: 'stuff and things', title: 'words', }

    expect(generator.next().value).toEqual(put(requestImage()));
    expect(generator.next().value).toEqual(call(fetchImage));
    expect(generator.next(data).value).toEqual(put(setImage(data)))
  });

  it('handles an unsuccessful function', () => {
    const generator = getImageAsync();

    const error = {
      code: 'BROKE STUFF'
    }

    expect(generator.next().value).toEqual(put(requestImage()));
    expect(generator.next().value).toEqual(call(fetchImage));
    expect(generator.next(error).value).toEqual(put(catchError(error)))
  });
});
