import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import courseApi from '@apis/course-api';
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
    navigate('/admin/course/create/0');
  };
  const onChangeEvent = async (eventName: string, value: { id: string, liveId?: string }) => {
    if (eventName === 'DELETE') {
      const result = await courseApi.remove(value.id);
      if (result.success) {
        messageApi.success('删除成功！').then();
        tableRef?.current?.refreshData();
      } else {
        messageApi.error(result.message)
          .then();
      }
      return;
    }
    if (eventName === 'LIVE') {
      if (value.liveId) {
        messageApi.success('请先取消预约！').then();
        return;
      }
      const result = await courseApi.live(value.id);
      if (result.success) {
        messageApi.success('预约成功！').then();
        tableRef?.current?.refreshData();
      } else {
        messageApi.error(result.message).then();
      }
      return;
    }
    if (eventName === 'DELETE_LIVE') {
      if (!value.liveId) {
        messageApi.success('请先预约！').then();
        return;
      }
      const result = await courseApi.liveDelete(value.id);
      if (result.success) {
        messageApi.success('取消成功！').then();
        tableRef?.current?.refreshData();
      } else {
        messageApi.error(result.message).then();
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
        tableRef?.current?.refreshData();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="COURSE"
          request={AutoTableRequest}
          toolBarRender={<>
            <Button type="primary" onClick={onCreate}>新建计划</Button>
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
