/*
 * @Author: Wenzhe
 * @Date: 2020-04-08 16:25:28
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-11 15:21:05
 */
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/user/access/current');
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function createUserInfo(params) {
  return request(`/api/user`, {
    method: 'POST',
    data: params.data,
  });
}

export async function fetchUserInfo(params) {
  return request(`/api/userinfo/${params.uid}`);
}

export async function updateUserInfo(params) {
  return request(`/api/user/${params.id}`, {
    method: 'PUT',
    data: params.data,
  });
}

export async function fetchAllUser(params) {
  const {
    pagination: { current, pageSize },
    query: { name },
  } = params;
  return request(`/api/user?current=${current}&pageSize=${pageSize}&name=${name}`);
}

export async function deleteUser(params) {
  console.log(params);
  return request(`/api/user/${params.id}`, {
    method: 'DELETE',
  });
}
