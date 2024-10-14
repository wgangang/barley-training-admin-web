import React from 'react';
import MyPageContainer from '@components/MyPageContainer';
import Outline from '@components/Outline';
import { css } from '@emotion/css';
import { Tabs } from 'antd';

export default () => {
  return (
    <>
      <MyPageContainer title="项目全要素数据（项目回访）" padding="0">
        <div style={{
          display: 'flex'
        }}>
          <div style={{
            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
            background: '#fff'
          }}>
            <Outline data={[
              {
                key: '00',
                label: 'HarmonyOS简介',
                children: [{
                  key: '001',
                  label: '快速入门'
                }, {
                  key: '003',
                  label: '赋能套件和学习资源介绍'
                }]
              },
              {
                key: '02',
                label: 'HarmonyOS实战',
                children: [{
                  key: '021',
                  label: '创建一个项目'
                }, {
                  key: '023',
                  label: '如何编译以及调试'
                }]
              }
            ]}/>
          </div>
          <div style={{
            maxWidth: 1000,
            flex: 1,
            background: '#fff'
          }}>
            <div style={{
              padding: '12px 20px',
              fontSize: 16,
              fontWeight: 500,
              background: '#fff',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <span>HarmonyOS简介</span>
            </div>
            <div style={{
              padding: '20px'
            }}>
              <div id="video" className={css`
                  background: #efefef;
                  height: 500px;
                  width: 900px
              `}>
              </div>
              <Tabs size="small" style={{
                marginTop: '12px'
              }} items={[{
                key: '01',
                label: <span style={{
                  fontSize: 14
                }}>课程概览</span>,
                children: <div style={{
                  padding: '0 20px 20px 0',
                  minHeight: 240
                }}>
                  HarmonyOS简介
                </div>
              }]}/>
            </div>
          </div>
        </div>
      </MyPageContainer>
    </>
  );
};
