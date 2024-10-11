import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';

export default () => {
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      <MyPageContainer title="今日预抵管理" onRefresh={() => {
        tableRef?.current?.refresh();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="COURSE_SIGN"
          request={AutoTableRequest}
        />
      </MyPageContainer>
    </>
  );
};
