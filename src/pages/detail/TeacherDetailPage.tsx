import React, { useContext, useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import deviceInfoApi from '@apis/device-info-api';
import reportApi from '@apis/report-api';
import ParentContext from '@/content/ParentContext';

export default () => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [form] = Form.useForm();
  const [educationList, _setEducationList] = useState([
    {
      label: '大专',
      value: 'ASSOCIATE'
    },
    {
      label: '本科',
      value: 'BACHELOR'
    },
    {
      label: '硕士',
      value: 'MASTER'
    },
    {
      label: '博士',
      value: 'DOCTORAL'
    },
    {
      label: '其他',
      value: ''
    }
  ]);
  const [teacherTitleList, setTeacherTitleList] = useState([]);
  const navigate = useNavigate();
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue(),
      birthDate: form.getFieldValue('birthDate')
        ?.format('YYYY-MM-DD')
    };
    const result = await deviceInfoApi.save(params);
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
    reportApi.getDataList<[]>('BASIC_TEACHER_TITLE')
      .then(result => {
        setTeacherTitleList(result.data);
      });
  }, []);
  return (
    <>
      <BackPageContainer title="师资信息">
        <MyCard title="教师简介" width={800}>
          <Form layout="vertical" form={form}>
            <Row>
              <Col span={11}>
                <Form.Item label="姓名" name="name">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="性别" name="gender">
                  <Radio.Group>
                    <Radio value="MALE">男</Radio>
                    <Radio value="FEMALE">女</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="生日" name="birthDate">
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="职称" name="titleId">
                  <Select options={teacherTitleList}></Select>
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="电话" name="phone">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="邮箱" name="email">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="联系地址" name="address">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="学历" name="education">
                  <Select options={educationList}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23}>
                <Form.Item label="教育经历" name="educationalExperience">
                  <Input.TextArea rows={3} style={{ width: '100%' }}></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23}>
                <Form.Item label="工作经历" name="workExperience">
                  <Input.TextArea rows={3} style={{ width: '100%' }}></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23}>
                <Form.Item label="备注" name="remarks">
                  <Input.TextArea rows={3} style={{ width: '100%' }}></Input.TextArea>
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
