declare namespace API {
  type addPostViewsUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseCommentVO_ = {
    code?: number;
    data?: CommentVO;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListInt_ = {
    code?: number;
    data?: number[];
    message?: string;
  };

  type BaseResponseListQuestion_ = {
    code?: number;
    data?: Question[];
    message?: string;
  };

  type BaseResponseListUserVO_ = {
    code?: number;
    data?: UserVO[];
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseMockInterview_ = {
    code?: number;
    data?: MockInterview;
    message?: string;
  };

  type BaseResponsePageCommentVO_ = {
    code?: number;
    data?: PageCommentVO_;
    message?: string;
  };

  type BaseResponsePageMockInterview_ = {
    code?: number;
    data?: PageMockInterview_;
    message?: string;
  };

  type BaseResponsePagePost_ = {
    code?: number;
    data?: PagePost_;
    message?: string;
  };

  type BaseResponsePagePostVO_ = {
    code?: number;
    data?: PagePostVO_;
    message?: string;
  };

  type BaseResponsePageQuestion_ = {
    code?: number;
    data?: PageQuestion_;
    message?: string;
  };

  type BaseResponsePageQuestionBank_ = {
    code?: number;
    data?: PageQuestionBank_;
    message?: string;
  };

  type BaseResponsePageQuestionBankQuestion_ = {
    code?: number;
    data?: PageQuestionBankQuestion_;
    message?: string;
  };

  type BaseResponsePageQuestionBankQuestionVO_ = {
    code?: number;
    data?: PageQuestionBankQuestionVO_;
    message?: string;
  };

  type BaseResponsePageQuestionBankVO_ = {
    code?: number;
    data?: PageQuestionBankVO_;
    message?: string;
  };

  type BaseResponsePageQuestionCode_ = {
    code?: number;
    data?: PageQuestionCode_;
    message?: string;
  };

  type BaseResponsePageQuestionCodeVO_ = {
    code?: number;
    data?: PageQuestionCodeVO_;
    message?: string;
  };

  type BaseResponsePageQuestionComment_ = {
    code?: number;
    data?: PageQuestionComment_;
    message?: string;
  };

  type BaseResponsePageQuestionRecommendVO_ = {
    code?: number;
    data?: PageQuestionRecommendVO_;
    message?: string;
  };

  type BaseResponsePageQuestionSubmitVO_ = {
    code?: number;
    data?: PageQuestionSubmitVO_;
    message?: string;
  };

  type BaseResponsePageQuestionVO_ = {
    code?: number;
    data?: PageQuestionVO_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserRecommendVO_ = {
    code?: number;
    data?: PageUserRecommendVO_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponsePostVO_ = {
    code?: number;
    data?: PostVO;
    message?: string;
  };

  type BaseResponseQuestionBankQuestionVO_ = {
    code?: number;
    data?: QuestionBankQuestionVO;
    message?: string;
  };

  type BaseResponseQuestionBankVO_ = {
    code?: number;
    data?: QuestionBankVO;
    message?: string;
  };

  type BaseResponseQuestionCode_ = {
    code?: number;
    data?: QuestionCode;
    message?: string;
  };

  type BaseResponseQuestionCodeVO_ = {
    code?: number;
    data?: QuestionCodeVO;
    message?: string;
  };

  type BaseResponseQuestionComment_ = {
    code?: number;
    data?: QuestionComment;
    message?: string;
  };

  type BaseResponseQuestionSubmitVO_ = {
    code?: number;
    data?: QuestionSubmitVO;
    message?: string;
  };

  type BaseResponseQuestionVO_ = {
    code?: number;
    data?: QuestionVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type checkFavouriteUsingGETParams = {
    /** questionId */
    questionId: number;
  };

  type checkThumbUsingGETParams = {
    /** questionId */
    questionId: number;
  };

  type checkUsingGETParams = {
    /** echostr */
    echostr?: string;
    /** nonce */
    nonce?: string;
    /** signature */
    signature?: string;
    /** timestamp */
    timestamp?: string;
  };

  type CommentAddRequest = {
    content?: string;
    parentId?: number;
    postId?: number;
    replyUserId?: number;
    rootId?: number;
  };

  type CommentQueryRequest = {
    current?: number;
    pageSize?: number;
    postId?: number;
    rootId?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type CommentThumbAddRequest = {
    commentId?: number;
  };

  type CommentUpdateRequest = {
    content?: string;
    id?: number;
  };

  type CommentVO = {
    children?: CommentVO[];
    content?: string;
    createTime?: string;
    hasThumb?: boolean;
    id?: number;
    level?: number;
    parentId?: number;
    postId?: number;
    replyCount?: number;
    replyUserId?: number;
    replyUserVO?: UserVO;
    rootId?: number;
    thumbNum?: number;
    userId?: number;
    userVO?: UserVO;
  };

  type DeleteRequest = {
    id?: number;
    ids?: number[];
  };

  type doLoginUsingDELETEParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type doLoginUsingGETParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type doLoginUsingPATCHParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type doLoginUsingPOSTParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type doLoginUsingPUTParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type getCommentByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getFavouriteUsingGETParams = {
    /** questionId */
    questionId: number;
  };

  type getMockInterviewByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getPostVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionBankQuestionVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionBankVOByIdUsingGETParams = {
    current?: number;
    description?: string;
    id?: number;
    needQueryQuestionList?: boolean;
    notId?: number;
    pageSize?: number;
    picture?: string;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    userId?: number;
  };

  type getQuestionById2AnswerUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionCodeByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionCodeRankUsingGETParams = {
    /** limit */
    limit?: number;
    /** month */
    month?: number;
    /** year */
    year?: number;
  };

  type getQuestionCodeSubmitByIdUsingGETParams = {
    /** questionSubmitId */
    questionSubmitId?: number;
  };

  type getQuestionCodeVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionCommentByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionViewCountUsingGETParams = {
    /** questionId */
    questionId: number;
  };

  type getQuestionViewsUsingGETParams = {
    /** postId */
    postId: number;
  };

  type getQuestionVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getThumbCountUsingGETParams = {
    /** questionId */
    questionId: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserSignInRankUsingGETParams = {
    /** limit */
    limit?: number;
    /** month */
    month?: number;
    /** year */
    year?: number;
  };

  type getUserSignInRecordUsingGETParams = {
    /** year */
    year?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type increaseQuestionViewCountUsingPOSTParams = {
    /** questionId */
    questionId: number;
  };

  type JudgeCase = {
    input?: string;
    output?: string;
  };

  type JudgeConfig = {
    memoryLimit?: number;
    stackLimit?: number;
    timeLimit?: number;
  };

  type JudgeInfo = {
    memory?: number;
    message?: string;
    time?: number;
  };

  type LoginUserVO = {
    createTime?: string;
    email?: string;
    expertiseDirection?: string;
    grade?: string;
    id?: number;
    phoneNumber?: string;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
    workExperience?: string;
  };

  type MockInterview = {
    createTime?: string;
    difficulty?: string;
    id?: number;
    isDelete?: number;
    jobPosition?: string;
    messages?: string;
    status?: number;
    updateTime?: string;
    userId?: number;
    workExperience?: string;
  };

  type MockInterviewAddRequest = {
    difficulty?: string;
    jobPosition?: string;
    workExperience?: string;
  };

  type MockInterviewEventRequest = {
    event?: string;
    id?: number;
    message?: string;
  };

  type MockInterviewQueryRequest = {
    current?: number;
    difficulty?: string;
    id?: number;
    jobPosition?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    userId?: number;
    workExperience?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageCommentVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: CommentVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageMockInterview_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: MockInterview[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePost_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Post[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePostVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: PostVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestion_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Question[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionBank_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionBank[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionBankQuestion_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionBankQuestion[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionBankQuestionVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionBankQuestionVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionBankVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionBankVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionCode_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionCode[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionCodeVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionCodeVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionComment_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionComment[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionRecommendVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionRecommendVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionSubmitVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionSubmitVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserRecommendVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserRecommendVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Post = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    tags?: string;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type PostAddRequest = {
    content?: string;
    tags?: string[];
    title?: string;
  };

  type PostEditRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostFavourAddRequest = {
    postId?: number;
  };

  type PostFavourQueryRequest = {
    current?: number;
    pageSize?: number;
    postQueryRequest?: PostQueryRequest;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type PostQueryRequest = {
    content?: string;
    current?: number;
    favourUserId?: number;
    id?: number;
    notId?: number;
    orTags?: string[];
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type PostThumbAddRequest = {
    postId?: number;
  };

  type PostUpdateRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostVO = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    tagList?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type Question = {
    answer?: string;
    content?: string;
    createTime?: string;
    difficulty?: string;
    editTime?: string;
    id?: number;
    isDelete?: number;
    tags?: string;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type QuestionAddRequest = {
    answer?: string;
    content?: string;
    judgeCase?: JudgeCase[];
    judgeConfig?: JudgeConfig;
    tags?: string[];
    title?: string;
  };

  type QuestionAddRequest1 = {
    answer?: string;
    content?: string;
    difficulty?: string;
    tags?: string[];
    title?: string;
  };

  type QuestionAIGenerateRequest = {
    number?: number;
    questionType?: string;
  };

  type QuestionBank = {
    createTime?: string;
    description?: string;
    editTime?: string;
    id?: number;
    isDelete?: number;
    picture?: string;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type QuestionBankAddRequest = {
    description?: string;
    picture?: string;
    title?: string;
  };

  type QuestionBankEditRequest = {
    description?: string;
    id?: number;
    picture?: string;
    title?: string;
  };

  type QuestionBankQueryRequest = {
    current?: number;
    description?: string;
    id?: number;
    needQueryQuestionList?: boolean;
    notId?: number;
    pageSize?: number;
    picture?: string;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    userId?: number;
  };

  type QuestionBankQuestion = {
    createTime?: string;
    id?: number;
    questionBankId?: number;
    questionId?: number;
    updateTime?: string;
    userId?: number;
  };

  type QuestionBankQuestionAddRequest = {
    questionBankId?: number;
    questionId?: number;
  };

  type QuestionBankQuestionBatchAddRequest = {
    questionBankId?: number;
    questionIdList?: number[];
  };

  type QuestionBankQuestionBatchRemoveRequest = {
    questionBankId?: number;
    questionIdList?: number[];
  };

  type QuestionBankQuestionQueryRequest = {
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    questionBankId?: number;
    questionId?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type QuestionBankQuestionRemoveRequest = {
    questionBankId?: number;
    questionId?: number;
  };

  type QuestionBankQuestionUpdateRequest = {
    id?: number;
    questionBankId?: number;
    questionId?: number;
  };

  type QuestionBankQuestionVO = {
    createTime?: string;
    id?: number;
    questionBankId?: number;
    questionId?: number;
    tagList?: string[];
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type QuestionBankUpdateRequest = {
    description?: string;
    id?: number;
    picture?: string;
    title?: string;
  };

  type QuestionBankVO = {
    createTime?: string;
    description?: string;
    id?: number;
    picture?: string;
    questionPage?: PageQuestionVO_;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type QuestionBatchDeleteRequest = {
    questionIdList?: number[];
  };

  type QuestionCode = {
    acceptedNum?: number;
    answer?: string;
    content?: string;
    createTime?: string;
    difficulty?: string;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    judgeCase?: string;
    judgeConfig?: string;
    submitNum?: number;
    tags?: string;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type QuestionCodeVO = {
    acceptedNum?: number;
    content?: string;
    createTime?: string;
    difficulty?: string;
    favourNum?: number;
    id?: number;
    judgeConfig?: JudgeConfig;
    submitNum?: number;
    tags?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type QuestionComment = {
    content?: string;
    createTime?: string;
    id?: number;
    isDelete?: number;
    questionId?: number;
    updateTime?: string;
    userId?: number;
  };

  type QuestionCommentAddRequest = {
    content?: string;
    questionId?: number;
  };

  type QuestionCommentQueryRequest = {
    content?: string;
    current?: number;
    pageSize?: number;
    questionId?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type QuestionCommentUpdateRequest = {
    content?: string;
    id?: number;
  };

  type QuestionEditRequest = {
    answer?: string;
    content?: string;
    id?: number;
    judgeCase?: JudgeCase[];
    judgeConfig?: JudgeConfig;
    tags?: string[];
    title?: string;
  };

  type QuestionEditRequest1 = {
    answer?: string;
    content?: string;
    difficulty?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type QuestionFavouriteAddRequest = {
    questionId?: number;
  };

  type QuestionFavouriteQueryRequest = {
    current?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type QuestionQueryRequest = {
    answer?: string;
    content?: string;
    current?: number;
    difficulty?: string;
    favourNum?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    thumbNum?: number;
    title?: string;
    userId?: number;
  };

  type QuestionQueryRequest1 = {
    answer?: string;
    content?: string;
    current?: number;
    difficulty?: string;
    id?: number;
    notId?: number;
    pageSize?: number;
    questionBankId?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type QuestionRecommendRequest = {
    current?: number;
    pageSize?: number;
    status?: number;
    type?: string;
    userId?: number;
  };

  type QuestionRecommendVO = {
    questionCodeVO?: QuestionCodeVO;
    questionId?: number;
    reason?: string;
    score?: number;
    type?: string;
  };

  type QuestionSubmitAddRequest = {
    inputList?: string;
    questionId?: number;
    submitCode?: string;
    submitLanguage?: string;
  };

  type QuestionSubmitQueryRequest = {
    current?: number;
    pageSize?: number;
    questionId?: number;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    submitLanguage?: string;
    userId?: number;
  };

  type QuestionSubmitVO = {
    createTime?: string;
    id?: number;
    judgeInfo?: JudgeInfo;
    questionCodeVO?: QuestionCodeVO;
    questionId?: number;
    submitCode?: string;
    submitLanguage?: string;
    submitState?: number;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type QuestionThumbAddRequest = {
    questionId?: number;
  };

  type QuestionUpdateRequest = {
    answer?: string;
    content?: string;
    id?: number;
    judgeCase?: JudgeCase[];
    judgeConfig?: JudgeConfig;
    tags?: string[];
    title?: string;
  };

  type QuestionUpdateRequest1 = {
    answer?: string;
    content?: string;
    difficulty?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type QuestionVO = {
    answer?: string;
    content?: string;
    createTime?: string;
    id?: number;
    tagList?: string[];
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type updateQuestionRecommendStatusUsingPOSTParams = {
    /** questionId */
    questionId: number;
    /** status */
    status: number;
    /** userId */
    userId: number;
  };

  type updateUserRecommendStatusUsingPOSTParams = {
    /** recommendUserId */
    recommendUserId: number;
    /** status */
    status: number;
    /** userId */
    userId: number;
  };

  type User = {
    createTime?: string;
    editTime?: string;
    email?: string;
    expertiseDirection?: string;
    grade?: string;
    id?: number;
    isDelete?: number;
    mpOpenId?: string;
    phoneNumber?: string;
    unionId?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
    workExperience?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserEditRequest = {
    email?: string;
    expertiseDirection?: string;
    grade?: string;
    phoneNumber?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    workExperience?: string;
  };

  type userLoginByWxOpenUsingGETParams = {
    /** code */
    code: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRecommendRequest = {
    current?: number;
    pageSize?: number;
    status?: number;
    userId?: number;
  };

  type UserRecommendVO = {
    reason?: string;
    recommendUser?: UserVO;
    recommendUserId?: number;
    score?: number;
    status?: number;
    tags?: string[];
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    questionPassCount?: number;
    signInCount?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
