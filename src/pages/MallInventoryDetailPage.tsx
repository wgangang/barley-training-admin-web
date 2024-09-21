import React, { useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Button, Col, Divider, Form, Input, Row, Select, Space } from 'antd';
import reportApi from '@apis/report-api';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';
import { ProTable } from '@ant-design/pro-components';

export default (props: { preview?: boolean }) => {
  const [detail, setDetail] = useState<any>({});
  const { id } = useParams();
  const requestMallInventory = async (searchParams: {}) => {
    return reportApi.search('MALL_INVENTORY_DETAIL_LIST', {
      ...searchParams,
      params: { id }
    });
  };
  useEffect(() => {
    reportApi.getStatistics('MALL_INVENTORY_BATCH', { id })
      .then(result => {
        console.log(result.data);
        setDetail(result.data);
      });
  }, []);
  return (
    <div className={css`
        & .ant-col {
            & > label {
                color: #606266;
            }

            & > span {
                color: #303030;
            }
        }
    `}>
      <BackPageContainer title="商城库存详情">
        <MyCard title="批次详情" minWidth={1000}>
          {detail.invalidTime === undefined ? undefined : <Row style={{
            margin: '12px 0'
          }}>
            <Col span={5}>
              <label>有效期：</label>
              <span style={{
                fontWeight: 500,
                fontSize: 14
              }}>{detail.invalidTime}</span>
            </Col>
          </Row>}
          <Row style={{
            margin: '12px 0'
          }}>
            <Col span={6}>
              <label>供应链订单编号：</label>
              <span>{detail.supplyChainOrderNo}</span>
            </Col>
            <Col span={6}>
              <label>供应商订单编号：</label>
              <span>{detail.supplyChainOrderNo}</span>
            </Col>
            <Col span={6}>
              <label>SKU：</label>
              <span>{detail.skuId}</span>
            </Col>
            <Col span={6}>
              <label>商品：</label>
              <span>{detail.spuName}</span>
            </Col>
          </Row>
          <Row style={{
            margin: '12px 0'
          }}>
            <Col span={6}>
              <label>规格：</label>
              <span>{detail.skuName}</span>
            </Col>
            <Col span={6}>
              <label>供货商：</label>
              <span>{detail.supplierShortName}</span>
            </Col>
            <Col span={6}>
              <label>采购商品：</label>
              <span>{detail.purchaseSpuName}</span>
            </Col>
            <Col span={6}>
              <label>采购商品规格：</label>
              <span>{detail.purchaseSkuName}</span>
            </Col>
          </Row>
          <Row style={{
            margin: '12px 0'
          }}>
            <Col span={6}>
              <label>采购价：</label>
              <span>{detail.purchasePrice}</span>
            </Col>
            <Col span={6}>
              <label>数量：</label>
              <span>{detail.inventoryTotalNumber}</span>
            </Col>
            <Col span={6}>
              <label>采购总额：</label>
              <span>{detail.totalAmount === undefined || Number(detail.totalAmount) <= 0 ? '-' : detail.totalAmount}</span>
            </Col>
          </Row>
          <Divider/>
          <p style={{
            fontWeight: 500,
            fontSize: 14,
            margin: '12px 0 4px 0'
          }}>出库明细</p>
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
            scroll={{ x: 'max-content' }}
            columns={[
              {
                title: '出库单编号',
                dataIndex: 'deliveryOrderNo',
                key: 'deliveryOrderNo',
                width: '200px'
              },
              {
                title: '卡号',
                dataIndex: 'cardNumber',
                key: 'cardNumber',
                width: '200px'
              },
              {
                title: '卡密（核销码）',
                dataIndex: 'cardSecret',
                key: 'cardSecret',
                ellipsis: true,
                width: '340px'
              },
              {
                title: '使用状态',
                dataIndex: 'consumeStatus',
                key: 'consumeStatus',
                width: '120px'
              },
              {
                title: '券码过期日期',
                dataIndex: 'consumeEndTime',
                key: 'consumeEndTime',
                width: '160px'
              },
              {
                title: '出库时间',
                dataIndex: 'outboundTime',
                key: 'outboundTime',
                width: '160px'
              },
              {
                title: '出库类型',
                dataIndex: 'outboundType',
                key: 'outboundType',
                width: '160px'
              },
              {
                title: '关联编号',
                dataIndex: 'serviceOrderNo',
                key: 'serviceOrderNo',
                width: '200px'
              },
              {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                width: '200px'
              }
            ]}
            headerTitle={<>
              <Form>
                <Space>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Input placeholder="关联单号"></Input>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Select placeholder="使用状态" style={{ width: 120 }} options={[
                      {
                        label: '不限',
                        value: ''
                      },
                      {
                        label: '待使用',
                        value: 'NOT_CONSUME'
                      },
                      {
                        label: '已核销',
                        value: 'HAS_CONSUME'
                      },
                      {
                        label: '已作废',
                        value: 'HAS_INVALID'
                      },
                      {
                        label: '已过期',
                        value: 'HAS_EXPIRED'
                      }
                    ]}></Select>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button type="primary" style={{
                        color: '#fff'
                      }}>查询</Button>
                    </Space>
                  </Form.Item>
                </Space>
              </Form>
            </>}
            request={requestMallInventory}
          />
        </MyCard>
      </BackPageContainer>
    </div>
  );
};
