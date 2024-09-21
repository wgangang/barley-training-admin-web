import React, { FC, useEffect, useState } from 'react';
import { Image, Upload, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Session } from 'beer-network/session';

export declare type ImagesContainerProps = {
  action: string
  value?: string[]
  disabled?: boolean | undefined
  title?: string | undefined
  children?: React.ReactNode | undefined
  buttonText?: string | undefined
  maxLength?: number | undefined
  onChange?: (files: string[]) => void | undefined
  requestUrl: (url: string) => Promise<string> | undefined
};
// {
//   uid: '-1',
//   name: 'image.png',
//   status: 'done',
//   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
// }
export const Component: FC<ImagesContainerProps> = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewCurrent, setPreviewCurrent] = useState(1);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: any) => {
    const index = fileList.map(item => item as any)
      .findIndex(item => file.s3 === item.s3);
    setPreviewCurrent(index);
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const status = newFileList.find(it => it.status !== undefined && it.status !== 'done');
    if (status === undefined) {
      props?.onChange?.(newFileList.map((it: any) => {
        return it.s3 || it?.response?.data;
      }));
    }
  };

  useEffect(() => {
    if (props?.value === undefined) {
      return;
    }
    const a = props?.value;
    const b = fileList?.map((it: any) => it.s3 as string);
    if (a.length === b.length && a.every((value, index) => value === b[index])) {
      return;
    }
    setTimeout(async () => {
      const data: UploadFile<any>[] = [];
      for (const item of props.value || []) {
        /* eslint-disable no-await-in-loop */
        data.push({
          uid: item,
          name: item,
          s3: item,
          status: 'done',
          url: await props.requestUrl(item)
        } as any);
      }
      setFileList(data);
      props?.onChange?.(props?.value || []);
    }, 0);
  }, [props?.value]);
  const Button = (
    <button style={{
      border: 0,
      background: 'none'
    }} type="button">
      <PlusOutlined/>
      <div style={{ marginTop: 8 }}>{props?.buttonText || '上传图片'}</div>
    </button>
  );
  return <div style={{ minHeight: 102 }}>
    <Upload
      action={props.action}
      headers={{
        authorization: 'Bearer ' + Session.getBearer() || ''
      }}
      listType="picture-card"
      fileList={fileList}
      onPreview={handlePreview}
      onChange={handleChange}
      disabled={props?.disabled === true}
    >
      {(fileList.length >= (props?.maxLength || 9) || props?.disabled) ? undefined : Button}
    </Upload>
    <Image.PreviewGroup preview={{
      visible: previewOpen,
      current: previewCurrent,
      onVisibleChange: (visible) => {
        setPreviewOpen(visible);
      },
      onChange: (current) => setPreviewCurrent(current)
    }}>
      {fileList.map((it: any, index: number) => (
        <Image key={index} wrapperStyle={{ display: 'none' }} src={it.url}/>
      ))}
    </Image.PreviewGroup>
  </div>;
};

export default Component;
