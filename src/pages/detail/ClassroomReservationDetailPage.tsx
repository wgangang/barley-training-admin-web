import React, { useContext, useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import classroomApi from '@apis/classroom-api';
import reportApi from '@apis/report-api';
import ParentContext from '@/content/ParentContext';

export default () => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [classroomList, setClassroomList] = useState([]);
  const [durationList, _setDurationList] = useState([
    {
      label: '30分钟',
      value: '30'
    },
    {
      label: '1小时',
      value: '60'
    },
    {
      label: '1.5小时',
      value: '90'
    },
    {
      label: '2小时',
      value: '120'
    },
    {
      label: '2.5小时',
      value: '150'
    },
    {
      label: '3小时',
      value: '180'
    }
  ]);
  const [classroomId, setClassroomId] = useState('');
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue(),
      date: undefined,
      startDate: form.getFieldValue('date')?.[0]?.format('YYYY-MM-DD'),
      endDate: form.getFieldValue('date')?.[1]?.format('YYYY-MM-DD'),
      reservationTime: form.getFieldValue('reservationTime')
        ?.format('HH:mm:ss')
    };
    const result = await classroomApi.saveReservation(params);
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
    if (classroomId === '') {
      return;
    }
    reportApi.getStatistics<{ capacity: string }>('BASIC_CLASSROOM_INFO', { id: classroomId })
      .then(result => {
        if (!result.success) {
          return;
        }
        form.setFieldValue('capacity', result.data?.capacity);
      });
  }, [classroomId]);
  useEffect(() => {
    reportApi.getDataList<[]>('BASIC_CLASSROOM_LIST', {})
      .then(result => {
        setClassroomList(result.data || []);
      });
  }, []);
  return (
    <>
      <BackPageContainer title="教室预定">
        <MyCard title="预定管理" width={800}>
          <Form layout="vertical" form={form} initialValues={{ duration: '30' }}>
            <Row>
              <Col span={11}>
                <Form.Item label="教室" name="classroomId">
                  <Select options={classroomList} onChange={(e) => {
                    setClassroomId(e);
                  }}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="容量（人数）" name="capacity">
                  <Input disabled={true}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="预定日期" name="date">
                  <DatePicker.RangePicker style={{ width: '100%' }}></DatePicker.RangePicker>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="预定时间" name="reservationTime">
                  <TimePicker style={{ width: '100%' }}></TimePicker>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="时长" name="duration">
                  <Select options={durationList}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="预定人" name="reserverName">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="联系方式" name="reserverPhone">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23}>
                <Form.Item label="用途" name="purpose">
                  <Input.TextArea rows={3}></Input.TextArea>
                </Form.Item>
              </Col>
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
