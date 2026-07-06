const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  createCustomerServiceAgent,
  loadKnowledgeBase,
} = require("./agent-core");

const knowledgePath = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "Agent研究文档",
  "Dify模板",
  "智能客服业务智能体",
  "knowledge-base-ai-agent-service-sales.md"
);

test("loads the service sales knowledge base", () => {
  const knowledge = loadKnowledgeBase(knowledgePath);
  assert.ok(knowledge.chunks.length > 10);
  assert.match(knowledge.text, /业务智能体/);
  assert.match(knowledge.text, /人工客服转接/);
});

test("answers difference from ordinary chatbot using knowledge", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const response = agent.reply("你们这个和普通聊天机器人有什么区别？");
  assert.equal(response.type, "answer");
  assert.match(response.message, /业务智能体/);
  assert.match(response.message, /知识库|业务流程|线索/);
});

test("answers pricing conservatively and does not invent a final quote", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const response = agent.reply("你们怎么收费？多少钱？");
  assert.equal(response.type, "answer");
  assert.match(response.message, /取决于|根据/);
  assert.match(response.message, /不能.*最终报价|不.*最终报价|工作人员/);
});

test("hands off immediately when user asks for human support", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const response = agent.reply("我要转人工，找真人客服");
  assert.equal(response.type, "handoff");
  assert.equal(response.handoffRequired, true);
  assert.match(response.message, /人工/);
});

test("answers data security concerns with privacy boundaries", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const response = agent.reply("客户数据安全吗？API Key 会不会泄露？");
  assert.equal(response.type, "answer");
  assert.match(response.message, /API Key|密钥/);
  assert.match(response.message, /数据|隐私|权限/);
});

test("collects lead fields across conversation turns", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const first = agent.reply("我想试用你们的智能客服");
  assert.equal(first.type, "lead_capture");
  assert.match(first.message, /称呼|联系方式/);

  const second = agent.reply("我叫王明，电话 13800138000，公司做装修，想下周联系");
  assert.equal(second.type, "lead_complete");
  assert.equal(second.lead.name, "王明");
  assert.equal(second.lead.contact, "13800138000");
  assert.match(second.lead.need, /装修/);
  assert.match(second.message, /已记录|工作人员/);
});

test("does not invent answers for unknown high-risk requests", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const response = agent.reply("你们能保证帮我自动处理法律纠纷并赔偿吗？");
  assert.equal(response.type, "handoff");
  assert.match(response.message, /人工|工作人员/);
  assert.doesNotMatch(response.message, /可以保证/);
});

