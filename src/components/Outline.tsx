import React, { FC, useState } from 'react';
import { Collapse, CollapseProps, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

declare type OutlineItem = {
  key: string
  label: string
  children?: OutlineItem[]
}
export declare type BackPageContainerProps = {
  title?: string | undefined
  data: OutlineItem[]
  children?: React.ReactNode | undefined
};
export const Component: FC<BackPageContainerProps> = (props) => {
  const { token } = theme.useToken();
  const [activeKey, setActiveKey] = useState('001');
  const Item = (props: { label: string, active: boolean }) => {
    return <div style={{
      height: 30,
      display: 'flex',
      alignItems: 'center',
      fontSize: 14
    }}>
      <a style={{
        color: props.active ? '#000' : '#666',
        fontWeight: props.active ? 600 : undefined
      }}>{props.label}</a>
    </div>;
  };
  const getItems: () => CollapseProps['items'] = () => {
    return props?.data?.map(it => {
      return {
        key: it.key,
        label: <span style={{
          fontSize: 14,
          color: it.children?.find(c => c.key === activeKey) ? '#000' : '#666',
          fontWeight: it.children?.find(c => c.key === activeKey) ? 600 : undefined
        }}>{it.label}</span>,
        children: <div style={{ padding: '0' }}>
          {it.children?.map(c => (
            <Item key={c.key} label={c.label} active={activeKey === c.key}/>
          ))}
        </div>,
        style: {
          marginBottom: 0,
          border: 'none'
        },
        styles: {
          header: {
            padding: '6px 20px'
          },
          body: {
            padding: '0 0 0 52px'
          }
        }
      };
    });
  };
  return <div style={{
    width: 300,
    overflow: 'hidden',
    background: '#fff'
  }}>
    <div style={{
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      padding: '12px 20px'
    }}>
      <span style={{
        fontSize: 16,
        fontWeight: 500
      }}>目录</span>
    </div>
    <div style={{
      padding: '8px 0'
    }}>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
        style={{
          background: token.colorBgContainer,
          width: 320
        }}
        items={getItems()}
      />
    </div>
  </div>;
};

export default Component;
