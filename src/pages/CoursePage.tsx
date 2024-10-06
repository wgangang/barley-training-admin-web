import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import courseApi from '@apis/course-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, message } from 'antd';
import { Async } from '@/utils';
import { Modals } from '@/Modals';

const async = new Async();
export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [courseModalApi, contextCourseHolder] = Modals.useCourse();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const onCreate = () => {
    onOpen();
  };
  const onOpen = (value?: {}) => {
    courseModalApi.ok(async (params) => {
      const result = await courseApi?.save(params);
      if (result.success) {
        messageApi.success('保存成功！');
        tableRef?.current?.refreshData();
      } else {
        messageApi.error(result.message);
      }
      return result.success;
    }, undefined, value);
  };
  const onChangeEvent = async (eventName: string, value: { id: string }) => {
    if (eventName === 'EDIT') {
      onOpen(value);
      return;
    }
    if (eventName === 'DELETE') {
      const result = await courseApi?.remove(value.id);
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
      <MyPageContainer title="授课计划" onRefresh={() => {
        tableRef?.current?.refresh();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="COURSE"
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
      {contextCourseHolder}
    </>
  );
};
