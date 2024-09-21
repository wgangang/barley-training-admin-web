import React, { useContext, useEffect, useState } from 'react';
import MyCard from '@components/MyCard';
import { Button, Col, Divider, Form, Input, Row, Select, Space } from 'antd';
import s3Api from '@apis/s3-api';
import ImagesContainer from '@components/ImagesContainer';
import BackPageContainer from '@components/BackPageContainer';
import supplierApi from '@apis/supplier-api';
import { useNavigate, useParams } from 'react-router-dom';
import reportApi from '@apis/report-api';
import ParentContext from '@/content/ParentContext';
import { Modals } from '@/utils';

export default (props: { preview?: boolean, audit?: boolean }) => {
  const {
    active,
    messageApi,
    modal
  } = useContext(ParentContext);
  const [audioModal, contextHolder] = Modals.useAudioModal();
  const [detail, setDetail] = useState<any>({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const onConfirm = async () => {
    const fieldValue = form.getFieldsValue();
    const params = {
      ...detail,
      ...fieldValue
    };
    messageApi?.loading('提交数据中...');
    const result = await supplierApi.save(params);
    messageApi?.destroy();
    if (result.success) {
      messageApi?.success('保存供货商信息成功！')
        .then();
      active();
      navigate(-1);
    } else {
      messageApi?.error(result.message)
        .then();
    }
  };
  const onCancel = async () => {
    navigate(-1);
  };
  const onAudit = async () => {
    if (id === undefined) {
      return;
    }
    audioModal.ok(async (params) => {
      let result;
      if (params.status) {
        result = await supplierApi.agree(id);
      } else {
        result = await supplierApi.reject(id, params.auditRejectReason);
      }
      if (result.success) {
        messageApi?.success('处理成功！')
          .then();
        navigate(-1);
        active();
        return true;
      }
      messageApi?.error(result.message || '审核失败')
        .then();
      return false;
    });
  };
  useEffect(() => {
    if (id === undefined || id === '' || Number(id) <= 0) {
      return;
    }
    reportApi.getStatistics<any>(props?.preview ? 'SUPPLIER_AUDIT_DETAIL' : 'SUPPLIER_DETAIL', { id })
      .then(result => {
        const value = {
          ...result.data,
          supplierId: id
        };
        form.setFieldsValue(value);
        setDetail(value);
      });
  }, []);
  return (
    <>
      {contextHolder}
      <BackPageContainer title="供货商信息">
        <Form layout="vertical" form={form}>
          <MyCard title="供货商详情" width={800}>
            <Row>
              <Col span={11}>
                <Form.Item label="供货商名称" name="supplierName">
                  <Input readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="供货商简称" name="supplierShortName">
                  <Input readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="供货场景" name="scenes">
                  <Select mode="multiple" options={[{
                    label: '商城',
                    value: 'MALL'
                  }]} disabled={props?.preview}/>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="联系人姓名" name="contactName">
                  <Input readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item label="联系人职位" name="contactPosition">
                  <Input readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="联系电话" name="contactPhone">
                  <Input readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item label="联系邮箱" name="contactEmail">
                  <Input readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="公司地址" name="companyAddress">
                  <Input readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
            </Row>

            {
              (props?.preview && (detail.companyLicence === undefined || detail.companyLicence.length === 0))
                ? undefined : <Row>
                  <Col span={24}>
                    <Form.Item label="资质/许可证" name="companyLicence">
                      <ImagesContainer
                        action={process.env.IMAGE_URL || ''}
                        disabled={props?.preview}
                        buttonText="上传资质"
                        requestUrl={async (url) => s3Api.getUrl(url)
                          .then(a => a.data)}/>
                    </Form.Item>
                  </Col>
                </Row>
            }

            <Divider/>

            <Row>
              <Col span={11}>
                <Form.Item label="发票抬头" name="invoiceTitle">
                  <Input maxLength={50} readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="纳税人识别号" name="invoiceTaxCode">
                  <Input maxLength={50} readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="公司地址" name="invoiceCompanyAddress">
                  <Input maxLength={50} readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="公司电话" name="invoiceCompanyPhone">
                  <Input maxLength={50} readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="开户银行" name="invoiceBankName">
                  <Input maxLength={50} readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="开户账号" name="invoiceBankAccount">
                  <Input maxLength={50} readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
            </Row>
            {props?.preview ? undefined : <Row>
              <Space size={16}>
                <Button type="primary" onClick={onConfirm}>保存</Button>
                <Button onClick={onCancel}>取消</Button>
              </Space>
            </Row>}
            {props?.audit ? <Row>
              <Button type="primary" onClick={onAudit}>审核</Button>
            </Row> : undefined}
          </MyCard>
        </Form>
      </BackPageContainer>
    </>
  );
};
