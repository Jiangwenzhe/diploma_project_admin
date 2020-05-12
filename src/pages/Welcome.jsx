import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { useRequest } from '@umijs/hooks';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './Welcome.less';

export default () => {
  const [logInfo, setLogInfo] = useState('fetching logs ... ... ');
  const [isFetchLog, setIsFetchLog] = useState(false);

  useEffect(() => {
    request('/api/log').then((response) => {
      setLogInfo(response.data);
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loading, run, cancel } = useRequest('/api/log', {
    manual: true,
    pollingInterval: 1000,
    pollingWhenHidden: false,
  });

  useEffect(() => {
    if (data) {
      setLogInfo(data.data);
    }
  }, [data]);

  const startRun = () => {
    run();
    setIsFetchLog(true);
  };

  const cancelRun = () => {
    cancel();
    setIsFetchLog(false);
  };

  return (
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
      <Row style={{ marginTop: '25px' }}>
        <Col span={24}>
          <Card
            title="系统日志"
            extra={
              <div>
                <Button onClick={startRun}>开始轮询获取 log</Button>
                <Button onClick={cancelRun} style={{ marginLeft: '5px' }}>
                  结束
                </Button>
                <Button shape="circle" type="dashed" style={{ marginLeft: '5px' }}>
                  <SyncOutlined spin={isFetchLog} />
                </Button>
              </div>
            }
          >
            <div className={styles.logBlock}>
              <SyntaxHighlighter style={dark}>{logInfo}</SyntaxHighlighter>
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};
