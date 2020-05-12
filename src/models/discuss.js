/*
 * @Author: Wenzhe
 * @Date: 2020-05-12 14:56:52
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-12 16:10:05
 */

import { getDiscussList, deleteDiscuss } from '@/services/discuss';

import { message } from 'antd';

const Model = {
  namespace: 'discuss',
  state: {
    discussList: [],
    total: 0,
  },
  effects: {
    *fetchDiscussList({ payload }, { call, put }) {
      const response = yield call(getDiscussList, payload);
      yield put({
        type: 'save',
        payload: {
          discussList: Array.isArray(response.data.list) ? response.data.list : [],
          total: response.data.total,
        },
      });
    },
    *deleteDiscuss({ payload }, { call, put, select }) {
      const response = yield call(deleteDiscuss, payload);
      if (response && response.data === '删除成功') {
        message.success('删除成功');
        const newPagination = JSON.parse(JSON.stringify(payload.pagination));
        const { total } = yield select((state) => state.discuss);
        // 针对删除再请求函数所做的校验
        if (
          newPagination.current > 1 &&
          // 当 total - 1 <= 页 * 页容量, 页就需要 - 1
          (newPagination.current - 1) * newPagination.pageSize >= total - 1
        ) {
          newPagination.current -= 1;
        }
        yield put({
          type: 'fetchDiscussList',
          payload: {
            pagination: newPagination,
            query: payload.query,
          },
        });
      }
    },
    *cleanDiscussModel(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          discussList: [],
          total: 0,
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
