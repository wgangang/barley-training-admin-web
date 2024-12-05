import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import './index.less';
import { Provider } from 'react-redux';
import store from '@/store';
import App from '@/App';

declare const window: { __POWERED_BY_QIANKUN__: any };
const APP_NAME = 'barley-training-admin-web';

let root: Root | undefined;
const render = (props: any) => {
  const { container } = props;
  root = ReactDOM.createRoot(
    container ? container.querySelector('#root') : document.querySelector('#root')
  );
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App/>
      </Provider>
    </React.StrictMode>
  );
};

// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[MicroAPP] Bootstrap: ' + APP_NAME);
}

export async function mount(props: any) {
  console.log('[MicroAPP] Mount: ' + APP_NAME);
  render(props);
}

export async function unmount(_props: any) {
  console.log('[MicroAPP] UnMount: ' + APP_NAME);
  root?.unmount();
}
