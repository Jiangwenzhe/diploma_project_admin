import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tooltip, Popconfirm, Badge, Tag, Pagination, Input } from 'antd';
import { DeleteTwoTone, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Link } from 'umi';
import moment from 'moment';

const { Search } = Input;

const makeContestTypeTag = (need_pass) => {
  if (need_pass) {
    return <Tag color="warning">需要密码</Tag>;
  }
  return <Tag color="success">公开</Tag>;
};

const contestStatus = (startTime, endTime) => {
  if (moment(Date.now()).isBetween(startTime, endTime)) {
    return (
      <span>
        <Badge status="processing" />
        <span style={{ color: '#1890ff' }}>进行中</span>
      </span>
    );
  }
  if (moment(Date.now()).isBefore(startTime)) {
    return (
      <span>
        <Badge status="default" /> <span style={{ color: '#d9d9d9' }}>未开始</span>
      </span>
    );
  }
  if (moment(Date.now()).isAfter(endTime)) {
    return (
      <span>
        <Badge status="error" /> <span style={{ color: '#ff4d4f' }}>已结束</span>
      </span>
    );
  }
  return null;
};

const ContestList = (props) => {
  const {
    dispatch,
    fetchContestListLoading,
    contest: { contestListInfo, total },
  } = props;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [query, setQuery] = useState({
    title: '',
  });

  useEffect(() => {
    dispatch({
      type: 'contest/fetchContestList',
      payload: { pagination, query },
    });
  }, [dispatch, pagination, query]);

  // 更改 pagination 中的 current 当前页码
  const paginationChangeHandler = (current) => {
    setPagination({ ...pagination, current });
  };

  // 更改 pagination 中的 pageSize 当前页面容量
  const handlePageSizeChange = (_, pageSize) => {
    setPagination({ ...pagination, pageSize });
  };

  const handleDeleteContest = (contest_id) => {
    dispatch({
      type: 'contest/deleteSignleContest',
      payload: { id: contest_id, pagination, query },
    });
  };

  const handleTitleQuery = (value) => {
    setQuery({ ...query, title: value });
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleSearchTextisNull = (e) => {
    const { value } = e.target;
    if (value === '') {
      dispatch({
        type: 'contest/fetchContestList',
        payload: { pagination: { current: 1, pageSize: 10 }, query: { ...query, title: '' } },
      });
    }
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'cid',
    },
    {
      title: '标题',
      dataIndex: 'title',
      // width: '50%',
      render: (text) => {
        return <a>{text}</a>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      render: (time) => {
        return time;
      },
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
    },
    {
      title: '题目数量',
      dataIndex: 'problemList',
      render: (problemList) => `${problemList.length} 题`,
    },
    {
      title: '类型',
      dataIndex: 'need_pass',
      render: (need_pass) => makeContestTypeTag(need_pass),
    },
    {
      title: '状态',
      render: (_, record) => contestStatus(record.start_time, record.end_time),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (record) => {
        return (
          <>
            <Tooltip placement="top" title="编辑比赛">
              <Button style={{ marginRight: '4px' }} size="small">
                {/* eslint-disable-next-line no-underscore-dangle */}
                <Link to={`/contest/update/${record._id}`}>
                  <EditOutlined />
                </Link>
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="编辑题目">
              <Button style={{ marginRight: '4px' }} size="small">
                {/* eslint-disable-next-line no-underscore-dangle */}
                <Link to={`/contest/problem/${record.cid}`}>
                  <UnorderedListOutlined />
                </Link>
              </Button>
            </Tooltip>
            <Tooltip placement="right" title="删除比赛">
              <Popconfirm
                arrowPointAtCenter
                placement="topRight"
                title={`确定要删除 title 为 「${record.title}」 的比赛吗?`}
                // eslint-disable-next-line no-underscore-dangle
                onConfirm={() => handleDeleteContest(record._id)}
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
    <div>
      <PageHeaderWrapper content="">
        <Card>
          <Search
            placeholder="请输入关键字"
            enterButton="搜索"
            size="large"
            onChange={(value) => handleSearchTextisNull(value)}
            onSearch={(value) => handleTitleQuery(value)}
          />
          <div style={{ marginTop: '20px' }}>
            <Table
              columns={columns}
              rowKey="_id"
              dataSource={contestListInfo}
              loading={fetchContestListLoading}
              pagination={false}
            />
          </div>
          <div>
            <Pagination
              style={{ marginTop: '10px' }}
              current={pagination.current}
              pageSize={pagination.pageSize}
              onChange={(current) => paginationChangeHandler(current)}
              onShowSizeChange={handlePageSizeChange}
              showSizeChanger
              total={total}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(({ contest, loading }) => ({
  contest,
  fetchContestListLoading: loading.effects['contest/fetchContestList'],
}))(ContestList);
