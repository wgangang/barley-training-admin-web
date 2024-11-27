import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import classroomApi from '@apis/classroom-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const onCreate = () => {
    navigate('/admin/classroom-reservation/create/0');
  };
  const onChangeEvent = async (eventName: string, value: { id: string }) => {
    if (eventName === 'DELETE') {
      const result = await classroomApi?.removeReservation(value.id);
      if (result.success) {
        messageApi.success('删除成功！')
          .then();
        tableRef?.current?.refreshData();
      } else {
        messageApi.error(result.message)
          .then();
      }
      return;
    }
    console.log(eventName, value);
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      <MyPageContainer title="教室预定" onRefresh={() => {
        tableRef?.current?.refreshData();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="CLASSROOM_RESERVATION"
          request={AutoTableRequest}
          toolBarRender={<>
            <Button type="primary" onClick={onCreate}>预定教室</Button>
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
    </>
  );
};
