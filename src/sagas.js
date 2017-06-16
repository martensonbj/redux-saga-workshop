import { call, put, takeEvery, all } from 'redux-saga/effects';


export function* testSaga() {
  console.log('Wired up!');
  yield 'WIRED UP!'
}

export function* getImageAsync(action) {
  console.log(action);
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
