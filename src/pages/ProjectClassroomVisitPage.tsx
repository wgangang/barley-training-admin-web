import React, { ReactNode, useEffect, useState } from 'react';
import reportApi from '@apis/report-api';
import MyPageContainer from '@components/MyPageContainer';
import Outline from '@components/Outline';
import ReactPlayer from 'react-player';

export default () => {
  const [project, setProject] = useState('');
  const [item, setItem] = useState('');
  const [video, setVideo] = useState({} as { title?: string, url?: string });
  const [projectList, setProjectList] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
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
  useEffect(() => {
    reportApi.getDataList<{ value: string }[]>('BASIC_PROJECT_LIST')
      .then(result => {
        setProjectList(result.data as never);
        setProject(result.data?.[0]?.value || '');
      });
  }, []);
  useEffect(() => {
    if (project === '') {
      return;
    }
    setProjectItems([]);
    reportApi.getDataList<{ children: { key: string }[] }[]>('BUS_CLASSROOM_ITEMS', { project })
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
    reportApi.getStatistics<{}>('BUS_CLASSROOM_DEVICE_DETAIL', { id: item })
      .then(result => {
        setVideo(result.data as never);
      });
  }, [item]);
  return (
    <>
      <MyPageContainer title="项目全要素数据（课堂巡检）" styles={{
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
          </VideoContext>
        </div>
      </MyPageContainer>
    </>
  );
};
