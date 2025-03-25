package com.cool.pandora.service.recommend;



import com.cool.pandora.model.dto.recommend.QuestionRecommendRequest;
import com.cool.pandora.model.dto.recommend.UserRecommendRequest;
import com.cool.pandora.model.vo.recommend.QuestionRecommendVO;
import com.cool.pandora.model.vo.recommend.UserRecommendVO;

import java.util.List;

public interface RecommendService {
    /**
     * 获取用户推荐列表
     * @param request
     * @return
     */
    List<UserRecommendVO> getUserRecommendList(UserRecommendRequest request);

    /**
     * 获取题目推荐列表
     * @param request
     * @return
     */
    List<QuestionRecommendVO> getQuestionRecommendList(QuestionRecommendRequest request);

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