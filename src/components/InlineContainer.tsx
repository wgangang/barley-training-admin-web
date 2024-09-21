import React, { FC } from 'react';
import { App, ConfigProvider } from 'antd';

export declare type InlineContainer = {
  children?: React.ReactNode
};
export const Component: FC<InlineContainer> = (props) => {

  return <App>
    <ConfigProvider theme={{
      token: {
        fontSize: 12,
        controlHeight: 30,
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
        }
      }
    }}>
      {props?.children}
    </ConfigProvider>
  </App>;
};

export default Component;
