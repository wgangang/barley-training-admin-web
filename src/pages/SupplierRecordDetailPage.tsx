import React, { useContext, useEffect, useState } from 'react';
import MyCard from '@components/MyCard';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import reportApi from '@apis/report-api';
import BackPageContainer from '@components/BackPageContainer';
import { useNavigate, useParams } from 'react-router-dom';
import supplierRecordApi from '@apis/supplier-record-api';
import ParentContext from '@/content/ParentContext';
import { Modals } from '@/utils';

export default (props: { preview?: boolean, audit?: boolean, read?: boolean }) => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const navigate = useNavigate();
  const [audioModal, contextHolder] = Modals.useAudioModal();
  const [detail, setDetail] = useState<any>({});
  const [form] = Form.useForm();
  const { id } = useParams();
  const [contractList, setContractList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const onConfirm = async () => {
    const fieldValue = form.getFieldsValue();
    const params = {
      ...fieldValue,
      modifyType: 'INCREMENT'
    };
    messageApi?.loading('提交数据中...');
    const result = await supplierRecordApi.save(params);
    messageApi?.destroy();
    if (result.success) {
      messageApi?.success('保存供应商付款记录成功！')
        .then();
      active();
      navigate(-1);
    } else {
      messageApi?.error(result.message)
        .then();
    }
  };
  const onAudit = async () => {
    if (id === undefined) {
      return;
    }
    audioModal.ok(async (params) => {
      let result;
      if (params.status) {
        result = await supplierRecordApi.agree(id);
      } else {
        result = await supplierRecordApi.reject(id, params.auditRejectReason);
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
    if (supplierId === undefined || supplierId === '') {
      return;
    }
    reportApi.getDataList<{ value: string }[]>('PURCHASE_CONTRACT_LIST', {
      purchaseContractStatus: 'ACTIVE',
      scene: 'MALL',
      supplierId
    })
      .then(result => {
        setContractList(result.data as never);
        form.resetFields(['purchaseContractId']);
      });
  }, [supplierId]);
  useEffect(() => {
    reportApi.getDataList<[]>('SUPPLIER_INFO_LIST')
      .then(result => {
        setSupplierList(result.data);
      });
    reportApi.getStatistics<any>(props?.preview ? 'SUPPLIER_RECORD_AUDIT_DETAIL' : 'SUPPLIER_RECORD_DETAIL', { id })
      .then(result => {
        const value = {
          ...result.data
        };
        form.setFieldsValue(value);
        setDetail(result.data);
      });
  }, []);
  return (
    <>
      {contextHolder}
      <BackPageContainer title="预付供货款">
        <Form layout="vertical" form={form}>
          <MyCard title="预付信息" width={800}>
            <Row>
              <Col span={11}>
                <Form.Item label="供货商" name="supplierId">
                  <Select options={supplierList} onChange={(e) => {
                    setSupplierId(e);
                  }} disabled={props?.preview || props?.read}/>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="合同" name="purchaseContractId">
                  <Select options={contractList} disabled={props?.preview || props?.read}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="预付款" name="modifyAmount">
                  <Input readOnly={props?.preview || props?.read}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23}>
                <Form.Item label="备注" name="remarks">
                  <Input.TextArea rows={4} readOnly={props?.preview || props?.read}></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            {props?.preview || props?.read ? undefined : <Row>
              <Col>
                <Space>
                  <Button type="primary" onClick={onConfirm}>保存</Button>
                  <Button onClick={() => navigate(-1)}>取消</Button>
                </Space>
              </Col>
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
