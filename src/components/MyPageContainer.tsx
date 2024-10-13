import React, { FC, useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { PageContainer } from '@ant-design/pro-components';
import { message, Modal, TabPaneProps, Tabs } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import ParentContext from '@/content/ParentContext';

export interface Tab extends Omit<TabPaneProps, 'tab'> {
  key: string;
  label: React.ReactNode;
}

export declare type MyPageContainerProps = {
  title?: string | undefined
  children?: React.ReactNode | undefined
  padding?: string | undefined
  tabList?: Tab[]
  onTabChange?: (e: string) => void
  onRefresh?: () => void
};
const pathPartition: string[] = sessionStorage.getItem('DETAIL_PARTITION') === null
  ? undefined : JSON.parse(sessionStorage.getItem('DETAIL_PARTITION') || '[]');
export const Component: FC<MyPageContainerProps> = (props) => {
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, contextModalHolder] = Modal.useModal();
  const [isSubpage, setIsSubpage] = useState(false);
  useEffect(() => {
    const partition = (pathPartition || ['CREATE', 'EDIT', 'AUDIT', 'PREVIEW', 'DETAIL'])
      .find(path => location.pathname.toUpperCase()
        .indexOf(`/${path}/`) > -1);
    if (partition !== undefined) {
      setIsSubpage(true);
    } else {
      setIsSubpage(false);
    }
  }, [location]);
  return <>
    <ParentContext.Provider value={{
      messageApi,
      modal,
      active: () => {
        props?.onRefresh?.();
      }
    }}>
      {contextHolder}
      {contextModalHolder}
      <PageContainer
        style={{ display: isSubpage ? 'none' : 'block' }}
        className={css`
            .ant-page-header-heading {
                padding-block-start: 0 !important;
            }

            .ant-page-header-heading-title {
                font-size: 15px;
                line-height: 1.5;
                color: #333;
            }

            //.ant-tabs-nav:before {
            //    display: none;
            //}
        `}
        header={{
          style: {
            background: '#fff',
            padding: (props?.tabList?.length || 0) <= 0 ? '10px 24px 10px 24px' : '10px 24px 2px 24px',
            borderBottom: (props?.tabList?.length || 0) <= 0 ? '1px solid rgba(0, 0, 0, 0.06)' : undefined
          }
        }}
        title={props.title}
        ghost={true}
        childrenContentStyle={{
          padding: '0'
        }}
      >
        {(props?.tabList?.length || 0) > 0 ? <>
          <Tabs
            size="small"
            items={props?.tabList}
            className={css`
                background: #fff;
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);

                .ant-tabs-nav::before {
                    display: none;
                }
            `}
            tabBarStyle={{ margin: '0 24px' }}
            onChange={(e) => props?.onTabChange?.(e)}/>
        </> : undefined}
        <div className={css`
            padding: ${props?.padding || '12px 16px'}
        `}>
          {props.children}
        </div>
      </PageContainer>
      <Outlet/>
    </ParentContext.Provider>
  </>;
};

export default Component;

// {
//         size: 'small',
//         tabBarStyle: {
//           margin: '0'
//         }
//       }
