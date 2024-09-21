import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import mallInventoryApi from '@apis/mall-inventory-api';
import { message } from 'antd';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const [messageApi, contextMessageHolder] = message.useMessage();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const onChangeEvent = async (eventName: string, value: { id: string }) => {
    if (eventName === 'FROZEN') {
      const result = await mallInventoryApi.frozen(value.id);
      if (result.success) {
        tableRef?.current?.refreshData();
        messageApi?.success('冻结成功！')
          .then();
      } else {
        messageApi?.error(result.message)
          .then();
      }
    }
    if (eventName === 'INVALID') {
      const result = await mallInventoryApi.invalid(value.id);
      if (result.success) {
        tableRef?.current?.refreshData();
        messageApi?.success('失效成功！')
          .then();
      } else {
        messageApi?.error(result.message)
          .then();
      }
    }
    if (eventName === 'SELL') {
      const result = await mallInventoryApi.sell(value.id);
      if (result.success) {
        tableRef?.current?.refreshData();
        messageApi?.success('生效成功！')
          .then();
      } else {
        messageApi?.error(result.message)
          .then();
      }
    }
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      {contextMessageHolder}
      <MyPageContainer title="商城库存">
        <TableAutoDataPanel
          ref={tableRef}
          code="MALL_INVENTORY_LIST"
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
