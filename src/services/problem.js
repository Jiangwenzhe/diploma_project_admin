/*
 * @Author: Wenzhe
 * @Date: 2020-04-09 15:10:43
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-10 14:45:29
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
  // console.log(title);
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
  // console.log(problem_id);
  return request(`/api/problem/${problem_id}`, { method: 'DELETE' });
}
