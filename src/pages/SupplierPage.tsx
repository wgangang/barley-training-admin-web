import React, { useContext, useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import reportApi, { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuditRejectContent, AuditRejectTitle } from '@components/AuditRejectReason';
import supplierApi from '@apis/supplier-api';
import ParentContext from '@/content/ParentContext';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const {
    messageApi
  } = useContext(ParentContext);
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const tableApplyRef = useRef<TableAutoDataPanelRef>(null);
  const [tabIndex, setTabIndex] = useState('00');
  const onCreate = () => {
    navigate('/supplier/create/0');
  };
  const onChangeEvent = async (eventName: string, value: { id: string, supplierName: string }) => {
    if (eventName === 'EDIT') {
      navigate('/supplier/edit/' + value.id);
    }
    if (eventName === 'DISABLE') {
      const result = await supplierApi.disable(value.id);
      if (result.success) {
        tableRef?.current?.refreshData();
        messageApi?.success('供货商禁用成功！')
          .then();
      } else {
        messageApi?.error(result.message);
      }
    }
    if (eventName === 'ENABLE') {
      const result = await supplierApi.enable(value.id);
      if (result.success) {
        tableRef?.current?.refreshData();
        messageApi?.success('供货商启用成功！')
          .then();
      } else {
        messageApi?.error(result.message);
      }
    }
    if (eventName === 'PREVIEW') {
      navigate('/supplier/preview/' + value.id);
    }
    if (eventName === 'REVOKE_AUDIT') {
      const result = await supplierApi.revoke(value.id);
      if (result.success) {
        tableApplyRef?.current?.refreshData();
        messageApi?.success('供货商启用成功！')
          .then();
      } else {
        messageApi?.error(result.message);
      }
    }
    if (eventName === 'AUDIT_REJECT_REASON') {
      const result = await reportApi.getStatistics<{
        auditRejectName: string,
        auditRejectTime: string,
        auditRejectReason: string
      }>('SUPPLIER_AUDIT_BY_DETAIL', { id: value.id });
      if (result.success) {
        modal?.error({
          title: <AuditRejectTitle title={value.supplierName}/>,
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
      <MyPageContainer title="供货商信息" tabList={[
        {
          key: '00',
          label: '入住供应商'
        },
        {
          key: '01',
          label: '申请列表'
        }
      ]} onTabChange={(e) => setTabIndex(e)} onRefresh={() => {
        tableRef?.current?.refresh();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          style={{ display: tabIndex === '00' ? 'block' : 'none' }}
          code="SUPPLIER_LIST"
          request={AutoTableRequest}
          toolBarRender={<>
            <Button type="primary" onClick={onCreate}>创建供货商</Button>
          </>}
          onChangeEvent={async (event, value) => {
            return async.run(async () => {
              return onChangeEvent(event, value);
            })
              .then();
          }}
        />
        <TableAutoDataPanel
          ref={tableApplyRef}
          style={{ display: tabIndex === '01' ? 'block' : 'none' }}
          code="SUPPLIER_APPLY_LIST"
          request={AutoTableRequest}
          onChangeEvent={async (event, value) => {
            return async.run(async () => {
              return onChangeEvent(event, value);
            })
              .then();
          }}
        />
      </MyPageContainer>
    </>
  );
};
