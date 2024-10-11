import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, Divider, Space } from 'antd';
import { Async } from '@/utils';
import { Modals } from '@/Modals';

const async = new Async();
export default () => {
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const [fundsFlowsModalApi, contextFundsFlowsHolder] = Modals.useCourse();
  const onOpen = (value?: {}) => {
    fundsFlowsModalApi.ok(async () => {
      return true;
    }, undefined, value);
  };
  const onChangeEvent = async (eventName: string, value: { id: string }) => {
    // TODO 22
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
          toolBarRender={<>
            <Space>
              <Button type="primary" onClick={onOpen}>新增支出</Button>
              <Divider type="vertical" style={{ background: 'rgb(187, 187, 187)' }}/>
            </Space>
          </>}
          onChangeEvent={async (event, value) => {
            return async.run(async () => {
              return onChangeEvent(event, value);
            })
              .then();
          }}
        />
      </MyPageContainer>
      {contextFundsFlowsHolder}
    </>
  );
};
