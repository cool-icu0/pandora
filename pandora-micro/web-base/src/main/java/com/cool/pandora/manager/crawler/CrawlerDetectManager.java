package com.cool.pandora.manager.crawler;

import cn.dev33.satoken.stp.StpUtil;
import com.cool.common.common.ErrorCode;
import com.cool.common.exception.BusinessException;
import com.cool.pandora.manager.CounterManager;
import com.cool.model.entity.User;
import com.cool.server.UserFeignClient;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.concurrent.TimeUnit;

@Component
public class CrawlerDetectManager {

    @Resource
    private UserFeignClient userFeignClient;
    @Resource
    private CounterManager counterManager;
    @Resource
    private JavaMailSender mailSender;
    /**
     * 检测爬虫
     *
     * @param loginUserId
     */
    public void crawlerDetect(long loginUserId) {
        // 调用多少次时告警
        final int WARN_COUNT = 10;
        // 调用多少次时封号
        final int BAN_COUNT = 20;
        // 拼接访问 key
        String key = String.format("user:access:%s", loginUserId);
        // 统计一分钟内访问次数，180 秒过期
        long count = counterManager.incrAndGetCounter(key, 1, TimeUnit.MINUTES, 180);
        // 是否封号
        if (count > BAN_COUNT) {
            // 踢下线
            StpUtil.kickout(loginUserId);
            // 封号
            User updateUser = new User();
            updateUser.setId(loginUserId);
            updateUser.setUserRole("ban");
            userFeignClient.updateById(updateUser);
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "访问次数过多，已被封号");
        }
        // 是否告警
        if (count == WARN_COUNT) {
            // 可以改为向管理员发送邮件通知
            String from = "990299103@qq.com";
            String to = "990299103@qq.com";
            String subject = "警告：访问太频繁";
            String text = "用户 ID：" + loginUserId + "，访问次数过多，已被警告。";
            sendMail(from, to, subject, text);
            throw new BusinessException(110, "警告：访问太频繁");
        }
    }
    public void sendMail(String from,String to, String subject,String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);//发件人邮箱
        message.setTo(to);//收件人邮箱
        message.setSubject(subject);//主题
        message.setText(text);//内容
        mailSender.send(message);
    }
}