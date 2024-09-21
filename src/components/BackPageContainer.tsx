import React, { FC } from 'react';
import { css } from '@emotion/css';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';

export declare type BackPageContainerProps = {
  title?: string | undefined
  children?: React.ReactNode | undefined
};
export const Component: FC<BackPageContainerProps> = (props) => {
  const navigate = useNavigate();
  return <>
    <PageContainer
      onBack={() => {
        navigate(-1);
      }}
      className={css`
          .ant-page-header-heading {
              padding-block-start: 0 !important;
          }

          .ant-page-header-heading-title {
              font-size: 15px;
              line-height: 1.5;
              color: #333;
          }
      `}
      header={{
        style: {
          background: '#fff',
          padding: '10px 24px 10px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }
      }}
      title={props.title}
      ghost={true}
      childrenContentStyle={{
        padding: '0'
      }}
    >
      <div className={css`
          padding: 12px 16px;
      `}>
        {props.children}
      </div>
    </PageContainer>
  </>;
};

export default Component;

// {
//         size: 'small',
//         tabBarStyle: {
//           margin: '0'
//         }
//       }
