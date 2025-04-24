package com.cool.user.controller.inner;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cool.model.entity.User;
import com.cool.server.UserFeignClient;
import com.cool.user.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/**
 * 该服务仅内部调用，不是给前端的
 */

@RestController
@RequestMapping("/inner")
public class UserInnerController implements UserFeignClient {

    @Resource
    private UserService userService;
    /**
     * 根据 id 获取用户
     * @param userId
     * @return
     */
    @Override
    @GetMapping("/get/id")
    public User getById(@RequestParam("userId") long userId){
        return userService.getById(userId);
    }

    /**
     * 根据 id 获取用户列表
     * @param idList
     * @return
     */
    @Override
    @GetMapping("/get/ids")
    public List<User> listByIds(@RequestParam("idList") Collection<Long> idList){
        return userService.listByIds(idList);
    }

    @Override
    public boolean updateById(User updateUser) {
        return userService.updateById(updateUser);
    }

    @Override
    public List<User> list(QueryWrapper<User> userQueryWrapper) {
        return userService.list(userQueryWrapper);
    }
}
