import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Intro from './pages/Intro';
import * as serviceWorker from './serviceWorker';
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import  './i18n';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Intro />
      <ToastContainer />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
