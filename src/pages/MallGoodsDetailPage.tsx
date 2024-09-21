import React, { useEffect, useState } from 'react';
import MyPageContainer from '@components/MyPageContainer';
import MyCard from '@components/MyCard';
import { Cascader, Col, Divider, Form, Input, Radio, Row, Select } from 'antd';
import ImagesContainer from '@components/ImagesContainer';
import reportApi from '@apis/report-api';
import s3Api from '@apis/s3-api';

declare type RecursionItem = {
  id?: string
  name?: string
  parentId?: string
  label?: string
  value?: string
  children?: RecursionItem[]
}
export default (props: { preview?: boolean, audit?: boolean }) => {
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [mallAfterSaleList, setMallAfterSaleList] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    reportApi.getDataList<[]>('BRAND_LIST')
      .then(result => {
        setBrandList(result.data);
      });
    reportApi.getDataList<RecursionItem[]>('MALL_CATEGORY_LIST')
      .then(result => {
        const recursion = (id: string): RecursionItem[] | undefined => {
          if (id === '') {
            return undefined;
          }
          return result.data.filter(it => it.parentId === id)
            .map(it => {
              return {
                label: it.name,
                value: it.id,
                children: recursion(it.id || '')
              };
            });
        };
        setCategoryList(recursion('0') as never);
      });
    reportApi.getDataList<[]>('MALL_SPU_PROMISE')
      .then(result => {
        setMallAfterSaleList(result.data);
      });
    form.setFieldValue('spuType', 'VIRTUAL');
    form.setFieldValue('skuType', 'UNIFIED');
  }, []);
  return (
    <>
      <MyPageContainer title="合同详情">
        <Form layout="vertical" form={form}>
          <MyCard title="基础信息">
            <Row>
              <Col span={11}>
                <Form.Item label="商品类型" name="spuType">
                  <Radio.Group>
                    <Radio value="VIRTUAL">虚拟商品</Radio>
                    <Radio value="REAL">实物商品</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23}>
                <Form.Item label="商品名称" name="spuName">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="商品分类" name="categoryId">
                  <Cascader options={categoryList}></Cascader>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="商品品牌" name="brandId">
                  <Select options={brandList}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23}>
                <Form.Item label="商品主图" name="spuImages">
                  <ImagesContainer
                    action={process.env.IMAGE_URL || ''}
                    buttonText="上传商品图片"
                    requestUrl={async (url) => s3Api.getUrl(url)
                      .then(a => a.data)}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="商品详情">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>

            <Divider/>
            <p style={{
              fontWeight: 500,
              fontSize: 14,
              margin: '12px 0 16px 0'
            }}>销售信息</p>
            <Row>
              <Col span={11}>
                <Form.Item label="规格设置" name="skuType">
                  <Radio.Group>
                    <Radio value="UNIFIED">统一规格</Radio>
                    <Radio value="MULTI">多规格</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="交易模式">
                  <Radio.Group value="DEFAULT">
                    <Radio value="DEFAULT">普通交易模式</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="市场价">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="标准售价">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="商品重量">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <p style={{
              fontWeight: 500,
              fontSize: 14,
              margin: '12px 0 16px 0'
            }}>物流与售后服务</p>
            <Row>
              <Col span={11}>
                <Form.Item label="运费设置（统一运费）">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item label="售后服务">
                  <Select options={mallAfterSaleList} mode="multiple"></Select>
                </Form.Item>
              </Col>
            </Row>
          </MyCard>
        </Form>
      </MyPageContainer>
    </>
  );
};
