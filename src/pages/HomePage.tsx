import React, { useEffect, useRef, useState } from 'react';
import reportApi from '@apis/report-api';
import {
  LaptopOutlined, UserOutlined, ProjectOutlined, BookOutlined, ScheduleOutlined, PlayCircleOutlined, SearchOutlined
} from '@ant-design/icons';
import { Row, Col, Card, Statistic, Typography, Space } from 'antd';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {

  const [systemStats, setSystemStats] = useState<any>({
    devices: 0,
    classrooms: 0,
    teachers: 0,
    projects: 0,
    courses: 0,
    coursePlans: 0,
    recordings: 0,
    inspections: 0
  });

  useEffect(() => {
    reportApi.getStatistics<any>('BUS_SYSTEM_STATS')
      .then(result => {
        if (!result.success) {
          return;
        }
        setSystemStats(result.data || {});
      });

  }, []);

  const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: number }) => (
    <Card hoverable>
      <Space direction="vertical" align="center" style={{ width: '100%' }}>
        {icon}
        <Statistic
          title={title}
          value={value}
          valueStyle={{ textAlign: 'center', width: '100%' }}
        />
      </Space>
    </Card>
  );

  return (
    <div style={{ padding: 24, backgroundColor: '#f0f2f5' }}>
      <Title level={2} style={{ marginTop: 0, marginBottom: 24 }}>
        智能培训系统 - 管理中心
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            icon={<LaptopOutlined style={{ fontSize: 48, color: '#1890ff' }} />}
            title="设备管理"
            value={systemStats.devices}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            icon={<BookOutlined style={{ fontSize: 48, color: '#52c41a' }} />}
            title="教室管理"
            value={systemStats.classrooms}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            icon={<UserOutlined style={{ fontSize: 48, color: '#faad14' }} />}
            title="教师管理"
            value={systemStats.teachers}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            icon={<ProjectOutlined style={{ fontSize: 48, color: '#722ed1' }} />}
            title="项目管理"
            value={systemStats.projects}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            icon={<ScheduleOutlined style={{ fontSize: 48, color: '#eb2f96' }} />}
            title="班级管理"
            value={systemStats.classes}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            icon={<BookOutlined style={{ fontSize: 48, color: '#13c2c2' }} />}
            title="培训计划"
            value={systemStats.course}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            icon={<PlayCircleOutlined style={{ fontSize: 48, color: '#f5222d' }} />}
            title="课程回放"
            value={systemStats.recordings}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            icon={<SearchOutlined style={{ fontSize: 48, color: '#fa8c16' }} />}
            title="课堂巡检"
            value={systemStats.devices}
          />
        </Col>
      </Row>

      <Card
        title="系统概览"
        style={{ marginTop: 24 }}
        extra={<Text type="secondary">最近更新时间：{new Date().toLocaleString()}</Text>}
      >
        <Text>
          欢迎使用智能培训系统管理中心。本系统提供全面的培训资源管理和监控功能，
          帮助您高效管理设备、教室、教师、项目、课程等关键资源。
        </Text>
      </Card>
    </div>
  );
};

export default HomePage;
