const canvas = document.querySelector("#memoryCanvas");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let nodes = [];
let frame = null;
let tick = 0;
let currentLang = "zh";

const palette = ["#43ddcf", "#78aaff", "#f4c56a", "#90d985"];

const copy = {
  zh: {
    navWhy: "动机",
    navFeatures: "功能",
    navDemo: "演示",
    navHow: "原理",
    heroEyebrow: "自托管 QQ 聊天记忆助手",
    heroSubtitle:
      "一个自托管的 QQ 聊天记忆助手。它可以记录聊天、检索历史、总结会话，并基于语义记忆回答后续问题。",
    heroCopy:
      "从最小可用的消息记录机器人，逐步迭代到支持 AI 总结、语义检索、连续上下文和 VPS 24 小时部署的个人 AI 项目。",
    ctaFeatures: "查看功能",
    ctaDemo: "查看演示",
    ctaArchitecture: "查看架构",
    whyEyebrow: "Why",
    whyTitle: "为什么做这个项目",
    whyOneTitle: "聊天记录难回顾",
    whyOneCopy: "项目讨论、部署步骤和灵感经常藏在长聊天里，靠手动翻记录效率很低。",
    whyTwoTitle: "AI 默认没有长期上下文",
    whyTwoCopy: "普通 AI 问答不知道你刚刚聊过什么，也不理解“继续说”“还有呢”这种追问。",
    whyThreeTitle: "个人项目也需要可维护",
    whyThreeCopy: "能部署、能备份、能检查运行状态，才不只是一次性的本地 demo。",
    featuresTitle: "核心能力",
    featureMemoryTitle: "聊天记忆",
    featureMemoryCopy: "保存机器人能收到的消息，并按当前会话隔离。查询只发生在当前私聊、群聊或频道内。",
    featureSummaryTitle: "AI 总结",
    featureSummaryCopy: "用 `/summary` 把当天聊天压缩成简短要点，适合 QQ 消息回复。",
    featureAskTitle: "语义问答",
    featureAskCopy: "用 `/ask` 结合关键词、最近消息、embedding 和短期上下文回答历史问题。",
    featureOpsTitle: "运维与安全",
    featureOpsCopy: "支持 `/health`、数据库备份、管理员权限和群聊 AI 开关，方便长期运行。",
    demoTitle: "命令演示",
    demoCopy: "以下是静态模拟展示，不连接真实 QQ、数据库或 AI 服务。",
    demoBotName: "QQ AI Memory Bot",
    howTitle: "工作原理",
    flowOne: "QQ 消息",
    flowTwo: "Python Bot",
    flowThree: "SQLite 记忆库",
    flowFour: "Embedding 检索",
    flowFive: "AI 回答",
    flowSix: "QQ 回复",
    safetyTitle: "部署与安全",
    safetyVps: "使用 Ubuntu VPS + systemd，让机器人在关闭 SSH 后继续运行。",
    safetySqlite: "消息、向量和 AI 交互记录都保存在本地 SQLite，结构清晰可迁移。",
    safetyEnv: "密钥只放在本地 `.env`，展示页不会读取或展示任何真实配置。",
    safetyBackupTitle: "数据库备份",
    safetyBackup: "备份脚本定期保存 SQLite 副本，降低误操作和服务器风险。",
    safetyAdminTitle: "管理员权限",
    safetyAdmin: "`/export`、`/exports`、`/health` 等敏感命令可限制管理员使用。",
    safetyFirewall: "通过防火墙、登录保护和 SSH 端口调整降低公网服务器暴露面。",
    versionTitle: "版本亮点",
    versionOne: "消息记录 MVP：先完成可保存、可查询的最小闭环。",
    versionTwo: "AI 总结与云部署：加入 `/summary`，并跑在 VPS 上。",
    versionThree: "管理员权限：为导出和运维命令加上安全边界。",
    versionFour: "`/ask` 记忆问答：从关键词检索升级到语义记忆和连续上下文。",
    versionFive: "展示网站：为作品集和面试准备清晰、克制的项目首页。",
    footerText: "QQ AI Memory Bot · 静态展示网站",
    backTop: "回到顶部",
  },
  en: {
    navWhy: "Why",
    navFeatures: "Features",
    navDemo: "Demo",
    navHow: "How",
    heroEyebrow: "Self-hosted QQ memory assistant",
    heroSubtitle:
      "A self-hosted QQ chat memory assistant for logging messages, searching history, summarizing conversations, and answering follow-up questions with semantic memory.",
    heroCopy:
      "It started as a minimal message logger and evolved into a personal AI project with summaries, semantic retrieval, short-term context, and 24/7 VPS deployment.",
    ctaFeatures: "Features",
    ctaDemo: "Demo",
    ctaArchitecture: "Architecture",
    whyEyebrow: "Why",
    whyTitle: "Why this project exists",
    whyOneTitle: "Chat history is hard to revisit",
    whyOneCopy: "Project decisions, deployment steps, and ideas often disappear in long QQ threads.",
    whyTwoTitle: "AI lacks personal context by default",
    whyTwoCopy: "A generic AI chat does not know what you just discussed or what “continue” refers to.",
    whyThreeTitle: "Personal tools still need operations",
    whyThreeCopy: "A useful bot should be deployable, maintainable, backed up, and observable.",
    featuresTitle: "Core capabilities",
    featureMemoryTitle: "Memory logging",
    featureMemoryCopy: "Save received messages with current-session isolation across private chats, groups, and channels.",
    featureSummaryTitle: "AI summary",
    featureSummaryCopy: "Use `/summary` to compress today's conversation into concise QQ-friendly highlights.",
    featureAskTitle: "Semantic Q&A",
    featureAskCopy: "Use `/ask` with keyword search, recent messages, embeddings, and short-term context.",
    featureOpsTitle: "Ops & safety",
    featureOpsCopy: "Health checks, backups, admin controls, and group-AI switches support long-running use.",
    demoTitle: "Command demo",
    demoCopy: "Static previews only. No real QQ data, database, or AI service is connected.",
    demoBotName: "QQ AI Memory Bot",
    howTitle: "How it works",
    flowOne: "QQ message",
    flowTwo: "Python Bot",
    flowThree: "SQLite memory",
    flowFour: "Embedding search",
    flowFive: "AI answer",
    flowSix: "QQ reply",
    safetyTitle: "Build & safety",
    safetyVps: "Ubuntu VPS + systemd keeps the bot running after the SSH session closes.",
    safetySqlite: "Messages, embeddings, and AI interactions stay in local SQLite tables.",
    safetyEnv: "Secrets stay in `.env`; the showcase never reads or displays real config.",
    safetyBackupTitle: "Database backup",
    safetyBackup: "Backup scripts keep timestamped SQLite copies for safer operations.",
    safetyAdminTitle: "Admin controls",
    safetyAdmin: "Sensitive commands can be limited to configured admin users.",
    safetyFirewall: "Firewall rules, login protection, and SSH port changes reduce exposure.",
    versionTitle: "Version highlights",
    versionOne: "Message logging MVP: save and query the first working memory loop.",
    versionTwo: "AI summary and cloud deployment: `/summary` plus VPS operation.",
    versionThree: "Admin permissions: safer exports and operational commands.",
    versionFour: "`/ask` memory Q&A: semantic retrieval and contextual follow-up.",
    versionFive: "Showcase site: a cleaner portfolio homepage for interviews.",
    footerText: "QQ AI Memory Bot · Static showcase",
    backTop: "Back to top",
  },
};

