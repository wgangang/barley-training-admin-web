import React, { ReactNode, useEffect, useState } from 'react';
import reportApi from '@apis/report-api';
import courseApi from '@apis/course-api';
import MyPageContainer from '@components/MyPageContainer';
import Outline from '@components/Outline';
import { Tabs } from 'antd';
import ReactPlayer from 'react-player';
import ReactHlsPlayer from 'react-hls-player';

export default () => {
  const [project, setProject] = useState('');
  const [projectList, setProjectList] = useState([]);

  const [item, setItem] = useState('');
  const [projectItems, setProjectItems] = useState([]);

  const [videoList, setVideoList] = useState<any[]>([]);
  const [video, setVideo] = useState<any>({});

  const VideoContext = (props: { children: ReactNode }) => {
    return <>
      <div style={{
        maxWidth: 1000,
        width: '100%',
        flex: 1,
        background: '#fff'
      }}>
        <div style={{
          fontSize: 16,
          fontWeight: 500,
          background: '#fff',
          height: 50,
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '0 20px',
          alignItems: 'center'
        }}>
          <span>{video?.videoName}&nbsp;</span>
        </div>
        <div style={{
          padding: '10px 20px'
        }}>
          {props?.children}
        </div>
      </div>
    </>;
  };

  const VideoDescription = () => {
    return <Tabs size="small" style={{
      marginTop: '12px'
    }} items={[{
      key: '01',
      label: <span style={{
        fontSize: 14
      }}>课程目录</span>,
      children: <div style={{
        padding: '0 20px 20px 0',
        minHeight: 140
      }}>
        {videoList.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              cursor: 'pointer'
            }}
            onClick={() => {
              setVideo(item);
            }}
          >
            <div style={{ flex: 1 }}>
              {item?.videoName}
            </div>
          </div>
        ))}
      </div>
    }]} />;
  };

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

  useEffect(() => {
    reportApi.getDataList<any>('BASIC_PROJECT_LIST')
      .then(result => {
        setProjectList(result.data);
        setProject(result.data?.[0]?.value || '');
      });
  }, []);

  useEffect(() => {
    if (project === '') {
      return;
    }
    setProjectItems([]);
    courseApi.listCourse<any>(project)
      .then(result => {
        setProjectItems(result.data);
        setItem(result.data?.children?.[0]?.key || '');
      });
  }, [project]);

  useEffect(() => {
    if (item === null || item === '') {
      return;
    }
    setVideo(null);
    courseApi.video<any>(item)
      .then(result => {
        setVideoList(result.data);
        setVideo(result.data?.[0] || null);
      });
  }, [item]);
  return (
    <>
      <MyPageContainer title="项目全要素数据（课程回放）" styles={{
        body: {
          display: 'contents',
          justifyContent: 'center'
        }
      }}>
        <div style={{ display: 'flex' }}>
          <Outline
            style={{
              background: '#fff',
              marginRight: 20,
              minWidth: 300
            }}
            outlineList={projectList}
            dataList={projectItems}
            value={project}
            itemValue={item}
            onChange={(e) => {
              setProject(e);
            }}
            onItemChange={(e) => {
              setItem(e);
            }} />
          <VideoContext>
            {renderVideoPlayer(video?.rtmpUrl || '')}
            <VideoDescription />
          </VideoContext>
        </div>
      </MyPageContainer>
    </>
  );
};
