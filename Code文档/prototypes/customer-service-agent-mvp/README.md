# 智能客服业务智能体 MVP

本目录是首个可运行的“可售卖业务智能体 Agent”本地 MVP。它默认使用 `Agent研究文档/Dify模板/智能客服业务智能体/knowledge-base-ai-agent-service-sales.md` 作为知识库，完成售前客服问答、报价边界、数据安全解释、线索收集和转人工判断；同时通过 `knowledge-base-home-cleaning-pilot.md` 验证第二客户家政清洁场景的复制能力。

## 目录说明

- `agent-core.js`：智能客服核心逻辑，负责知识库加载、检索、回复、线索收集和转人工判断。
- `server.js`：本地 HTTP 服务，提供网页演示和 `/api/chat` 接口。
- `public/`：可直接给客户演示的网页聊天界面。
- `agent-core.test.js`：核心 Agent 行为测试。
- `second-customer-pilot.test.js`：第二客户家政清洁复制试点测试。
- `server.test.js`：HTTP API 与会话状态测试。

## 运行方式

```powershell
node "Code文档\prototypes\customer-service-agent-mvp\server.js"
```

默认访问地址：

```text
http://127.0.0.1:4175
```

如果端口被占用，服务会自动尝试后续端口。

## API 自测

PowerShell 直接发送中文 JSON 时建议显式使用 UTF-8 字节体：

```powershell
$body = @{ sessionId = "demo"; message = "我想试用你们的智能客服" } | ConvertTo-Json -Compress
$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
Invoke-RestMethod -Uri "http://127.0.0.1:4175/api/chat" -Method Post -ContentType "application/json; charset=utf-8" -Body $bytes
```

## 验证方式

```powershell
$tests = Get-ChildItem -LiteralPath 'Code文档\prototypes\customer-service-agent-mvp' -Filter '*.test.js' | ForEach-Object { $_.FullName }
node --test $tests
```

当前验收覆盖：

- 加载通用售前客服知识库。
- 加载第二客户家政清洁知识库。
- 回答“和普通聊天机器人有什么区别”。
- 保守处理价格与最终报价。
- 回答家政清洁服务范围和价格边界。
- 识别家政清洁预约线索。
- 对转人工、投诉、合同、法律、赔偿等问题触发人工跟进。
- 回答数据安全、API Key、隐私和权限边界。
- 跨轮次收集称呼、联系方式、行业和需求。
- 对高风险未知承诺不编造答案。
- `/api/health` 与 `/api/chat` 可用。
- Chrome 浏览器可打开演示页、提交问题并收到智能客服回复；截图证据为 `mvp-browser-smoke.png`。

## 后续迁移到 Dify

1. 将 `knowledge-base-ai-agent-service-sales.md` 导入 Dify Knowledge。
2. 将 `system-prompt.md` 设置为应用系统提示词。
3. 按 `workflow-blueprint.json` 建立 Chatflow。
4. 用 `test-cases.md` 复验同一批客服问题。
5. 用 `server.js` 的 `/api/chat` 行为作为 Dify API 中转层参考。
