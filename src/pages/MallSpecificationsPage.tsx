import React, { useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, Form, Input, Modal } from 'antd';

export default () => {
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const [form] = Form.useForm();
  const [isSpecificationsModal, setIsSpecificationsModal] = useState(false);
  const onOpen = (item?: {}) => {
    if (item === undefined) {
      form.resetFields();
    } else {
      form.setFieldsValue(item);
    }
    setIsSpecificationsModal(true);
  };
  const onConfirm = () => {
    console.log(form.getFieldsValue());
    setIsSpecificationsModal(false);
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      <MyPageContainer title="规格管理">
        <TableAutoDataPanel
          ref={tableRef}
          toolBarRender={<Button type="primary" onClick={onOpen}>添加规格</Button>}
          code="MALL_SCENE_SPECIFICATIONS_LIST"
          request={AutoTableRequest}
        />
        <Modal
          styles={{
            body: {
              padding: '5px 0 0 0'
            }
          }}
          title="保存规格"
          width="360px"
          open={isSpecificationsModal}
          onCancel={() => setIsSpecificationsModal(false)}
          onOk={() => onConfirm()}>
          <Form form={form}>
            <Form.Item hidden={true} name="id">
              <Input></Input>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }} name="skuKeyName">
              <Input placeholder="规格名称"></Input>
            </Form.Item>
          </Form>
        </Modal>
      </MyPageContainer>
    </>
  );
};
