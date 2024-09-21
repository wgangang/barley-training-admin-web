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
      <MyPageContainer title="系统日志">
        <TableAutoDataPanel
          ref={tableRef}
          code="SYSTEM_LOG"
          request={AutoTableRequest}
        />
      </MyPageContainer>
    </>
  );
};
