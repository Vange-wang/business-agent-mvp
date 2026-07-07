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
  "knowledge-base-home-cleaning-pilot.md"
);

test("loads the second-customer home cleaning knowledge base", () => {
  const knowledge = loadKnowledgeBase(knowledgePath);
  assert.ok(knowledge.chunks.length > 10);
  assert.match(knowledge.text, /清安到家/);
  assert.match(knowledge.text, /开荒保洁/);
});

test("answers home cleaning service scope from second-customer knowledge", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const response = agent.reply("你们可以做开荒保洁和厨房油污清洁吗？");
  assert.equal(response.type, "answer");
  assert.match(response.message, /开荒保洁|厨房油污|清洁/);
  assert.ok(response.sources.some((source) => /服务范围|常见问题/.test(source.title)));
});

test("answers home cleaning pricing conservatively without final quote", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const response = agent.reply("开荒保洁大概多少钱？");
  assert.equal(response.type, "answer");
  assert.match(response.message, /平方米|价格|费用|报价|确认/);
  assert.match(response.message, /不能.*最终报价|工作人员|最终确认/);
  assert.doesNotMatch(response.message, /一定|保证/);
});

test("collects a home cleaning appointment lead across turns", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const first = agent.reply("我想预约家政保洁");
  assert.equal(first.type, "lead_capture");
  assert.match(first.message, /称呼|联系方式|服务区域/);

  const second = agent.reply("我叫李娜，电话 13900139000，做开荒保洁，明天下午联系");
  assert.equal(second.type, "lead_complete");
  assert.equal(second.lead.name, "李娜");
  assert.equal(second.lead.contact, "13900139000");
  assert.match(second.lead.need, /开荒保洁/);
  assert.match(second.message, /已记录|工作人员/);
});

test("hands off home cleaning complaints and refund requests", () => {
  const agent = createCustomerServiceAgent({ knowledgePath });
  const response = agent.reply("上次清洁不满意，我要投诉退款和赔偿");
  assert.equal(response.type, "handoff");
  assert.equal(response.handoffRequired, true);
  assert.match(response.message, /人工|工作人员/);
  assert.doesNotMatch(response.message, /可以退款|保证赔偿/);
});
