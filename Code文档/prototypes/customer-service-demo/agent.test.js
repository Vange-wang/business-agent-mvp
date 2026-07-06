const test = require("node:test");
const assert = require("node:assert/strict");
const { reply } = require("./agent");

test("answers service scope questions", () => {
  const answer = reply("这个智能客服能做什么功能？");
  assert.match(answer, /常见问题自动回复/);
  assert.match(answer, /转人工/);
});

test("answers price questions conservatively", () => {
  const answer = reply("你们这个多少钱？");
  assert.match(answer, /客户场景/);
  assert.match(answer, /最终固定报价/);
});

test("captures appointment intent", () => {
  const answer = reply("我想做一个试点演示");
  assert.match(answer, /记录试点意向/);
  assert.match(answer, /称呼/);
  assert.match(answer, /联系方式/);
});

test("hands off high-risk requests", () => {
  const answer = reply("你能给正式合同报价吗？");
  assert.match(answer, /正式商务/);
  assert.match(answer, /人工进一步确认/);
});

test("does not invent unknown answers", () => {
  const answer = reply("你们能直接帮我操控所有平台账号吗？");
  assert.match(answer, /没有在知识库中找到确定答案/);
  assert.match(answer, /转人工/);
});

test("explains difference from ordinary chatbot", () => {
  const answer = reply("和普通聊天机器人有什么区别？");
  assert.match(answer, /业务智能体/);
  assert.match(answer, /知识库/);
});

test("explains required customer materials", () => {
  const answer = reply("客户需要准备什么资料？");
  assert.match(answer, /FAQ/);
  assert.match(answer, /Dify 知识库/);
});

test("handles empty input", () => {
  assert.match(reply(""), /请先输入/);
});
