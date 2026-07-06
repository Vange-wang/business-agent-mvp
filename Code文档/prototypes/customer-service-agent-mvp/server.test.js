const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer, listenWithFallback } = require("./server");

test("serves health endpoint", async (t) => {
  const server = createServer();
  const { port } = await listenWithFallback(server, 4275);
  t.after(() => server.close());

  const response = await fetch(`http://127.0.0.1:${port}/api/health`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.equal(payload.product, "customer-service-agent-mvp");
});

test("chat endpoint keeps session state for lead capture", async (t) => {
  const server = createServer();
  const { port } = await listenWithFallback(server, 4295);
  t.after(() => server.close());

  const first = await postChat(port, {
    sessionId: "lead-test",
    message: "我想试用你们的智能客服",
  });
  assert.equal(first.response.type, "lead_capture");
  assert.equal(first.state.pendingLead, true);

  const second = await postChat(port, {
    sessionId: "lead-test",
    message: "我叫李娜，电话 13900139000，公司做电商，明天下午联系",
  });
  assert.equal(second.response.type, "lead_complete");
  assert.equal(second.state.pendingLead, false);
  assert.equal(second.response.lead.name, "李娜");
  assert.equal(second.response.lead.contact, "13900139000");
});

test("chat endpoint rejects empty message", async (t) => {
  const server = createServer();
  const { port } = await listenWithFallback(server, 4315);
  t.after(() => server.close());

  const response = await fetch(`http://127.0.0.1:${port}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "" }),
  });
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.error, "message is required");
});

async function postChat(port, payload) {
  const response = await fetch(`http://127.0.0.1:${port}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  assert.equal(response.status, 200);
  return response.json();
}
