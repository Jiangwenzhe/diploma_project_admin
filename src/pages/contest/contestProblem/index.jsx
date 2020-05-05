import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tooltip, Popconfirm, Typography, Modal, message, Input } from 'antd';
import { DeleteTwoTone, EditOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Link, history } from 'umi';
import moment from 'moment';
import update from 'immutability-helper';
import styles from './index.less';

const { Text } = Typography;
const { Search } = Input;

const type = 'DragbleBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? styles.drop_over_downward : styles.drop_over_upward,
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className} ${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const ContestList = (props) => {
  const {
    match,
    dispatch,
    fetchContestProblemLoading,
    fetchProblem,
    contest: { contestProblemList, problemList, problemListTotal },
  } = props;

  const [problemListData, setProblemListData] = useState([]);
  const [pidList, setPidList] = useState([]);
  const [addProblemFormvisible, setAddProblemFormvisible] = useState(false);
  const [problemPagination, setProblemPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [problemQuery, setProblemQuery] = useState('');

  const handleSearchTextisNull = (e) => {
    const { value } = e.target;
    if (value === '') {
      dispatch({
        type: 'contest/fetchProblemList',
        payload: { pagination: { current: 1, pageSize: 10 }, query: { ...problemQuery, title: '' } },
      });
    }
  };

  const handleTitleQuery = (value) => {
    setProblemQuery({ ...problemQuery, title: value });
    setProblemPagination({ current: 1, pageSize: 10 });
  };


  const showProblemForm = () => {
    setAddProblemFormvisible(true);
  };

  const hideProblemForm = () => {
    setAddProblemFormvisible(false);
  };

  useEffect(() => {
    setProblemListData(contestProblemList);
    const newPidList = contestProblemList.map((problem) => problem.pid);
    setPidList(newPidList);
  }, [contestProblemList]);

  useEffect(() => {
    dispatch({
      type: 'contest/fetchProblemList',
      payload: { pagination: problemPagination, query: problemQuery },
    });
  }, [problemPagination, problemQuery, dispatch]);

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = (dragIndex, hoverIndex) => {
    if (dragIndex === hoverIndex) {
      return;
    }
    const dragRow = problemListData[dragIndex];
    const updated_list = update(pidList, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow.pid],
      ],
    });
    dispatch({
      type: 'contest/updateContestProblem',
      payload: {
        cid: match.params.cid,
        pidList: updated_list,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'contest/getContestProblem',
      payload: {
        cid: match.params.cid,
      },
    });
  }, [dispatch, match]);

  const handleDeleteContestProblem = (pid) => {
    dispatch({
      type: 'contest/deleteContestProblem',
      payload: {
        cid: match.params.cid,
        pid,
      },
    });
  };

  const problemTableChangeHandler = (current_pagination) => {
    setProblemPagination(current_pagination);
  };

  const jumpToCreateProblem = () => {
    history.push('/problem/create');
  };

  const handleAddProblemToContest = (pid) => {
    const newpidList = contestProblemList.map((problem) => problem.pid);
    if (newpidList.includes(pid)) {
      message.warning('当前比赛已经有 pid 为「 pid 」的题目了！');
      return;
    }
    dispatch({
      type: 'contest/addContestProblem',
      payload: {
        cid: match.params.cid,
        pid,
      },
    });
  };

  const columns = [
    {
      title: '排序 id',
      key: 'id',
      fixed: 'left',
      width: 72,
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      title: 'pid',
      dataIndex: 'pid',
      key: 'pid',
      fixed: 'left',
      width: 72,
    },
    {
      title: '题目',
      dataIndex: 'title',
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: '作者',
      render: () => <>root</>,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'create',
      render: (value) => {
        return moment(value).format('YYYY-MM-DD HH:mm');
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
            <Tooltip placement="right" title="删除题目">
              <Popconfirm
                arrowPointAtCenter
                placement="topRight"
                title={`确定要删除 title 为 ${record.title} 的题目吗?`}
                // eslint-disable-next-line no-underscore-dangle
                onConfirm={() => handleDeleteContestProblem(record.pid)}
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

  const problemlist_columns = [
    {
      title: 'pid',
      dataIndex: 'pid',
      key: 'pid',
      fixed: 'left',
      width: 72,
    },
    {
      title: '题目',
      dataIndex: 'title',
      // width: 150,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: '作者',
      render: () => <>root</>,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'create',
      render: (value) => {
        return moment(value).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: '动作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (record) => {
        return (
          <>
            <Tooltip placement="top" title="添加题目">
              <Button size="small" onClick={() => handleAddProblemToContest(record.pid)}>
                <PlusOutlined />
              </Button>
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
          <h1 style={{ borderBottom: '3px solid' }}>题目列表</h1>
          <div style={{ marginTop: '20px' }}>
            <DndProvider backend={HTML5Backend}>
              <Table
                columns={columns}
                rowKey="_id"
                dataSource={contestProblemList}
                components={components}
                onRow={(record, index) => ({
                  index,
                  moveRow,
                })}
                loading={fetchContestProblemLoading}
                pagination={false}
                footer={() => (
                  <div>
                    <Button onClick={showProblemForm}>添加题目</Button>&nbsp;&nbsp;&nbsp;
                    <Button onClick={jumpToCreateProblem}>创建</Button>
                  </div>
                )}
              />
            </DndProvider>
          </div>
        </Card>
      </PageHeaderWrapper>
      <Modal
        title="添加题目"
        visible={addProblemFormvisible}
        onCancel={hideProblemForm}
        width="900px"
        footer={null}
      >
        <Search
          placeholder="请输入关键字"
          enterButton="搜索"
          size="middle"
          onChange={(value) => handleSearchTextisNull(value)}
          onSearch={(value) => handleTitleQuery(value)}
        />
        <Table
          style={{ marginTop: '10px'}}
          columns={problemlist_columns}
          rowKey="_id"
          dataSource={problemList}
          pagination={{ ...problemPagination, total: problemListTotal, showSizeChanger: true }}
          onChange={problemTableChangeHandler}
          loading={fetchProblem}
          size="small"
          scroll={{ y: 500 }}
        />
      </Modal>
    </div>
  );
};

export default connect(({ contest, loading }) => ({
  contest,
  fetchContestProblemLoading: loading.effects['contest/getContestProblem'],
  fetchProblem: loading.effects['contest/fetchProblemList'],
}))(ContestList);
