import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

const HomePage = lazy(() => import('@pages/HomePage'));

const DeviceInfoPage = lazy(() => import('@pages/DeviceInfoPage'));

const ClassroomPage = lazy(() => import('@pages/ClassroomPage'));
const ClassroomReservationPage = lazy(() => import('@pages/ClassroomReservationPage'));

const TeacherPage = lazy(() => import('@pages/TeacherPage'));
const TeacherTitlePage = lazy(() => import('@pages/TeacherTitlePage'));
const TeacherCertificatePage = lazy(() => import('@pages/TeacherCertificatePage'));
const TeacherEvaluationPage = lazy(() => import('@pages/TeacherEvaluationPage'));

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
          {/*设备*/}
          <Route path="/device-info" element={<Suspense><DeviceInfoPage/></Suspense>}></Route>
          {/*教室*/}
          <Route path="/classroom" element={<Suspense><ClassroomPage/></Suspense>}></Route>
          <Route path="/classroom-reservation" element={<Suspense><ClassroomReservationPage/></Suspense>}></Route>
          {/*教师*/}
          <Route path="/teacher" element={<Suspense><TeacherPage/></Suspense>}></Route>
          <Route path="/teacher-title" element={<Suspense><TeacherTitlePage/></Suspense>}></Route>
          <Route path="/teacher-certificate" element={<Suspense><TeacherCertificatePage/></Suspense>}></Route>
          <Route path="/teacher-evaluation" element={<Suspense><TeacherEvaluationPage/></Suspense>}></Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </div>;
};
export default App;
