# Dify API 接入实施方案

状态：二阶段增强方案，当前不写入真实 API Key。

## 1. 什么时候进入 API 接入

满足以下任一条件时进入 API 接入阶段：

- 客户不想直接暴露 Dify WebApp 样式。
- 客户需要自定义前端聊天组件。
- 客户需要把线索同步到表格、CRM、飞书、企微或数据库。
- 客户需要服务端隐藏 Dify API Key。
- 客户需要统一日志、限流、错误兜底或客户隔离。

## 2. 推荐架构

```text
用户浏览器
  -> 客户网站聊天组件
  -> 我方服务端 API 中转
  -> Dify Access API
  -> Dify Chatflow / Knowledge / LLM
  -> 我方服务端处理响应与线索
  -> 用户浏览器
```

原则：

- Dify API Key 只放服务端环境变量。
- 浏览器不直接持有密钥。
- 服务端负责超时、错误兜底、日志和线索同步。
- 客户数据字段必须最小化。

## 3. 环境变量

建议使用 `Code文档/env/customer-service.env.example` 作为基础，并补充客户项目实际配置。

```text
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_APP_ID=
DIFY_API_KEY=
DIFY_WEBAPP_URL=
DIFY_CONVERSATION_MODE=api
CUSTOMER_SERVICE_AGENT_NAME=智能客服
PUBLIC_CUSTOMER_SERVICE_ENTRY_URL=
LEAD_WEBHOOK_URL=
LEAD_WEBHOOK_SECRET=
REQUEST_TIMEOUT_MS=30000
ENABLE_LEAD_CAPTURE=true
ENABLE_DEBUG_LOG=false
```

真实值只写入客户部署环境，不写入 Git 仓库。

## 4. 最小接口设计

### `POST /api/customer-service/chat`

请求：

```json
{
  "message": "你们怎么收费？",
  "conversationId": "optional-conversation-id",
  "visitorId": "anonymous-or-customer-visitor-id"
}
```

响应：

```json
{
  "answer": "具体价格会根据你的业务场景、知识库规模和接入方式评估。",
  "conversationId": "dify-conversation-id",
  "handoffRequired": false,
  "leadCaptured": false
}
```

错误响应：

```json
{
  "answer": "当前智能客服暂时不可用，我可以先帮你记录需求，请稍后由人工跟进。",
  "errorCode": "DIFY_TIMEOUT",
  "handoffRequired": true
}
```

## 5. 服务端职责

- 校验输入不能为空、不能过长。
- 读取服务端 Dify API Key。
- 调用 Dify Chat API。
- 维护 conversation_id。
- 处理 Dify 超时和错误。
- 识别转人工和线索意图。
- 按客户确认方式同步线索。
- 记录必要日志，不记录高敏感信息。

## 6. 前端职责

- 展示聊天入口。
- 展示智能客服身份和隐私提示。
- 发送用户消息到服务端。
- 展示回复、加载态和错误态。
- 在移动端保持输入框可用。
- 不保存或展示 Dify API Key。

## 7. 测试清单

| 测试项 | 通过标准 |
| --- | --- |
| 未配置 API Key | 服务端拒绝启动或返回明确错误 |
| 普通问答 | 能获得 Dify 回复 |
| 多轮会话 | conversation_id 能延续 |
| Dify 超时 | 返回友好兜底，不暴露内部错误 |
| 转人工 | 返回 handoffRequired 或对应话术 |
| 线索收集 | 字段完整时可同步到目标系统 |
| 移动端 | 聊天入口可用，不遮挡输入 |
| 安全检查 | 前端代码和响应中没有 API Key |

## 8. 当前项目落地顺序

1. 保持当前 Dify WebApp 作为稳定演示入口。
2. 确认客户是否需要自定义网页组件。
3. 确认线索同步目标是表格、CRM、飞书、企微还是数据库。
4. 新增服务端 API 中转。
5. 新增前端聊天组件。
6. 跑 API 冒烟测试。
7. 更新交付 SOP 和验收清单。

## 9. 暂不纳入 API 首版的内容

- 多租户后台。
- 客户登录权限系统。
- 自动计费。
- 大规模消息队列。
- 私有模型微调。
- 未确认平台的深度双向同步。

