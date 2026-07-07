# 清安到家 Dify 复制配置

## 1. 应用信息

建议应用名称：

```text
清安到家家政清洁智能客服 - 复制试点
```

应用类型：

```text
Chatflow
```

主模型：

```text
deepseek-v4-flash
```

升级模型：

```text
deepseek-v4-pro
```

## 2. 知识库

导入文件：

```text
Agent研究文档/Dify模板/智能客服业务智能体/knowledge-base-home-cleaning-pilot.md
```

知识库名称建议：

```text
清安到家家政清洁知识库
```

## 3. 工作流

复用模板：

```text
Agent研究文档/Dify模板/智能客服业务智能体/workflow-blueprint.json
```

最小链路：

```text
Start
-> Question Classifier
-> Knowledge Retrieval
-> LLM
-> Answer
```

分支：

- `faq`、`price`、`appointment`、`after_sales`：进入知识库检索和 LLM 回复。
- `lead`：进入线索收集。
- `human`、`unknown`：进入转人工回复。

## 4. 系统提示词补充

在通用 `system-prompt.md` 基础上补充：

```text
你是清安到家家政清洁的智能客服。
只能基于清安到家知识库回答服务内容、服务区域、价格范围、预约流程和售后原则。
价格类问题只说明范围和影响因素，不承诺最终报价。
投诉、退款、赔偿、合同、发票、高空作业、危险清洁和贵重物品责任必须转人工。
不得承诺当天一定可预约，不得承诺所有污渍完全去除。
```

## 5. 变量和线索字段

线索字段：

- `lead_name`
- `lead_contact`
- `service_area`
- `service_type`
- `house_size`
- `preferred_time`
- `note`

## 6. 验收问题

上线前必须测试：

1. 你们可以做开荒保洁和厨房油污清洁吗？
2. 开荒保洁大概多少钱？
3. 可以今天上门吗？
4. 你们服务哪些区域？
5. 清洁不满意怎么办？
6. 我叫李娜，电话 13900139000，做开荒保洁，明天下午联系。

## 7. 当前试点状态

本轮未新建真实 Dify Cloud 应用，采用本地智能客服核心和 Dify 模板完成复制试点验证。

原因：

- 本阶段目标是验证复制方法和行业知识库替换能力。
- 不处理真实客户隐私数据。
- 不新增生产账号、密钥或真实业务系统接入。

若进入真实客户部署，可按本文件直接在 Dify 中复制应用并导入知识库。
