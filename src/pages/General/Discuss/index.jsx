import React, { useEffect, useState } from 'react';
import { Card, Table, Input, Pagination, Avatar, Tooltip, Button, Popconfirm, Tag } from 'antd';
import { DeleteTwoTone, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';

const { Search } = Input;

const categoryToCN = (category) => {
  switch (category) {
    case 'all':
      return <Tag color="magenta">全部话题</Tag>;
    case 'interview':
      return <Tag color="red">面试考题</Tag>;
    case 'algorithm':
      return <Tag color="blue">算法与数据结构</Tag>;
    case 'question':
      return <Tag color="green">题目交流</Tag>;
    case 'work':
      return <Tag color="cyan">职场问题</Tag>;
    case 'news':
      return <Tag color="lime">最新资讯</Tag>;
    case 'feedback':
      return <Tag color="geekblue">系统反馈</Tag>;
    default:
      return '';
  }
};

const typeToCN = (type) => {
  switch (type) {
    case 'article':
      return <Tag color="#2db7f5">文章</Tag>;
    case 'discuss':
      return <Tag color="#108ee9">讨论</Tag>;
    default:
      return '';
  }
};

const DiscussList = (props) => {
  const {
    dispatch,
    fetchDiscussListLoading,
    discuss: { discussList, total },
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
      type: 'discuss/fetchDiscussList',
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

  const handleTitleQuery = (value) => {
    setQuery({ ...query, title: value });
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleSearchTextisNull = (e) => {
    const { value } = e.target;
    if (value === '') {
      dispatch({
        type: 'discuss/fetchDiscussList',
        payload: { pagination: { current: 1, pageSize: 10 }, query: { ...query, title: '' } },
      });
    }
  };

  const handleDeleteUser = (id) => {
    dispatch({
      type: 'discuss/deleteDiscuss',
      payload: {
        pagination,
        query,
        id,
      },
    });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (title) => <strong>{title}</strong>,
    },
    {
      title: '类别',
      dataIndex: 'category',
      render: (category) => categoryToCN(category),
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type) => typeToCN(type),
    },
    {
      title: '作者',
      render: (record) => {
        return <span>{record.authorInfo.name}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (createdAt) => {
        return <span>{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (record) => {
        return (
          <>
            <Tooltip placement="right" title="删除比赛">
              <Popconfirm
                arrowPointAtCenter
                placement="topRight"
                title={`确定要标题为 「${record.title}」 的${
                  record.type === 'article' ? '文章' : '讨论'
                }吗?`}
                // eslint-disable-next-line no-underscore-dangle
                onConfirm={() => handleDeleteUser(record._id)}
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
              dataSource={discussList}
              loading={fetchDiscussListLoading}
              pagination={false}
            />
          </div>

          <Pagination
            style={{ marginTop: '10px', display: 'inline-block' }}
            current={pagination.current}
            pageSize={pagination.pageSize}
            onChange={(current) => paginationChangeHandler(current)}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger
            total={total}
          />
        </Card>
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(({ discuss, loading }) => ({
  discuss,
  fetchDiscussListLoading: loading.effects['discuss/fetchDiscussList'],
}))(DiscussList);
