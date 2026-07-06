(function attachAgent(root) {
  const leadWords = ["想做", "试点", "咨询", "联系", "演示", "搭建", "接入", "报价"];
  const handoffWords = ["合同", "退款", "赔偿", "法律", "发票", "正式报价", "保密协议"];

  function reply(question) {
    const text = String(question || "").trim();
    if (!text) {
      return "请先输入你想咨询的问题。";
    }
    if (handoffWords.some((word) => text.includes(word))) {
      return "这个问题涉及正式商务或高风险承诺，需要人工进一步确认。我可以先帮你记录需求，请留下称呼、联系方式、公司/行业和方便联系的时间，工作人员会尽快跟进。";
    }
    if (leadWords.some((word) => text.includes(word))) {
      return "可以，我先帮你记录试点意向。请补充：称呼、联系方式、行业、当前客服入口和最想自动回复的 3 类问题。工作人员会根据你的业务场景给出搭建建议。";
    }
    if (text.includes("区别") || text.includes("普通聊天机器人")) {
      return "普通聊天机器人通常只是泛泛聊天；业务智能体会基于商家的知识库、客服流程和转人工规则工作，目标是接住重复咨询、收集有效线索，并把复杂问题交给人工处理。";
    }
    if (text.includes("价格") || text.includes("多少钱") || text.includes("费用")) {
      return "费用会根据客户场景、知识库规模、是否需要网站嵌入、是否需要 API/CRM 接入和后续维护范围评估。首版不会在未了解业务前给最终固定报价。";
    }
    if (text.includes("能做什么") || text.includes("功能") || text.includes("服务")) {
      return "首版可以做常见问题自动回复、业务资料问答、价格保守说明、购买/预约意向收集、转人工兜底、对话记录回看和知识库持续优化。";
    }
    if (text.includes("需要准备") || text.includes("资料") || text.includes("知识库")) {
      return "客户需要准备商家简介、服务/产品清单、FAQ、价格范围、服务流程、售后规则、转人工方式和希望收集的线索字段。交付方会把这些资料整理成 Dify 知识库。";
    }
    if (text.includes("安全") || text.includes("隐私") || text.includes("数据")) {
      return "首版会使用样例数据和客户确认可公开的业务资料，不提交真实密钥和高敏感信息。正式交付前需要单独确认数据存储、删除、备份、日志和模型调用边界。";
    }
    return "这个问题我暂时没有在知识库中找到确定答案。为了避免误导，我建议转人工确认。你可以留下称呼、联系方式和问题摘要。";
  }

  const api = { reply };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.CustomerServiceAgent = api;
})(typeof window !== "undefined" ? window : globalThis);
