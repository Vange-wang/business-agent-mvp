# ISSUE 总表

更新日期：2026-07-07

当前 Open Issue：无。

## 本轮跟踪口径

- 阶段任务：二客户复制试点
- 任务 ID：`CS-AGENT-SECOND-CUSTOMER-PILOT-2026-07-07-ISSUE-TRACK`
- 对应项目主任务：`CS-AGENT-SECOND-CUSTOMER-PILOT-2026-07-07`
- ISSUE 管理员 Agent 只登记真实阻塞或缺陷，不虚构 Issue。
- 后续接收产品经理、技术验证、Agent 搭建师、代码开发员、UI / 交付设计 Agent 回报的问题。
- 本表作为本轮是否可验收的依据之一：当前无阻塞 Open Issue 时，可支持进入后续验收判断；最终验收仍以项目总负责人汇总各角色证据为准。

## 当前阶段验收口径

二客户复制试点已完成以下关键闭环：

- 已完成清安到家家政清洁第二客户交付目录。
- 已新增第二客户专属知识库和 Dify 复制配置。
- 已新增第二客户自动化测试。
- 已执行本地智能客服原型自动化验收：`tests 15 / pass 15 / fail 0`。
- 当前无阻塞二客户复制试点验收的 Open Issue。

## 编号与状态规则

- 新增 Issue 编号格式：`CS-ISSUE-YYYYMMDD-NNN`。
- 状态取值：`Open`、`Blocked`、`Resolved`、`Closed`。
- 责任 Agent 必须明确到主责内部协作角色 Agent。
- 关闭依据必须包含责任 Agent 的修复或验证回报、必要证据路径，以及项目总负责人或验收流程的确认口径。

## Issue 列表

| Issue ID | 标题 | 状态 | 来源 | 责任 Agent | 创建日期 | 关闭依据 |
| --- | --- | --- | --- | --- | --- | --- |
| CS-ISSUE-20260707-001 | 生产环境 Dify WebApp URL 使用后台应用 ID，导致 App with code not found | Closed | 用户截图 / 生产页面 | 项目总负责人 Agent / Agent 搭建师 Agent / 代码开发员 Agent | 2026-07-07 | 已将 `NEXT_PUBLIC_DIFY_CUSTOMER_SERVICE_URL` 修复为 `https://udify.app/chatbot/aFMxKMpMSFNm6ItV`；复验结果：Dify WebApp 200 且无 `App with code`，生产 `/customer-service` 200，包含新 `/chatbot/` URL，不再包含旧 `/chat/ae0d...` URL，保留 `/feedback` 入口 |
