import React, { useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { useNavigate } from 'react-router-dom';
import reportApi, { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, message, Modal } from 'antd';
import { AuditRejectContent, AuditRejectTitle } from '@components/AuditRejectReason';
import contractApi from '@apis/contract-api';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const tableApplyRef = useRef<TableAutoDataPanelRef>(null);
  const [tabIndex, setTabIndex] = useState('00');
  const onChangeEvent = async (eventName: string, value: { id: string, purchaseContractName: string }) => {
    if (eventName === 'REVOKE_AUDIT') {
      const result = await contractApi.revoke(value.id);
      if (result.success) {
        tableApplyRef?.current?.refreshData();
        messageApi?.success('申请已撤回！')
          .then();
      } else {
        messageApi?.error(result.message)
          .then();
      }
    }
    if (eventName === 'AUDIT_REJECT_REASON') {
      const result = await reportApi.getStatistics<{
        auditRejectName: string,
        auditRejectTime: string,
        auditRejectReason: string
      }>('CONTRACT_AUDIT_BY_DETAIL', { id: value.id });
      if (result.success) {
        modal?.error({
          title: <AuditRejectTitle title={value.purchaseContractName}/>,
          content: <AuditRejectContent
            auditRejectName={result.data?.auditRejectName}
            auditRejectTime={result.data?.auditRejectTime}
            auditRejectReason={result.data?.auditRejectReason}/>
        });
      } else {
        messageApi?.error(result.message);
      }
    }
  };
  useEffect(() => {
    if (tabIndex === '00') {
      tableRef?.current?.refreshData();
    }
    if (tabIndex === '01') {
      tableApplyRef?.current?.refreshData();
    }
  }, [tabIndex]);
  useEffect(() => {
    tableRef?.current?.refresh();
    tableApplyRef?.current?.refresh();
  }, []);
  return (
    <>
      {contextMessageHolder}
      {contextHolder}
      <MyPageContainer title="合同管理" tabList={[
        {
          key: '00',
          label: '合同列表'
        },
        {
          key: '01',
          label: '申请列表'
        }
      ]} onTabChange={(e) => setTabIndex(e)}>
        <TableAutoDataPanel
          style={{ display: tabIndex === '00' ? 'block' : 'none' }}
          ref={tableRef}
          code="CONTRACT_LIST"
          request={AutoTableRequest}
          toolBarRender={<Button type="primary" onClick={() => navigate('/contract/create/0')}>新建合同</Button>}
          onChangeEvent={(eventName, value) => {
            return async.run(async () => {
              return onChangeEvent(eventName, value);
            });
          }}
        />
        <TableAutoDataPanel
          style={{ display: tabIndex === '01' ? 'block' : 'none' }}
          ref={tableApplyRef}
          code="CONTRACT_APPLY_LIST"
          request={AutoTableRequest}
          onChangeEvent={async (eventName, value) => {
            return async.run(async () => {
              return onChangeEvent(eventName, value);
            });
          }}
        />
      </MyPageContainer>
    </>
  );
};
