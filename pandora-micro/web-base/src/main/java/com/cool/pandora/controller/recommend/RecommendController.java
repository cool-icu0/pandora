package com.cool.pandora.controller.recommend;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cool.common.common.BaseResponse;
import com.cool.common.common.ResultUtils;
import com.cool.model.dto.recommend.QuestionRecommendRequest;
import com.cool.model.dto.recommend.UserRecommendRequest;
import com.cool.model.vo.recommend.QuestionRecommendVO;
import com.cool.model.vo.recommend.UserRecommendVO;
import com.cool.pandora.service.recommend.RecommendService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/recommend")
public class RecommendController {

    @Resource
    private RecommendService recommendService;

    /**
     * 获取用户推荐
     */
    @PostMapping("/user/list")
    public BaseResponse<Page<UserRecommendVO>> getUserRecommendList(@RequestBody UserRecommendRequest request,
                                                                    HttpServletRequest httpServletRequest) {
        return ResultUtils.success(recommendService.getUserRecommendList(request));
    }

    /**
     * 获取题目推荐
     */
    @PostMapping("/question/list")
    public BaseResponse<Page<QuestionRecommendVO>> getQuestionRecommendList(@RequestBody QuestionRecommendRequest request,
                                                                            HttpServletRequest httpServletRequest) {
        return ResultUtils.success(recommendService.getQuestionRecommendList(request));
    }

    /**
     * 更新用户推荐状态
     */
    @PostMapping("/user/status")
    public BaseResponse updateUserRecommendStatus(@RequestParam Long userId,
                                               @RequestParam Long recommendUserId,
                                               @RequestParam Integer status) {
        return ResultUtils.success(recommendService.updateUserRecommendStatus(userId, recommendUserId, status));
    }

    /**
     * 更新题目推荐状态
     */
    @PostMapping("/question/status")
    public BaseResponse updateQuestionRecommendStatus(@RequestParam Long userId,
                                                   @RequestParam Long questionId,
                                                   @RequestParam Integer status) {
        return ResultUtils.success(recommendService.updateQuestionRecommendStatus(userId, questionId, status));
    }
}