import React, { useContext, useEffect, useState } from 'react';
import MyCard from '@components/MyCard';
import { Button, Col, Divider, Form, Input, Modal, Radio, Row, Select, Space } from 'antd';
import reportApi from '@apis/report-api';
import BackPageContainer from '@components/BackPageContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { ProTable } from '@ant-design/pro-components';
import InlineContainer from '@components/InlineContainer';
import purchaseOrderApi from '@apis/purchase-order-api';
import ParentContext from '@/content/ParentContext';
import { Modals, NumberUtils } from '@/utils';

export default (props: { preview?: boolean, audit?: boolean, read?: boolean }) => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [detail, setDetail] = useState<any>({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [goodsForm] = Form.useForm();
  const [form] = Form.useForm();
  const [audioModal, contextHolder] = Modals.useAudioModal();
  const [display, setDisplay] = useState(false);
  const [contractList, setContractList] = useState([]);
  const [isGoodsOpenModal, setIsGoodOpenModal] = useState(false);
  const [selectGoods, setSelectGoods] = useState({} as { name: string, id: string });
  const [purchaseSpuId, setPurchaseSpuId] = useState('');
  const requestGoods = async (id: string) => {
    const result = await reportApi.getStatistics<{ purchasePrice: string }>('PURCHASE_ORDER_GOODS', { id });
    if (result.success) {
      const amount = (Number(form.getFieldValue('quantity') || '0')
        * Number(result.data.purchasePrice || '0')).toFixed(2);
      goodsForm.setFieldsValue(result.data);
      form.setFieldValue('finalPrice', NumberUtils.ifGeZeroNumeric(amount, ''));
      setDisplay(true);
    }
  };
  const onConfirm = async () => {
    const fieldValue = form.getFieldsValue();
    const params = {
      purchaseSpuId,
      ...detail,
      ...fieldValue
    };
    const result = await purchaseOrderApi.save(params);
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
        result = await purchaseOrderApi.agree(id);
      } else {
        result = await purchaseOrderApi.reject(id, params.auditRejectReason);
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
  const requestPurchaseGoods = async () => {
    return reportApi.search('SUPPLIER_PURCHASE_GOODS', {});
  };
  const onConfirmGoods = async () => {
    setIsGoodOpenModal(false);
    setPurchaseSpuId(selectGoods.id);
    await requestGoods(selectGoods.id);
  };
  useEffect(() => {
    reportApi.getDataList<[]>('PURCHASE_CONTRACT_LIST', {
      purchaseContractStatus: 'ACTIVE',
      scene: 'MALL',
      supplierId: '1813031615721811970'
    })
      .then(result => {
        setContractList(result.data);
      });
    if (id === undefined || id === '' || Number(id) <= 0) {
      return;
    }
    setDisplay(true);
    reportApi.getStatistics<any>(props?.preview ? 'PURCHASE_ORDER_AUDIT_DETAIL' : 'PURCHASE_ORDER_DETAIL', { id })
      .then(result => {
        const value = {
          ...result.data,
          purchaseOrderId: id
        };
        form.setFieldsValue(value);
        setDetail(value);
        requestGoods(selectGoods.id)
          .then();
      });
  }, []);
  return (
    <>
      {contextHolder}
      <BackPageContainer title="申请采购">
        <MyCard title="采购信息" width={1200}>
          {props?.preview || props?.read ? undefined : <Row style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={() => setIsGoodOpenModal(true)}>选择采购商品</Button>
          </Row>}
          <div style={{ display: display ? 'block' : 'none' }}>
            <Form layout="vertical" form={goodsForm}>
              <Row>
                <Col span={5}>
                  <Form.Item label="SKU" name="id">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="商品" name="spuName">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="规格" name="skuName">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="标准售价" name="skuSellPrice">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Form.Item label="供货商" name="supplierShortName">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="采购商品名称" name="purchaseSpuName">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="采购商品规格" name="purchaseSkuName">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="计量单位" name="meteringUnit">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Form.Item label="采购价" name="purchasePrice">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="税率" name="taxRate">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider/>
            <Form layout="vertical" form={form}>
              <Row>
                <Col span={5}>
                  <Form.Item label="采购合同" name="purchaseContractId">
                    <Select options={contractList} disabled={props?.preview || props?.read}></Select>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="采购数量" name="quantity">
                    <Input onChange={(e) => {
                      form.setFieldValue('finalPrice', NumberUtils.ifGeZeroNumeric(
                        (Number(e.target.value) * Number(goodsForm.getFieldValue('purchasePrice'))).toFixed(2)
                      ));
                    }} readOnly={props?.preview || props?.read}></Input>
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item label="最终金额" name="finalPrice">
                    <Input readOnly={true}></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label="备注" name="remarks">
                    <Input.TextArea rows={4} readOnly={props?.preview || props?.read}></Input.TextArea>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            {props?.preview || props?.read ? undefined : <Row>
              <Col>
                <Space>
                  <Button type="primary" onClick={onConfirm}>保存</Button>
                  <Button onClick={onCancel}>取消</Button>
                </Space>
              </Col>
            </Row>}
            {props?.audit ? <Row>
              <Button type="primary" onClick={onAudit}>审核</Button>
            </Row> : undefined}
          </div>
        </MyCard>
        <Modal
          open={isGoodsOpenModal}
          onCancel={() => setIsGoodOpenModal(false)}
          onOk={() => onConfirmGoods()}
          width={800}
          title="选择采购商品"
          styles={{ body: { padding: 0 } }}
        >
          <InlineContainer>
            <ProTable
              cardProps={{
                bodyStyle: {
                  padding: 0
                }
              }}
              size="small"
              search={false}
              options={false}
              rowKey="id"
              headerTitle={<>
                <Form>
                  <Space>
                    <Form.Item name="spuName" style={{ marginBottom: 0 }}>
                      <Input placeholder="请输入商品名称"></Input>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Space>
                        <Button type="primary">查询</Button>
                      </Space>
                    </Form.Item>
                  </Space>
                </Form>
              </>}
              toolBarRender={() => [
                <>
                  {selectGoods?.name === undefined ? undefined : <span style={{
                    color: '#606266',
                    fontSize: 13
                  }}>已选择商品：</span>}
                  <span style={{
                    fontWeight: 500,
                    fontSize: 13
                  }}>{selectGoods?.name}</span>
                </>
              ]}
              columns={[
                {
                  title: '商品名称',
                  dataIndex: 'spuName',
                  key: 'spuName',
                  width: '240px'
                },
                {
                  title: '商品类型',
                  dataIndex: 'spuType',
                  key: 'spuType',
                  width: '120px'
                },
                {
                  title: '商品规格',
                  dataIndex: 'skuName',
                  key: 'skuName'
                }
              ]}
              request={requestPurchaseGoods}
              expandable={{
                expandedRowRender: (record) => <>
                  <Radio.Group onChange={(e) => {
                    const id = e.target.value.toString();
                    const item = record.child.find((it: any) => it.id === id);
                    const name = item.supplierShortName + '（' + item.taxRate + '）：' + record.spuName + '-' + item.purchasePrice;
                    setSelectGoods({
                      id,
                      name
                    });
                  }}>
                    <Space direction="vertical" style={{
                      margin: '0 0 0 38px'
                    }}>
                      {record.child?.map((item: any, index: number) => (
                        <Radio value={item.id} key={index}>
                          <span style={{ color: '#606266' }}>供货商：</span>
                          {item.supplierShortName}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span style={{ color: '#606266' }}>采购价格：</span>
                          {item.purchasePrice}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span style={{ color: '#606266' }}>税率：</span>
                          {item.taxRate}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </>,
                rowExpandable: (record) => true
              }}
            />
          </InlineContainer>
        </Modal>
      </BackPageContainer>
    </>
  );
};
