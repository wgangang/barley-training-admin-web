import React, { useState } from 'react';
import authApi from '@apis/auth-api';
import AppLayout, { App, UserInfo } from 'beer-assembly-biz/AppLayout';
import systemApi from '@apis/system-api';
import { MenuDataItem } from '@ant-design/pro-components';
import { Outlet, useNavigate } from 'react-router-dom';

const pathPartition: string[] = (sessionStorage.getItem('DETAIL_PARTITION') || '') === ''
  ? ['CREATE', 'EDIT', 'AUDIT', 'PREVIEW', 'DETAIL', 'READ', 'IN', 'INPUT', 'OUTPUT']
  : JSON.parse(sessionStorage.getItem('DETAIL_PARTITION') || '[]');
export default () => {
  const navigate = useNavigate();
  const [app] = useState({
    key: '0',
    name: '智能培训系统',
    description: '',
    icon: '/douyin.png'
  } as App);
  const [apps] = useState([app] as App[]);
  return (
    <>
      <AppLayout
        app={app}
        apps={apps}
        logo={{
          path: '/logo.png'
        }}
        path={window.location.pathname}
        pathPartition={pathPartition}
        requestUser={async () => {
          const result = await authApi.getUserInfo<UserInfo>();
          return result.data;
        }}
        requestMenus={async () => {
          const result = await systemApi.getTreeMenus<MenuDataItem[]>();
          return result.data;
        }}
        toLink={(path) => {
          navigate(path);
        }}>
        <Outlet/>
      </AppLayout>
    </>
  );
};
