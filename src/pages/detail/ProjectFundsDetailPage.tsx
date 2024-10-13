import React, { useContext, useState } from 'react';
import BackPageContainer from '@components/BackPageContainer';
import { ProTable } from '@ant-design/pro-components';
import MyCard from '@components/MyCard';
import { Button, Col, Form, Popconfirm, Row, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import projectFundsApi from '@apis/project-funds-api';
import ParentContext from '@/content/ParentContext';
import { Config } from '@/config';
import { Modals } from '@/Modals';

declare type ProjectFunds = {
  id?: string
  subject?: string
  subjectName: string
  amount: string
};
let indexFunds = 0;
export default () => {
  const {
    active,
    messageApi
  } = useContext(ParentContext);
  const [form] = Form.useForm();
  const [dataList, setDataList] = useState([] as ProjectFunds[]);
  const navigate = useNavigate();
  const [fundsInputModal, contextFundsInputHolder] = Modals.useProjectFundsInput();
  const onRemoveItem = (value: { id: string }) => {
    const items: any[] = [...dataList];
    items.splice(items.findIndex(it => it.id === value.id), 1);
    setDataList(items as never);
  };
  const pushDataList = (data: ProjectFunds) => {
    if (data.id === undefined) {
      indexFunds += 1;
      setDataList([...dataList, {
        ...data,
        id: indexFunds.toString()
      }]);
    }
  };
  const onInput = () => {
    fundsInputModal.ok(async (params) => {
      pushDataList(params as ProjectFunds);
      return true;
    });
  };
  const onImport = () => {
    // orderImportModal.ok(async (params) => {
    //   pushDataList(params.data);
    //   return false;
    // });
  };
  const onConfirm = async () => {
    const params = {
      ...form.getFieldsValue()
    };
    const result = await projectFundsApi.save(params);
    if (result.success) {
      messageApi?.success('保存成功！')
        .then();
      active();
      navigate(-1);
    } else {
      messageApi?.error(result.message)
        .then();
    }
  };
  const onCancel = () => {
    navigate(-1);
  };
  return (
    <>
      <BackPageContainer title="项目预算">
        <MyCard title="制定预算" width={1000} bodyPadding="0 20px 20px 20px">
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
            dataSource={dataList}
            columns={[
              {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '100px'
              },
              {
                title: '分项',
                dataIndex: 'subject',
                key: 'subject',
                ellipsis: true,
                width: '200px'
              },
              {
                title: '预算金额',
                dataIndex: 'amount',
                key: 'amount',
                width: '240px'
              },
              {
                title: '',
                dataIndex: '_panel',
                key: '_panel',
                render: (_: any, record: any) => {
                  return <Popconfirm
                    title="是否确认删除该数据？"
                    onConfirm={() => onRemoveItem(record)}
                    okText="是"
                    cancelText="否"
                  >
                    <a style={{ color: Config.colors.danger }}>删除</a>
                  </Popconfirm>;
                }
              }
            ]}
            headerTitle={<div style={{ minWidth: 1200 }}>
              <Space size={12}>
                <Button onClick={onInput}>手动录入</Button>
                <Button type="primary" onClick={onImport}>导入数据</Button>
              </Space>
            </div>}
          />
          <Row style={{ marginTop: 24 }}>
            <Col>
              <Space size={16}>
                <Button type="primary" onClick={onConfirm}>保存</Button>
                <Button onClick={onCancel}>取消</Button>
              </Space>
            </Col>
          </Row>
        </MyCard>
      </BackPageContainer>
      {contextFundsInputHolder}
    </>
  );
};
