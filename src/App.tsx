import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

const HomePage = lazy(() => import('@pages/HomePage'));

const DeviceInfoPage = lazy(() => import('@pages/DeviceInfoPage'));
const DeviceInfoDetailPage = lazy(() => import('@pages/detail/DeviceInfoDetailPage'));

const ClassroomPage = lazy(() => import('@pages/ClassroomPage'));
const ClassroomPageDetailPage = lazy(() => import('@pages/detail/ClassroomPageDetailPage'));

const ClassroomReservationPage = lazy(() => import('@pages/ClassroomReservationPage'));
const ClassroomReservationDetailPage = lazy(() => import('@pages/detail/ClassroomReservationDetailPage'));

const TeacherPage = lazy(() => import('@pages/TeacherPage'));
const TeacherDetailPage = lazy(() => import('@pages/detail/TeacherDetailPage'));
const TeacherTitlePage = lazy(() => import('@pages/TeacherTitlePage'));
const TeacherCertificatePage = lazy(() => import('@pages/TeacherCertificatePage'));
const TeacherEvaluationPage = lazy(() => import('@pages/TeacherEvaluationPage'));
const TeacherEvaluationDetailPage = lazy(() => import('@pages/detail/TeacherEvaluationDetailPage'));

const ProjectPage = lazy(() => import('@pages/ProjectPage'));
const ProjectClassPage = lazy(() => import('@pages/ProjectClassPage'));
const CoursePage = lazy(() => import('@pages/CoursePage'));
const CourseSupervisionPage = lazy(() => import('@pages/CourseSupervisionPage'));
const CourseSignPage = lazy(() => import('@pages/CourseSignPage'));
const CourseTeacherPricePage = lazy(() => import('@pages/CourseTeacherPricePage'));
const ProjectFundsPage = lazy(() => import('@pages/ProjectFundsPage'));
const ProjectFundsFlowPage = lazy(() => import('@pages/ProjectFundsFlowPage'));
const ProjectFundsSettlementPage = lazy(() => import('@pages/ProjectFundsSettlementPage'));

const ProjectVideoPage = lazy(() => import('@pages/ProjectVideoPage'));
const ProjectClassroomVisitPage = lazy(() => import('@pages/ProjectClassroomVisitPage'));
const ProjectStudentStudyPage = lazy(() => import('@pages/ProjectStudentStudyPage'));
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
          <Route path="/device-info" element={<Suspense><DeviceInfoPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><DeviceInfoDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><DeviceInfoDetailPage/></Suspense>}/>
          </Route>
          {/*教室*/}
          <Route path="/classroom" element={<Suspense><ClassroomPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><ClassroomPageDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><ClassroomPageDetailPage/></Suspense>}/>
          </Route>
          <Route path="/classroom-reservation" element={<Suspense><ClassroomReservationPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><ClassroomReservationDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><ClassroomReservationDetailPage/></Suspense>}/>
          </Route>
          {/*教师*/}
          <Route path="/teacher" element={<Suspense><TeacherPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><TeacherDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><TeacherDetailPage/></Suspense>}/>
          </Route>
          <Route path="/teacher-title" element={<Suspense><TeacherTitlePage/></Suspense>}></Route>
          <Route path="/teacher-certificate" element={<Suspense><TeacherCertificatePage/></Suspense>}></Route>
          <Route path="/teacher-evaluation" element={<Suspense><TeacherEvaluationPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><TeacherEvaluationDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><TeacherEvaluationDetailPage/></Suspense>}/>
          </Route>
          {/*项目*/}
          <Route path="/project" element={<Suspense><ProjectPage/></Suspense>}></Route>
          <Route path="/project-class" element={<Suspense><ProjectClassPage/></Suspense>}></Route>
          <Route path="/course" element={<Suspense><CoursePage/></Suspense>}></Route>
          <Route path="/course-supervision" element={<Suspense><CourseSupervisionPage/></Suspense>}></Route>
          <Route path="/course-sign" element={<Suspense><CourseSignPage/></Suspense>}></Route>
          <Route path="/course-teacher-price" element={<Suspense><CourseTeacherPricePage/></Suspense>}></Route>
          <Route path="/project-funds" element={<Suspense><ProjectFundsPage/></Suspense>}></Route>
          <Route path="/project-funds-flow" element={<Suspense><ProjectFundsFlowPage/></Suspense>}></Route>
          <Route path="/project-funds-settlement" element={<Suspense><ProjectFundsSettlementPage/></Suspense>}></Route>
          {/*统计*/}
          <Route path="/project-video" element={<Suspense><ProjectVideoPage/></Suspense>}></Route>
          <Route path="/project-classroom-visit" element={<Suspense><ProjectClassroomVisitPage/></Suspense>}></Route>
          <Route path="/project-student-study" element={<Suspense><ProjectStudentStudyPage/></Suspense>}></Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </div>;
};
export default App;
