import React, { useContext, useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import ImagesContainer from '@components/ImagesContainer';
import reportApi from '@apis/report-api';
import dayjs from 'dayjs';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import s3Api from '@apis/s3-api';
import { useNavigate, useParams } from 'react-router-dom';
import contractApi from '@apis/contract-api';
import ParentContext from '@/content/ParentContext';
import { Modals } from '@/utils';

const { RangePicker } = DatePicker;

export default (props: { preview?: boolean, audit?: boolean }) => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [audioModal, contextHolder] = Modals.useAudioModal();
  const [detail, setDetail] = useState<any>({});
  const navigate = useNavigate();
  const [supplierList, setSupplierList] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const onConfirm = async () => {
    const fieldValue = form.getFieldsValue();
    const params = {
      ...detail,
      ...fieldValue,
      id: undefined,
      purchaseContractTime: undefined,
      purchaseContractStartTime: dayjs(fieldValue?.purchaseContractTime?.[0])
        ?.format('YYYY-MM-DD 00:00:00'),
      purchaseContractEndTime: dayjs(fieldValue?.purchaseContractTime?.[1])
        ?.format('YYYY-MM-DD 23:59:59')
    };
    messageApi?.loading('提交数据中...');
    const result = await contractApi.save(params);
    messageApi?.destroy();
    if (result.success) {
      messageApi?.success('保存采购合同成功！')
        .then();
      active();
      navigate(-1);
    } else {
      messageApi?.error(result.message)
        .then();
    }
  };
  const onAddRow = () => {
    const array = form.getFieldValue('purchaseAmountAndDiscountInfo');
    form.setFieldValue('purchaseAmountAndDiscountInfo', [...array, {
      purchasePriceMin: '',
      type: '',
      value: ''
    }]);
  };
  const onRemoveRow = (index: number) => {
    const array = form.getFieldValue('purchaseAmountAndDiscountInfo');
    const newArray = [...array];
    newArray.splice(index, 1);
    form.setFieldValue('purchaseAmountAndDiscountInfo', newArray);
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
        result = await contractApi.agree(id);
      } else {
        result = await contractApi.reject(id, params.auditRejectReason);
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
    reportApi.getDataList<[]>('SUPPLIER_INFO_LIST')
      .then(result => {
        setSupplierList(result.data);
      });
    if (!props?.preview) {
      form.setFieldValue('purchaseAmountAndDiscountInfo', [{
        purchasePriceMin: '',
        type: '',
        value: ''
      }]);
    }
    if (id === undefined || id === '' || Number(id) <= 0) {
      return;
    }
    reportApi.getStatistics<any>(props?.preview ? 'CONTRACT_AUDIT_DETAIL' : 'CONTRACT_DETAIL', { id })
      .then(result => {
        const value = {
          ...result.data,
          purchaseContractId: id,
          purchaseContractTime: [dayjs(result.data?.purchaseContractStartTime), dayjs(result.data?.purchaseContractEndTime)]
        };
        form.setFieldsValue(value);
        setDetail(value);
      });
  }, []);
  return (
    <>
      {contextHolder}
      <BackPageContainer title="采购信息">
        <MyCard title="基础信息" width={800}>
          <Form layout="vertical" form={form}>
            <Row>
              <Col span={11}>
                <Form.Item label="合同名称" name="purchaseContractName">
                  <Input readOnly={props?.preview}></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="供货商" name="supplierId">
                  <Select disabled={props?.preview} options={supplierList}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="合同类型" name="purchaseContractType">
                  <Select disabled={props?.preview} options={[{
                    label: '长期有效',
                    value: 'LONG_TERM'
                  }, {
                    label: '预付合同',
                    value: 'PREPAY'
                  }, {
                    label: '服务采购合同',
                    value: 'SERVICE_PURCHASE'
                  }]}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="生效日期" name="purchaseContractTime">
                  <RangePicker disabled={props?.preview} style={{ width: '100%' }}></RangePicker>
                </Form.Item>
              </Col>
            </Row>
            {detail?.purchaseContractSnapshot === undefined ? undefined : <Row>
              <Col span={24}>
                <Form.Item label="电子版本" name="purchaseContractSnapshot">
                  <ImagesContainer
                    disabled={props?.preview}
                    action={process.env.IMAGE_URL || ''}
                    buttonText="上传电子合同"
                    requestUrl={async (url) => s3Api.getUrl(url)
                      .then(a => a.data)}
                  />
                </Form.Item>
              </Col>
            </Row>}

            <p style={{
              fontWeight: 500,
              fontSize: 14,
              margin: '12px 0 20px 0'
            }}>采购金额和折扣信息</p>
            <Form.List name="purchaseAmountAndDiscountInfo">
              {(items) => (<>
                {
                  items.map(it => (
                    <Space key={it.key} style={{ marginBottom: 12 }}>
                      <span>采购金额门槛</span>
                      <Form.Item name={[it.key, 'purchasePriceMin']} style={{ margin: 0 }}>
                        <Input readOnly={props?.preview} style={{ width: 120 }}></Input>
                      </Form.Item>
                      <span>享</span>
                      <Form.Item name={[it.key, 'type']} style={{ margin: 0 }}>
                        <Select disabled={props?.preview} style={{ width: 120 }} options={[
                          {
                            label: '折扣',
                            value: 'DISCOUNT'
                          }, {
                            label: '返现',
                            value: 'CASHBACK'
                          }
                        ]}></Select>
                      </Form.Item>
                      <Form.Item name={[it.name, 'value']} style={{ margin: 0 }}>
                        <Input readOnly={props?.preview} style={{ width: 120 }}></Input>
                      </Form.Item>
                      {props?.preview ? undefined : <Space style={{ marginLeft: 4 }}>
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
                      </Space>}
                    </Space>
                  ))
                }
              </>)}
            </Form.List>
          </Form>
          {props?.preview ? undefined : <Row style={{ marginTop: 24 }}>
            <Col>
              <Space size={16}>
                <Button type="primary" onClick={onConfirm}>保存</Button>
                <Button onClick={onCancel}>取消</Button>
              </Space>
            </Col>
          </Row>}
          {props?.audit ? <Row style={{ marginTop: 24 }}>
            <Col>
              <Button type="primary" onClick={onAudit}>审核</Button>
            </Col>
          </Row> : undefined}
        </MyCard>
      </BackPageContainer>
    </>
  );
};
