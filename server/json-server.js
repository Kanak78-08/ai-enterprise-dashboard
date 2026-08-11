import http from "node:http";
import {
  generateReport,
  autofillForm,
  generateEmail,
  generateNotification,
} from "./aiWorkflow.js";

const PORT = process.env.PORT || 3001;
import pool from "./db.js";

const COLLECTIONS = new Set(["users", "reports", "analytics", "activities", "notifications"]);

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const readDb = async () => {
  const [users] = await pool.query('SELECT * FROM users');
  const [reports] = await pool.query('SELECT * FROM reports');
  const [analytics] = await pool.query('SELECT * FROM analytics');
  const [activities] = await pool.query('SELECT * FROM activities');
  const [notifications] = await pool.query('SELECT * FROM notifications');
  return { users, reports, analytics, activities, notifications };
};

const ensureAiTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_prompts (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      prompt TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      isFavorite BOOLEAN DEFAULT false,
      usedCount INT DEFAULT 0,
      lastUsed BIGINT NULL,
      createdAt BIGINT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      createdAt BIGINT NOT NULL,
      updatedAt BIGINT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_conversation_messages (
      id VARCHAR(50) PRIMARY KEY,
      conversationId VARCHAR(50) NOT NULL,
      role VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      timestamp BIGINT NOT NULL,
      FOREIGN KEY (conversationId) REFERENCES ai_conversations(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      timestamp VARCHAR(255) NOT NULL,
      isRead BOOLEAN DEFAULT false
    )
  `);

  const [[lastUsedColumn]] = await pool.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'ai_prompts'
      AND COLUMN_NAME = 'lastUsed'
  `);

  if (!lastUsedColumn) {
    await pool.query(`ALTER TABLE ai_prompts ADD COLUMN lastUsed BIGINT NULL AFTER usedCount`);
  }

  const [[notificationCount]] = await pool.query(`SELECT COUNT(*) AS count FROM notifications`);
  if (Number(notificationCount.count) === 0) {
    const now = new Date();
    const defaults = [
      {
        id: "notif-1",
        title: "AI Summary Ready",
        message: "Dashboard summary was generated from the latest report data.",
        type: "success",
        timestamp: new Date(now.getTime() - 1000 * 60 * 4).toISOString(),
        isRead: false,
      },
      {
        id: "notif-2",
        title: "Pending Queue",
        message: "Two reports are still pending review. Prioritize high-impact workflows first.",
        type: "warning",
        timestamp: new Date(now.getTime() - 1000 * 60 * 11).toISOString(),
        isRead: false,
      },
      {
        id: "notif-3",
        title: "Failure Rate Watch",
        message: "Failure rate is above the preferred operating target. Review failed reports before EOD.",
        type: "error",
        timestamp: new Date(now.getTime() - 1000 * 60 * 23).toISOString(),
        isRead: false,
      },
    ];

    for (const notification of defaults) {
      await pool.query(
        `INSERT INTO notifications (id, title, message, type, timestamp, isRead)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [notification.id, notification.title, notification.message, notification.type, notification.timestamp, notification.isRead],
      );
    }
  }
};

const uid = () => Math.random().toString(36).slice(2, 9);

const sendJson = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  });
  res.end(JSON.stringify(data));
};

const parseBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
};

const parseDateValue = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const resolveCollection = (name) => (name === "analytics_data" ? "analytics" : name);

const buildReportFilters = (reports, filters = {}) => {
  if (!filters || Object.keys(filters).length === 0) return reports;

  return reports.filter((report) => {
    if (filters.status && normalizeText(report.status) !== normalizeText(filters.status)) return false;
    if (filters.priority && normalizeText(report.priority) !== normalizeText(filters.priority)) return false;
    if (filters.category && normalizeText(report.category) !== normalizeText(filters.category)) return false;
    if (filters.createdBy && !normalizeText(report.createdBy).includes(normalizeText(filters.createdBy))) return false;

    const reportDate = parseDateValue(report.createdDate) || parseDateValue(report.startDate) || parseDateValue(report.endDate);
    const dateRange = normalizeText(filters.dateRange || "");

    if (dateRange && reportDate) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfThisWeek = new Date(startOfToday);
      startOfThisWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      if (dateRange.includes("today") && reportDate < startOfToday) return false;
      if (dateRange.includes("this week") && reportDate < startOfThisWeek) return false;
      if (dateRange.includes("last week") && (reportDate < startOfLastWeek || reportDate >= startOfThisWeek)) return false;
      if (dateRange.includes("this month") && reportDate < startOfThisMonth) return false;
      if (dateRange.includes("last month") && (reportDate < startOfLastMonth || reportDate > endOfLastMonth)) return false;
    }

    if (filters.startDate) {
      const startFilter = parseDateValue(filters.startDate);
      if (reportDate && startFilter && reportDate < startFilter) return false;
    }
    if (filters.endDate) {
      const endFilter = parseDateValue(filters.endDate);
      if (reportDate && endFilter && reportDate > endFilter) return false;
    }

    return true;
  });
};

const buildStats = (reports) => {
  const totalReports = reports.length;
  const completedReports = reports.filter((r) => normalizeText(r.status) === "completed").length;
  const pendingReports = reports.filter((r) => normalizeText(r.status) === "pending").length;
  const failedReports = reports.filter((r) => normalizeText(r.status) === "failed").length;
  const failureRate = totalReports ? `${((failedReports / totalReports) * 100).toFixed(1)}%` : "0%";
  return { totalReports, completedReports, pendingReports, failureRate };
};

const getCurrentStats = async (filters = {}) => {
  const db = await readDb();
  const filteredReports = buildReportFilters(db.reports || [], filters);
  return buildStats(filteredReports);
};

const createSummary = (stats) => {
  const completionRate = stats.totalReports ? ((stats.completedReports / stats.totalReports) * 100).toFixed(1) : "0";
  const failureNum = parseFloat(stats.failureRate);

  return {
    summary: [
      `Total reports processed: ${stats.totalReports.toLocaleString()}`,
      `Completed reports: ${stats.completedReports} (${completionRate}% completion rate)`,
      `Pending reports: ${stats.pendingReports} awaiting processing`,
      `Current failure rate: ${stats.failureRate}`,
      `Peak activity observed between 10 AM and 12 PM`,
      stats.pendingReports > 3
        ? `Warning: ${stats.pendingReports} reports pending - consider assigning more analysts`
        : "Pending queue is manageable",
    ],
    generatedAt: new Date().toISOString(),
    highlights: [
      { label: "Completion Rate", value: `${completionRate}%`, trend: Number(completionRate) > 50 ? "up" : "down" },
      { label: "Failure Rate", value: stats.failureRate, trend: failureNum < 5 ? "down" : "up" },
      { label: "Pending", value: String(stats.pendingReports), trend: stats.pendingReports > 5 ? "up" : "stable" },
    ],
  };
};

const createRecommendations = (stats) => {
  const recs = [];
  const failNum = parseFloat(stats.failureRate);
  const completionRate = stats.totalReports ? (stats.completedReports / stats.totalReports) * 100 : 0;

  if (stats.pendingReports > 3) {
    recs.push({
      id: `rec-${Math.random().toString(36).slice(2, 8)}`,
      severity: "warning",
      title: "High Pending Queue",
      description: `There are ${stats.pendingReports} reports pending processing, which is ${Math.round((stats.pendingReports / Math.max(stats.totalReports, 1)) * 100)}% of total reports.`,
      suggestedAction: "Assign additional analysts to reduce the backlog.",
      metric: "Pending Reports",
      change: `+${stats.pendingReports}`,
    });
  }

  recs.push({
    id: `rec-${Math.random().toString(36).slice(2, 8)}`,
    severity: failNum > 3 ? "critical" : "success",
    title: failNum > 3 ? "Failure Rate Exceeds Threshold" : "Failure Rate Within Target",
    description:
      failNum > 3
        ? `Current failure rate is ${stats.failureRate}, exceeding the 3% target threshold.`
        : `Current failure rate of ${stats.failureRate} is below the 3% threshold.`,
    suggestedAction:
      failNum > 3
        ? "Review reports submitted after 2 PM - failure patterns correlate with late-day submissions."
        : "Continue monitoring. System performance is stable.",
    metric: "Failure Rate",
    change: stats.failureRate,
  });

  recs.push({
    id: `rec-${Math.random().toString(36).slice(2, 8)}`,
    severity: completionRate > 60 ? "success" : "warning",
    title: completionRate > 60 ? "Strong Completion Rate" : "Low Completion Rate",
    description:
      completionRate > 60
        ? `${completionRate.toFixed(1)}% of reports are completed. This is above the 60% benchmark.`
        : `Only ${completionRate.toFixed(1)}% of reports are completed, below the 60% benchmark.`,
    suggestedAction:
      completionRate > 60
        ? "Maintain current workflow efficiency. Consider documenting best practices."
        : "Review assignment distribution and identify bottlenecks in the pipeline.",
    metric: "Completion Rate",
    change: `${completionRate.toFixed(1)}%`,
  });

  recs.push({
    id: `rec-${Math.random().toString(36).slice(2, 8)}`,
    severity: "info",
    title: "Optimize Report Scheduling",
    description: "Peak activity is observed between 10 AM and 12 PM. Distributing workload across off-peak hours can improve throughput.",
    suggestedAction: "Schedule batch processing during 6-8 AM to balance server load.",
    metric: "Peak Hours",
    change: "10 AM-12 PM",
  });

  return { recommendations: recs, generatedAt: new Date().toISOString() };
};

const explainChart = ({ chartType, chartTitle, data }) => {
  const values = Array.isArray(data) ? data.map((item) => item.reports ?? item.value ?? 0) : [];
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;
  const avg = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
  const maxLabel = data[values.indexOf(max)]?.name || "peak day";
  const minLabel = data[values.indexOf(min)]?.name || "low day";
  const insights = [`Average value: ${avg}`, `Peak activity on ${maxLabel}`, `Lowest activity on ${minLabel}`];
  let trend = "stable";

  if (values.length > 1 && values[values.length - 1] > values[0]) trend = "upward";
  if (values.length > 1 && values[values.length - 1] < values[0]) trend = "downward";

  const explanation =
    chartType === "BAR"
      ? `The "${chartTitle}" chart highlights category comparisons over time. ${maxLabel} has the highest value at ${max}, while ${minLabel} is the lowest.`
      : `The "${chartTitle}" chart shows report activity over time. The highest value is ${max} on ${maxLabel} and the lowest is ${min} on ${minLabel}.`;

  return { explanation, keyInsights: insights, trend };
};

const detectIntent = (query) => {
  const text = normalizeText(query);
  const filters = {};
  let intent = "GENERAL_QUERY";
  let message = "Searching for results.";

  if (text.match(/\b(pending|queue|waiting|in progress)\b/)) {
    filters.status = "Pending";
    intent = "FILTER_REPORTS";
    message = "Showing pending reports.";
  } else if (text.match(/\b(completed|done|finished|success)\b/)) {
    filters.status = "Completed";
    intent = "FILTER_REPORTS";
    message = "Showing completed reports.";
  } else if (text.match(/\b(failed|fail|error|broken)\b/)) {
    filters.status = "Failed";
    intent = "FILTER_REPORTS";
    message = "Showing failed reports.";
  }

  if (text.match(/\b(high priority|urgent|critical)\b/)) {
    filters.priority = "High";
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} with high priority.`;
  } else if (text.match(/\b(medium priority)\b/)) {
    filters.priority = "Medium";
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} with medium priority.`;
  } else if (text.match(/\b(low priority)\b/)) {
    filters.priority = "Low";
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} with low priority.`;
  }

  if (text.match(/\b(sales)\b/)) {
    filters.category = "Sales";
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} in Sales category.`;
  } else if (text.match(/\b(operations|ops)\b/)) {
    filters.category = "Operations";
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} in Operations category.`;
  } else if (text.match(/\b(analytics)\b/) && !text.match(/\b(dashboard|summary)\b/)) {
    filters.category = "Analytics";
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} in Analytics category.`;
  } else if (text.match(/\b(maintenance)\b/)) {
    filters.category = "Maintenance";
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} in Maintenance category.`;
  }

  const createdByMatch = text.match(/(?:by|from|created by|author)\s+(\w+(?:\s+\w+)?)/);
  if (createdByMatch) {
    filters.createdBy = createdByMatch[1]
      .split(" ")
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(" ");
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} created by ${filters.createdBy}.`;
  }

  if (text.match(/\b(this week|current week)\b/)) filters.dateRange = "This Week";
  if (text.match(/\b(last week|previous week)\b/)) filters.dateRange = "Last Week";
  if (text.match(/\b(this month|current month)\b/)) filters.dateRange = "This Month";
  if (text.match(/\b(last month|previous month)\b/)) filters.dateRange = "Last Month";
  if (filters.dateRange) {
    intent = "FILTER_REPORTS";
    message = `${message.replace(/\.$/, "")} from ${filters.dateRange.toLowerCase()}.`;
  }

  if (text.match(/\b(summary|overview|summarize|dashboard summary)\b/)) {
    intent = "DASHBOARD_SUMMARY";
    message = "Generating dashboard summary.";
  }
  if (text.match(/\b(analytics data|show analytics|view analytics)\b/)) {
    intent = "SHOW_ANALYTICS";
    message = "Showing analytics data.";
  }
  if (text.match(/\b(users|team|people|members)\b/) && !createdByMatch) {
    intent = "SHOW_USERS";
    message = "Showing user data.";
  }

  return { intent, filters, message };
};

const handleAiRoute = async (req, res, pathname) => {
  const body = await parseBody(req);
  const [, , , resource, id, action] = pathname.split("/");

  if (pathname === "/api/ai/search") {
    if (typeof body.query !== "string") return sendJson(res, 400, { error: "Query must be a string." });
    return sendJson(res, 200, detectIntent(body.query));
  }

  if (pathname === "/api/ai/dashboard-summary") {
    const db = await readDb();
    const filteredReports = buildReportFilters(db.reports || [], body.filters || {});
    return sendJson(res, 200, createSummary(buildStats(filteredReports)));
  }

  if (pathname === "/api/ai/recommendations") {
    const db = await readDb();
    const filteredReports = buildReportFilters(db.reports || [], body.filters || {});
    return sendJson(res, 200, createRecommendations(buildStats(filteredReports)));
  }

  if (pathname === "/api/ai/explain-chart") {
    const { chartType, chartTitle, data } = body;
    if (!chartType || !chartTitle || !Array.isArray(data)) {
      return sendJson(res, 400, { error: "chartType, chartTitle, and data are required." });
    }
    return sendJson(res, 200, explainChart({ chartType, chartTitle, data }));
  }

  if (pathname === "/api/ai/generate-report" && req.method === "POST") {
    if (!body.reportType || !body.dateRange) {
      return sendJson(res, 400, { error: "reportType and dateRange are required." });
    }
    const stats = await getCurrentStats(body.filters || {});
    return sendJson(res, 200, generateReport(body, stats));
  }

  if (pathname === "/api/ai/autofill" && req.method === "POST") {
    if (typeof body.prompt !== "string" || !body.prompt.trim()) {
      return sendJson(res, 400, { error: "prompt is required." });
    }
    return sendJson(res, 200, autofillForm(body));
  }

  if (pathname === "/api/ai/generate-email" && req.method === "POST") {
    if (!body.context) return sendJson(res, 400, { error: "context is required." });
    const stats = await getCurrentStats(body.filters || {});
    return sendJson(res, 200, generateEmail(body, stats));
  }

  if (pathname === "/api/ai/generate-notification" && req.method === "POST") {
    if (!body.type) return sendJson(res, 400, { error: "type is required." });
    const stats = await getCurrentStats(body.filters || {});
    return sendJson(res, 200, generateNotification(body, stats));
  }

  if (resource === "prompts") return handlePromptRoute(req, res, id, action, body);
  if (resource === "conversations") return handleConversationRoute(req, res, id, action, body);

  return sendJson(res, 404, { error: "AI route not found." });
};

const normalizePromptRow = (row) => ({
  ...row,
  isFavorite: Boolean(row.isFavorite),
  usedCount: Number(row.usedCount || 0),
  lastUsed: row.lastUsed == null ? undefined : Number(row.lastUsed),
  createdAt: Number(row.createdAt),
});

const handlePromptRoute = async (req, res, id, action, body) => {
  if (req.method === "GET" && !id) {
    const [rows] = await pool.query(`SELECT * FROM ai_prompts ORDER BY usedCount DESC, createdAt DESC`);
    return sendJson(res, 200, rows.map(normalizePromptRow));
  }

  if (req.method === "POST" && !id) {
    if (!body.name || !body.prompt || !body.category) {
      return sendJson(res, 400, { error: "name, prompt, and category are required." });
    }
    const prompt = {
      id: body.id || uid(),
      name: body.name,
      prompt: body.prompt,
      category: body.category,
      isFavorite: Boolean(body.isFavorite),
      usedCount: Number(body.usedCount || 0),
      lastUsed: body.lastUsed ?? null,
      createdAt: body.createdAt || Date.now(),
    };
    await pool.query(
      `INSERT INTO ai_prompts (id, name, prompt, category, isFavorite, usedCount, lastUsed, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [prompt.id, prompt.name, prompt.prompt, prompt.category, prompt.isFavorite, prompt.usedCount, prompt.lastUsed, prompt.createdAt],
    );
    return sendJson(res, 201, normalizePromptRow(prompt));
  }

  if ((req.method === "PUT" || req.method === "PATCH") && id && !action) {
    const allowed = ["name", "prompt", "category", "isFavorite", "usedCount", "lastUsed"];
    const keys = allowed.filter((key) => Object.prototype.hasOwnProperty.call(body, key));
    if (!keys.length) return sendJson(res, 400, { error: "No valid prompt fields provided." });
    await pool.query(
      `UPDATE ai_prompts SET ${keys.map((key) => `${key} = ?`).join(", ")} WHERE id = ?`,
      [...keys.map((key) => body[key]), id],
    );
    const [[updated]] = await pool.query(`SELECT * FROM ai_prompts WHERE id = ?`, [id]);
    return updated ? sendJson(res, 200, normalizePromptRow(updated)) : sendJson(res, 404, { error: "Prompt not found." });
  }

  if (req.method === "POST" && id && action === "use") {
    const lastUsed = Date.now();
    const [result] = await pool.query(`UPDATE ai_prompts SET usedCount = usedCount + 1, lastUsed = ? WHERE id = ?`, [lastUsed, id]);
    if (result.affectedRows === 0) return sendJson(res, 404, { error: "Prompt not found." });
    const [[updated]] = await pool.query(`SELECT * FROM ai_prompts WHERE id = ?`, [id]);
    return sendJson(res, 200, normalizePromptRow(updated));
  }

  if (req.method === "DELETE" && id && !action) {
    const [result] = await pool.query(`DELETE FROM ai_prompts WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return sendJson(res, 404, { error: "Prompt not found." });
    return sendJson(res, 200, {});
  }

  return sendJson(res, 405, { error: "Method not allowed." });
};

const getConversations = async () => {
  const [conversations] = await pool.query(`SELECT * FROM ai_conversations ORDER BY updatedAt DESC`);
  const [messages] = await pool.query(`SELECT * FROM ai_conversation_messages ORDER BY timestamp ASC`);
  const messagesByConversation = new Map();

  for (const message of messages) {
    const list = messagesByConversation.get(message.conversationId) || [];
    list.push({
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: Number(message.timestamp),
    });
    messagesByConversation.set(message.conversationId, list);
  }

  return conversations.map((conversation) => ({
    id: conversation.id,
    title: conversation.title,
    messages: messagesByConversation.get(conversation.id) || [],
    createdAt: Number(conversation.createdAt),
    updatedAt: Number(conversation.updatedAt),
  }));
};

const appendConversationMessage = async (conversationId, message) => {
  const item = {
    id: message.id || uid(),
    role: message.role,
    content: message.content,
    timestamp: message.timestamp || Date.now(),
  };

  await pool.query(
    `INSERT INTO ai_conversation_messages (id, conversationId, role, content, timestamp)
     VALUES (?, ?, ?, ?, ?)`,
    [item.id, conversationId, item.role, item.content, item.timestamp],
  );
  await pool.query(`UPDATE ai_conversations SET updatedAt = ? WHERE id = ?`, [Date.now(), conversationId]);
  return item;
};

const handleConversationRoute = async (req, res, id, action, body) => {
  if (req.method === "GET" && !id) {
    return sendJson(res, 200, await getConversations());
  }

  if (req.method === "POST" && !id) {
    const now = Date.now();
    const conversation = {
      id: body.id || uid(),
      title: body.title || String(body.firstMessage || "New conversation").slice(0, 50),
      createdAt: body.createdAt || now,
      updatedAt: body.updatedAt || now,
    };
    await pool.query(
      `INSERT INTO ai_conversations (id, title, createdAt, updatedAt)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), updatedAt = VALUES(updatedAt)`,
      [conversation.id, conversation.title, conversation.createdAt, conversation.updatedAt],
    );

    if (Array.isArray(body.messages)) {
      for (const message of body.messages) await appendConversationMessage(conversation.id, message);
    }

    const [saved] = (await getConversations()).filter((item) => item.id === conversation.id);
    return sendJson(res, 201, saved || { ...conversation, messages: [] });
  }

  if (req.method === "POST" && id && action === "messages") {
    if (!body.role || !body.content) return sendJson(res, 400, { error: "role and content are required." });
    const [[conversation]] = await pool.query(`SELECT id FROM ai_conversations WHERE id = ?`, [id]);
    if (!conversation) return sendJson(res, 404, { error: "Conversation not found." });
    return sendJson(res, 201, await appendConversationMessage(id, body));
  }

  if (req.method === "POST" && id && action === "respond") {
    const userMessage = String(body.userMessage || "");
    const history = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];
    const lastMessages = history.slice(-4).map((message) => `${message.role === "user" ? "User" : "AI"}: ${message.content}`);
    const contextLine = lastMessages.length ? ` I considered the recent context: ${lastMessages.join(" | ")}` : "";
    return sendJson(res, 200, {
      response: `I understood your follow-up: "${userMessage}".${contextLine} Based on the dashboard data, I can help refine filters, summarize trends, or turn this into a report-ready action plan.`,
    });
  }

  if (req.method === "DELETE" && id && !action) {
    const [result] = await pool.query(`DELETE FROM ai_conversations WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return sendJson(res, 404, { error: "Conversation not found." });
    return sendJson(res, 200, {});
  }

  return sendJson(res, 405, { error: "Method not allowed." });
};

