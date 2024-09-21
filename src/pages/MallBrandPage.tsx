import React, { useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import reportApi, { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import ImagesContainer from '@components/ImagesContainer';
import s3Api from '@apis/s3-api';
import groupApi from '@apis/group-api';
import brandApi from '@apis/brand-api';
import { Async } from '@/utils';

const async = new Async();
export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [groupList, setGroupList] = useState([]);
  const tableBrandRef = useRef<TableAutoDataPanelRef>(null);
  const tableGroupRef = useRef<TableAutoDataPanelRef>(null);
  const [formBrand] = Form.useForm();
  const [formGroup] = Form.useForm();
  const [isBrandModal, setIsBrandModal] = useState(false);
  const [isGroupModal, setIsGroupModal] = useState(false);
  const [tabIndex, setTabIndex] = useState('00');
  const onOpenBrandModal = () => {
    formBrand.resetFields();
    setIsBrandModal(true);
  };
  const onOpenGroupModal = () => {
    formGroup.resetFields();
    setIsGroupModal(true);
  };
  const onConfirmSaveBrand = async () => {
    const params = {
      ...formBrand.getFieldsValue(),
      brandLogo: formBrand.getFieldValue('brandLogo')?.[0],
      scenes: [formBrand.getFieldValue('scenes')]
    };
    const result = await brandApi.save(params);
    if (result.success) {
      tableBrandRef?.current?.refreshData();
      messageApi?.success('保存成功！')
        .then();
      setIsBrandModal(false);
    } else {
      messageApi?.error(result.message)
        .then();
    }
  };
  const onConfirmSaveGroup = async () => {
    const params = {
      ...formGroup.getFieldsValue(),
      groupLogo: formGroup.getFieldValue('groupLogo')?.[0]
    };
    const result = await groupApi.save(params);
    if (result.success) {
      tableGroupRef?.current?.refreshData();
      messageApi?.success('保存成功！')
        .then();
      setIsGroupModal(false);
    } else {
      messageApi?.error(result.message)
        .then();
    }
  };
  const onChangeBrandEvent = async (eventName: string, value: { id: string, s3_brandLogo: string, brandLogo: string, scenes: string[] }) => {
    if (eventName === 'EDIT') {
      formBrand.setFieldsValue({
        ...value,
        brandLogo: [value.s3_brandLogo || value.brandLogo],
        scenes: value?.scenes?.[0]
      });
      setIsBrandModal(true);
      return;
    }
    if (eventName === 'DELETE') {
      const result = await brandApi.remove(value.id);
      if (result.success) {
        tableBrandRef?.current?.refreshData();
        messageApi?.success('删除成功！')
          .then();
      } else {
        messageApi?.error(result.message)
          .then();
      }
    }
  };
  const onChangeGroupEvent = async (eventName: string, value: { id: string, s3_groupLogo: string, groupLogo: string }) => {
    if (eventName === 'EDIT') {
      formGroup.setFieldsValue({
        ...value,
        groupLogo: [value.s3_groupLogo || value.groupLogo]
      });
      setIsGroupModal(true);
      return;
    }
    if (eventName === 'DELETE') {
      const result = await groupApi.remove(value.id);
      if (result.success) {
        tableGroupRef?.current?.refreshData();
        messageApi?.success('删除成功！')
          .then();
      } else {
        messageApi?.error(result.message)
          .then();
      }
    }
  };
  useEffect(() => {
    tableBrandRef?.current?.refresh();
    tableGroupRef?.current?.refresh();
  }, [tabIndex]);
  useEffect(() => {
    reportApi.getDataList<[]>('GROUP_LIST', {})
      .then(result => {
        setGroupList(result.data);
      });
  }, []);
  return (
    <>
      {contextHolder}
      <MyPageContainer title="品牌管理" tabList={[
        {
          key: '00',
          label: '品牌列表'
        },
        {
          key: '01',
          label: '集团列表'
        }
      ]} onTabChange={(e) => setTabIndex(e)}>
        {tabIndex === '00' ? <TableAutoDataPanel
          ref={tableBrandRef}
          code="MALL_SCENE_BRAND_LIST"
          request={AutoTableRequest}
          toolBarRender={<Button type="primary" onClick={onOpenBrandModal}>创建品牌</Button>}
          onChangeEvent={async (event, value) => {
            return async.run(async () => {
              return onChangeBrandEvent(event, value);
            });
          }}
        /> : undefined}
        {tabIndex === '01' ? <TableAutoDataPanel
          ref={tableGroupRef}
          code="MALL_SCENE_BRAND_GROUP_LIST"
          request={AutoTableRequest}
          toolBarRender={<Button type="primary" onClick={onOpenGroupModal}>创建集团</Button>}
          onChangeEvent={async (event, value) => {
            return async.run(async () => {
              return onChangeGroupEvent(event, value);
            });
          }}
        /> : undefined}
        <Modal
          title="保存品牌"
          width="400px"
          open={isBrandModal}
          onCancel={() => setIsBrandModal(false)}
          onOk={onConfirmSaveBrand}
          styles={{
            body: { padding: '16px 0 0 0' }
          }}>
          <Form form={formBrand}>
            <Form.Item label="ID" name="id" hidden={true}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="品牌名称" name="brandName">
              <Input></Input>
            </Form.Item>
            <Form.Item label="所属集团" name="groupId">
              <Select options={groupList}></Select>
            </Form.Item>
            <Form.Item label="关联场景" name="scenes">
              <Select options={[
                {
                  label: '商城',
                  value: 'MALL'
                }
              ]}></Select>
            </Form.Item>
            <Form.Item label="品牌Logo" name="brandLogo">
              <ImagesContainer
                action={process.env.IMAGE_URL || ''}
                maxLength={1}
                requestUrl={async (url) => s3Api.getUrl(url)
                  .then(a => a.data)}/>
            </Form.Item>
            <Form.Item label="品牌描述" name="brandDesc">
              <Input.TextArea></Input.TextArea>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="保存集团"
          width="400px"
          open={isGroupModal}
          onCancel={() => setIsGroupModal(false)}
          onOk={onConfirmSaveGroup}
          styles={{
            body: { padding: '16px 0 0 0' }
          }}>
          <Form form={formGroup}>
            <Form.Item name="id" hidden={true}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="集团名称" name="groupName">
              <Input></Input>
            </Form.Item>
            <Form.Item label="集团Logo" name="groupLogo">
              <ImagesContainer
                action={process.env.IMAGE_URL || ''}
                maxLength={1}
                requestUrl={async (url) => s3Api.getUrl(url)
                  .then(a => a.data)}/>
            </Form.Item>
            <Form.Item label="集团描述" name="groupDesc">
              <Input.TextArea></Input.TextArea>
            </Form.Item>
          </Form>
        </Modal>
      </MyPageContainer>
    </>
  );
};
