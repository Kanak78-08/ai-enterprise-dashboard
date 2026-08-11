import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function setup() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
  });

  console.log("Creating database...");
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`ai_enterprise_dashboard\``);
  await connection.query(`USE \`ai_enterprise_dashboard\``);

  console.log("Creating tables...");
  
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(255),
      password VARCHAR(255),
      name VARCHAR(255),
      role VARCHAR(50),
      status VARCHAR(50),
      lastLogin VARCHAR(255)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      category VARCHAR(100),
      status VARCHAR(50),
      priority VARCHAR(50),
      createdBy VARCHAR(255),
      createdDate VARCHAR(255),
      description TEXT,
      startDate VARCHAR(255),
      endDate VARCHAR(255)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS analytics (
      id VARCHAR(50) PRIMARY KEY,
      metric VARCHAR(100),
      value VARCHAR(100),
      plant VARCHAR(100),
      pressure VARCHAR(100),
      efficiency VARCHAR(100),
      timestamp VARCHAR(255),
      category VARCHAR(100)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id VARCHAR(50) PRIMARY KEY,
      user VARCHAR(255),
      action VARCHAR(255),
      status VARCHAR(50),
      timestamp VARCHAR(255)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255),
      message TEXT,
      type VARCHAR(50),
      timestamp VARCHAR(255),
      isRead BOOLEAN DEFAULT false
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS ai_prompts (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      prompt TEXT,
      category VARCHAR(100),
      isFavorite BOOLEAN,
      usedCount INT DEFAULT 0,
      lastUsed BIGINT NULL,
      createdAt BIGINT
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255),
      createdAt BIGINT,
      updatedAt BIGINT
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS ai_conversation_messages (
      id VARCHAR(50) PRIMARY KEY,
      conversationId VARCHAR(50),
      role VARCHAR(50),
      content TEXT,
      timestamp BIGINT,
      FOREIGN KEY (conversationId) REFERENCES ai_conversations(id) ON DELETE CASCADE
    )
  `);

  console.log("Reading db.json...");
  const dbPath = path.resolve("./db.json");
  const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  console.log("Inserting users...");
  for (const user of dbData.users || []) {
    await connection.query(`
      INSERT IGNORE INTO users (id, email, password, name, role, status, lastLogin)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [user.id, user.email, user.password, user.name, user.role, user.status, user.lastLogin]);
  }

  console.log("Inserting reports...");
  for (const report of dbData.reports || []) {
    await connection.query(`
      INSERT IGNORE INTO reports (id, name, category, status, priority, createdBy, createdDate, description, startDate, endDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [report.id, report.name, report.category, report.status, report.priority, report.createdBy, report.createdDate, report.description, report.startDate, report.endDate]);
  }

  console.log("Inserting analytics...");
  for (const item of dbData.analytics || []) {
    await connection.query(`
      INSERT IGNORE INTO analytics (id, metric, value, plant, pressure, efficiency, timestamp, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [item.id, item.metric, item.value, item.plant, item.pressure, item.efficiency, item.timestamp, item.category]);
  }

  console.log("Inserting activities...");
  for (const activity of dbData.activities || []) {
    await connection.query(`
      INSERT IGNORE INTO activities (id, user, action, status, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `, [activity.id, activity.user, activity.action, activity.status, activity.timestamp]);
  }

  console.log("Inserting notifications...");
  for (const notification of dbData.notifications || []) {
    await connection.query(`
      INSERT IGNORE INTO notifications (id, title, message, type, timestamp, isRead)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [notification.id, notification.title, notification.message, notification.type, notification.timestamp, notification.isRead || false]);
  }

  console.log("Inserting default AI prompts...");
  const defaultPrompts = [
    { id: "p1", name: "Dashboard Summary", prompt: "Give me a comprehensive summary of the current dashboard data including all key metrics and trends.", category: "Analytics", isFavorite: true, usedCount: 12, createdAt: Date.now() - 86400000 * 7 },
    { id: "p2", name: "Generate Weekly Report", prompt: "Generate a detailed weekly executive report based on the latest dashboard analytics data.", category: "Reports", isFavorite: true, usedCount: 8, createdAt: Date.now() - 86400000 * 5 },
    { id: "p3", name: "Explain Trend", prompt: "Explain the current trends in report completion rates and failure rates over the past week.", category: "Analytics", isFavorite: false, usedCount: 5, createdAt: Date.now() - 86400000 * 3 },
    { id: "p4", name: "Generate Recommendations", prompt: "Based on the current dashboard data, provide actionable recommendations to improve operational efficiency.", category: "Operations", isFavorite: true, usedCount: 15, createdAt: Date.now() - 86400000 * 10 },
    { id: "p5", name: "Summarize Activity", prompt: "Summarize the recent activity in the system including reports, user actions, and system performance.", category: "Operations", isFavorite: false, usedCount: 3, createdAt: Date.now() - 86400000 * 2 },
    { id: "p6", name: "Explain Chart", prompt: "Explain what the current analytics charts are showing and what insights can be derived from them.", category: "Analytics", isFavorite: false, usedCount: 7, createdAt: Date.now() - 86400000 * 4 },
    { id: "p7", name: "Failure Analysis", prompt: "Analyze the current failure rate, identify possible root causes, and suggest mitigation strategies.", category: "Operations", isFavorite: false, usedCount: 9, createdAt: Date.now() - 86400000 * 6 },
    { id: "p8", name: "Draft Status Email", prompt: "Draft a professional status update email for stakeholders based on current dashboard metrics.", category: "Communication", isFavorite: false, usedCount: 4, createdAt: Date.now() - 86400000 * 1 },
  ];

  for (const prompt of defaultPrompts) {
    await connection.query(`
      INSERT IGNORE INTO ai_prompts (id, name, prompt, category, isFavorite, usedCount, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [prompt.id, prompt.name, prompt.prompt, prompt.category, prompt.isFavorite, prompt.usedCount, prompt.createdAt]);
  }

  console.log("Setup completed successfully!");
  await connection.end();
}

setup().catch(console.error);
