package com.cool.pandora.job;

import com.alibaba.otter.canal.client.CanalConnector;
import com.alibaba.otter.canal.client.CanalConnectors;
import com.alibaba.otter.canal.protocol.CanalEntry;
import com.alibaba.otter.canal.protocol.Message;
import com.cool.pandora.esdao.QuestionEsDao;
import com.cool.model.dto.question.QuestionEsDTO;
import com.cool.model.entity.question.Question;
import com.cool.pandora.service.question.QuestionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.annotation.PostConstruct;
import java.net.InetSocketAddress;
import java.util.List;

/**
 * 基于 Canal 实现的 binlog 自动同步任务，监听 MySQL 变更并双写到 ES 和 MySQL
 */
@Slf4j
// @Component
public class BinlogSyncJob {

    @Resource
    private QuestionService questionService;
    @Resource
    private QuestionEsDao questionEsDao;

    @PostConstruct
    public void startBinlogSync() {
        new Thread(() -> {
            log.info("BinlogSyncJob 启动，监听 MySQL binlog 变更...");
            CanalConnector connector = CanalConnectors.newSingleConnector(
                    new InetSocketAddress("127.0.0.1", 11111), "example", "", "");
            try {
                connector.connect();
                connector.subscribe(".*\\.question");
                connector.rollback();
                while (true) {
                    Message message = connector.getWithoutAck(100); // 获取指定数量的数据
                    long batchId = message.getId();
                    int size = message.getEntries().size();
                    if (batchId == -1 || size == 0) {
                        Thread.sleep(1000);
                        continue;
                    }
                    for (CanalEntry.Entry entry : message.getEntries()) {
                        if (entry.getEntryType() == CanalEntry.EntryType.ROWDATA) {
                            CanalEntry.RowChange rowChange = CanalEntry.RowChange.parseFrom(entry.getStoreValue());
                            String tableName = entry.getHeader().getTableName();
                            for (CanalEntry.RowData rowData : rowChange.getRowDatasList()) {
                                BinlogEvent event = convertToBinlogEvent(tableName, rowChange.getEventType(), rowData);
                                if (event != null) {
                                    try {
                                        handleEvent(event);
                                    } catch (Exception e) {
                                        log.error("同步 binlog 到 ES 失败", e);
                                    }
                                }
                            }
                        }
                    }
                    connector.ack(batchId); // 提交确认
                }
            } catch (Exception e) {
                log.error("Canal 监听异常", e);
            } finally {
                connector.disconnect();
            }
        }).start();
    }

    // 处理 binlog 事件并同步到 ES
    private void handleEvent(BinlogEvent event) {
        if (event.getTable().equalsIgnoreCase("question")) {
            if (event.getType() == BinlogEvent.Type.INSERT || event.getType() == BinlogEvent.Type.UPDATE) {
                Question question = (Question) event.getData();
                // 1. 写入 MySQL（此处假设已由业务层完成）
                // 2. 写入 ES
                QuestionEsDTO dto = QuestionEsDTO.objToDto(question);
                questionEsDao.save(dto);
                log.info("同步题目到 ES: {}", dto.getId());
            } else if (event.getType() == BinlogEvent.Type.DELETE) {
                Long id = event.getId();
                questionEsDao.deleteById(id);
                log.info("从 ES 删除题目: {}", id);
            }
        }
    }

    // 伪 binlog 事件类，实际应用需用 canal 的 Entry/Event 对象
    private static class BinlogEvent {
        enum Type {INSERT, UPDATE, DELETE}
        private String table;
        private Type type;
        private Object data;
        private Long id;
        public String getTable() { return table; }
        public Type getType() { return type; }
        public Object getData() { return data; }
        public Long getId() { return id; }
    }
    // 将 canal 的事件转换为 BinlogEvent
    private BinlogEvent convertToBinlogEvent(String table, CanalEntry.EventType eventType, CanalEntry.RowData rowData) {
        if (!"question".equalsIgnoreCase(table)) return null;
        BinlogEvent event = new BinlogEvent();
        event.table = table;
        if (eventType == CanalEntry.EventType.INSERT) {
            event.type = BinlogEvent.Type.INSERT;
            Question question = new Question();
            rowData.getAfterColumnsList().forEach(col -> setQuestionField(question, col.getName(), col.getValue()));
            event.data = question;
            event.id = question.getId();
        } else if (eventType == CanalEntry.EventType.UPDATE) {
            event.type = BinlogEvent.Type.UPDATE;
            Question question = new Question();
            rowData.getAfterColumnsList().forEach(col -> setQuestionField(question, col.getName(), col.getValue()));
            event.data = question;
            event.id = question.getId();
        } else if (eventType == CanalEntry.EventType.DELETE) {
            event.type = BinlogEvent.Type.DELETE;
            Long id = null;
            for (CanalEntry.Column col : rowData.getBeforeColumnsList()) {
                if ("id".equalsIgnoreCase(col.getName())) {
                    id = Long.valueOf(col.getValue());
                    break;
                }
            }
            event.id = id;
        } else {
            return null;
        }
        return event;
    }

    // 反射设置 Question 字段（可根据实际字段优化）
    private void setQuestionField(Question question, String fieldName, String value) {
        try {
            java.lang.reflect.Field field = Question.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            if (field.getType() == Long.class) {
                field.set(question, value == null || value.isEmpty() ? null : Long.valueOf(value));
            } else if (field.getType() == Integer.class) {
                field.set(question, value == null || value.isEmpty() ? null : Integer.valueOf(value));
            } else {
                field.set(question, value);
            }
        } catch (Exception e) {
            // 忽略不存在的字段
        }
    }
}