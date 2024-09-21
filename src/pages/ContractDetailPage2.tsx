import React from 'react';
import MyPageContainer from '@components/MyPageContainer';
import MyCard from '@components/MyCard';
import { Button, Col, Divider, Form, Input, Row } from 'antd';

export default () => {
  return (
    <>
      <MyPageContainer title="申请采购">
        <Form layout="vertical">
          <MyCard title="采购信息">
            <Row>
              <Button type="primary">选择采购商品</Button>
            </Row>
            <Row>
              <Col span={5}>
                <Form.Item label="SKU">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="商品">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="规格">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="标准售价">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                <Form.Item label="供货商">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="采购商品名称">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="采购商品规格">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="计量单位">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                <Form.Item label="采购价">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="税率">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="最终金额">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>

            <Divider/>
            <Row>
              <Col span={5}>
                <Form.Item label="采购合同">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col offset={1} span={5}>
                <Form.Item label="采购数量">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label="备注">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
          </MyCard>
        </Form>
      </MyPageContainer>
    </>
  );
};
