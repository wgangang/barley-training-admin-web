import React, { useEffect, useRef, useState } from 'react';
import TableAutoDataPanel, { TableAutoDataPanelRef } from 'beer-assembly/TableAutoDataPanel';
import { AutoTableRequest } from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import { Button, Tree, Modal, Form, Input, Select, Popconfirm } from 'antd';
import type { TreeProps } from 'antd';
import ImagesContainer from '@/components/ImagesContainer';
import s3Api from '@/apis/s3-api';
import MallApi from '@/apis/mall-api';

const { Option } = Select;
type ITreeDataNode = {title: any, id: string, key?: any, children?: ITreeDataNode[]};
export default () => {
  const tableRef = useRef<TableAutoDataPanelRef>(null);
  const [modelStatus, setModelStatus] = useState(false);
  const [modelTitle, setModelTitle] = useState('新增分类');
  const [form] = Form.useForm();
  useEffect(() => {
    tableRef?.current?.refresh();
  }, []);

  const treeData: ITreeDataNode[] = [
    {
      title: 'parent 1',
      id: '90',
      children: [
        {
          title: 'parent 1-0',
          id: '1',
          children: [
            {
              title: 'leaf1',
              id: '2'
            },
            {
              title: 'leaf2',
              id: '3'
            },
            {
              title: 'leaf3',
              id: '4'
            }
          ]
        },
        {
          title: 'parent 1-1',
          id: '5',
          children: [
            {
              title: 'leaf',
              id: '6'
            }
          ]
        },
        {
          title: 'parent 1-2',
          id: '7',
          children: [
            {
              title: 'leaf',
              id: '8'
            },
            {
              title: 'leaf',
              id: '9'
            }
          ]
        }
      ]
    }
  ];
  // 设置tree的title（组装操作区按钮）
  const setTreeTitle = (title: any) => {
    const titleNode = () => (<>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>{title}</div>
        <div>
          <Button type="link" style={{ fontSize: 12 }} onClick={() => handleEditClick()}>编辑</Button>
          <Button type="link" style={{ fontSize: 12 }} onClick={() => handleLowerClick()}>新增下级分类</Button>
          <Popconfirm
            title="提示"
            description="你确定要删除该分类吗？"
            onConfirm={handleDeleteClick}
          >
            <Button type="link" danger style={{ fontSize: 12 }}>删除</Button>
          </Popconfirm>
        </div>
      </div>
    </>);
    return titleNode;
  };

  // 返回新的treeData
  const setTree = (treeData: ITreeDataNode[]): ITreeDataNode[] => {
    if (!treeData || treeData.length === 0) {
      return [];
    }
    return treeData.map((item: ITreeDataNode) => {
      return {
        ...item,
        title: setTreeTitle(item.title),
        children: setTree(item.children as ITreeDataNode[])
      };
    });
  };

  const onModelConfirm = async () => {
    try {
      const result = await form.validateFields();
      await MallApi.save(result);
      console.log(result, '我是要提交的数据');
    } catch (error) {
      console.log(error);
    }
  };

  // 编辑分类
  const handleEditClick = () => {
    setModelTitle('编辑分类');
    setModelStatus(true);
  };

  // 新增下级分类
  const handleLowerClick = () => {
    setModelTitle('编辑分类');
    setModelStatus(true);
  };

  // 新增分类
  const handleAddClick = () => {
    setModelTitle('新增分类');
    setModelStatus(true);
  };

  // 删除
  const handleDeleteClick = () => {
    console.log('删除');
  };

  // 父级分类change
  const handleParentIdChange = () => {
    console.log('伪代码');
  };

  const [gData, setGData] = useState(setTree(treeData));

  const handleTreeDrop: TreeProps['onDrop'] = (info) => {
    console.log(info, 333);
    const dropKey = (info.node as any).id;
    const dragKey = (info.dragNode as any).id;
    const dropPos = info.node.pos.split('-');
    const dragPos = info.dragNode.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // 是否统一层级
    const isSameLevel = () => {
      const aLevel = dropPos.length;
      const bLevel = dragPos.length;
      return aLevel === bLevel;
    };

    // 是否是同一父级
    const isSameParent = () => {
      dropPos.pop();
      dragPos.pop();
      return dropPos.join('') === dragPos.join('');
    };
    const canDrop = ((isSameParent() && isSameLevel()) && info.dropToGap);
    if (!canDrop) return;

    const loop = (
      data: ITreeDataNode[],
      id: React.Key,
      callback: (node: ITreeDataNode, i: number, data: ITreeDataNode[]) => void
    // eslint-disable-next-line consistent-return
    ) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, id, callback);
        }
      }
    };
    const data = [...gData];
    let dragObj: ITreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: ITreeDataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setGData(data);
  };
  return (
    <>
      <MyPageContainer title="分类管理">
        <div style={{
          display: 'flex',
          marginBottom: 16,
          padding: '20px',
          backgroundColor: '#fff'
        }}>
          <Button type="primary" onClick={() => handleAddClick()}>新增分类</Button>
        </div>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            backgroundColor: '#fafafa',
            fontSize: 13,
            color: '#333',
            fontWeight: 500,
            marginBottom: 16
          }}>
            <div>分类名称</div>
            <div>操作</div>
          </div>
          <Tree
            className="draggable-tree"
            draggable={{ icon: false }}
            fieldNames={{ title: 'title', key: 'id', children: 'children' }}
            blockNode
            autoExpandParent={true}
            treeData={gData as any[]}
            onDrop={handleTreeDrop}
          />
        </div>

        <Modal
          styles={{
            body: {
              padding: '5px 0 0 0'
            }
          }}
          title={modelTitle}
          width="360px"
          open={modelStatus}
          onCancel={() => setModelStatus(false)}
          onOk={() => onModelConfirm()}>
          <Form
            form={form}
          >
            <Form.Item name="parentId" label="上级分类">
              <Select
                placeholder="请选择"
                onChange={handleParentIdChange}
                allowClear
              >
                <Option value="male">male</Option>
                <Option value="female">female</Option>
                <Option value="other">other</Option>
              </Select>
            </Form.Item>
            <Form.Item name="categoryName" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
              <Input placeholder="分类名称"></Input>
            </Form.Item>
            <Form.Item label="分类图标" name="categoryIcon">
              <ImagesContainer
                action={process.env.IMAGE_URL || ''}
                maxLength={1}
                requestUrl={async (url) => s3Api.getUrl(url)
                  .then(a => a.data)}/>
            </Form.Item>
          </Form>
        </Modal>
      </MyPageContainer>
    </>
  );
};
