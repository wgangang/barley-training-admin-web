import React, { FC } from 'react';

export declare type MyPageContainerProps = {
  title?: string | undefined
  children?: React.ReactNode | undefined
  width?: number | undefined
  minWidth?: number | undefined
  className?: string | undefined
  bodyPadding?: string | undefined
};
export const Component: FC<MyPageContainerProps> = (props) => {
  return <div style={{
    background: '#fff',
    borderRadius: '6px',
    fontSize: 13,
    maxWidth: props?.width,
    minWidth: props?.minWidth,
    marginBottom: 16
  }}>
    <div style={{
      fontSize: 16,
      fontWeight: 500,
      padding: '14px 24px',
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>{props?.title}</div>
    <div style={{ padding: props?.bodyPadding || '20px 24px' }}>
      {props.children}
    </div>
  </div>;
};

export default Component;
