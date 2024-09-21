import { legacy_createStore as createStore } from 'redux';
import Icon02 from '@assets/report-icon-02.png';
import Icon03 from '@assets/report-icon-03.png';
import Icon04 from '@assets/report-icon-04.png';
import Icon01 from '@assets/report-icon-01.png';
import Icon05 from '@assets/report-icon-05.png';

const initialState = {
  appList: [
    {
      icon: Icon02,
      code: 'INTERESTS',
      url: '/interests/home'
    },
    {
      icon: Icon03,
      code: 'COUPON',
      url: '/coupon/home'
    },
    {
      icon: Icon04,
      code: 'MARKETING',
      url: '/marketing/home'
    },
    {
      icon: Icon01,
      code: 'HUMAN',
      url: '/human/home'
    },
    {
      icon: Icon05,
      code: 'FINANCE',
      url: '/finance/home'
    }
  ],
  currentApp: undefined as {
    icon: string
    url: string
    code: string
    name: string
    description: string
  } | undefined
};
const reducer = (state = initialState, action: { type: string, payload?: any | undefined }) => {
  // const currentModule = ((window as any).appModules as any[]).find(it => it.url.startsWith('/' + window.location.pathname.split('/')[1]));
  switch (action.type) {
  case 'APP_LIST':
    return {
      ...state,
      appList: ((action.payload as any[]) || []).map(app => {
        const value = state.appList.find(it => it.code === app.code) || {};
        return {
          ...value,
          ...app,
          title: app.name,
          desc: app.description
        };
      })
    };
  case 'CURRENT':
    const path = '/' + window.location.pathname.split('/')[1];
    return {
      ...state,
      currentApp: state.appList.find(it => it.url.startsWith(path)) as {
        icon: string
        url: string
        code: string
        name: string
        description: string
      } | undefined
    };
  default:
    return state;
  }
};
export default createStore(reducer);
