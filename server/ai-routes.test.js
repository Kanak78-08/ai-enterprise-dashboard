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
  } finally {
    server.kill();
  }
});
