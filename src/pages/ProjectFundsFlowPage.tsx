import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, message } from 'antd';
import projectFundsFlowApi from '@apis/project-funds-flow-api';
import { Async } from '@/utils';
import { Modals } from '@/Modals';

const async = new Async();
export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const [fundsFlowsModalApi, contextFundsFlowsHolder] = Modals.useProjectFundsFlow();
  const onOpen = (value?: {}) => {
    fundsFlowsModalApi.ok(async (params) => {
      const result = await projectFundsFlowApi.save(params);
      if (result.success) {
        messageApi.success('保存成功！')
          .then();
        tableRef?.current?.refreshData();
      } else {
        messageApi.error(result.message)
          .then();
      }
      return result.success;
    }, undefined, value);
  };
  const onChangeEvent = async (eventName: string, value: { id: string }) => {
    if (eventName === 'EDIT') {
      onOpen(value);
    }
    console.log(eventName, value);
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      <MyPageContainer title="支出管理" onRefresh={() => {
        tableRef?.current?.refresh();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="PROJECT_FUNDS_FLOW"
          request={AutoTableRequest}
          headerTitle={<>
            <Button type="primary" onClick={onOpen}>新增支出</Button>
          </>}
          onChangeEvent={async (event, value) => {
            return async.run(async () => {
              return onChangeEvent(event, value);
            })
              .then();
          }}
        />
      </MyPageContainer>
      {contextHolder}
      {contextFundsFlowsHolder}
    </>
  );
};
