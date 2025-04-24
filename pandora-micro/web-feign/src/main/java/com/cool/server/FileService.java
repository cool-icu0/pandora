package com.cool.server;

import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传
 */
public interface FileService {
    /**
     * 上传头像到OSS
     *
     * @param file
     * @return
     */
    String uploadFileAvatar(MultipartFile file);
}
