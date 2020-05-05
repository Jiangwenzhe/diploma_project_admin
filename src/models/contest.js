/*
 * @Author: Wenzhe
 * @Date: 2020-05-04 09:40:53
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-05 14:45:38
 */
import {
  getContestList,
  createContest,
  deleteContest,
  getContentDetail,
  updateContest,
  getContestProblem,
  addContestProblem,
  deleteContestProblem,
  updateContestProblem,
} from '@/services/contest';
import { getProlebmList } from '@/services/problem';

import { message } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'contest',
  state: {
    contestListInfo: [],
    total: 0,
    contestDetail: {},
    contestProblemList: [],
    problemList: [],
    problemListTotal: 0,
  },
  effects: {
    *fetchContestList({ payload }, { call, put }) {
      const response = yield call(getContestList, payload);
      yield put({
        type: 'save',
        payload: {
          contestListInfo: Array.isArray(response.data.list) ? response.data.list : [],
          total: response.data.total,
        },
      });
    },
    *fetchContentDetail({ payload }, { call, put }) {
      const response = yield call(getContentDetail, payload);
      yield put({
        type: 'save',
        payload: {
          contestDetail: response.data,
        },
      });
    },
    *createContest({ payload }, { call }) {
      const response = yield call(createContest, payload);
      // eslint-disable-next-line no-underscore-dangle
      if (response && response.data && response.data._id) {
        message.success(`cid 为 ${response.data.cid} 的比赛创建成, 之后会跳转到新页面`);
        // 跳转页面
        setTimeout(() => {
          history.push('/contest/list');
        }, 1000);
      }
    },
    *updateContest({ payload }, { call }) {
      const response = yield call(updateContest, payload);
      // eslint-disable-next-line no-underscore-dangle
      if (response && response.data.status === '修改成功') {
        message.success(`cid 为 ${response.data.newValue.cid} 的比赛更新成功, 之后会跳转到新页面`);
        // 跳转页面
        setTimeout(() => {
          history.push('/contest/list');
        }, 1000);
      }
    },
    *deleteSignleContest({ payload }, { call, put, select }) {
      const response = yield call(deleteContest, payload);
      if (response && response.data === '删除成功') {
        message.success('删除成功');
        const newPagination = JSON.parse(JSON.stringify(payload.pagination));
        const { total } = yield select((state) => state.contest);
        // 针对删除再请求函数所做的校验
        if (
          newPagination.current > 1 &&
          // 当 total - 1 <= 页 * 页容量, 页就需要 - 1
          (newPagination.current - 1) * newPagination.pageSize >= total - 1
        ) {
          newPagination.current -= 1;
        }
        yield put({
          type: 'fetchContestList',
          payload: {
            pagination: newPagination,
            query: payload.query,
          },
        });
      }
    },
    //  =================== contest problem =====================
    *addContestProblem({ payload }, { call, put }) {
      const response = yield call(addContestProblem, payload);
      if (response && response.data && response.data.status === 'success') {
        message.success('题目添加成功！');
        yield put({
          type: 'getContestProblem',
          payload: {
            cid: payload.cid,
          },
        });
      }
    },
    *getContestProblem({ payload }, { call, put }) {
      const response = yield call(getContestProblem, payload);
      yield put({
        type: 'save',
        payload: {
          contestProblemList: response.data,
        },
      });
    },
    *deleteContestProblem({ payload }, { call, put }) {
      const response = yield call(deleteContestProblem, payload);
      if (response.data && response.data.status === 'success') {
        message.success(`pid 为「${payload.pid}」的题目已从当前比赛移除`);
        yield put({
          type: 'getContestProblem',
          payload: {
            cid: payload.cid,
          },
        });
      }
    },
    *updateContestProblem({ payload }, { call, put }) {
      const response = yield call(updateContestProblem, payload);
      if (response.data && response.data.status === 'success') {
        message.success(`题目列表排序更新成功`);
        yield put({
          type: 'getContestProblem',
          payload: {
            cid: payload.cid,
          },
        });
      }
    },
    *fetchProblemList({ payload }, { call, put }) {
      const response = yield call(getProlebmList, payload);
      yield put({
        type: 'save',
        payload: {
          problemList: response.data.list,
          problemListTotal: response.data.total,
        },
      });
    },
    //  =================== clean state =====================
    *cleanContestList(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          contestListInfo: [],
        },
      });
    },
    *cleanContestDetail(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          contestDetail: {},
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
