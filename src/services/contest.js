/*
 * @Author: Wenzhe
 * @Date: 2020-05-04 09:41:17
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-05 13:37:15
 */
import request from '@/utils/request';

export async function getContestList(params) {
  const {
    pagination: { current, pageSize },
    query: { title },
  } = params;
  return request(`/api/contest?current=${current}&pageSize=${pageSize}&title=${title}`);
}

export async function getContentDetail(params) {
  return request(`/api/contest_tool/${params.id}`);
}

export async function createContest(params) {
  return request('/api/contest', {
    method: 'POST',
    data: params,
  });
}

export async function updateContest(params) {
  return request(`/api/contest/${params.id}`, {
    method: 'PUT',
    data: params.payload,
  });
}

export async function deleteContest(params) {
  return request(`/api/contest/${params.id}`, {
    method: 'DELETE',
  });
}

export async function getContestProblem(params) {
  return request(`/api/contest_problem/${params.cid}`);
}

export async function addContestProblem(params) {
  return request(`/api/contest_problem`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteContestProblem(params) {
  const { cid, pid } = params;
  return request(`/api/contest_problem?cid=${cid}&pid=${pid}`, {
    method: 'DELETE',
  });
}

export async function updateContestProblem(params) {
  return request(`/api/contest_problem`, {
    method: 'PUT',
    data: params,
  });
}