// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

/** addComment POST /api/comment/add */
export async function addCommentUsingPost(
  body: API.CommentAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/comment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteComment POST /api/comment/delete */
export async function deleteCommentUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/comment/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员删除评论 POST /api/comment/delete/admin */
export async function deleteCommentAdminUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/comment/delete/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getCommentById GET /api/comment/get */
export async function getCommentByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseCommentVO_>('/api/comment/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listCommentByPage POST /api/comment/list/page */
export async function listCommentByPageUsingPost(
  body: API.CommentQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageCommentVO_>('/api/comment/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取我的评论列表 POST /api/comment/my/list/page */
export async function listMyCommentByPageUsingPost(
  body: API.CommentQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageCommentVO_>('/api/comment/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** thumbComment POST /api/comment/thumb */
export async function thumbCommentUsingPost(
  body: API.CommentThumbAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/comment/thumb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateComment POST /api/comment/update */
export async function updateCommentUsingPost(
  body: API.CommentUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/comment/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
