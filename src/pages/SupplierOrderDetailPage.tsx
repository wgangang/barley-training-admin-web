import React, { useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Col, Divider, Form, Row } from 'antd';
import reportApi from '@apis/report-api';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';
import { ProTable } from '@ant-design/pro-components';

export default () => {
  const [detail, setDetail] = useState<any>({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const requestCardInfo = async () => {
    return reportApi.search('SUPPLIER_ORDER_DETAIL_CARD_LIST', { params: { id } });
  };
  useEffect(() => {
    reportApi.getStatistics<any>('SUPPLIER_ORDER_DETAIL', { id })
      .then(result => {
        const value = {
          ...result.data
        };
        form.setFieldsValue(value);
        setDetail(value);
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
      <BackPageContainer title="商城供货商订单">
        <MyCard title="订单详情">
          <Row style={{
            margin: '12px 0'
          }}>
            <Col span={5}>
              <label>供应链订单编号：</label>
              <span>{detail.supplyChainOrderNo}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>供应商订单编号：</label>
              <span>{detail.supplierOrderNo}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>状态：</label>
              <span>{detail.supplierOrderStatusName}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>创建时间：</label>
              <span>{detail.createTime}</span>
            </Col>
          </Row>
          <Divider/>
          <p style={{
            fontWeight: 500,
            fontSize: 14,
            margin: '12px 0 20px 0'
          }}>商品信息</p>
          <Row style={{
            margin: '12px 0'
          }}>
            <Col span={5}>
              <label>SKU：</label>
              <span>{detail.skuId}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>商品：</label>
              <span>{detail.spuName}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>规格：</label>
              <span>{detail.skuName}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>供货商：</label>
              <span>{detail.supplierShortName}</span>
            </Col>
          </Row>
          <Row style={{
            margin: '12px 0'
          }}>
            <Col span={5}>
              <label>采购商品：</label>
              <span>{detail.purchaseSpuName || '-'}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>采购商品规格：</label>
              <span>{detail.purchaseSkuName || '-'}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>采购价：</label>
              <span>{detail.purchaseUnitPrice || '-'}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>数量：</label>
              <span>{detail.purchaseQuantity || '-'}</span>
            </Col>
          </Row>
          <Row style={{
            margin: '12px 0'
          }}>
            <Col span={5}>
              <label>采购总额：</label>
              <span>{detail.purchaseTotalPrice || '-'}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>预订人：</label>
              <span>{detail.bookerName || '-'}</span>
            </Col>
            <Col offset={1} span={5}>
              <label>预定电话：</label>
              <span>{detail.bookerPhone || '-'}</span>
            </Col>
          </Row>
          <Divider/>
          <p style={{
            fontWeight: 500,
            fontSize: 14,
            margin: '12px 0 20px 0'
          }}>发货信息</p>
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
            pagination={false}
            columns={[
              {
                title: '卡号',
                dataIndex: 'cardNumber',
                key: 'cardNumber',
                width: '300px'
              },
              {
                title: '卡密（核销码）',
                dataIndex: 'cardSecret',
                key: 'cardSecret',
                width: '340px'
              },
              {
                title: '发货时间',
                dataIndex: 'deliveryTime',
                key: 'deliveryTime'
              }
            ]}
            request={requestCardInfo}
          />
        </MyCard>
      </BackPageContainer>
    </div>
  );
};
