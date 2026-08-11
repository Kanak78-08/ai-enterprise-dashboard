import pool from './db.js';

async function migrate() {
  console.log("Creating Week 7 AI Tables...");

  await pool.query(`
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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255),
      createdAt BIGINT,
      updatedAt BIGINT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_conversation_messages (
      id VARCHAR(50) PRIMARY KEY,
      conversationId VARCHAR(50),
      role VARCHAR(50),
      content TEXT,
      timestamp BIGINT,
      FOREIGN KEY (conversationId) REFERENCES ai_conversations(id) ON DELETE CASCADE
    )
  `);

  console.log("Inserting default prompts...");
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

  for (const p of defaultPrompts) {
    await pool.query(`
      INSERT IGNORE INTO ai_prompts (id, name, prompt, category, isFavorite, usedCount, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [p.id, p.name, p.prompt, p.category, p.isFavorite, p.usedCount, p.createdAt]);
  }

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

  console.log("Migration completed!");
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
