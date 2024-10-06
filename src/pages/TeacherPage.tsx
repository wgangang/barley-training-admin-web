import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const navigate = useNavigate();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const onCreate = () => {
    navigate('/teacher/create/0');
  };
  const onChangeEvent = async (eventName: string, value: { id: string }) => {
    console.log(eventName, value);
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      <MyPageContainer title="师资信息" onRefresh={() => {
        tableRef?.current?.refreshData();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="TEACHER"
          request={AutoTableRequest}
          toolBarRender={<>
            <Button type="primary" onClick={onCreate}>新增</Button>
          </>}
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
