import React, { useContext, useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import reportApi, { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuditRejectContent, AuditRejectTitle } from '@components/AuditRejectReason';
import supplierRecordApi from '@apis/supplier-record-api';
import ParentContext from '@/content/ParentContext';
import { Async, Modals } from '@/utils';

const async = new Async();
export default () => {
  const {
    messageApi
  } = useContext(ParentContext);
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const [payModal, contextPayHolder] = Modals.usePayModal();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const tableApplyRef = useRef<TableAutoDataPanelRef>(null);
  const [tabIndex, setTabIndex] = useState('00');
  const onChangeEvent = async (eventName: string, value: { id: string, supplierShortName: string, modifyAmount: string }) => {
    if (eventName === 'REVOKE_AUDIT') {
      const result = await supplierRecordApi.revoke(value.id);
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
      }>('SUPPLIER_RECORD_AUDIT_BY_DETAIL', { id: value.id });
      if (result.success) {
        modal?.error({
          title: <AuditRejectTitle title={value.supplierShortName}/>,
          content: <AuditRejectContent
            auditRejectName={result.data?.auditRejectName}
            auditRejectTime={result.data?.auditRejectTime}
            auditRejectReason={result.data?.auditRejectReason}/>
        });
      } else {
        messageApi?.error(result.message);
      }
    }
    if (eventName === 'PAY') {
      payModal?.ok(async (params) => {
        const result = await supplierRecordApi.pay({
          id: value.id,
          paymentVoucher: params?.voucher[0]
        });
        if (result.success) {
          tableRef?.current?.refreshData();
          messageApi?.success('付款成功！')
            .then();
          return true;
        }
        messageApi?.error(result.message)
          .then();
        return false;
      }, { amount: value.modifyAmount });
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
      {contextPayHolder}
      <MyPageContainer title="预付供货款" tabList={[
        {
          key: '00',
          label: '预付款记录'
        },
        {
          key: '01',
          label: '申请列表'
        }
      ]} onTabChange={(e) => setTabIndex(e)}>
        <TableAutoDataPanel
          style={{ display: tabIndex === '00' ? 'block' : 'none' }}
          ref={tableRef}
          code="SUPPLIER_BALANCE_LIST"
          request={AutoTableRequest}
          toolBarRender={<>
            <Button type="primary" onClick={() => navigate('/supplier-record/create/0')}>申请付款</Button>
          </>}
          onChangeEvent={(eventName, value) => {
            return async.run(async () => {
              return onChangeEvent(eventName, value);
            });
          }}
        />
        <TableAutoDataPanel
          style={{ display: tabIndex === '01' ? 'block' : 'none' }}
          ref={tableApplyRef}
          code="SUPPLIER_BALANCE_APPLY_LIST"
          request={AutoTableRequest}
          onChangeEvent={(eventName, value) => {
            return async.run(async () => {
              return onChangeEvent(eventName, value);
            });
          }}
        />
      </MyPageContainer>
    </>
  );
};
