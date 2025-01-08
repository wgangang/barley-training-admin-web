import React, { useContext, useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import Images from 'beer-assembly/Images';
import s3Api from '@apis/s3-api';
import MyCard from '@components/MyCard';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import reportApi from '@apis/report-api';
import { useNavigate, useParams } from 'react-router-dom';
import projectApi from '@apis/project-api';
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
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue()
    };
    const result = await projectApi.saveClass(params);
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
    reportApi.getDataList<[]>('BASIC_PROJECT_LIST')
      .then(result => {
        setProjectList(result.data);
      });
    if (id === undefined || id === '') {
      return;
    }
    reportApi.getStatistics<{}>('BUS_PROJECT_CLASS', { id })
      .then(result => {
        form.setFieldsValue(result.data);
      });
  }, []);
  return (
    <>
      <BackPageContainer title="班级信息">
        <MyCard title="班级管理" width={800}>
          <Form layout="vertical" form={form} initialValues={{ type: 'TRAIN' }}>
            <Form.Item hidden={true} name="id">
              <Input></Input>
            </Form.Item>
            <Row>
              <Col span={11}>
                <Form.Item label="项目名称" name="projectId">
                  <Select options={projectList}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="培训班名称" name="className">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="班主任" name="classHeader">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="班主任电话" name="classHeaderPhone">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="班长" name="classLeader">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="班长电话" name="classLeaderPhone">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="学习委员" name="studyCommittee">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="学习委员电话" name="studyCommitteePhone">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="宣传委员" name="publicityCommittee">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="宣传委员电话" name="publicityCommitteePhone">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="纪律委员" name="disciplineCommittee">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="纪律委员电话" name="disciplineCommitteePhone">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="生活委员" name="lifeCommittee">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="生活委员电话" name="lifeCommitteePhone">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="临时书记" name="temporarySecretary">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="临时书记电话" name="temporarySecretaryPhone">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <Col span={23}>
                <Form.Item label="简介" name="remarks">
                  <Input.TextArea rows={3} style={{ width: '100%' }}></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item label="班级图片" name="images">
                <Images
                  action={process.env.IMAGE_URL || ''}
                  maxLength={1}
                  buttonText="上传班级图片"
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
