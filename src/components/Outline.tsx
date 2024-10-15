import React, { CSSProperties, FC, useEffect, useState } from 'react';
import { Collapse, CollapseProps, Select } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';

declare type OutlineItem = {
  key: string
  label: string
  children?: OutlineItem[]
}
export declare type BackPageContainerProps = {
  title?: string | undefined
  value?: string | undefined
  itemValue?: string | undefined
  outlineList?: { value: string, label: string }[]
  dataList?: OutlineItem[]
  onChange?: (event: string) => void
  onItemChange?: (event: string) => void
  style?: CSSProperties
};
export const Component: FC<BackPageContainerProps> = (props) => {
  const [outline, setOutline] = useState('');
  const [activeKey, setActiveKey] = useState([] as string[]);
  const Item = (itemProps: { label: string, active: boolean, value: string }) => {
    return <div style={{
      height: 30,
      display: 'flex',
      alignItems: 'center',
      fontSize: 14
    }} onClick={() => {
      props?.onItemChange?.(itemProps?.value || '');
    }}>
      <a style={{
        color: itemProps.active ? '#000' : 'rgba(0, 0, 0, 0.6)',
        fontWeight: itemProps.active ? 500 : undefined
      }}>{itemProps.label}</a>
    </div>;
  };
  const getItems: () => CollapseProps['items'] = () => {
    return props?.dataList?.map(it => {
      return {
        key: it.key,
        label: <span style={{
          fontSize: 14,
          color: it.children?.find(c => c.key === props?.itemValue) ? '#000' : 'rgba(0, 0, 0, 0.6)',
          fontWeight: it.children?.find(c => c.key === props?.itemValue) ? 500 : undefined
        }}>{it.label}</span>,
        children: <div style={{ padding: '0' }}>
          {it.children?.map(c => (
            <Item key={c.key} label={c.label} value={c.key} active={props?.itemValue === c.key}/>
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
  useEffect(() => {
    const items = props?.outlineList || [];
    const value = props?.value || '';
    if (value === '' || items.length <= 0) {
      return;
    }
    setOutline((items.find(it => it.value === value) || {})?.value || '');
  }, [props?.value, props?.outlineList]);
  useEffect(() => {
    if ((props?.itemValue || '') === '' || (props?.dataList || []).length <= 0) {
      return;
    }
    const item = props?.dataList?.find(it => it?.children?.find(c => c.key === props?.itemValue) !== undefined);
    if (item !== undefined) {
      setActiveKey([item.key]);
    }
  }, [props?.itemValue, props?.dataList]);
  return <div style={{
    width: 300,
    overflow: 'hidden',
    ...(props?.style)
  }}>
    <div style={{
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      height: 50,
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Select options={props?.outlineList} variant="filled" className={css`
          width: 100%;

          & .ant-select-selection-item {
              font-size: 14px;
              font-weight: 500;
          }
      `} value={outline} onChange={(e) => {
        setOutline(e);
        props?.onChange?.(e);
      }}/>
    </div>
    <div style={{
      padding: '8px 0'
    }}>
      <Collapse
        bordered={false}
        activeKey={activeKey}
        onChange={(e) => {
          setActiveKey(e);
        }}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
        style={{
          background: 'transparent',
          width: 320
        }}
        items={getItems()}
      />
    </div>
  </div>;
};

export default Component;
