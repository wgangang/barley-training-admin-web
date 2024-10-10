import React, { ReactNode, useRef, useState } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, Radio, Select, TimePicker } from 'antd';
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

  public static useProjectClass(): [Handler<ProjectParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [projectList, setProjectList] = useState([]);
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
        reportApi?.getDataList<[]>('BASIC_PROJECT_LIST')
          .then(result => {
            setProjectList(result.data);
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
        title="班级信息"
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
            <Form.Item name="className" label="班级" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="classLeader" label="班长" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="classLeaderPhone" label="班长电话" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="studyCommittee" label="学习委员" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="studyCommitteePhone" label="学习委员电话" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="publicityCommittee" label="宣传委员" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="publicityCommitteePhone" label="宣传委员电话" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="disciplineCommittee" label="纪律委员" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="disciplineCommitteePhone" label="纪律委员电话" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="lifeCommittee" label="生活委员" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="lifeCommitteePhone" label="生活委员电话" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="temporarySecretary" label="书记" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="temporarySecretaryPhone" label="书记电话" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
        </Form>
      </Modal>
    </>];
  }

  public static useCourse(): [Handler<ProjectParams>, ReactNode] {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const [projectClassList, setProjectClassList] = useState([]);
    const [classRoomList, setClassRoomList] = useState([]);
    const [trainingFormList, _setTrainingFormList] = useState([
      {
        label: '线下培训',
        value: 'OFFLINE'
      }
    ]);
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
        const params = initialValues as any;
        const values = params?.time?.toString()
          .split('~');
        form.setFieldsValue({
          ...initialValues,
          date: params?.date === undefined ? undefined : dayjs(params?.date),
          time: values === undefined ? undefined : [dayjs(values[0]?.trim(), 'HH:mm'), dayjs(values[1]?.trim(), 'HH:mm')]
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
        reportApi?.getDataList<[]>('BASIC_PROJECT_CLASS_LIST')
          .then(result => {
            setProjectClassList(result.data);
          });
        reportApi?.getDataList<[]>('BASIC_CLASSROOM_LIST')
          .then(result => {
            setClassRoomList(result.data);
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
        title="授课计划"
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
            <Form.Item name="teacherId" label="讲师" style={{ width: '100%' }}>
              <Select options={teacherList}></Select>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="classId" label="班级" style={{ width: '100%' }}>
              <Select options={projectClassList}></Select>
            </Form.Item>
            <Form.Item name="classroomId" label="教室" style={{ width: '100%' }}>
              <Select options={classRoomList}></Select>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="supervise" label="督导员" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="supervisePhone" label="督导电话" style={{ width: '100%' }}>
              <Input></Input>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="date" label="培训日期" style={{ width: '100%' }}>
              <DatePicker style={{ width: '100%' }}></DatePicker>
            </Form.Item>
            <Form.Item name="time" label="培训时间" style={{ width: '100%' }}>
              <TimePicker.RangePicker style={{ width: '100%' }}></TimePicker.RangePicker>
            </Form.Item>
          </Flux>
          <Flux size={12}>
            <Form.Item name="trainingForm" label="培训形式" style={{ width: '100%' }}>
              <Select options={trainingFormList}></Select>
            </Form.Item>
            <Form.Item style={{ width: '100%' }}>
            </Form.Item>
          </Flux>
          <Form.Item name="trainingContent" label="培训内容" style={{ width: '100%' }}>
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
}
