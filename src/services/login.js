/*
 * @Author: Wenzhe
 * @Date: 2020-04-08 16:25:28
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-12 15:02:45
 */
import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function accountLogin(params) {
  return request('/api/user/access/login', {
    method: 'POST',
    data: params,
  });
}
