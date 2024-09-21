import React, { useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import reportApi, { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuditRejectContent, AuditRejectTitle } from '@components/AuditRejectReason';
import purchaseOrderApi from '@apis/purchase-order-api';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, contextModalHolder] = Modal.useModal();
  const navigate = useNavigate();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const tableApplyRef = useRef<TableAutoDataPanelRef>(null);
  const [tabIndex, setTabIndex] = useState('00');
  const onChangeEvent = async (eventName: string, value: { id: string, purchaseContractName: string }) => {
    if (eventName === 'REVOKE_AUDIT') {
      const result = await purchaseOrderApi.revoke(value.id);
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
      }>('PURCHASE_ORDER_AUDIT_BY_DETAIL', { id: value.id });
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
      {contextHolder}
      {contextModalHolder}
      <MyPageContainer title="商城采购订单" tabList={[
        {
          key: '00',
          label: '采购订单列表'
        },
        {
          key: '01',
          label: '申请列表'
        }
      ]} onTabChange={(e) => setTabIndex(e)}>
        <TableAutoDataPanel
          style={{ display: tabIndex === '00' ? 'block' : 'none' }}
          ref={tableRef}
          code="PURCHASE_ORDER_LIST"
          request={AutoTableRequest}
          toolBarRender={<>
            <Button type="primary" onClick={() => navigate('/purchase-order/create/0')}>申请采购</Button>
          </>}
        />
        <TableAutoDataPanel
          style={{ display: tabIndex === '01' ? 'block' : 'none' }}
          ref={tableApplyRef}
          code="PURCHASE_ORDER_APPLY_LIST"
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
