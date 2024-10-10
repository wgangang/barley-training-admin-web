import React, { useContext, useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import ImagesContainer from 'beer-assembly/ImagesContainer';
import s3Api from '@apis/s3-api';
import reportApi from '@apis/report-api';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import deviceInfoApi from '@apis/device-info-api';
import ParentContext from '@/content/ParentContext';

export default () => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [deviceTypeList, setDeviceTypeList] = useState([]);
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue(),
      purchaseDate: form.getFieldValue('purchaseDate')
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
    reportApi.getDataList<[]>('BASIC_DEVICE_TYPE')
      .then(result => {
        if (!result.success) {
          return;
        }
        setDeviceTypeList(result.data);
      });
    if (id === undefined || id === '') {
      return;
    }
    reportApi.getStatistics<{ purchaseDate: string }>('BASIC_DEVICE_INFO', { id })
      .then(result => {
        form.setFieldsValue({
          ...(result.data || {}),
          purchaseDate: result.data?.purchaseDate === undefined ? undefined : dayjs(result.data?.purchaseDate)
        });
      });
  }, []);
  return (
    <>
      <BackPageContainer title="设备信息">
        <MyCard title="设备管理" width={800}>
          <Form layout="vertical" form={form}>
            <Form.Item hidden={true} name="id">
              <Input></Input>
            </Form.Item>
            <Row>
              <Col span={11}>
                <Form.Item label="设备名称" name="deviceName">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="设备编号" name="deviceCode">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="设备IP" name="deviceIp">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="序列号" name="serialNumber">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="设备类型" name="deviceType">
                  <Select options={deviceTypeList}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="设备型号" name="model">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="购买日期" name="purchaseDate">
                  <DatePicker style={{ width: '100%' }}></DatePicker>
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
            <Row>
              <Form.Item label="附件" name="images">
                <ImagesContainer
                  action={process.env.IMAGE_URL || ''}
                  buttonText="上传设备图片"
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
