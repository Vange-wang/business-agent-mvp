const fs = require("node:fs");

const DEFAULT_STOPWORDS = new Set([
  "你们",
  "我们",
  "这个",
  "什么",
  "怎么",
  "可以",
  "客户",
  "智能",
  "客服",
  "业务",
  "Agent",
  "agent",
]);

function loadKnowledgeBase(knowledgePath) {
  const text = fs.readFileSync(knowledgePath, "utf8");
  const sections = text
    .split(/\n(?=#{1,4}\s+)/)
    .map((section) => section.trim())
    .filter(Boolean);

  const chunks = sections.flatMap((section, sectionIndex) => {
    const title = (section.match(/^#{1,4}\s+(.+)$/m) || [])[1] || `知识片段 ${sectionIndex + 1}`;
    const paragraphs = section
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 20);

    return paragraphs.map((content, paragraphIndex) => ({
      id: `${sectionIndex + 1}-${paragraphIndex + 1}`,
      title,
      content,
      keywords: extractKeywords(`${title}\n${content}`),
    }));
  });

  return {
    text,
    chunks,
  };
}

function createCustomerServiceAgent({ knowledgePath }) {
  const knowledge = loadKnowledgeBase(knowledgePath);
  const state = {
    pendingLead: false,
    lead: {},
  };

  return {
    reply(input) {
      const message = normalizeInput(input);
      const lowerMessage = message.toLowerCase();
      const leadFields = extractLeadFields(message);

      if (isHighRiskOrHumanHandoff(message)) {
        return createHandoffResponse(message, knowledge);
      }

      if (state.pendingLead || hasLeadIntent(message)) {
        Object.assign(state.lead, leadFields);
        if (hasCompleteLead(state.lead)) {
          state.pendingLead = false;
          return {
            type: "lead_complete",
            handoffRequired: true,
            lead: { ...state.lead },
            message:
              `已记录您的需求：${formatLead(state.lead)}。工作人员会根据您留下的联系方式继续沟通，确认场景、资料范围、接入方式和报价。`,
            sources: topKnowledge(message, knowledge, 2),
          };
        }

        state.pendingLead = true;
        return {
          type: "lead_capture",
          message:
            "可以先安排试用或方案沟通。请留下称呼、联系方式、公司/行业、希望智能客服解决的问题，以及方便联系的时间；如果涉及合同、最终报价或售后争议，也会由工作人员继续确认。",
          sources: topKnowledge(message, knowledge, 2),
        };
      }

      if (containsAny(lowerMessage, ["多少钱", "收费", "价格", "报价", "费用"])) {
        return {
          type: "answer",
          message:
            "费用通常取决于知识库资料量、需要接入的平台、是否要配置工作流/人工客服转接、部署方式和后续维护范围。我可以说明报价口径，但不能给出最终报价；如果您留下联系方式，工作人员会按场景评估后给出正式方案。",
          sources: topKnowledge(message, knowledge, 3),
        };
      }

      if (containsAny(message, ["数据", "隐私", "泄露", "密钥", "API Key", "权限"])) {
        return {
          type: "answer",
          message:
            "数据安全会按最小权限处理：客户知识资料、API Key/密钥、账号权限和聊天记录需要分开管理，不在交付文档中暴露真实密钥；涉及客户隐私或生产数据时，建议使用自托管 Dify、独立知识库和可审计的权限配置。",
          sources: topKnowledge(message, knowledge, 3),
        };
      }

      if (containsAny(message, ["普通聊天机器人", "传统机器人", "区别", "和普通"])) {
        return {
          type: "answer",
          message:
            "业务智能体不只是回答闲聊问题，而是围绕知识库、业务流程、线索收集、转人工和系统接入来接管重复工作。它需要知道哪些问题能自动回答，哪些信息要结构化收集，哪些场景必须交给工作人员继续处理。",
          sources: topKnowledge(message, knowledge, 3),
        };
      }

      return {
        type: "answer",
        message: composeKnowledgeAnswer(message, knowledge),
        sources: topKnowledge(message, knowledge, 3),
      };
    },
    getState() {
      return {
        pendingLead: state.pendingLead,
        lead: { ...state.lead },
      };
    },
  };
}

function normalizeInput(input) {
  if (typeof input !== "string") {
    return "";
  }
  return input.trim();
}

function isHighRiskOrHumanHandoff(message) {
  return containsAny(message, [
    "转人工",
    "真人",
    "人工",
    "投诉",
    "退款",
    "合同",
    "开票",
    "法律",
    "赔偿",
    "保证",
    "纠纷",
  ]);
}

function hasLeadIntent(message) {
  return containsAny(message, [
    "试用",
    "购买",
    "咨询",
    "报价",
    "预约",
    "联系",
    "想了解",
    "方案",
    "演示",
  ]);
}

function createHandoffResponse(message, knowledge) {
  return {
    type: "handoff",
    handoffRequired: true,
    message:
      "这个问题需要人工工作人员继续处理。我已为您标记转人工，请补充称呼、联系方式、业务背景和要处理的问题，方便工作人员接手时不用重复沟通。",
    sources: topKnowledge(message, knowledge, 2),
  };
}

function extractLeadFields(message) {
  const lead = {};
  const nameMatch = message.match(/(?:我叫|我是|姓名[:：]?)([\u4e00-\u9fa5A-Za-z]{2,12})/);
  const phoneMatch = message.match(/(?:\+?86[-\s]?)?(1[3-9]\d{9})/);
  const industryMatch = message.match(/(?:公司做|做|行业是|从事)([\u4e00-\u9fa5A-Za-z0-9]{2,20})/);
  const timeMatch = message.match(/(?:今天|明天|后天|下周|上午|下午|晚上|周[一二三四五六日天])/);

  if (nameMatch) {
    lead.name = nameMatch[1];
  }
  if (phoneMatch) {
    lead.contact = phoneMatch[1];
  }
  if (industryMatch) {
    lead.need = `${industryMatch[1]}智能客服咨询`;
  } else if (containsAny(message, ["装修", "教育", "家政", "电商", "软件", "餐饮", "医美", "获客"])) {
    lead.need = message;
  }
  if (timeMatch) {
    lead.preferredTime = timeMatch[0];
  }
  return lead;
}

function hasCompleteLead(lead) {
  return Boolean(lead.name && lead.contact && lead.need);
}

function formatLead(lead) {
  const parts = [
    `称呼 ${lead.name}`,
    `联系方式 ${lead.contact}`,
    `需求 ${lead.need}`,
  ];
  if (lead.preferredTime) {
    parts.push(`方便时间 ${lead.preferredTime}`);
  }
  return parts.join("，");
}

function composeKnowledgeAnswer(message, knowledge) {
  const chunks = topKnowledge(message, knowledge, 2);
  if (!chunks.length) {
    return "这个问题我还不能可靠判断，建议转给工作人员确认，避免给出不准确承诺。";
  }

  const answerPoints = chunks
    .map((chunk) => summarizeChunk(chunk.content))
    .filter(Boolean)
    .slice(0, 2);

  return `${answerPoints.join(" ")} 如果您希望落地到自己的业务，可以继续告诉我行业、现有客服渠道和需要自动处理的高频问题。`;
}

function summarizeChunk(content) {
  const normalized = content.replace(/\s+/g, " ").replace(/^[-*]\s*/, "").trim();
  const sentences = normalized.split(/[。！？!?]/).map((item) => item.trim()).filter(Boolean);
  return sentences[0] ? `${sentences[0]}。` : normalized.slice(0, 120);
}

function topKnowledge(message, knowledge, limit) {
  const queryKeywords = extractKeywords(message);
  return knowledge.chunks
    .map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      content: chunk.content,
      score: scoreChunk(queryKeywords, chunk),
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ score, ...chunk }) => chunk);
}

