import React, { useEffect, useRef } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { useNavigate } from 'react-router-dom';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const navigate = useNavigate();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const onChangeEvent = (eventName: string, value: { id: string }) => {
    if (eventName === 'AUDIT') {
      navigate('/supplier-record-audit/audit/' + value.id);
    }
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      <MyPageContainer title="预付供货款审批">
        <TableAutoDataPanel
          ref={tableRef}
          code="SUPPLIER_RECORD_AUDIT"
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
