# 智能客服业务智能体 MVP — Dify Cloud 手动搭建指南

> 生成时间: 2026-07-06
> 用途: 浏览器打开 https://cloud.dify.ai 后，按以下步骤操作

---

## 第一步：创建知识库（Knowledge）

1. 进入 Dify Cloud 主页 → 左侧 "Knowledge" → "Create Knowledge"
2. 知识库名称：`智能客服业务智能体-样例知识库`
3. 导入方式：选择 "Upload File" → 上传项目中的文件：
   `Agent研究文档/Dify模板/智能客服业务智能体/knowledge-base-ai-agent-service-sales.md`
4. 分段设置：默认即可（按段落分段）
5. 索引方式：选择 "High Quality"
6. 点击 "Create" 等待索引完成

---

## 第二步：创建 Chatflow 应用

1. 左侧 "Studio" → "Create Application"
2. 应用类型：选择 **"Chatflow"**（不是 Chatbot / Agent）
3. 应用名称：`智能客服业务智能体 MVP`
4. 图标可选，描述填："基于知识库的智能客服，支持FAQ问答、线索收集、转人工"
5. 点击 "Create"

---

## 第三步：搭建 Chatflow 工作流

### 节点 1：Start（自动创建）
- 输入变量：`user_question`（文本类型）

### 节点 2：问题分类（Question Classifier）
- 点击 "+" → 选择 "Question Classifier"
- 分类标签（Class labels）：
  ```
  faq, price, appointment, lead, after_sales, human, unknown
  ```
- 对每个分类输入 2-3 个示例问题（从 test-cases.md 中取）

### 节点 3：知识库检索（Knowledge Retrieval）
- 点击 "+" → 选择 "Knowledge Retrieval"
- 关联知识库：`智能客服业务智能体-样例知识库`
- 检索参数：TopK=3, Score Threshold=0.5

### 节点 4：LLM（LLM Node）
- 选择模型：GPT-4o / Claude 3.5 Sonnet 或可用模型
- 系统提示词：完整粘贴 `system-prompt.md` 内容
- 将 Knowledge Retrieval 的输出作为上下文变量传入
- CONTEXT 变量：`{{#knowledge_retrieval.result#}}`
- 用户问题变量：`{{#sys.query#}}`

### 节点 5：线索收集（LLM Node 或直接回复）
- 用 LLM 节点实现，提示词设为引导收集称呼、联系方式、需求类型的流程
- 或者直接用 "Direct Reply" 节点输出线索收集话术

### 节点 6：转人工（Direct Reply）
- 回复内容：
  ```
  这个问题需要人工进一步确认。我可以先帮你记录需求，请留下称呼、联系方式和方便联系的时间，工作人员会尽快跟进。
  ```

### 节点连线（Routing）

从 Question Classifier 出发：
- 分类 = faq / price / appointment / after_sales → 指向 Knowledge Retrieval → LLM → Output
- 分类 = lead → 指向 线索收集 → Output
- 分类 = human / unknown → 指向 转人工 → Output

> **注意**：Dify Chatflow 的连接方式是拖拽节点端口连线。分类器各分类出口分叉，每个分类对应一条分支路径。

---

## 第四步：设置系统提示词

在 LLM 节点的 "System Prompt" 字段中，完整粘贴以下内容：

---

你是商家的智能客服业务智能体。你的目标是接管重复客服咨询，基于知识库回答问题，收集有意向客户的线索，并在无法确定时转人工。

规则：
1. 只能基于知识库和已确认信息回答，不要编造。
2. 回答要简洁、自然、可信。
3. 涉及最终报价、合同、退款、投诉、开票、隐私和法律风险时，必须转人工。
4. 当用户表达预约、购买、咨询意向时，引导收集称呼、联系方式、需求类型、城市/区域、期望联系时间。
5. 不要一次性索要过多信息。
6. 不要承诺"完全替代人工"。
7. 如果知识库没有答案，回复：这个问题需要人工进一步确认，我可以先帮你记录需求。

输出风格：
- 中文。
- 友好但不过度热情。
- 每次回复尽量少于 120 字。
- 必要时用列表。

---

## 第五步：冒烟测试（用 test-cases.md）

Chatflow 构建完成后，点击右上角 "Run" 进入预览界面，逐条输入以下问题验证：

### 测试 1: FAQ 问答
- 输入：`你们提供哪些服务？`
- 期望：基于知识库回答服务简介

### 测试 2: 价格边界
- 输入：`深度清洁多少钱？`
- 期望：给价格范围，不承诺最终报价；或引导留资

### 测试 3: 转人工
- 输入：`我要投诉`
- 期望：立即触发转人工回复

### 测试 4: 预约线索
- 输入：`我想预约明天下午的保洁`
- 期望：引导收集称呼和联系方式

### 测试 5: 未知问题
- 输入：`你们能修飞机吗？`
- 期望：不编造，引导转人工

---

## 第六步：发布

1. 测试通过后，点击 "Publish" 发布应用
2. 左侧 "Overview" → 可获取：
   - **WebApp 分享链接**（可直接发给客户）
   - **API 密钥**（用于集成到网站）
   - **嵌入代码**（iframe / JavaScript）

---

## 备用信息

### 文件索引
| 用途 | 文件路径 |
|------|---------|
| 知识库 | `Agent研究文档/Dify模板/智能客服业务智能体/knowledge-base-ai-agent-service-sales.md` |
| 系统提示词 | `Agent研究文档/Dify模板/智能客服业务智能体/system-prompt.md` |
| 测试用例 | `Agent研究文档/Dify模板/智能客服业务智能体/test-cases.md` |
| 蓝图参考 | `Agent研究文档/Dify模板/智能客服业务智能体/workflow-blueprint.json` |
| 本地 MVP 参考 | `Code文档/prototypes/customer-service-agent-mvp/README.md` |

### 常见问题
- **Dify 登录页打不开？** 检查网络，或尝试 https://cloud.dify.ai 直接访问
- **模型不可用？** 在 Settings → Model Provider 中配置 OpenAI / Claude / DeepSeek API Key
- **知识库索引慢？** 小知识库通常 1-2 分钟完成
