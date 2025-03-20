// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

/** doFavourite POST /api/question_favourite/ */
export async function doFavouriteUsingPost(
  body: API.QuestionFavouriteAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/question_favourite/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** checkFavourite GET /api/question_favourite/check */
export async function checkFavouriteUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkFavouriteUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/question_favourite/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getFavourite GET /api/question_favourite/count */
export async function getFavouriteUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFavouriteUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/question_favourite/count', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listMyFavouriteQuestions GET /api/question_favourite/my/list */
export async function listMyFavouriteQuestionsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListQuestion_>('/api/question_favourite/my/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** listMyFavouriteQuestionsByPage POST /api/question_favourite/my/list/page */
export async function listMyFavouriteQuestionsByPageUsingPost(
  body: API.QuestionFavouriteQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestion_>('/api/question_favourite/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
