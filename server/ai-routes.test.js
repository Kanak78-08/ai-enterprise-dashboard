import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const PORT = 3101;
const BASE_URL = `http://localhost:${PORT}`;

const waitForServer = async () => {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/reports`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("Test server did not start in time.");
};

const postJson = async (path, body) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  assert.equal(response.ok, true, `${path} returned ${response.status}`);
  return response.json();
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  assert.equal(response.ok, true, `${path} returned ${response.status}`);
  return response.status === 204 ? null : response.json();
};

test("AI mock routes support search, summaries, recommendations, chart explanations, and collections", async () => {
  const server = spawn(process.execPath, ["server/json-server.js"], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
    windowsHide: true,
  });

  try {
    await waitForServer();

    const reports = await fetch(`${BASE_URL}/reports`).then((response) => response.json());
    assert.ok(Array.isArray(reports));
    assert.ok(reports.length > 0);

    const search = await postJson("/api/ai/search", { query: "show failed high priority reports" });
    assert.equal(search.intent, "FILTER_REPORTS");
    assert.equal(search.filters.status, "Failed");
    assert.equal(search.filters.priority, "High");

    const summary = await postJson("/api/ai/dashboard-summary", { filters: { status: "Failed" } });
    assert.equal(summary.summary.length, 6);
    assert.match(summary.summary[0], /Total reports processed/);

    const recommendations = await postJson("/api/ai/recommendations", { filters: { status: "Failed" } });
    assert.ok(recommendations.recommendations.length >= 2);
    assert.ok(recommendations.recommendations.some((item) => item.metric === "Failure Rate"));

    const explanation = await postJson("/api/ai/explain-chart", {
      chartType: "LINE",
      chartTitle: "Reports Trend",
      data: [
        { name: "Mon", reports: 1 },
        { name: "Tue", reports: 3 },
      ],
    });
    assert.equal(explanation.trend, "upward");
    assert.ok(explanation.keyInsights.length > 0);

    const report = await postJson("/api/ai/generate-report", {
      reportType: "Weekly",
      dateRange: "Last 7 Days",
      team: "Operations",
      category: "Maintenance",
    });
    assert.equal(report.reportType, "Weekly");
    assert.ok(report.sections.length >= 3);

    const autofill = await postJson("/api/ai/autofill", { prompt: "High priority weekly maintenance report for Mumbai" });
    assert.equal(autofill.priority, "High");
    assert.equal(autofill.plant, "Mumbai");

    const email = await postJson("/api/ai/generate-email", { context: "Performance Update", recipientName: "Ops", senderName: "AI" });
    assert.match(email.subject, /Performance Update/);
    assert.match(email.body, /Dear Ops/);

    const notification = await postJson("/api/ai/generate-notification", { type: "warning", context: "Pending Review" });
    assert.equal(notification.type, "warning");
    assert.equal(notification.title, "Pending Review");

    const promptId = `test-prompt-${Date.now()}`;
    const createdPrompt = await postJson("/api/ai/prompts", {
      id: promptId,
      name: "Test Prompt",
      prompt: "Summarize test data",
      category: "Custom",
      isFavorite: false,
    });
    assert.equal(createdPrompt.id, promptId);

    const usedPrompt = await requestJson(`/api/ai/prompts/${promptId}/use`, { method: "POST" });
    assert.equal(usedPrompt.usedCount, 1);
    assert.ok(usedPrompt.lastUsed);

    const updatedPrompt = await requestJson(`/api/ai/prompts/${promptId}`, {
      method: "PUT",
      body: JSON.stringify({ isFavorite: true }),
    });
    assert.equal(updatedPrompt.isFavorite, true);

    const prompts = await requestJson("/api/ai/prompts");
    assert.ok(prompts.some((item) => item.id === promptId));

    await requestJson(`/api/ai/prompts/${promptId}`, { method: "DELETE" });

    const conversation = await postJson("/api/ai/conversations", { firstMessage: "Review the pending queue" });
    assert.ok(conversation.id);
    assert.equal(conversation.messages.length, 0);

    const message = await requestJson(`/api/ai/conversations/${conversation.id}/messages`, {
      method: "POST",
      body: JSON.stringify({ id: `msg-${Date.now()}`, role: "user", content: "Show failed reports", timestamp: Date.now() }),
    });
    assert.equal(message.role, "user");

    const aiResponse = await requestJson(`/api/ai/conversations/${conversation.id}/respond`, {
      method: "POST",
      body: JSON.stringify({ userMessage: "What should I do next?", conversationHistory: [message] }),
    });
    assert.match(aiResponse.response, /What should I do next/);

    const conversations = await requestJson("/api/ai/conversations");
    assert.ok(conversations.some((item) => item.id === conversation.id && item.messages.length === 1));

    await requestJson(`/api/ai/conversations/${conversation.id}`, { method: "DELETE" });
  } finally {
    server.kill();
  }
});
