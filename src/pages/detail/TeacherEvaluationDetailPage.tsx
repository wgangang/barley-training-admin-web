import React, { useContext, useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Button, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select, Space } from 'antd';
import Images from 'beer-assembly/Images';
import dayjs from 'dayjs';
import s3Api from '@apis/s3-api';
import reportApi from '@apis/report-api';
import teacherApi from '@apis/teacher-api';
import { useNavigate, useParams } from 'react-router-dom';
import ParentContext from '@/content/ParentContext';

export default () => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacherList, setTeacherList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue()
    };
    const result = await teacherApi.saveEvaluation(params);
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
    reportApi.getDataList<[]>('BASIC_TEACHER_LIST')
      .then(result => {
        setTeacherList(result.data);
      });
    reportApi.getDataList<[]>('BASIC_PROJECT_LIST')
      .then(result => {
        setProjectList(result.data);
      });
    if (id === undefined || id === '') {
      return;
    }
    reportApi.getStatistics<{ evaluationDate: string }>('BASIC_TEACHER_EVALUATION', { id })
      .then(result => {
        form.setFieldsValue({
          ...(result.data || {}),
          evaluationDate: result.data?.evaluationDate === undefined ? undefined : dayjs(result.data?.evaluationDate)
        });
      });
  }, []);
  return (
    <>
      <BackPageContainer title="师资评估">
        <MyCard title="师资评估" width={800}>
          <Form layout="vertical" form={form}>
            <Form.Item hidden={true} name="id">
              <Input></Input>
            </Form.Item>
            <Row>
              <Col span={11}>
                <Form.Item label="教师" name="teacherId">
                  <Select options={teacherList}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="项目" name="projectId">
                  <Select options={projectList}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="评估分数" name="score">
                  <InputNumber style={{ width: '100%' }} min={0} max={100}></InputNumber>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="评估日期" name="evaluationDate">
                  <DatePicker style={{ width: '100%' }}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="评估结果" name="result">
                  <Radio.Group>
                    <Radio value="PASS">通过</Radio>
                    <Radio value="NOT_PASS">拒绝</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item label="评估表" name="images">
                <Images
                  action={process.env.IMAGE_URL || ''}
                  buttonText="上传意见书"
                  requestUrl={async (url) => s3Api.getUrl(url)
                    .then(a => a.data)}/>
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
