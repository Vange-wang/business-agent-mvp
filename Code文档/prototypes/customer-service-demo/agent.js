(function attachAgent(root) {
  const leadWords = ["预约", "想订", "想要", "咨询", "联系", "上门"];
  const handoffWords = ["投诉", "退款", "合同", "开票", "最终报价", "法律", "赔偿"];

  function reply(question) {
    const text = String(question || "").trim();
    if (!text) {
      return "请先输入你想咨询的问题。";
    }
    if (handoffWords.some((word) => text.includes(word))) {
      return "这个问题需要人工进一步确认。我可以先帮你记录需求，请留下称呼、联系方式和方便联系的时间，工作人员会尽快跟进。";
    }
    if (leadWords.some((word) => text.includes(word))) {
      return "可以，我先帮你记录预约意向。请补充：称呼、联系方式、服务区域和期望时间。工作人员会确认排期后联系你。";
    }
    if (text.includes("服务") || text.includes("提供")) {
      return "我们提供日常保洁、深度清洁、家电维修咨询和上门服务预约。具体能否上门需要根据服务区域和时间确认。";
    }
    if (text.includes("价格") || text.includes("多少钱") || text.includes("费用")) {
      return "价格会根据服务类型、距离、工作量和材料情况变化。日常保洁通常每小时 50-90 元，深度清洁通常每次 300-1200 元，最终报价需要人工确认。";
    }
    if (text.includes("区域") || text.includes("哪里")) {
      return "当前覆盖市区主要城区。偏远区域需要人工确认是否可上门。你可以留下所在区域，我帮你记录。";
    }
    if (text.includes("时间") || text.includes("几点") || text.includes("上班")) {
      return "客服工作时间为每天 9:00-21:00。上门时间需要工作人员根据排期确认。";
    }
    return "这个问题我暂时没有在知识库中找到确定答案。为了避免误导，我建议转人工确认。你可以留下称呼、联系方式和问题摘要。";
  }

  const api = { reply };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.CustomerServiceAgent = api;
})(typeof window !== "undefined" ? window : globalThis);

