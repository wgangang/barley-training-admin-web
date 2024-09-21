import React, { useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, Form, Input, message, Modal } from 'antd';
import ImagesContainer from '@components/ImagesContainer';
import promiseApi from '@apis/promise-api';
import s3Api from '@apis/s3-api';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const [form] = Form.useForm();
  const [isPromiseModal, setIsPromiseModal] = useState(false);
  const onOpen = () => {
    form.resetFields();
    setIsPromiseModal(true);
  };
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue(),
      promiseIcon: form.getFieldValue('promiseIcon')?.[0]
    };
    const result = await promiseApi.save(params);
    if (result.success) {
      tableRef?.current?.refreshData();
      messageApi?.success('保存成功！')
        .then();
      setIsPromiseModal(false);
    } else {
      messageApi?.error(result.message)
        .then();
    }
  };
  const onChangeEvent = async (eventName: string, value: { id: string, s3_promiseIcon: string, promiseIcon: string }) => {
    if (eventName === 'EDIT') {
      form.setFieldsValue({
        ...value,
        promiseIcon: [value.s3_promiseIcon || value.promiseIcon]
      });
      setIsPromiseModal(true);
      return;
    }
    if (eventName === 'DELETE') {
      const result = await promiseApi.remove(value.id);
      if (result.success) {
        tableRef?.current?.refreshData();
        messageApi?.success('删除成功！')
          .then();
      } else {
        messageApi?.error(result.message)
          .then();
      }
    }
  };
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);
  return (
    <>
      {contextHolder}
      <MyPageContainer title="售后服务">
        <TableAutoDataPanel
          ref={tableRef}
          toolBarRender={<Button type="primary" onClick={onOpen}>添加服务</Button>}
          code="MALL_SCENE_PROMISE_LIST"
          request={AutoTableRequest}
          onChangeEvent={async (event, value) => {
            return async.run(async () => {
              return onChangeEvent(event, value);
            });
          }}
        />
        <Modal
          title="售后服务管理"
          width="400px"
          open={isPromiseModal}
          onCancel={() => setIsPromiseModal(false)}
          styles={{
            body: { padding: '16px 0 0 0' }
          }}
          onOk={() => onConfirm()}>
          <Form form={form} labelCol={{ span: 5 }}>
            <Form.Item name="id" hidden={true}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="服务名称" name="promiseName">
              <Input></Input>
            </Form.Item>
            <Form.Item label="服务描述" name="promiseDesc">
              <Input.TextArea></Input.TextArea>
            </Form.Item>
            <Form.Item name="promiseIcon" label="图标" tooltip="文件大小不得超过1M，限上传1张，支持上传格式：PNG, JPEG, JPG" style={{ marginBottom: 0 }}>
              <ImagesContainer
                action={process.env.IMAGE_URL || ''}
                maxLength={1}
                requestUrl={async (url) => s3Api.getUrl(url)
                  .then(a => a.data)}/>
            </Form.Item>
          </Form>
        </Modal>
      </MyPageContainer>
    </>
  );
};
