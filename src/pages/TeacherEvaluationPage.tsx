import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import teacherApi from '@apis/teacher-api';
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
    navigate('/admin/teacher-evaluation/create/0');
  };
  const onChangeEvent = async (eventName: string, value: { id: string }) => {
    if (eventName === 'DELETE') {
      const result = await teacherApi?.removeEvaluation(value.id);
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
      <MyPageContainer title="师资评估" onRefresh={() => {
        tableRef?.current?.refreshData();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="TEACHER_EVALUATION"
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
      {contextHolder}
    </>
  );
};
