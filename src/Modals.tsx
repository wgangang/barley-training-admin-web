import React, { ReactNode, useRef, useState } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, Radio, Select, Space, TimePicker } from 'antd';
import Flux from 'beer-assembly/Flux';
import reportApi from '@apis/report-api';
import dayjs from 'dayjs';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';

export type Handler<T> = {
  ok: (callback: (params: T) => Promise<boolean>, args?: {}, initialValues?: {}) => void
}
export type TeacherTitleParams = {}
export type TeacherCertificatesParams = {}
export type ProjectParams = {}
export type ProjectFundsParams = {}
export type ProjectFundsFlowParams = {}

export class Modals {
  public static useTeacherTitle(): [Handler<TeacherTitleParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const callbackRef = useRef<((params: TeacherTitleParams) => Promise<boolean>) | undefined>(undefined);
    const onAddRow = () => {
      const array = form.getFieldValue('config');
      form.setFieldValue('config', [...array, {
        hour: '',
        price: ''
      }]);
    };
    const onRemoveRow = (index: number) => {
      const array = form.getFieldValue('config');
      const newArray = [...array];
      newArray.splice(index, 1);
      form.setFieldValue('config', newArray);
    };
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
        const params: any = initialValues || {};
        form.setFieldsValue({
          ...params,
          config: params?.config || [{
            hour: '',
            price: ''
          }]
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
        title="职称（等级）管理"
        width={480}
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => onConfirm()}>
        <Form form={form} colon={false} layout="vertical">
          <Form.Item name="id" hidden={true}>
            <Input></Input>
          </Form.Item>
          <Flux size={12}>
            <Form.Item name="code" label="职称（等级）代码" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="name" label="职称（等级）名称" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <p style={{
            fontWeight: 500,
            fontSize: 13,
            margin: '0px 0 12px 0'
          }}>薪酬设置</p>
          <Form.List name="config">
            {(items) => (<>
              {
                items.map(it => (
                  <Space key={it.key} style={{ marginBottom: 12 }}>
                    <span>课时</span>
                    <Form.Item name={[it.key, 'hour']} style={{ margin: 0 }}>
                      <InputNumber style={{ width: 90 }} min={0} precision={0}></InputNumber>
                    </Form.Item>
                    <span>以内，单课时薪酬：</span>
                    <Form.Item name={[it.name, 'price']} style={{ margin: 0 }}>
                      <InputNumber style={{ width: 90 }} min={0} precision={2}></InputNumber>
                    </Form.Item>
                    <span>元</span>
                    <Space style={{ marginLeft: 4 }}>
                      {items.length > 1 ? <MinusCircleOutlined className={css`
                          font-size: 16px;
                          color: #686868;
                          cursor: pointer;

                          &:hover {
                              color: #333;
                          }
                      `} onClick={() => onRemoveRow(it.key)}/> : undefined}
                      {it.key === items.length - 1 ? <PlusOutlined className={css`
                          font-size: 16px;
                          color: #686868;
                          cursor: pointer;

                          &:hover {
                              color: #333;
                          }
                      `} onClick={onAddRow}/> : undefined}
                    </Space>
                  </Space>
                ))
              }
            </>)}
          </Form.List>
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
        if (await callbackRef.current?.({
          ...form.getFieldsValue(),
          acquisitionDate: form.getFieldValue('acquisitionDate')
            ?.format('YYYY-MM-DD')
        })) {
          setIsOpenModal(false);
        }
      } else {
        setIsOpenModal(false);
      }
    };
    const handler: Handler<TeacherCertificatesParams> = {
      ok: (callback: (params: TeacherCertificatesParams) => Promise<boolean>, args?: {}, initialValues?: {}) => {
        form.resetFields();
        const params: any = initialValues;
        form.setFieldsValue({
          ...initialValues,
          acquisitionDate: params?.acquisitionDate === undefined ? undefined : dayjs(params?.acquisitionDate)
        });
        callbackRef.current = callback;
        setIsOpenModal(true);
        reportApi.getDataList<[]>('BASIC_TEACHER_LIST')
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
          <Form.Item name="certificateCode" label="证书编号">
            <Input></Input>
          </Form.Item>
          <Form.Item name="certificateName" label="证书名称">
            <Input></Input>
          </Form.Item>
          <Form.Item name="issuingAuthority" label="颁发机构">
            <Input></Input>
          </Form.Item>
          <Form.Item name="acquisitionDate" label="颁发日期">
            <DatePicker style={{ width: '100%' }}></DatePicker>
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
        title="项目管理"
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
            <Form.Item name="isDisplay" label="是否公开" style={{ width: '100%' }}>
              <Radio.Group>
                <Radio value={true}>公开</Radio>
                <Radio value={false}>隐藏</Radio>
              </Radio.Group>
            </Form.Item>
          </Flux>
          <Form.Item name="projectDescription" label="项目简介">
            <Input.TextArea rows={3}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>];
  }

