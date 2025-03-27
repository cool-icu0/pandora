// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

/** getQuestionRecommendList POST /api/recommend/question/list */
export async function getQuestionRecommendListUsingPost(
  body: API.QuestionRecommendRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/api/recommend/question/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateQuestionRecommendStatus POST /api/recommend/question/status */
export async function updateQuestionRecommendStatusUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateQuestionRecommendStatusUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/api/recommend/question/status', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getUserRecommendList POST /api/recommend/user/list */
export async function getUserRecommendListUsingPost(
  body: API.UserRecommendRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/api/recommend/user/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateUserRecommendStatus POST /api/recommend/user/status */
export async function updateUserRecommendStatusUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserRecommendStatusUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/api/recommend/user/status', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
