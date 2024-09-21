import React, { useEffect, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import MyCard from '@components/MyCard';
import { Button, Form, Input, Modal, Space } from 'antd';
import reportApi from '@apis/report-api';
import { useNavigate, useParams } from 'react-router-dom';
import { ProTable } from '@ant-design/pro-components';

export default () => {
  const [detail, setDetail] = useState<any>({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSpecificationsModal, setIsSpecificationsModal] = useState(false);
  const requestSpecificationsItems = async (searchParams: {}) => {
    return reportApi.search('MALL_SKU_VALUE', {
      ...searchParams,
      params: { skuKeyId: id }
    });
  };
  const onOpen = (item?: {}) => {
    if (item === undefined) {
      form.resetFields();
    } else {
      form.setFieldsValue(item);
    }
    setIsSpecificationsModal(true);
  };
  const onConfirm = () => {
    console.log({ skuKeyId: detail.id, ...form.getFieldsValue() });
    setIsSpecificationsModal(false);
  };
  useEffect(() => {
    reportApi.getStatistics<any>('MALL_SKU_KEY_DETAIL', { id })
      .then(result => {
        setDetail(result.data);
      });
  }, []);
  return (
    <>
      <BackPageContainer title="规格详情">
        <MyCard title={detail.name === undefined ? '--' : detail.name + '-详情'} bodyPadding="2px 24px 32px 24px">
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
                  <Form.Item name="子规格名称" style={{ marginBottom: 0 }}>
                    <Input placeholder="请输入子规格名称"></Input>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button type="primary">查询</Button>
                    </Space>
                  </Form.Item>
                </Space>
              </Form>
            </>}
            columns={[
              {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                hidden: true
              },
              {
                title: '子规格名称',
                dataIndex: 'skuValueName',
                key: 'skuValueName',
                width: '400px'
              },
              {
                title: '操作',
                dataIndex: '_panel',
                key: '_panel',
                render: (text, record) => (
                  <a onClick={() => onOpen(record)}>编辑</a>
                )
              }
            ]}
            request={requestSpecificationsItems}
            toolBarRender={() => [
              <Button key="00" type="primary" onClick={() => onOpen()}>添加子规格</Button>
            ]}
          />
        </MyCard>
        <Modal
          styles={{
            body: {
              padding: '5px 0 0 0'
            }
          }}
          title="保存子规格"
          width="360px"
          open={isSpecificationsModal}
          onCancel={() => setIsSpecificationsModal(false)}
          onOk={() => onConfirm()}>
          <Form form={form}>
            <Form.Item hidden={true} name="id">
              <Input></Input>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }} name="skuValueName">
              <Input placeholder="子规格名称"></Input>
            </Form.Item>
          </Form>
        </Modal>
      </BackPageContainer>
    </>
  );
};
