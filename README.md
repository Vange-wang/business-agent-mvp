# Business Agent MVP

这是“Agent智能体”产品化交付仓库，目标是沉淀一套可复制的业务智能体交付流程，并完成首个智能客服业务智能体 MVP。

## 当前 MVP

首个可运行版本位于：

```text
Code文档/prototypes/customer-service-agent-mvp
```

能力范围：

- 基于通用售前客服知识库回答业务智能体咨询。
- 处理价格、数据安全、产品差异等高频售前问题。
- 收集客户称呼、联系方式、行业和需求。
- 对投诉、合同、退款、法律、赔偿等高风险问题转人工。
- 提供本地网页演示和 `/api/chat` 接口。

## 运行

```powershell
node "Code文档\prototypes\customer-service-agent-mvp\server.js"
```

默认地址：

```text
http://127.0.0.1:4175
```

## 测试

```powershell
$tests = Get-ChildItem -LiteralPath 'Code文档\prototypes\customer-service-agent-mvp' -Filter '*.test.js' | ForEach-Object { $_.FullName }
node --test $tests
```

## 项目边界

本项目严格区分：

- 内部协作角色 Agent：项目总负责人、产品经理、技术验证、搭建师、开发员等。
- 可售卖业务智能体 Agent：面向真实客户和商家交付的客服、信息回复、线索收集、知识库问答等产品。

Dify / Coze 是实现和验证业务智能体的工具底座，不是最终售卖产品本身。
