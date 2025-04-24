// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** addQuestion POST /api/questionCode/add */
export async function addQuestionUsingPost(
  body: API.QuestionAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/questionCode/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchDeleteQuestionCode POST /api/questionCode/batchDelete */
export async function batchDeleteQuestionCodeUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/questionCode/batchDelete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchDownloadQuestions POST /api/questionCode/batchDownload */
export async function batchDownloadQuestionsUsingPost(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<string>("/api/questionCode/batchDownload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteQuestionCode POST /api/questionCode/delete */
export async function deleteQuestionCodeUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/questionCode/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** editQuestionCode POST /api/questionCode/edit */
export async function editQuestionCodeUsingPost(
  body: API.QuestionEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/questionCode/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getQuestionCodeById GET /api/questionCode/get */
export async function getQuestionCodeByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionCodeByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseQuestionCode_>("/api/questionCode/get", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getQuestionCodeVOById GET /api/questionCode/get/vo */
export async function getQuestionCodeVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionCodeVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseQuestionCodeVO_>("/api/questionCode/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getQuestionById2Answer GET /api/questionCode/get2Answer */
export async function getQuestionById2AnswerUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionById2AnswerUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseQuestionCode_>(
    "/api/questionCode/get2Answer",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** listQuestionCodeByPage POST /api/questionCode/list/page */
export async function listQuestionCodeByPageUsingPost(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionCode_>(
    "/api/questionCode/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** listQuestionCodeVOByPage POST /api/questionCode/list/page/vo */
export async function listQuestionCodeVoByPageUsingPost(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionCodeVO_>(
    "/api/questionCode/list/page/vo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** listMyQuestionCodeVOByPage POST /api/questionCode/my/list/page/vo */
export async function listMyQuestionCodeVoByPageUsingPost(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionCodeVO_>(
    "/api/questionCode/my/list/page/vo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** doQuestionCodeSubmit POST /api/questionCode/question_submit/do */
export async function doQuestionCodeSubmitUsingPost(
  body: API.QuestionSubmitAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>(
    "/api/questionCode/question_submit/do",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** getQuestionCodeSubmitById GET /api/questionCode/question_submit/get */
export async function getQuestionCodeSubmitByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionCodeSubmitByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseQuestionSubmitVO_>(
    "/api/questionCode/question_submit/get",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** listQuestionCodeSubmitByPage POST /api/questionCode/question_submit/list/page */
export async function listQuestionCodeSubmitByPageUsingPost(
  body: API.QuestionSubmitQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionSubmitVO_>(
    "/api/questionCode/question_submit/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** doQuestionCodeRun POST /api/questionCode/question_submit/run */
export async function doQuestionCodeRunUsingPost(
  body: API.QuestionSubmitAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>(
    "/api/questionCode/question_submit/run",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** getQuestionCodeRank GET /api/questionCode/rank */
export async function getQuestionCodeRankUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionCodeRankUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListUserVO_>("/api/questionCode/rank", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateQuestionCode POST /api/questionCode/update */
export async function updateQuestionCodeUsingPost(
  body: API.QuestionUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/questionCode/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
