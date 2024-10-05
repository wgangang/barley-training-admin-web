import React, { ReactNode, useRef, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import reportApi from '@apis/report-api';

export type Handler<T> = {
  ok: (callback: (params: T) => Promise<boolean>, args?: {}, initialValues?: {}) => void
}
export type TeacherTitleParams = {
  status: boolean
  auditRejectReason: string
}
export type TeacherCertificatesParams = {
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

  public static useTeacherCertificate(): [Handler<TeacherCertificatesParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [teacherList, setTeacherList] = useState([]);
    const callbackRef = useRef<((params: TeacherCertificatesParams) => Promise<boolean>) | undefined>(undefined);
    const onConfirm = async () => {
      if (callbackRef.current) {
        if (await callbackRef.current?.(form.getFieldsValue())) {
          setIsOpenModal(false);
        }
      } else {
        setIsOpenModal(false);
      }
    };
    const handler: Handler<TeacherCertificatesParams> = {
      ok: (callback: (params: TeacherCertificatesParams) => Promise<boolean>, args?: {}, initialValues?: {}) => {
        form.resetFields();
        form.setFieldsValue(initialValues);
        callbackRef.current = callback;
        setIsOpenModal(true);
        reportApi.getDataList<[]>('TEACHER_LIST')
          .then(result => {
            setTeacherList(result.data);
          });
      }
    };
    return [handler, <>
      <Modal
        styles={{
          body: {
            padding: '12px 0 0 0'
          }
        }}
        title="师资资质"
        width="360px"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => onConfirm()}>
        <Form form={form} colon={false} layout="vertical">
          <Form.Item name="id" hidden={true}>
            <Input></Input>
          </Form.Item>
          <Form.Item name="teacherId" label="教师">
            <Select options={teacherList}></Select>
          </Form.Item>
          <Form.Item name="certificateName" label="证书名称">
            <Input></Input>
          </Form.Item>
          <Form.Item name="issuingAuthority" label="颁发机构">
            <Input></Input>
          </Form.Item>
          <Form.Item name="acquisitionDate" label="颁发日期">
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>];
  }
}
