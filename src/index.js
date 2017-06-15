import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers';
import './styles.css';

import { getImage } from './actions';


const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  ),
);

store.dispatch(getImage());

render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