  public static useCourseTeacherPrice(): [Handler<ProjectParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const callbackRef = useRef<((params: ProjectParams) => Promise<boolean>) | undefined>(undefined);
    const onConfirm = async () => {
      if (callbackRef.current) {
        if (await callbackRef.current?.({
          ...form.getFieldsValue(),
          time: form.getFieldValue('time') === undefined
            ? undefined : `${form.getFieldValue('time')?.[0]?.format('HH:mm')} ~ ${form.getFieldValue('time')?.[1]?.format('HH:mm')}`,
          date: form.getFieldValue('date')
            ?.format('YYYY-MM-DD')
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
        form.setFieldsValue({
          ...initialValues
        });
        callbackRef.current = callback;
        setIsOpenModal(true);
        reportApi?.getDataList<[]>('BASIC_PROJECT_LIST')
          .then(result => {
            setProjectList(result.data);
          });
        reportApi?.getDataList<[]>('BASIC_TEACHER_LIST')
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
        title="酬金计算"
        width="520px"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => onConfirm()}>
        <Form form={form} colon={false} layout="vertical">
          <Form.Item name="id" hidden={true}>
            <Input></Input>
          </Form.Item>
          <Flux size={12}>
            <Form.Item name="projectId" label="项目" style={{ width: '100%' }}>
              <Select options={projectList}></Select>
            </Form.Item>
            <Form.Item name="teacherId" label="教师" style={{ width: '100%' }}>
              <Select options={teacherList}></Select>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="hour" label="课时" style={{ width: '100%' }}>
              <InputNumber style={{ width: '100%' }}></InputNumber>
            </Form.Item>
            <Form.Item name="salary" label="薪资" style={{ width: '100%' }}>
              <InputNumber addonAfter="元" style={{ width: '100%' }}></InputNumber>
            </Form.Item>
          </Flux>
        </Form>
      </Modal>
    </>];
  }

  public static useProjectFundsInput(): [Handler<ProjectFundsParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [subjectList, setSubjectList] = useState([] as { value: string, label: string }[]);
    const [projectList, setProjectList] = useState([]);
    const [projectClassList, setProjectClassList] = useState([]);
    const callbackRef = useRef<((params: ProjectFundsParams) => Promise<boolean>) | undefined>(undefined);
    const onConfirm = async () => {
      if (callbackRef.current) {
        const subject = form.getFieldValue('subject');
        if (await callbackRef.current?.({
          ...form.getFieldsValue(),
          subjectName: subjectList.find(it => it.value === subject)?.label || ''
        })) {
          setIsOpenModal(false);
        }
      } else {
        setIsOpenModal(false);
      }
    };
    const handler: Handler<ProjectFundsParams> = {
      ok: (callback: (params: ProjectFundsParams) => Promise<boolean>, args?: {}, initialValues?: {}) => {
        form.resetFields();
        form.setFieldsValue({
          ...initialValues
        });
        callbackRef.current = callback;
        setIsOpenModal(true);
        reportApi?.getDataList<[]>('BUS_PROJECT_SUBJECT_LIST')
          .then(result => {
            setSubjectList(result.data);
          });
        reportApi?.getDataList<[]>('BASIC_PROJECT_LIST')
          .then(result => {
            setProjectList(result.data);
          });
        reportApi?.getDataList<[]>('BASIC_PROJECT_CLASS_LIST')
          .then(result => {
            setProjectClassList(result.data);
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
        title="新增分项"
        width={380}
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => onConfirm()}>
        <Form form={form} colon={false} layout="vertical">
          <Form.Item name="id" hidden={true}>
            <Input></Input>
          </Form.Item>
          <Flux size={12}>
            <Form.Item name="projectId" label="培训项目" style={{ width: '100%' }}>
              <Select options={projectList}></Select>
            </Form.Item>
            <Form.Item name="projectClassId" label="培训班" style={{ width: '100%' }}>
              <Select options={projectClassList}></Select>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="subject" label="分项" style={{ width: '100%' }}>
              <Select options={subjectList}></Select>
            </Form.Item>
            <Form.Item name="amount" label="预算金额" style={{ width: '100%' }}>
              <InputNumber style={{ width: '100%' }} min={0} precision={2}></InputNumber>
            </Form.Item>
          </Flux>
        </Form>
      </Modal>
    </>];
  }

  public static useProjectFundsFlow(): [Handler<ProjectFundsFlowParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [projectClassList, setProjectClassList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const callbackRef = useRef<((params: ProjectFundsFlowParams) => Promise<boolean>) | undefined>(undefined);
    const onConfirm = async () => {
      if (callbackRef.current) {
        if (await callbackRef.current?.({
          ...form.getFieldsValue(),
          transactionDate: form.getFieldValue('transactionDate')
            ?.format('YYYY-MM-DD')
        })) {
          setIsOpenModal(false);
        }
      } else {
        setIsOpenModal(false);
      }
    };
    const handler: Handler<ProjectFundsFlowParams> = {
      ok: (callback: (params: ProjectFundsFlowParams) => Promise<boolean>, args?: {}, initialValues?: {}) => {
        form.resetFields();
        const params = initialValues as any;
        form.setFieldsValue({
          ...initialValues,
          transactionDate: params?.transactionDate === undefined ? undefined : dayjs(params.transactionDate)
        });
        callbackRef.current = callback;
        setIsOpenModal(true);
        reportApi?.getDataList<[]>('BASIC_PROJECT_LIST')
          .then(result => {
            setProjectList(result.data);
          });
        reportApi?.getDataList<[]>('BASIC_PROJECT_CLASS_LIST')
          .then(result => {
            setProjectClassList(result.data);
          });
        reportApi?.getDataList<[]>('BUS_PROJECT_SUBJECT_LIST')
          .then(result => {
            setSubjectList(result.data);
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
        title="支出明细"
        width={460}
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => onConfirm()}>
        <Form form={form} colon={false} layout="vertical">
          <Form.Item name="id" hidden={true}>
            <Input></Input>
          </Form.Item>
          <Flux size={12}>
            <Form.Item name="projectId" label="培训项目" style={{ width: '100%' }}>
              <Select options={projectList}></Select>
            </Form.Item>
            <Form.Item name="subject" label="分项" style={{ width: '100%' }}>
              <Select options={subjectList}></Select>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="projectClassId" label="培训班" style={{ width: '100%' }}>
              <Select options={projectClassList}></Select>
            </Form.Item>
            <Form.Item name="amount" label="金额" style={{ width: '100%' }}>
              <InputNumber style={{ width: '100%' }} min={0} precision={2}></InputNumber>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="transactionDate" label="支出日期" style={{ width: '100%' }}>
              <DatePicker style={{ width: '100%' }}></DatePicker>
            </Form.Item>
            <Form.Item style={{ width: '100%' }}></Form.Item>
          </Flux>
        </Form>
      </Modal>
    </>];
  }
}
