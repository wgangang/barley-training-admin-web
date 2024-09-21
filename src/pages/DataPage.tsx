import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { Directory } from 'beer-assembly/DirectorySelect';
import { AutoTableRequest } from '@apis/report-api';
import netDiskApi from '@apis/net-disk-api';
import MyPageContainer from '@components/MyPageContainer';
import MicroAppUtils from '@/micro-app-utils';

export default () => {
  const location = useLocation();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const code = () => {
    const appCode = MicroAppUtils.getAppCode();
    if (appCode !== undefined) {
      return appCode;
    }
    const val = window.location.pathname.split('?')[0].split('/');
    return (val[val.length - 2] || '').trim();
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, [location.pathname]);
  (AutoTableRequest as any).saveExport = async (_: string, exportId: string, parentId: string) => {
    return (await netDiskApi.saveNetDisk(code(), parentId, exportId)).success;
  };
  return (
    <>
      <MyPageContainer title={title}>
        <TableAutoDataPanel
          isDisplayNetDisk={MicroAppUtils.getNetDiskPermissions()}
          ref={tableRef} code={id || ''}
          request={AutoTableRequest}
          directoryProps={{
            isCreate: false,
            phrase: '保存',
            request: {
              getDirectoryList: async (parentId) => {
                const result = await netDiskApi.getNetDiskDirectoryItem<Directory[]>(code(), parentId || '');
                return result.data || [];
              }
            }
          }}
          onLoad={(config) => {
            setTitle(config?.name);
          }}
        />
      </MyPageContainer>
    </>
  );
};
