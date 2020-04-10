/*
 * @Author: Wenzhe
 * @Date: 2020-04-09 10:15:27
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-10 15:12:38
 */

import { getProlebmList, deleteSingleProblem } from '@/services/problem';
import { message } from 'antd';

const Model = {
  namespace: 'problem',
  state: {
    problemList: [],
    total: 0,
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
