import React, { useState, useEffect } from 'react';
import { Card, Typography, Input, Table, Button, Tooltip, Popconfirm } from 'antd';
import { DeleteTwoTone, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Link } from 'umi';
import moment from 'moment';

const { Search } = Input;
const { Text } = Typography;

const ProblemTable = (props) => {
  const {
    problem: { problemList, total },
    dispatch,
    fetching,
  } = props;

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch({
      type: 'problem/fetchProblemList',
      payload: { pagination, query },
    });
  }, [dispatch, pagination, query]);

  // params: (current_pagination, filters, sorter)
  const tableChangeHandler = (current_pagination) => {
    setPagination(current_pagination);
  };

  const handleTitleQuery = (value) => {
    setQuery({ ...query, title: value });
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleDeleteProblem = (problem_id) => {
    dispatch({
      type: 'problem/deleteSignleProblem',
      payload: { problem_id, pagination, query },
    });
  };

  const columns = [
    {
      title: 'pid',
      dataIndex: 'pid',
      key: 'pid',
      fixed: 'left',
      width: 72,
    },
    {
      title: 'title',
      dataIndex: 'title',
      // width: 150,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: 'Author',
      render: () => <>root</>,
      width: 100,
    },
    {
      title: 'create_time',
      dataIndex: 'create',
      render: (value) => {
        return moment(value).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (record) => {
        return (
          <>
            <Tooltip placement="top" title="编辑题目">
              <Button style={{ marginRight: '4px' }} size="small">
                {/* eslint-disable-next-line no-underscore-dangle */}
                <Link to={`/problem/update/${record._id}`}>
                  <EditOutlined />
                </Link>
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="下载题目执行用例">
              <Button size="small" style={{ marginRight: '4px' }} disabled={!record.test_case_id}>
                {/* eslint-disable-next-line no-underscore-dangle */}
                <a href={`/api/problem/testcase/${record._id}`} download>
                  <DownloadOutlined />
                </a>
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="删除题目">
              <Popconfirm
                arrowPointAtCenter
                placement="topRight"
                title={`确定要删除 title 为 ${record.title} 的题目吗?`}
                // eslint-disable-next-line no-underscore-dangle
                onConfirm={() => handleDeleteProblem(record._id)}
                okText="确定"
                cancelText="取消"
              >
                <Button size="small">
                  <DeleteTwoTone twoToneColor="#eb2f96" />
                </Button>
              </Popconfirm>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper content="">
      <Card>
        <Search
          placeholder="请输入关键字"
          enterButton="搜索"
          size="large"
          // TODO: 当搜索框为空的时，就重新发起请求
          onSearch={(value) => handleTitleQuery(value)}
        />
        <Table
          style={{ marginTop: '30px' }}
          columns={columns}
          rowKey="_id"
          dataSource={problemList}
          pagination={{ ...pagination, total, showSizeChanger: true }}
          onChange={tableChangeHandler}
          scroll={{ x: 1000 }}
          loading={fetching}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ problem, loading }) => ({
  problem,
  fetching: loading.effects['problem/fetchProblemList'],
}))(ProblemTable);
