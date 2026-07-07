# Business Agent MVP

这是“Agent智能体”产品化交付仓库，目标是沉淀一套可复制的业务智能体交付流程，并完成首个智能客服业务智能体 MVP。

## 当前 MVP

首个可运行版本位于：

```text
Code文档/prototypes/customer-service-agent-mvp
```

商业演示页位于：

```text
Code文档/prototypes/customer-service-demo/index.html
```

能力范围：

- 基于通用售前客服知识库回答业务智能体咨询。
- 处理价格、数据安全、产品差异等高频售前问题。
- 收集客户称呼、联系方式、行业和需求。
- 对投诉、合同、退款、法律、赔偿等高风险问题转人工。
- 提供本地网页演示和 `/api/chat` 接口。

真实 Dify Cloud 版本：

- 应用名称：`智能客服业务智能体 MVP - 知识库版`
- 应用页面：`https://cloud.dify.ai/app/ae0d0725-c989-4e0c-b8ab-941e8deefccd/workflow`
- 工作流：`Start -> Knowledge Retrieval -> LLM -> Answer`
- 主模型：`deepseek-v4-flash`

## 商业化交付包

首版可复制交付资产位于：

```text
交付文档/智能客服业务智能体交付包v1
```

该目录包含售前一页纸、客户需求采集表、知识库整理模板、交付 SOP、报价模板、验收清单、运维维护手册和 Dify API 接入实施方案。

## 二客户复制试点

第二客户复制试点位于：

```text
交付文档/客户复制试点/2026-07-07-清安到家家政清洁智能客服
```

该试点将智能客服业务智能体从首个家教网站案例复制到本地家政清洁服务商家，覆盖服务范围问答、价格保守回复、预约线索收集和投诉退款转人工。

## 多行业模板矩阵

多行业客服智能体模板矩阵位于：

```text
Agent研究文档/Dify模板/多行业客服模板矩阵
```

标准商业化复制包位于：

```text
交付文档/商业化复制包/多行业客服智能体套餐
```

本阶段首批沉淀教育培训、家政清洁、本地门店 3 个低风险客服模板，并形成 Spec、研究、技术验证、Dify 模板、客户交付包和阶段验收报告。

## 三行业实装准备与可视化预览

三行业 FAQ 测试集位于：

```text
Agent研究文档/行业模板矩阵/FAQ测试集
```

三行业 Dify 实装配置蓝图位于：

```text
Agent研究文档/Dify模板/三行业实装验收
```

可视化预览页位于：

```text
Code文档/prototypes/multi-industry-template-preview/index.html
```

可视化截图位于：

```text
Code文档/prototypes/multi-industry-template-preview/preview.png
```

本阶段已完成教育培训、家政清洁、本地门店各 30 条 FAQ / 验收问题，并形成 Dify 实装配置蓝图和静态交付战情面板；真实 Dify 三行业线上样板应用仍属于下一阶段。

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
