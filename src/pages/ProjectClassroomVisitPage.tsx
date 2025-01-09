import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import classroomApi from '@apis/classroom-api';
import MyPageContainer from '@components/MyPageContainer';
import MyCard from '@components/MyCard';
import ReactPlayer from 'react-player/lazy';
import ReactHlsPlayer from 'react-hls-player';

export default () => {
  const [inspectList, setInspectList] = useState<any[]>([]);

  useEffect(() => {
    classroomApi.inspect<any>().then(result => {
      if (!result.success) {
        return;
      }
      setInspectList(result.data || []);
    });
  }, []);

  const renderVideoPlayer = (videoUrl?: string) => {
    if (!videoUrl) return null;

    const isHls = videoUrl.endsWith('.m3u8');
    const formattedUrl = `${videoUrl}?response-content-disposition=attachment`;

    return isHls ? (
      <ReactHlsPlayer
        src={formattedUrl}
        autoPlay={false}
        controls={true}
        width="100%"
        height="auto"
      />
    ) : (
      <ReactPlayer
        controls={true}
        url={formattedUrl}
        width="100%"
      />
    );
  };

  return (
    <>
      <MyPageContainer title="项目全要素数据（课堂巡检）" styles={{
        body: {
          display: 'flex',
          justifyContent: 'center'
        }
      }}>
        <Row gutter={[16, 16]}>
          {
            inspectList.map((item, index) => (
              <Col span={12} key={index}>
                <MyCard title={`${item.classroomName} - ${item.deviceName}`}>
                  {renderVideoPlayer(item.m3u8Url)}
                </MyCard>
              </Col>
            ))
          }
        </Row>
      </MyPageContainer>
    </>
  );
};