const demos = {
  zh: {
    summary: [
      { role: "user", text: "/summary" },
      {
        role: "bot",
        text: "今日总结：整理了部署状态、记录了语义检索优化，并确认了下一步要简化展示网站。",
      },
    ],
    ask: [
      { role: "user", text: "/ask 最近这个项目做了什么？" },
      {
        role: "bot",
        text: "根据当前会话记录，最近重点是 AI 记忆问答、连续上下文、/health 记忆状态，以及展示网站 polish。",
      },
    ],
    health: [
      { role: "user", text: "/health" },
      { role: "system", text: "数据库：OK\n当前会话消息：128\nEmbedding 记忆：96\nAI 交互记录：14\nGroup AI：off" },
    ],
  },
  en: {
    summary: [
      { role: "user", text: "/summary" },
      {
        role: "bot",
        text: "Today: reviewed deployment status, improved semantic retrieval, and planned a cleaner showcase page.",
      },
    ],
    ask: [
      { role: "user", text: "/ask What did this project add recently?" },
      {
        role: "bot",
        text: "Recent work focused on memory Q&A, contextual follow-up, memory-state health checks, and web showcase polish.",
      },
    ],
    health: [
      { role: "user", text: "/health" },
      { role: "system", text: "Database: OK\nMessages: 128\nEmbedding memory: 96\nAI interactions: 14\nGroup AI: off" },
    ],
  },
};

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = copy[lang][key] || "";
  });

  document.querySelectorAll(".lang-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  renderDemo(document.querySelector(".demo-tab.active")?.dataset.demo || "summary");
}

