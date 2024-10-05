import React, { ReactNode, useRef, useState } from 'react';
import { Form, Input, Modal } from 'antd';

export type Handler<T> = {
  ok: (callback: (params: T) => Promise<boolean>, args?: {}, initialValues?: {}) => void
}
export type TeacherTitleParams = {
  status: boolean
  auditRejectReason: string
}

export class Modals {
  public static useTeacherTitle(): [Handler<TeacherTitleParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const callbackRef = useRef<((params: TeacherTitleParams) => Promise<boolean>) | undefined>(undefined);
    const onConfirm = async () => {
      if (callbackRef.current) {
        if (await callbackRef.current?.(form.getFieldsValue())) {
          setIsOpenModal(false);
        }
      } else {
        setIsOpenModal(false);
      }
    };
    const handler: Handler<TeacherTitleParams> = {
      ok: (callback: (params: TeacherTitleParams) => Promise<boolean>, args?: {}, initialValues?: {}) => {
        form.resetFields();
        form.setFieldsValue(initialValues);
        callbackRef.current = callback;
        setIsOpenModal(true);
      }
    };
    return [handler, <>
      <Modal
        styles={{
          body: {
            padding: '12px 0 0 0'
          }
        }}
        title="职称管理"
        width="360px"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => onConfirm()}>
        <Form form={form} colon={false} layout="vertical">
          <Form.Item name="id" hidden={true}>
            <Input></Input>
          </Form.Item>
          <Form.Item name="code" label="职称代码">
            <Input></Input>
          </Form.Item>
          <Form.Item name="name" label="职称名称">
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>];
  }
}
