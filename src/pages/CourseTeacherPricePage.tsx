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
  const [courseModalApi, contextCourseHolder] = Modals.useCourseTeacherPrice();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const onChangeEvent = async (eventName: string, value: { id: string }) => {
    if (eventName === 'DELETE') {
      const result = await courseApi?.removeTeacherPrice(value.id);
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
      <MyPageContainer title="教师酬金计算" onRefresh={() => {
        tableRef?.current?.refresh();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="COURSE_TEACHER_PRICE"
          request={AutoTableRequest}
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
