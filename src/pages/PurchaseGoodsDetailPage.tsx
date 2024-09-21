import React, { useContext, useEffect, useRef, useState } from 'react';
import MyCard from '@components/MyCard';
import { Button, Col, DatePicker, Form, Input, Modal, Radio, Row, Select, Space } from 'antd';
import BackPageContainer from '@components/BackPageContainer';
import { useNavigate, useParams } from 'react-router-dom';
import reportApi from '@apis/report-api';
import { ActionType, ProTable } from '@ant-design/pro-components';
import InlineContainer from '@components/InlineContainer';
import dayjs from 'dayjs';
import purchaseGoodsApi from '@apis/purchase-goods-api';
import ParentContext from '@/content/ParentContext';
import { Modals } from '@/utils';

export default (props: { edit?: boolean, audit?: boolean, preview?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const tableRef = useRef<ActionType>(null);
  const [form] = Form.useForm();
  const [audioModal, contextHolder] = Modals.useAudioModal();
  const [detail, setDetail] = useState<any>({});
  const [supplierList, setSupplierList] = useState([]);
  const [taxRate] = useState([
    {
      label: '0%',
      value: '0'
    },
    {
      label: '3%',
      value: '3'
    },
    {
      label: '6%',
      value: '6'
    },
    {
      label: '9%',
      value: '9'
    },
    {
      label: '13%',
      value: '13'
    }
  ]);
  const [modes] = useState([
    {
      label: '按需采购',
      value: 'DEMAND'
    },
    {
      label: '备货采购',
      value: 'STOCK_UP'
    }
  ]);
  const [isOpenGoodsModal, setIsOpenGoodsModal] = useState(false);
  const [selectSku, setSelectSku] = useState({
    skuId: '',
    name: ''
  });
  const [sku, setSku] = useState('');

  const requestMallGoods = (searchParams: {}) => {
    return reportApi.search('MALL_GOODS_CHILD_LIST', { ...searchParams });
  };
  const requestSpuItems = async () => {
    if (sku === '') {
      return {};
    }
    return reportApi.search('MALL_GOODS_SPU_INFO_LIST', {
      params: { skuId: sku }
    });
  };
  const onOpenGoods = () => {
    setIsOpenGoodsModal(true);
  };
  const onConfirmGoods = () => {
    setSku(selectSku.skuId);
    setIsOpenGoodsModal(false);
  };
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue(),
      skuId: sku,
      quotationTime: dayjs(form.getFieldValue('quotationTime'))
        .format('YYYY-MM-DD'),
      expireTime: dayjs(form.getFieldValue('expireTime'))
        .format('YYYY-MM-DD')
    };
    const result = await purchaseGoodsApi.save(params);
    if (result.success) {
      active();
      messageApi?.success('保存成功！')
        .then();
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
        result = await purchaseGoodsApi.agree(id);
      } else {
        result = await purchaseGoodsApi.reject(id, params.auditRejectReason);
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
    tableRef?.current?.reload();
  }, [sku]);
  useEffect(() => {
    reportApi.getDataList<[]>('SUPPLIER_INFO_LIST')
      .then(result => {
        setSupplierList(result.data);
      });
    if (Number(id) <= 0) {
      return;
    }
    reportApi.getStatistics<any>(props?.preview ? 'PURCHASE_GOODS_AUDIT_DETAIL' : 'PURCHASE_GOODS_DETAIL', { id })
      .then(result => {
        const value = {
          ...result.data,
          quotationTime: result.data?.quotationTime === undefined ? undefined : dayjs(result.data?.quotationTime),
          expireTime: result.data?.expireTime === undefined ? undefined : dayjs(result.data?.expireTime)
        };
        setDetail(value);
        setSku(value.skuId);
        form.setFieldsValue(value);
      });
  }, []);
  return (
    <>
      {contextHolder}
      <BackPageContainer title="商品报价">
        <MyCard title="供应链商品" width={1200}>
          {props?.edit || props?.preview ? undefined : <Row style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={onOpenGoods}>选择商品</Button>
          </Row>}
          <ProTable
            actionRef={tableRef}
            locale={{ emptyText: <div style={{ height: 20 }}></div> }}
            size="small"
            search={false}
            options={false}
            pagination={false}
            rowKey="id"
            columns={[
              {
                title: '',
                dataIndex: 'id',
                key: 'id',
                hidden: true
              },
              {
                title: 'SKU',
                dataIndex: 'skuId',
                key: 'skuId',
                width: '150px'
              },
              {
                title: '商品',
                dataIndex: 'spuName',
                key: 'spuName',
                width: '240px'
              },
              {
                title: '规格',
                dataIndex: 'skuName',
                key: 'skuName',
                width: '200px'
              },
              {
                title: '商品类型',
                dataIndex: 'spuType',
                key: 'spuType',
                width: '100px'
              },
              {
                title: '商品分类',
                dataIndex: 'categoryPath',
                key: 'categoryPath',
                width: '200px'
              },
              {
                title: '标准售价',
                dataIndex: 'skuSellPrice',
                key: 'skuSellPrice',
                width: '100px'
              },
              {
                title: '',
                dataIndex: '_panel',
                key: '_panel'
              }
            ]}
            request={requestSpuItems}
          />
          <p style={{
            fontWeight: 500,
            fontSize: 14,
            margin: '30px 0 20px 0'
          }}>采购商品信息</p>
          <Form layout="vertical" form={form}>
            <Row>
              <Col span={5}>
                <Form.Item label="供货商" name="supplierId">
                  <Select options={supplierList}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="采购方式" name="purchaseMode">
                  <Select options={modes}></Select>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="采购商品编号" name="purchaseSpuNo">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="采购商品名称" name="purchaseSpuName">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                <Form.Item label="采购商品规格" name="purchaseSkuName">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="采购价(单价不含税)" name="purchasePrice">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="计量单位" name="meteringUnit">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="税率" name="taxRate">
                  <Select options={taxRate}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                <Form.Item label="报价日期" name="quotationTime">
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="有效期" name="expireTime">
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="最小订货量" name="minBuyQuantity">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
        <Modal
          open={isOpenGoodsModal}
          onCancel={() => setIsOpenGoodsModal(false)}
          onOk={() => onConfirmGoods()}
          width={800}
          title="选择商品SKU"
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
                  {selectSku?.name === undefined ? undefined : <span style={{
                    color: '#606266',
                    fontSize: 13
                  }}>已选择商品：</span>}
                  <span style={{
                    fontWeight: 500,
                    fontSize: 13
                  }}>{selectSku?.name}</span>
                </>
              ]}
              columns={[
                {
                  title: '商品名称',
                  dataIndex: 'spuName',
                  key: 'spuName',
                  width: '200px'
                },
                {
                  title: '分类',
                  dataIndex: 'categoryPath',
                  key: 'categoryPath',
                  width: '160px'
                },
                {
                  title: '标准售价',
                  dataIndex: 'spuSellPriceRange',
                  key: 'spuSellPriceRange'
                }
              ]}
              request={requestMallGoods}
              expandable={{
                expandedRowRender: (record) => <>
                  <Radio.Group value={selectSku.skuId} onChange={(e) => {
                    const id = e.target.value.toString();
                    const item = record.child.find((it: any) => it.id === id);
                    const name = record.spuName + ' - ' + item.skuName;
                    setSelectSku({
                      skuId: id,
                      name
                    });
                  }}>
                    <Space direction="vertical" style={{
                      margin: '0 0 0 38px'
                    }}>
                      {record.child?.map((item: any, index: number) => (
                        <Radio value={item.id} key={index}>
                          <Row style={{ width: '660px' }}>
                            <Col span={7}>
                              <span style={{ color: '#606266' }}>规格：</span>
                              {item.skuName}
                            </Col>
                            <Col span={5}>
                              <span style={{ color: '#606266' }}>售价：</span>
                              {item.skuSellPrice}
                            </Col>
                          </Row>
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
