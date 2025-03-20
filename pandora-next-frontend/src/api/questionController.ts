// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

/** addQuestion POST /api/question/add */
export async function addQuestionUsingPost1(
  body: API.QuestionAddRequest1,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/question/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** aiGenerateQuestions POST /api/question/ai/generate/question */
export async function aiGenerateQuestionsUsingPost(
  body: API.QuestionAIGenerateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/question/ai/generate/question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteQuestion POST /api/question/delete */
export async function deleteQuestionUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/question/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** batchDeleteQuestions POST /api/question/delete/batch */
export async function batchDeleteQuestionsUsingPost(
  body: API.QuestionBatchDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/question/delete/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** editQuestion POST /api/question/edit */
export async function editQuestionUsingPost(
  body: API.QuestionEditRequest1,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/question/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getQuestionVOById GET /api/question/get/vo */
export async function getQuestionVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseQuestionVO_>('/api/question/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listQuestionByPage POST /api/question/list/page */
export async function listQuestionByPageUsingPost(
  body: API.QuestionQueryRequest1,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestion_>('/api/question/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listQuestionVOByPage POST /api/question/list/page/vo */
export async function listQuestionVoByPageUsingPost(
  body: API.QuestionQueryRequest1,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestionVO_>('/api/question/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listQuestionVOByPageSentinel POST /api/question/list/page/vo/sentinel */
export async function listQuestionVoByPageSentinelUsingPost(
  body: API.QuestionQueryRequest1,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestionVO_>('/api/question/list/page/vo/sentinel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyQuestionVOByPage POST /api/question/my/list/page/vo */
export async function listMyQuestionVoByPageUsingPost(
  body: API.QuestionQueryRequest1,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestionVO_>('/api/question/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** searchQuestionVOByPage POST /api/question/search/page/vo */
export async function searchQuestionVoByPageUsingPost(
  body: API.QuestionQueryRequest1,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestionVO_>('/api/question/search/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateQuestion POST /api/question/update */
export async function updateQuestionUsingPost(
  body: API.QuestionUpdateRequest1,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/question/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** increaseQuestionViewCount POST /api/question/view/${param0} */
export async function increaseQuestionViewCountUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.increaseQuestionViewCountUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { questionId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean_>(`/api/question/view/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** getQuestionViewCount GET /api/question/view/count/${param0} */
export async function getQuestionViewCountUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionViewCountUsingGETParams,
  options?: { [key: string]: any },
) {
  const { questionId: param0, ...queryParams } = params;
  return request<API.BaseResponseLong_>(`/api/question/view/count/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