function renderDemo(name) {
  const panel = document.querySelector("#demoPanel");
  const items = demos[currentLang][name];
  panel.innerHTML = "";

  items.forEach((item) => {
    const bubble = document.createElement("p");
    bubble.className = `bubble ${item.role}`;
    bubble.textContent = item.text;
    panel.appendChild(bubble);
  });
}

function initDemoTabs() {
  document.querySelectorAll(".demo-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".demo-tab").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderDemo(button.dataset.demo);
    });
  });
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createNodes();
}

function createNodes() {
  const count = Math.max(30, Math.min(66, Math.floor(width / 22)));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    baseSize: 1.6 + Math.random() * 2.4,
    vx: (Math.random() - 0.5) * 0.16,
    vy: (Math.random() - 0.5) * 0.16,
    phase: Math.random() * Math.PI * 2,
    color: palette[index % palette.length],
  }));
}

function drawBackdrop() {
  const gradient = ctx.createRadialGradient(width * 0.74, height * 0.24, 0, width * 0.74, height * 0.24, width * 0.6);
  gradient.addColorStop(0, "rgba(67, 221, 207, 0.1)");
  gradient.addColorStop(0.55, "rgba(120, 170, 255, 0.05)");
  gradient.addColorStop(1, "rgba(14, 17, 22, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function updateNodes() {
  if (prefersReducedMotion) return;
  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < -20) node.x = width + 20;
    if (node.x > width + 20) node.x = -20;
    if (node.y < -20) node.y = height + 20;
    if (node.y > height + 20) node.y = -20;
  });
  tick += 1;
}

function drawConnections() {
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 138) continue;
      const alpha = (1 - distance / 138) * 0.18;
      ctx.strokeStyle = `rgba(67, 221, 207, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

function drawNodes() {
  nodes.forEach((node) => {
    const size = node.baseSize + Math.sin(tick * 0.03 + node.phase) * 0.55;
    ctx.globalAlpha = 0.66;
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, Math.max(1.2, size), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  drawBackdrop();
  drawConnections();
  drawNodes();
  updateNodes();
  frame = window.requestAnimationFrame(draw);
}

function initCanvas() {
  resizeCanvas();
  if (frame) window.cancelAnimationFrame(frame);
  draw();
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  items.forEach((item) => observer.observe(item));
}

document.querySelectorAll(".lang-button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

window.addEventListener("resize", resizeCanvas);
initCanvas();
initReveal();
initDemoTabs();
setLanguage("zh");
