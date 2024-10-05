import React, { ReactNode, useRef, useState } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import Flux from 'beer-assembly/Flux';
import reportApi from '@apis/report-api';
import dayjs from 'dayjs';

export type Handler<T> = {
  ok: (callback: (params: T) => Promise<boolean>, args?: {}, initialValues?: {}) => void
}
export type TeacherTitleParams = {}
export type TeacherCertificatesParams = {}
export type ProjectParams = {}

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

  public static useProject(): [Handler<ProjectParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const callbackRef = useRef<((params: ProjectParams) => Promise<boolean>) | undefined>(undefined);
    const onConfirm = async () => {
      if (callbackRef.current) {
        if (await callbackRef.current?.({
          ...form.getFieldsValue(),
          date: undefined,
          startDate: form.getFieldValue('date')?.[0].format('YYYY-MM-DD'),
          endDate: form.getFieldValue('date')?.[1].format('YYYY-MM-DD')
        })) {
          setIsOpenModal(false);
        }
      } else {
        setIsOpenModal(false);
      }
    };
    const handler: Handler<ProjectParams> = {
      ok: (callback: (params: ProjectParams) => Promise<boolean>, args?: {}, initialValues?: {}) => {
        form.resetFields();
        const params = initialValues as any;
        form.setFieldsValue({
          ...initialValues,
          date: params?.startDate === undefined || params?.endDate === undefined
            ? undefined : [dayjs(params?.startDate), dayjs(params?.endDate)]
        });
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
        width="520px"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => onConfirm()}>
        <Form form={form} colon={false} layout="vertical">
          <Form.Item name="id" hidden={true}>
            <Input></Input>
          </Form.Item>
          <Flux size={12}>
            <Form.Item name="projectCode" label="项目编号" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="projectName" label="项目名称" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="date" label="项目周期" style={{ width: '100%' }}>
              <DatePicker.RangePicker></DatePicker.RangePicker>
            </Form.Item>
            <Form.Item name="hours" label="课时" style={{ width: '100%' }}>
              <InputNumber style={{ width: '100%' }} min={1} max={999}></InputNumber>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="isDisplay" label="是否公开" style={{ width: '100%' }}>
              <Radio.Group>
                <Radio value={true}>公开</Radio>
                <Radio value={false}>隐藏</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item style={{ width: '100%' }}>
            </Form.Item>
          </Flux>
          <Form.Item name="projectDescription" label="项目简介">
            <Input.TextArea rows={3}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>];
  }

}