const handleAuthRoute = async (req, res, pathname) => {
  if (pathname !== "/api/auth/social-login" || req.method !== "POST") {
    return sendJson(res, 404, { error: "Auth route not found." });
  }

  const body = await parseBody(req);
  const provider = normalizeText(body.provider);
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();

  if (!["google", "microsoft"].includes(provider)) {
    return sendJson(res, 400, { error: "provider must be google or microsoft." });
  }
  if (!email || !email.includes("@")) return sendJson(res, 400, { error: "A valid account email is required." });

  const [[existingUser]] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  const user = existingUser || {
    id: `${provider}-${uid()}`,
    email,
    password: "",
    name: name || email.split("@")[0],
    role: "Viewer",
    status: "Active",
    lastLogin: new Date().toISOString(),
  };

  if (existingUser) {
    await pool.query(`UPDATE users SET lastLogin = ?, status = 'Active' WHERE id = ?`, [new Date().toISOString(), user.id]);
  } else {
    await pool.query(
      `INSERT INTO users (id, email, password, name, role, status, lastLogin)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.email, user.password, user.name, user.role, user.status, user.lastLogin],
    );
  }

  await pool.query(
    `INSERT INTO notifications (id, title, message, type, timestamp, isRead)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      `notif-${Date.now()}`,
      "New Sign In",
      `${user.name || user.email} signed in with ${provider === "google" ? "Google" : "Microsoft"}.`,
      "info",
      new Date().toISOString(),
      false,
    ],
  );

  return sendJson(res, 200, {
    token: `mock-${provider}-token-${uid()}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "Viewer",
      status: user.status,
    },
  });
};

const applyQuery = (items, searchParams) => {
  let result = [...items];

  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("_")) continue;
    result = result.filter((item) => normalizeText(item[key]) === normalizeText(value));
  }

  const sortKey = searchParams.get("_sort");
  if (sortKey) {
    const order = searchParams.get("_order") === "desc" ? -1 : 1;
    result.sort((a, b) => String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? "")) * order);
  }

  const limit = Number(searchParams.get("_limit"));
  return Number.isFinite(limit) && limit > 0 ? result.slice(0, limit) : result;
};

const handleCollectionRoute = async (req, res, url) => {
  const [, rawCollection, id] = url.pathname.split("/");
  const collectionName = resolveCollection(rawCollection);
  if (!COLLECTIONS.has(collectionName)) return sendJson(res, 404, { error: "Route not found." });

  const db = await readDb();
  const items = db[collectionName] || [];

  if (req.method === "GET" && !id) return sendJson(res, 200, applyQuery(items, url.searchParams));
  if (req.method === "GET" && id) {
    const item = items.find((entry) => String(entry.id) === id);
    return item ? sendJson(res, 200, item) : sendJson(res, 404, { error: "Item not found." });
  }

  if (req.method === "POST" && !id) {
    const body = await parseBody(req);
    const item = { id: body.id || String(Date.now()), ...body };
    const keys = Object.keys(item);
    const values = Object.values(item);
    const placeholders = keys.map(() => '?').join(', ');
    await pool.query(`INSERT INTO ${collectionName} (${keys.join(', ')}) VALUES (${placeholders})`, values);
    return sendJson(res, 201, item);
  }

  if ((req.method === "PATCH" || req.method === "PUT") && id) {
    const body = await parseBody(req);
    const keys = Object.keys(body).filter(k => k !== 'id');
    const values = keys.map(k => body[k]);
    if (keys.length > 0) {
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      await pool.query(`UPDATE ${collectionName} SET ${setClause} WHERE id = ?`, [...values, id]);
    }
    const [[updatedItem]] = await pool.query(`SELECT * FROM ${collectionName} WHERE id = ?`, [id]);
    return updatedItem ? sendJson(res, 200, updatedItem) : sendJson(res, 404, { error: "Item not found." });
  }

  if (req.method === "DELETE" && id) {
    const [result] = await pool.query(`DELETE FROM ${collectionName} WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return sendJson(res, 404, { error: "Item not found." });
    return sendJson(res, 200, {});
  }

  return sendJson(res, 405, { error: "Method not allowed." });
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return sendJson(res, 204, {});

    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/ai/")) return handleAiRoute(req, res, url.pathname);
    if (url.pathname.startsWith("/api/auth/")) return handleAuthRoute(req, res, url.pathname);
    return handleCollectionRoute(req, res, url);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: "Internal server error." });
  }
});

ensureAiTables()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Mock API with AI routes listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize AI tables", error);
    process.exit(1);
  });
