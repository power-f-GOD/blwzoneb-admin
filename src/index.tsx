import ReactDOM from 'react-dom';

import { StylesProvider } from '@material-ui/styles';

import './styles/index.scss';

import App from './App';
import AppContextsProvider from './App.Contexts';

export const userDeviceIsMobile = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(
  window.navigator.userAgent
);

export const isMac = /Mac(\s?OS)?/i.test(window.navigator.userAgent);

if (userDeviceIsMobile) {
  document.body.classList.add('mobile');
} else {
  document.body.classList.add('desktop');
  document.body.classList.add(isMac ? 'is-mac' : 'is-pc');
}

ReactDOM.render(
  <StylesProvider injectFirst>
    <AppContextsProvider>
      <App />
    </AppContextsProvider>
  </StylesProvider>,
  document.querySelector('#root') || document.createElement('div')
);
