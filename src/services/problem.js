/*
 * @Author: Wenzhe
 * @Date: 2020-04-09 15:10:43
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-11 16:15:00
 */
import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/api/user/access/login', {
    method: 'POST',
    data: params,
  });
}

export async function getProlebmList(params) {
  const {
    pagination: { current, pageSize },
    query: { title },
  } = params;
  if (title) {
    return request(`/api/problem?current=${current}&&pageSize=${pageSize}&&title=${title}`);
  }
  return request(`/api/problem?current=${current}&&pageSize=${pageSize}`);
}

export async function getSingleProblemTestCase(params) {
  const { test_case_id } = params;
  return request(`/api/problem/testcase/${test_case_id}`);
}

export async function deleteSingleProblem(params) {
  const { problem_id } = params;
  return request(`/api/problem/${problem_id}`, { method: 'DELETE' });
}

export async function createProblem(params) {
  return request('/api/problem', {
    method: 'POST',
    data: params,
  });
}

export async function updateProblem(params) {
  return request(`/api/problem/${params.id}`, {
    method: 'PUT',
    data: params.data,
  });
}

export async function getProblemInfo(params) {
  return request(`/api/problem/${params}`)
}
