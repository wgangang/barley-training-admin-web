// noinspection DuplicatedCode

import React, { ReactNode, useRef, useState } from 'react';
import { Form, Input, Modal, Radio } from 'antd';
import ImagesContainer from '@components/ImagesContainer';
import s3Api from '@apis/s3-api';

export class Async {
  private isRun = false;

  async run<T>(func: () => Promise<T>): Promise<T | undefined> {
    try {
      if (this.isRun) {
        return undefined;
      }
      this.isRun = true;
      return await func();
    } finally {
      this.isRun = false;
    }
  }
}

export class NumberUtils {
  public static isNumeric(value: any) {
    if (typeof value === 'number') {
      return !Number.isNaN(value);
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return !Number.isNaN(Number(value)) && !Number.isNaN(Number.parseFloat(value));
    }
    return false;
  }

  public static ifGeZeroNumeric(value: any, defaultValue?: any): any {
    return this.isNumeric(value) && Number(value) > 0 ? value : defaultValue;
  }
}

export type Handler<T> = {
  ok: (callback: (params: T) => Promise<boolean>, initialValues?: {}) => void
}
export type AudioParams = {
  status: boolean
  auditRejectReason: string
}
export type PayParams = {
  amount: string
  voucher: string
}

export class Modals {

  public static useAudioModal(): [Handler<AudioParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [audioStatus, setAudioStatus] = useState(true);
    const callbackRef = useRef<((params: AudioParams) => Promise<boolean>) | undefined>(undefined);
    const onConfirm = async () => {
      if (callbackRef.current) {
        if (await callbackRef.current?.(form.getFieldsValue())) {
          setIsOpenModal(false);
        }
      } else {
        setIsOpenModal(false);
      }
    };
    const handler: Handler<AudioParams> = {
      ok: (callback: (params: AudioParams) => Promise<boolean>) => {
        form.resetFields();
        setIsOpenModal(true);
        callbackRef.current = callback;
      }
    };
    return [handler, <>
      <Modal
        title="审核"
        width={400}
        open={isOpenModal}
        onOk={() => onConfirm()}
        onCancel={() => setIsOpenModal(false)}>
        <Form form={form} layout="vertical" initialValues={{ status: true }}>
          <Form.Item style={{ marginBottom: 8 }} name="status">
            <Radio.Group onChange={(e) => {
              setAudioStatus(e.target.value);
              if (e.target.value) {
                form.setFieldValue('auditRejectReason', undefined);
              }
            }}>
              <Radio value={true}>同意</Radio>
              <Radio value={false}>拒绝</Radio>
            </Radio.Group>
          </Form.Item>
          {audioStatus ? undefined : <Form.Item style={{ marginBottom: 0 }} name="auditRejectReason">
            <Input.TextArea placeholder="请输入拒绝原因"></Input.TextArea>
          </Form.Item>}
        </Form>
      </Modal>
    </>];
  }

  public static usePayModal(): [Handler<PayParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const callbackRef = useRef<((params: PayParams) => Promise<boolean>) | undefined>(undefined);
    const onConfirm = async () => {
      if (callbackRef.current) {
        if (await callbackRef.current?.(form.getFieldsValue())) {
          setIsOpenModal(false);
        }
      } else {
        setIsOpenModal(false);
      }
    };
    const handler: Handler<PayParams> = {
      ok: (callback: (params: PayParams) => Promise<boolean>, initialValues?: {}) => {
        form.resetFields();
        if (initialValues !== undefined) {
          form.setFieldsValue(initialValues);
        }
        setIsOpenModal(true);
        callbackRef.current = callback;
      }
    };
    return [handler, <>
      <Modal
        title="付款"
        width={400}
        open={isOpenModal}
        onOk={() => onConfirm()}
        onCancel={() => setIsOpenModal(false)}
        styles={{ body: { padding: '12px 0 0 0' } }}>
        <Form form={form} labelCol={{ span: 5 }}>
          <Form.Item label="预付款" name="amount">
            <Input readOnly></Input>
          </Form.Item>
          <Form.Item label="付款凭证" name="voucher">
            <ImagesContainer
              action={process.env.IMAGE_URL || ''}
              buttonText="上传凭证"
              maxLength={1}
              requestUrl={async (url) => s3Api.getUrl(url)
                .then(a => a.data)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>];
  }
}
