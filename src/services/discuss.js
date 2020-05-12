/*
 * @Author: Wenzhe
 * @Date: 2020-05-12 14:56:52
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-12 16:07:53
 */
import request from '@/utils/request';

export async function getDiscussList(params) {
  const {
    pagination: { current, pageSize },
    query: { title },
  } = params;
  return request(
    `/api/discuss?current=${current}&pageSize=${pageSize}&title=${title}`,
  );
}

export async function deleteDiscuss(params) {
  return request(`/api/discuss/${params.id}`, {
    method: 'DELETE',
  });
}