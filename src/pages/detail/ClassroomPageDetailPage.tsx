import React, { useContext, useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import reportApi from '@apis/report-api';
import { useNavigate, useParams } from 'react-router-dom';
import classroomApi from '@apis/classroom-api';
import ParentContext from '@/content/ParentContext';

export default () => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [classroomList, _setClassRoomList] = useState([
    {
      label: '培训',
      value: 'TRAIN'
    }
  ]);
  const [deviceList, setDeviceList] = useState([]);
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue()
    };
    const result = await classroomApi.save(params);
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
    reportApi.getDataList<[]>('BASIC_DEVICE_LIST', { classroomId: id })
      .then(result => {
        setDeviceList(result.data);
      });
    if (id === undefined || id === '') {
      return;
    }
    reportApi.getStatistics<{}>('BASIC_CLASSROOM_INFO', { id })
      .then(result => {
        form.setFieldsValue(result.data);
      });
  }, []);
  return (
    <>
      <BackPageContainer title="教室信息">
        <MyCard title="教室管理" width={800}>
          <Form layout="vertical" form={form} initialValues={{ type: 'TRAIN' }}>
            <Form.Item hidden={true} name="id">
              <Input></Input>
            </Form.Item>
            <Row>
              <Col span={11}>
                <Form.Item label="教室名称" name="name">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="教室号" name="code">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="容量（人数）" name="capacity">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="教室类型" name="type">
                  <Select options={classroomList}/>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="设备列表" name="device">
              <Select options={deviceList} mode="multiple"></Select>
            </Form.Item>
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
