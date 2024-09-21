import React, { FC } from 'react';

export declare type AuditRejectReasonProps = {
  auditRejectReason?: string | undefined
  auditRejectName?: string | undefined
  auditRejectTime?: string | undefined
};
export declare type AuditRejectReasonTitleProps = {
  title?: string | undefined
}
export const AuditRejectContent: FC<AuditRejectReasonProps> = (props) => {
  return <>
    <ul style={{
      padding: '0 24px',
      margin: '0',
      color: '#333'
    }}>
      {(props?.auditRejectName || '') === '' ? undefined : <li style={{ margin: '2px 0' }}><span style={{ fontWeight: 500 }}>审核人：</span>{props?.auditRejectName}</li>}
      {(props?.auditRejectTime || '') === '' ? undefined : <li style={{ margin: '2px 0' }}><span style={{ fontWeight: 500 }}>审核时间：</span>{props?.auditRejectTime}</li>}
      {(props?.auditRejectReason || '') === '' ? undefined : <li style={{ margin: '2px 0' }}>
        <span style={{ fontWeight: 500 }}>拒绝原因：</span>
        {props?.auditRejectReason}
      </li>}
    </ul>
  </>;
};

export const AuditRejectTitle: FC<AuditRejectReasonTitleProps> = (props) => {
  return <>
    《{props.title}》已被拒绝
  </>;
};
