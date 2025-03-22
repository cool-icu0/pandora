// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** addQuestionComment POST /api/question_comment/add */
export async function addQuestionCommentUsingPost(
  body: API.QuestionCommentAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/question_comment/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteQuestionComment POST /api/question_comment/delete */
export async function deleteQuestionCommentUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/question_comment/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getQuestionCommentById GET /api/question_comment/get */
export async function getQuestionCommentByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionCommentByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseQuestionComment_>(
    "/api/question_comment/get",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** listQuestionCommentByPage POST /api/question_comment/list/page */
export async function listQuestionCommentByPageUsingPost(
  body: API.QuestionCommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionComment_>(
    "/api/question_comment/list/page",
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

/** updateQuestionComment POST /api/question_comment/update */
export async function updateQuestionCommentUsingPost(
  body: API.QuestionCommentUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/question_comment/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
