/*
 * @Author: Wenzhe
 * @Date: 2020-05-11 12:04:45
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-11 15:47:37
 */
import { fetchUserInfo, updateUserInfo, fetchAllUser, createUserInfo, deleteUser } from '@/services/user';
import { message } from 'antd';

const Model = {
  namespace: 'userManage',
  state: {
    userInfo: {},
    userList: [],
    total: 0,
  },
  effects: {
    *fetchAllUser({ payload }, { call, put }) {
      const response = yield call(fetchAllUser, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'save',
          payload: {
            userList: response.data.list,
            total: response.data.total,
          },
        });
      }
    },
    *fetchUserInfo({ payload }, { call, put }) {
      const response = yield call(fetchUserInfo, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'save',
          payload: {
            userInfo: response.data,
          },
        });
      }
    },
    *createUser({ payload }, { call, put }) {
      const response = yield call(createUserInfo, payload);
      if (response.code === 0 && response.data) {
        message.success('用户添加成功~');
        yield put({
          type: 'fetchAllUser',
          payload: payload.getUserPayload,
        });
        return 'success';
      }
      return undefined;
    },
    *updateUserInfo({ payload }, { call, put }) {
      const response = yield call(updateUserInfo, payload);
      if (response.code === 0 && response.data) {
        message.success('用户信息更新成功~');
        yield put({
          type: 'fetchAllUser',
          payload: payload.getUserPayload,
        });
        return 'success';
      }
      return undefined;
    },
    *deleteUser({ payload }, { call, put, select }) {
      const response = yield call(deleteUser, payload);
      if (response) {
        message.success('删除成功');
        const newPagination = JSON.parse(JSON.stringify(payload.pagination));
        const { total } = yield select((state) => state.userManage);
        // 针对删除再请求函数所做的校验
        if (
          newPagination.current > 1 &&
          // 当 total - 1 <= 页 * 页容量, 页就需要 - 1
          (newPagination.current - 1) * newPagination.pageSize >= total - 1
        ) {
          newPagination.current -= 1;
        }
        yield put({
          type: 'fetchAllUser',
          payload: {
            pagination: newPagination,
            query: payload.query,
          },
        });
      }
    },
    *cleanUserInfo(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          userInfo: {},
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
