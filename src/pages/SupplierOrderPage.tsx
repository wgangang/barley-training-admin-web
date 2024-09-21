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
      <MyPageContainer title="商城供货商订单">
        <TableAutoDataPanel
          ref={tableRef}
          code="SUPPLIER_ORDER_LIST"
          request={AutoTableRequest}
        />
      </MyPageContainer>
    </>
  );
};
