import React, { ReactNode, useEffect, useState } from 'react';
import reportApi from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import Outline from '@components/Outline';
import { Tabs } from 'antd';
import ReactPlayer from 'react-player';

export default () => {
  const [projectList, setProjectList] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [project, setProject] = useState('');
  const [item, setItem] = useState('');
  const [video, setVideo] = useState({} as { title?: string, description?: string, url?: string });
  const VideoContext = (props: { children: ReactNode }) => {
    return <>
      <div style={{
        maxWidth: 1000,
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
          display: 'flex',
          alignItems: 'center'
        }}>
          <span>{video?.title}&nbsp;</span>
        </div>
        <div style={{
          padding: '10px 20px'
        }}>
          {props?.children}
        </div>
      </div>
    </>;
  };
  const Player = () => {
    return <>
      <div style={{
        height: 500,
        background: video?.url === undefined ? 'rgba(0, 0, 0, 0.75)' : 'transparent'
      }}>
        <ReactPlayer
          id="video"
          url={video?.url}
          width={860}
          height={500}
          controls
        />
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
      }}>课程概览</span>,
      children: <div style={{
        padding: '0 20px 20px 0',
        minHeight: 140
      }}>
        {video?.description}
      </div>
    }]}/>;
  };
  useEffect(() => {
    if (project === '') {
      return;
    }
    setProjectItems([]);
    reportApi.getDataList<{ children: { key: string }[] }[]>('BUS_COURSE_ITEMS', { project })
      .then(result => {
        setProjectItems(result.data as never);
        setItem(result.data?.[0]?.children?.[0].key || '');
      });
  }, [project]);
  useEffect(() => {
    if (item === '') {
      return;
    }
    setVideo({});
    reportApi.getStatistics<{}>('BUS_COURSE_VIDEO_DETAIL', { id: item })
      .then(result => {
        setVideo(result.data as never);
      });
  }, [item]);
  useEffect(() => {
    reportApi.getDataList<{ value: string }[]>('BASIC_PROJECT_LIST')
      .then(result => {
        setProjectList(result.data as never);
        setProject(result.data?.[0]?.value || '');
      });
  }, []);
  return (
    <>
      <MyPageContainer title="项目全要素数据（项目回访）" styles={{
        body: {
          display: 'flex',
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
            onItemChange={(e) => {
              setItem(e);
            }}/>
          <VideoContext>
            <Player/>
            <VideoDescription/>
          </VideoContext>
        </div>
      </MyPageContainer>
    </>
  );
};
