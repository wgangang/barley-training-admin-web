import React from 'react';
import AuthLayout from 'beer-assembly-biz/auth/AuthStyle02';
import authApi from '@apis/auth-api';
import { Slider } from 'beer-assembly/SliderCode';

export default () => {
  return (
    <>
      <AuthLayout
        colorPrimary="#1677ff"
        logo={{
          path: '/logo.png',
          height: 28
        }}
        description="大麦教培"
        copyright=""
        requestSlider={async () => {
          const result = await authApi.getSliderImageCode<Slider>();
          return result?.data;
        }}
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