function scoreChunk(queryKeywords, chunk) {
  return queryKeywords.reduce((score, keyword) => {
    if (chunk.title.includes(keyword)) {
      return score + 3;
    }
    if (chunk.keywords.includes(keyword) || chunk.content.includes(keyword)) {
      return score + 1;
    }
    return score;
  }, 0);
}

function extractKeywords(text) {
  const cnWords = Array.from(text.matchAll(/[\u4e00-\u9fa5]{2,}/g), (match) => match[0]);
  const asciiWords = Array.from(text.matchAll(/[A-Za-z][A-Za-z0-9_-]{1,}/g), (match) => match[0]);
  const expanded = cnWords.flatMap((word) => segmentChineseWord(word));
  return unique([...cnWords, ...expanded, ...asciiWords])
    .map((word) => word.trim())
    .filter((word) => word.length >= 2 && !DEFAULT_STOPWORDS.has(word));
}

function segmentChineseWord(word) {
  if (word.length <= 4) {
    return [word];
  }
  const tokens = [];
  for (let size = 2; size <= 4; size += 1) {
    for (let index = 0; index <= word.length - size; index += 1) {
      tokens.push(word.slice(index, index + size));
    }
  }
  return tokens;
}

function containsAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function unique(items) {
  return [...new Set(items)];
}

module.exports = {
  createCustomerServiceAgent,
  loadKnowledgeBase,
};
