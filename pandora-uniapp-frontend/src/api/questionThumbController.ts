// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** doThumb POST /api/question_thumb/ */
export async function doThumbUsingPost1(
  body: API.QuestionThumbAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseInt_>("/api/question_thumb/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** checkThumb GET /api/question_thumb/get/check */
export async function checkThumbUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkThumbUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/question_thumb/get/check", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getThumbCount GET /api/question_thumb/get/count */
export async function getThumbCountUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getThumbCountUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseInt_>("/api/question_thumb/get/count", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
