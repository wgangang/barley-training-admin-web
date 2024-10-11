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
      <MyPageContainer title="决算表" onRefresh={() => {
        tableRef?.current?.refresh();
      }}>
        <TableAutoDataPanel
          ref={tableRef}
          code="PROJECT_FUNDS_SETTLEMENT"
          request={AutoTableRequest}
        />
      </MyPageContainer>
    </>
  );
};
