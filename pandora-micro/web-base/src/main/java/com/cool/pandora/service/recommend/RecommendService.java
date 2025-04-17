package com.cool.pandora.service.recommend;



import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cool.model.dto.recommend.QuestionRecommendRequest;
import com.cool.model.dto.recommend.UserRecommendRequest;
import com.cool.model.vo.recommend.QuestionRecommendVO;
import com.cool.model.vo.recommend.UserRecommendVO;

import java.util.List;

public interface RecommendService {
    /**
     * 获取用户推荐列表
     * @param request
     * @return
     */
    Page<UserRecommendVO> getUserRecommendList(UserRecommendRequest request);

    /**
     * 获取题目推荐列表
     * @param request 推荐请求
     * @return 分页后的推荐题目列表
     */
    Page<QuestionRecommendVO> getQuestionRecommendList(QuestionRecommendRequest request);

    /**
     * 更新用户推荐状态
     * @param userId
     * @param recommendUserId
     * @param status
     * @return
     */
    boolean updateUserRecommendStatus(Long userId, Long recommendUserId, Integer status);

    /**
     * 更新题目推荐状态
     * @param userId
     * @param questionId
     * @param status
     * @return
     */
    boolean updateQuestionRecommendStatus(Long userId, Long questionId, Integer status);
}