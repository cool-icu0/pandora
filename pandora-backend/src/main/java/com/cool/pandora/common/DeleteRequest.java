package com.cool.pandora.common;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * 删除请求
 *
 */
@Data
public class DeleteRequest implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * ids
     */
    private List<Long> ids;

    private static final long serialVersionUID = 1L;
}