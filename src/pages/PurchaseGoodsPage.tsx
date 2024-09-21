import React, { useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import reportApi, { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { useNavigate } from 'react-router-dom';
import { Button, message, Modal } from 'antd';
import { AuditRejectContent, AuditRejectTitle } from '@components/AuditRejectReason';
import purchaseGoodsApi from '@apis/purchase-goods-api';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, contextModalHolder] = Modal.useModal();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const tableApplyRef = useRef<TableAutoDataPanelRef>(null);
  const [tabIndex, setTabIndex] = useState('00');
  const onChangeEvent = async (eventName: string, value: { id: string, spuName: string }) => {
    if (eventName === 'REVOKE_AUDIT') {
      const result = await purchaseGoodsApi.revoke(value.id);
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
      }>('PURCHASE_GOODS_AUDIT_BY_DETAIL', { id: value.id });
      if (result.success) {
        modal?.error({
          title: <AuditRejectTitle title={value.spuName}/>,
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
      <MyPageContainer title="商城采购商品" tabList={[
        {
          key: '00',
          label: '商品列表'
        },
        {
          key: '01',
          label: '申请列表'
        }
      ]} onTabChange={(e) => setTabIndex(e)}>
        <TableAutoDataPanel
          style={{ display: tabIndex === '00' ? 'block' : 'none' }}
          ref={tableRef}
          code="PURCHASE_GOODS_LIST"
          request={AutoTableRequest}
          toolBarRender={<Button type="primary" onClick={() => navigate('/purchase-goods/create/0')}>添加报价</Button>}
        />
        <TableAutoDataPanel
          style={{ display: tabIndex === '01' ? 'block' : 'none' }}
          ref={tableApplyRef}
          code="PURCHASE_GOODS_APPLY_LIST"
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
