import React, { useContext, useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import ImagesContainer from 'beer-assembly/ImagesContainer';
import s3Api from '@apis/s3-api';
import MyCard from '@components/MyCard';
import { DatePicker, Button, Col, Form, Input, Row, Select, Space, InputNumber, TimePicker } from 'antd';
import reportApi from '@apis/report-api';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import courseApi from '@apis/course-api';
import ParentContext from '@/content/ParentContext';

export default () => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
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
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue(),
      time: form.getFieldValue('time') === undefined
        ? undefined : `${form.getFieldValue('time')?.[0]?.format('HH:mm')} ~ ${form.getFieldValue('time')?.[1]?.format('HH:mm')}`,
      date: form.getFieldValue('date')
        ?.format('YYYY-MM-DD')
    };
    const result = await courseApi.save(params);
    if (result.success) {
      messageApi?.success('保存成功！')
        .then();
      active();
      navigate(-1);
    } else {
      messageApi?.error(result.message)
        .then();
    }
  };
  const onCancel = () => {
    navigate(-1);
  };
  useEffect(() => {
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

    if (id === undefined || id === '') {
      return;
    }

    reportApi.getStatistics<{ time: string, date: string }>('BUS_COURSE_INFO', { id })
      .then(result => {
        const values = result.data?.time?.toString().split('~');
        form.setFieldsValue({
          ...(result.data || {}),
          date: result.data?.date === undefined ? undefined : dayjs(result.data?.date),
          time: values === undefined ? undefined : [dayjs(values[0]?.trim(), 'HH:mm'), dayjs(values[1]?.trim(), 'HH:mm')]
        });
      });
  }, []);
  return (
    <>
      <BackPageContainer title="授课计划">
        <MyCard title="计划信息" width={800}>
          <Form layout="vertical" form={form} initialValues={{ type: 'TRAIN' }}>
            <Form.Item hidden={true} name="id">
              <Input></Input>
            </Form.Item>
            <Row>
              <Col span={11}>
                <Form.Item name="projectId" label="培训项目" style={{ width: '100%' }}>
                  <Select options={projectList}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item name="teacherId" label="教师名称" style={{ width: '100%' }}>
                  <Select options={teacherList}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="classId" label="培训班名称" style={{ width: '100%' }}>
                  <Select options={projectClassList}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item name="classroomId" label="教室" style={{ width: '100%' }}>
                  <Select options={classRoomList}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="supervise" label="督导员" style={{ width: '100%' }}>
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item name="supervisePhone" label="督导电话" style={{ width: '100%' }}>
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="date" label="培训日期" style={{ width: '100%' }}>
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item name="time" label="培训时间" style={{ width: '100%' }}>
                  <TimePicker.RangePicker style={{ width: '100%' }}></TimePicker.RangePicker>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="trainingForm" label="培训形式" style={{ width: '100%' }}>
                  <Select options={trainingFormList}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item name="hours" label="课时" style={{ width: '100%' }}>
                  <InputNumber style={{ width: '100%' }} min={1} max={999}></InputNumber>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item name="trainingContent" label="培训内容" style={{ width: '100%' }}>
                <Input.TextArea rows={3}></Input.TextArea>
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="课件信息" name="files">
                <ImagesContainer
                  action={process.env.IMAGE_URL || ''}
                  fileTypes={['png', 'jpg', 'doc', 'docx', 'pdf']}
                  maxLength={1}
                  buttonText="上传课件"
                  requestUrl={async (url) => s3Api.getUrl(url)
                    .then(a => a.data)} />
              </Form.Item>
            </Row>
          </Form>
          <Row style={{ marginTop: 24 }}>
            <Col>
              <Space size={16}>
                <Button type="primary" onClick={onConfirm}>保存</Button>
                <Button onClick={onCancel}>取消</Button>
              </Space>
            </Col>
          </Row>
        </MyCard>
      </BackPageContainer>
    </>
  );
};
