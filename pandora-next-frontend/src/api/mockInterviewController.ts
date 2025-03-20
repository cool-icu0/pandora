// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

/** addMockInterview POST /api/mockInterview/add */
export async function addMockInterviewUsingPost(
  body: API.MockInterviewAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/mockInterview/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteMockInterview POST /api/mockInterview/delete */
export async function deleteMockInterviewUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/mockInterview/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getMockInterviewById GET /api/mockInterview/get */
export async function getMockInterviewByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMockInterviewByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseMockInterview_>('/api/mockInterview/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** handleMockInterviewEvent POST /api/mockInterview/handleEvent */
export async function handleMockInterviewEventUsingPost(
  body: API.MockInterviewEventRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString_>('/api/mockInterview/handleEvent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMockInterviewByPage POST /api/mockInterview/list/page */
export async function listMockInterviewByPageUsingPost(
  body: API.MockInterviewQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageMockInterview_>('/api/mockInterview/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMockInterviewVOByPage POST /api/mockInterview/my/list/page/vo */
export async function listMockInterviewVoByPageUsingPost(
  body: API.MockInterviewQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageMockInterview_>('/api/mockInterview/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
