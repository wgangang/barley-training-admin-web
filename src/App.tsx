import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DataPage from '@pages/DataPage';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

const HomePage = lazy(() => import('@pages/HomePage'));

const App: FC = () => {
  return <div>
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        borderRadius: 4,
        fontSize: 13,
        controlHeight: 30,
        padding: 12,
        fontWeightStrong: 500
      },
      components: {
        Table: {
          motion: false,
          headerColor: '#333',
          rowHoverBg: '#f5f6f7',
          rowSelectedBg: '#f4f5f6',
          rowSelectedHoverBg: '#e6e7e8',
          headerBg: '#fafafa',
          cellPaddingInlineSM: 6,
          cellPaddingBlockSM: 7
        },
        Form: {
          verticalLabelPadding: '0 0 6px 0'
        },
        Input: {},
        Button: {
          paddingInline: '12px 4px'
        },
        Tooltip: {}
      }
    }} locale={zhCN}>
      <BrowserRouter basename={process.env.ROUTE_BASE || ''}>
        <Routes>
          <Route path="/home" element={<Suspense><HomePage/></Suspense>}></Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </div>;
};
export default App;
