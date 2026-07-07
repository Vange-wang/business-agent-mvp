# ISSUE 总表

更新日期：2026-07-07

当前 Open Issue：无。

## 本轮跟踪口径

- 阶段任务：三行业 FAQ 测试集与可视化预览阶段
- 任务 ID：`CS-AGENT-THREE-INDUSTRY-IMPLEMENTATION-VISUAL-2026-07-07-ISSUE-TRACK`
- 对应项目主任务：`CS-AGENT-THREE-INDUSTRY-IMPLEMENTATION-VISUAL-2026-07-07`
- ISSUE 管理员 Agent 只登记真实阻塞或缺陷，不虚构 Issue。
- 后续接收产品经理、学习研究、技术验证、Agent 搭建师、代码开发员、UI / 交付设计 Agent 回报的问题。
- 本表作为本轮是否可验收的依据之一：当前无阻塞 Open Issue 时，可支持进入后续验收判断；最终验收仍以项目总负责人汇总各角色证据为准。
- 当前 Open Issue：无。

## 当前阶段验收口径

三行业 FAQ 测试集与可视化预览阶段已完成以下关键闭环：

- 产品经理已产出三行业实施与可视化阶段 Spec。
- 学习研究已完成三行业 FAQ 测试集，每个行业 30 条，覆盖教育培训、家政清洁、本地门店。
- Agent 搭建师已完成三行业 Dify 实装配置蓝图。
- 技术验证已完成三行业验收方案。
- UI / 交付设计已完成可视化预览说明。
- 代码开发员已完成静态可视化预览页。
- 当前已完成范围为文档、测试集、配置蓝图和静态预览；真实 Dify 三行业线上实装属于下一阶段，不作为本阶段已完成内容。
- 当前无阻塞三行业 FAQ 测试集与可视化预览阶段验收的 Open Issue。

## 编号与状态规则

- 新增 Issue 编号格式：`CS-ISSUE-YYYYMMDD-NNN`。
- 状态取值：`Open`、`Blocked`、`Resolved`、`Closed`。
- 责任 Agent 必须明确到主责内部协作角色 Agent。
- 关闭依据必须包含责任 Agent 的修复或验证回报、必要证据路径，以及项目总负责人或验收流程的确认口径。

## Issue 列表

| Issue ID | 标题 | 状态 | 来源 | 责任 Agent | 创建日期 | 关闭依据 |
| --- | --- | --- | --- | --- | --- | --- |
| CS-ISSUE-20260707-001 | 生产环境 Dify WebApp URL 使用后台应用 ID，导致 App with code not found | Closed | 用户截图 / 生产页面 | 项目总负责人 Agent / Agent 搭建师 Agent / 代码开发员 Agent | 2026-07-07 | 已将 `NEXT_PUBLIC_DIFY_CUSTOMER_SERVICE_URL` 修复为 `https://udify.app/chatbot/aFMxKMpMSFNm6ItV`；复验结果：Dify WebApp 200 且无 `App with code`，生产 `/customer-service` 200，包含新 `/chatbot/` URL，不再包含旧 `/chat/ae0d...` URL，保留 `/feedback` 入口 |
