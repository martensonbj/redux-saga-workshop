import { call, put, takeEvery, all } from 'redux-saga/effects';
import { catchError, requestImage, setImage } from './actions'
import { fetchImage } from './fetch'

export function* testSaga() {
  console.log('Wired up!');
  yield 'WIRED UP!'
}

export function* getImageAsync(action) {
  console.log(action);
  yield put(requestImage())
  const data = yield call(fetchImage);
  if (data && !data.error) {
    yield put(setImage(data))
  } else {
    yield put(catchError(data))
  }
}

export function* watchGetImage() {
  yield takeEvery('INITIALIZE_IMAGE_SAGA', getImageAsync);
}

export default function* rootSaga() {
  yield all([
    testSaga(),
    watchGetImage(),
  ]);
}

const gen = getImageAsync();
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
