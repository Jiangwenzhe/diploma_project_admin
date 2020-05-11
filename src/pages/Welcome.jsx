import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert, Row, Col, Statistic } from 'antd';
import styles from './Welcome.less';

export default () => (
  <PageHeaderWrapper>
    <Row gutter={12}>
      <Col span={6}>
        <Card title="所用用户">
        <Statistic title="用户数量" value={12} suffix="/ 人" />
        </Card>
      </Col>
      <Col span={6}>
        <Card title="最近比赛">
          <Statistic title="比赛数量" value={8} suffix="/ 个" />
        </Card>
      </Col>
      <Col span={6}>
        <Card title="今日提交">
          <Statistic title="submission" value={112893} />
        </Card>

        </Col>
      <Col span={6}>
        <Card title="今日访问">
          <Statistic title="访问量" value={112893} />
        </Card>
      </Col>
    </Row>
  </PageHeaderWrapper>
);
