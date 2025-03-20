// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

/** doLogin GET /api/test/user/doLogin */
export async function doLoginUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doLoginUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/test/user/doLogin', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** doLogin PUT /api/test/user/doLogin */
export async function doLoginUsingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doLoginUsingPUTParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/test/user/doLogin', {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** doLogin POST /api/test/user/doLogin */
export async function doLoginUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doLoginUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/test/user/doLogin', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** doLogin DELETE /api/test/user/doLogin */
export async function doLoginUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doLoginUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/test/user/doLogin', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** doLogin PATCH /api/test/user/doLogin */
export async function doLoginUsingPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doLoginUsingPATCHParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/test/user/doLogin', {
    method: 'PATCH',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** isLogin GET /api/test/user/isLogin */
export async function isLoginUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/test/user/isLogin', {
    method: 'GET',
    ...(options || {}),
  });
}

/** isLogin PUT /api/test/user/isLogin */
export async function isLoginUsingPut(options?: { [key: string]: any }) {
  return request<string>('/api/test/user/isLogin', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** isLogin POST /api/test/user/isLogin */
export async function isLoginUsingPost(options?: { [key: string]: any }) {
  return request<string>('/api/test/user/isLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** isLogin DELETE /api/test/user/isLogin */
export async function isLoginUsingDelete(options?: { [key: string]: any }) {
  return request<string>('/api/test/user/isLogin', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** isLogin PATCH /api/test/user/isLogin */
export async function isLoginUsingPatch(options?: { [key: string]: any }) {
  return request<string>('/api/test/user/isLogin', {
    method: 'PATCH',
    ...(options || {}),
  });
}
