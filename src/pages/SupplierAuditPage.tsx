import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const navigate = useNavigate();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const onChangeEvent = (eventName: string, value: { id: string }) => {
    if (eventName === 'AUDIT') {
      navigate('/supplier-audit/audit/' + value.id);
    }
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      <MyPageContainer title="供货商信息审批">
        <TableAutoDataPanel
          ref={tableRef}
          code="SUPPLIER_AUDIT"
          request={AutoTableRequest}
          onChangeEvent={(eventName, value) => {
            return async.run(async () => {
              return onChangeEvent(eventName, value);
            });
          }}
        />
      </MyPageContainer>
    </>
  );
};
