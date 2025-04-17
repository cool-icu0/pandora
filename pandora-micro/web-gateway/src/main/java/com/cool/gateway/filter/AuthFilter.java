package com.cool.gateway.filter;

import com.alibaba.excel.util.StringUtils;
import com.cool.common.utils.JwtUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * JWT统一鉴权 全局过滤器
 **/
// @Component
public class AuthFilter implements GlobalFilter, Ordered {
    /**
     * 如果配置文件中的字符串是用,隔开的 springboot 在value时会自动变成 List<String> 的数组
     * 配置不需要校验的链接
     */
    @Value("#{'${gateway.excludedUrls}'.split(',')}")
    private List<String> excludedUrls;

    /**
     * 过滤器核心代码
     *
     * @param exchange
     * @param chain
     * @return
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1.排除不需要权限校验的连接
        // 当前请求连接
        String path = exchange.getRequest().getURI().getPath();
        // 如果 当前链接不需要校验则直接放行
        if (excludedUrls.contains(path)) {
            return chain.filter(exchange);
        }
        // 2.获取token并校验
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        // 不为空时把 ("Bearer"去掉) 有时候前端传来的 token是带这个的
        if (!StringUtils.isEmpty(token)) {
            token = token.replace("Bearer ", "");
        }
        ServerHttpResponse response = exchange.getResponse();
        // 3.如果校验失败，相应状态码 401
        // 2、使用工具类，判断token是否有效
        boolean verifyToken = JwtUtils.verifyToken(token);
        // 3、如果token失效，返回状态码401，拦截
        if (!verifyToken) {
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("errCode", 401);
            responseData.put("errMessage", "用户未登录");
            return responseError(response, responseData);
        }
        return chain.filter(exchange);

    }

    /**
     * 响应错误数据 这个方法就是将这个map转化为JSON
     *
     * @param response
     * @param responseData
     * @return
     */
    private Mono<Void> responseError(ServerHttpResponse response, Map<String, Object> responseData) {
        // 将信息转换为 JSON
        ObjectMapper objectMapper = new ObjectMapper();
        byte[] data = new byte[0];
        try {
            data = objectMapper.writeValueAsBytes(responseData);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        // 输出错误信息到页面
        DataBuffer buffer = response.bufferFactory().wrap(data);
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add("Content-Type", "application/json;charset=UTF-8");
        return response.writeWith(Mono.just(buffer));
    }

    /**
     * 配置执行顺序
     *
     * @return
     */
    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}