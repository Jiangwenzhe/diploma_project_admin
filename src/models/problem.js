/*
 * @Author: Wenzhe
 * @Date: 2020-04-09 10:15:27
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-13 14:55:05
 */

import {
  getProlebmList,
  deleteSingleProblem,
  createProblem,
  getProblemInfo,
  updateProblem,
} from '@/services/problem';
import { message } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'problem',
  state: {
    problemList: [],
    total: 0,
    currentProblemInfo: {},
  },
  effects: {
    *fetchProblemList({ payload }, { call, put }) {
      const response = yield call(getProlebmList, payload);
      yield put({
        type: 'save',
        payload: {
          problemList: response.data.list,
          total: response.data.total,
        },
      });
    },
    *deleteSignleProblem({ payload }, { call, put, select }) {
      const response = yield call(deleteSingleProblem, payload);
      if (response && response.data.status === '删除成功') {
        message.success('删除成功');
        const newPagination = JSON.parse(JSON.stringify(payload.pagination));
        const { total } = yield select((state) => state.problem);
        // 针对删除再请求函数所做的校验
        if (
          newPagination.current > 1 &&
          // 当 total - 1 <= 页 * 页容量, 页就需要 - 1
          (newPagination.current - 1) * newPagination.pageSize >= total - 1
        ) {
          newPagination.current -= 1;
        }
        yield put({
          type: 'fetchProblemList',
          payload: {
            pagination: newPagination,
            query: payload.query,
          },
        });
      }
    },
    *createProblem({ payload }, { call }) {
      const response = yield call(createProblem, payload);
      // eslint-disable-next-line no-underscore-dangle
      if (response && response.data && response.data._id) {
        message.success(`pid 为 ${response.data.pid} 的题目创建成, 之后会跳转到新页面`);
        // 跳转页面
        setTimeout(() => {
          history.push('/problem/list');
        }, 1000);
      }
    },
    *updateProblem({ payload }, { call, put }) {
      const response = yield call(updateProblem, payload);
      // eslint-disable-next-line no-underscore-dangle
      if (response && response.data && response.data.status === '修改成功') {
        message.success(`pid 为 ${response.data.newValue.pid} 的题目更新成功`);
        yield put({
          type: 'getProblemInfo',
          payload: payload.id,
        })
      }
    },
    *getProblemInfo({ payload }, { call, put }) {
      const response = yield call(getProblemInfo, payload);
      yield put({
        type: 'save',
        payload: {
          currentProblemInfo: response.data,
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
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname,  }) => {
    //     if (pathname === '/hero') {
    //       dispatch({
    //         type: 'fetch',
    //       });
    //     }
    //   });
    // },
  },
};

export default Model;
