import React from 'react';
import AuthLayout from 'beer-assembly-biz/auth/AuthStyle02';
import authApi from '@apis/auth-api';

export default () => {
  return (
    <>
      <AuthLayout
        colorPrimary="#1677ff"
        logo={{
          path: '/logo.png'
          // height: 42
        }}
        description="智能培训系统"
        copyright=""
        systemLogin={async (params) => {
          return authApi.login(params);
        }}
        sliderToken={{
          colorPrimary: '#1677ff',
          colorBar: '#1677ff',
          boxShadow: 'rgba(92, 157, 255, 0.55)',
          gradient: [
            '#5C9DFF',
            '#1677ff'
          ]
        }}
      />
    </>
  );
};
