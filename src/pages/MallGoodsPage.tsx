import React, { useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';

export default () => {
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const tableApplyRef = useRef<TableAutoDataPanelRef>(null);
  const [tabIndex, setTabIndex] = useState('00');
  useEffect(() => {
    tableRef?.current?.refresh();
    tableApplyRef?.current?.refresh();
  }, [tabIndex]);
  return (
    <>
      <MyPageContainer title="商品管理" tabList={[
        {
          key: '00',
          label: '商品列表'
        },
        {
          key: '01',
          label: '申请列表'
        }
      ]} onTabChange={(e) => setTabIndex(e)}>
        {tabIndex === '00' ? <TableAutoDataPanel
          ref={tableRef}
          code="MALL_SCENE_GOODS_LIST"
          request={AutoTableRequest}
        /> : undefined}
        {tabIndex === '01' ? <TableAutoDataPanel
          ref={tableApplyRef}
          code="MALL_SCENE_GOODS_APPLY_LIST"
          request={AutoTableRequest}
        /> : undefined}
      </MyPageContainer>
    </>
  );
};
