const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const form = document.getElementById("chatForm");
const quickActions = document.getElementById("quickActions");
const resetButton = document.getElementById("resetButton");

let sessionId = createSessionId();

const examples = [
  "你们这个和普通聊天机器人有什么区别？",
  "你们怎么收费？多少钱？",
  "客户数据安全吗？API Key 会不会泄露？",
  "我想试用你们的智能客服",
  "我要转人工，找真人客服",
];

examples.forEach((example) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = example;
  button.addEventListener("click", () => {
    input.value = example;
    form.requestSubmit();
  });
  quickActions.appendChild(button);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    return;
  }

  addMessage(text, "user");
  input.value = "";
  input.focus();

  const pending = addMessage("正在查询知识库...", "agent");
  try {
    const payload = await sendMessage(text);
    pending.remove();
    addAgentResponse(payload.response);
  } catch (error) {
    pending.remove();
    addMessage(`请求失败：${error.message}`, "agent");
  }
});

resetButton.addEventListener("click", () => {
  sessionId = createSessionId();
  messages.innerHTML = "";
  addWelcome();
  input.focus();
});

function addWelcome() {
  addMessage(
    "你好，我是智能客服业务智能体 MVP。你可以咨询业务智能体能力、报价方式、数据安全，也可以留下试用需求；涉及合同、退款、法律、赔偿等问题时，我会转人工。",
    "agent"
  );
}

function addAgentResponse(response) {
  const sources = response.sources || [];
  const sourceText = sources.length
    ? `\n\n参考知识片段：${sources.map((source) => source.title).join(" / ")}`
    : "";
  const handoffText = response.handoffRequired ? "\n\n状态：需要人工继续跟进" : "";
  addMessage(`${response.message}${handoffText}${sourceText}`, "agent");
}

function addMessage(text, role) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
  return item;
}

async function sendMessage(message) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, message }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "unknown error");
  }
  return payload;
}

function createSessionId() {
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

addWelcome();
