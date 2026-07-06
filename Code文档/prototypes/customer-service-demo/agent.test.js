const test = require("node:test");
const assert = require("node:assert/strict");
const { reply } = require("./agent");

test("answers service scope questions", () => {
  const answer = reply("你们提供哪些服务？");
  assert.match(answer, /日常保洁/);
  assert.match(answer, /家电维修/);
});

test("answers price questions conservatively", () => {
  const answer = reply("深度清洁多少钱？");
  assert.match(answer, /300-1200/);
  assert.match(answer, /最终报价需要人工确认/);
});

test("captures appointment intent", () => {
  const answer = reply("我想预约明天下午保洁");
  assert.match(answer, /记录预约意向/);
  assert.match(answer, /称呼/);
  assert.match(answer, /联系方式/);
});

test("hands off high-risk requests", () => {
  const answer = reply("我要投诉");
  assert.match(answer, /人工进一步确认/);
});

test("does not invent unknown answers", () => {
  const answer = reply("你们能修飞机吗？");
  assert.match(answer, /没有在知识库中找到确定答案/);
  assert.match(answer, /转人工/);
});

test("handles empty input", () => {
  assert.match(reply(""), /请先输入/);
});

