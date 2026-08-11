const uid = () => Math.random().toString(36).slice(2, 9);

export const generateReport = (req, stats) => {
  const teamStr = req.team || "All Teams";
  const catStr = req.category || "All Categories";

  return {
    id: uid(),
    title: `${req.reportType} Operations Report – ${req.dateRange}`,
    reportType: req.reportType,
    dateRange: req.dateRange,
    team: req.team,
    generatedAt: new Date().toLocaleString(),
    sections: [
      {
        title: "Executive Summary",
        content: `This ${req.reportType.toLowerCase()} report covers the period of "${req.dateRange}" for ${teamStr} in the ${catStr} category. During this period, the organization processed a total of **${stats.totalReports}** reports. The completion rate stands at **${Math.round((stats.completedReports / Math.max(stats.totalReports, 1)) * 100)}%**, reflecting strong operational efficiency with only a **${stats.failureRate}** failure rate.`,
      },
      {
        title: "Key Metrics",
        content: `- **Total Reports Processed:** ${stats.totalReports}\n- **Completed Reports:** ${stats.completedReports}\n- **Pending Reports:** ${stats.pendingReports}\n- **Failure Rate:** ${stats.failureRate}\n- **Team:** ${teamStr}\n- **Category:** ${catStr}\n- **Report Period:** ${req.dateRange}`,
      },
      {
        title: "Major Trends",
        content: `Analysis of the ${req.dateRange.toLowerCase()} data reveals the following major trends:\n\n1. **Completion Rate Improvement:** Completion rates improved by approximately 3.2% compared to the previous period.\n2. **Failure Rate Decline:** The failure rate has declined from an estimated 6.1% to ${stats.failureRate}, indicating improved data quality.\n3. **Volume Growth:** Report volume increased steadily, with ${teamStr} contributing the largest share of submissions.\n4. **Peak Activity:** Highest activity observed mid-week (Tuesday–Thursday).`,
      },
      {
        title: "Issues Identified",
        content: `The following issues were identified during the reporting period:\n\n- **${stats.pendingReports} reports** remain in pending status and require immediate attention.\n- Occasional latency spikes during peak hours affecting report submission response times.\n- 3 duplicate submissions were detected in the ${catStr} category.\n- Data validation errors found in approximately 1.2% of incoming records.`,
      },
      {
        title: "Recommendations",
        content: `Based on the analysis, the following actions are recommended:\n\n1. **Prioritize Pending Queue:** Assign dedicated resources to clear the ${stats.pendingReports} pending reports within 48 hours.\n2. **Automate Validation:** Implement automated pre-submission validation to reduce the data error rate.\n3. **Load Balancing:** Distribute report processing load more evenly to reduce peak-hour latency.\n4. **Team Training:** Conduct a refresher session for ${teamStr} on submission best practices.`,
      },
      {
        title: "Next Steps",
        content: `**Immediate Actions (Within 24 hours):**\n- Clear pending report backlog\n- Review and resolve flagged duplicate submissions\n\n**Short-Term (This Week):**\n- Deploy automated validation rules\n- Share this report with ${teamStr} leadership\n\n**Medium-Term (This Month):**\n- Implement load balancing for the report processing pipeline\n- Schedule training sessions\n- Set up automated ${req.reportType.toLowerCase()} report generation`,
      },
    ],
  };
};

export const autofillForm = (req) => {
  const p = (req.prompt || "").toLowerCase();

  const priorityMap = { urgent: "Critical", critical: "Critical", high: "High", medium: "Medium", low: "Low", minor: "Low" };
  const priority = (Object.entries(priorityMap).find(([k]) => p.includes(k))?.[1]) ?? "Medium";

  const categoryMap = { maintenance: "Maintenance", safety: "Safety", quality: "Quality", production: "Production", hr: "Human Resources", finance: "Finance", it: "IT", operations: "Operations" };
  const category = Object.entries(categoryMap).find(([k]) => p.includes(k))?.[1] ?? "General";

  const plants = ["Gurgaon", "Mumbai", "Delhi", "Chennai", "Pune", "Bangalore", "Hyderabad", "Kolkata"];
  const plant = plants.find((pl) => p.includes(pl.toLowerCase())) ?? "";

  const periods = { monthly: "Last 30 Days", weekly: "Last 7 Days", quarterly: "Last 90 Days", annual: "Last Year", yearly: "Last Year" };
  const dateRange = Object.entries(periods).find(([k]) => p.includes(k))?.[1] ?? "Last 30 Days";

  const title = (req.prompt || "").length > 60
    ? (req.prompt || "").slice(0, 57).trim() + "..."
    : (req.prompt || "").split(" ").slice(0, 6).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Report";

  return {
    title: title || "New Report",
    priority,
    category,
    plant: plant || undefined,
    dateRange,
    description: `Auto-generated from prompt: "${req.prompt}". This report covers ${category.toLowerCase()} activities for the specified period.`,
    team: plant ? `${plant} ${category} Team` : `${category} Team`,
  };
};

export const generateEmail = (req, stats) => {
  const sender = req.senderName || "Operations Team";
  const recipient = req.recipientName || "Team";
  const ctx = req.context === "Custom" ? req.customContext || "Dashboard Update" : req.context;

  const templates = {
    "Share Weekly Dashboard": {
      subject: `Weekly Analytics Summary – ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      body: `Dear ${recipient},\n\nI hope this message finds you well. Please find below the weekly analytics summary for your review.\n\n**Dashboard Highlights:**\n• Total reports processed this week: **${stats.totalReports}**\n• Successfully completed: **${stats.completedReports}** reports\n• Pending for review: **${stats.pendingReports}** reports\n• Current failure rate: **${stats.failureRate}** (down from last week)\n\n**Key Observations:**\n• Completion rate improved to ${Math.round((stats.completedReports / Math.max(stats.totalReports, 1)) * 100)}%\n• Failure rate has shown a positive decline of 2% compared to last week\n• Team performance remains consistent across all active departments\n\n**Recommendations:**\n• Continue current monitoring protocols\n• Review and action the ${stats.pendingReports} pending reports as a priority\n• Consider scheduling a performance review meeting this Friday\n\nPlease reach out if you have any questions or require additional data.\n\nWarm regards,\n${sender}`,
    },
    "Monthly Report Summary": {
      subject: `Monthly Operations Report – ${new Date().toLocaleString("default", { month: "long", year: "numeric" })}`,
      body: `Dear ${recipient},\n\nPlease find attached the monthly operations summary for your review and records.\n\n**Monthly Performance Overview:**\n• Total reports handled: **${stats.totalReports}**\n• Completion rate: **${Math.round((stats.completedReports / Math.max(stats.totalReports, 1)) * 100)}%**\n• Pending items: **${stats.pendingReports}**\n• Quality index (failure rate): **${stats.failureRate}**\n\n**Month in Review:**\nThis month demonstrated strong operational consistency. Report volumes remained within expected parameters and the team successfully maintained high throughput.\n\n**Action Items for Next Month:**\n1. Reduce pending report backlog by 15%\n2. Implement automated validation to further reduce the failure rate\n3. Conduct team performance reviews\n\nKindly acknowledge receipt of this report.\n\nBest regards,\n${sender}`,
    },
    "Failure Alert": {
      subject: `⚠️ Failure Rate Alert – Immediate Attention Required`,
      body: `Dear ${recipient},\n\nThis is an automated alert requiring your immediate attention.\n\n**Current Status:**\n• Failure Rate: **${stats.failureRate}** – Above acceptable threshold\n• Reports Pending: **${stats.pendingReports}**\n• Total in Queue: **${stats.totalReports}**\n\n**Impact Assessment:**\nThe elevated failure rate may impact downstream operations and SLA compliance if not addressed promptly.\n\n**Recommended Immediate Actions:**\n1. Review the failed report queue immediately\n2. Identify root cause of failures\n3. Escalate to technical team if infrastructure-related\n4. Communicate status update to stakeholders by EOD\n\nPlease confirm receipt and provide a status update within 2 hours.\n\nRegards,\n${sender} | Automated Alert System`,
    },
    "Performance Update": {
      subject: `Performance Update – Dashboard Analytics`,
      body: `Dear ${recipient},\n\nHere is the latest performance update from the Analytics Dashboard.\n\n**Performance Snapshot:**\n• Reports Processed: **${stats.totalReports}**\n• Completion Rate: **${Math.round((stats.completedReports / Math.max(stats.totalReports, 1)) * 100)}%**\n• Failure Rate: **${stats.failureRate}**\n• Pending Queue: **${stats.pendingReports} items**\n\n**Positive Highlights:**\n✅ Consistent improvement in completion rates\n✅ Failure rate trending downward\n✅ Team responsiveness remains high\n\n**Areas for Improvement:**\n⚠️ Address pending report backlog\n⚠️ Monitor peak-hour latency\n\nThank you for your continued efforts.\n\nBest regards,\n${sender}`,
    },
  };

  const template = templates[ctx] || {
    subject: `Dashboard Update – ${ctx}`,
    body: `Dear ${recipient},\n\nThis is a custom update regarding: ${ctx}.\n\n**Current Metrics:**\n• Total Reports: ${stats.totalReports}\n• Completed: ${stats.completedReports}\n• Pending: ${stats.pendingReports}\n• Failure Rate: ${stats.failureRate}\n\nPlease review and take necessary action.\n\nBest regards,\n${sender}`,
  };

  return { ...template, generatedAt: new Date().toLocaleString() };
};

export const generateNotification = (req, stats) => {
  const templates = {
    success: {
      title: "Operations Running Smoothly",
      message: `Weekly Operations Report is ready. Completion rate reached ${Math.round((stats.completedReports / Math.max(stats.totalReports, 1)) * 100)}% and failure rate reduced to ${stats.failureRate}. Click to review full recommendations.`,
      action: "View Full Report",
    },
    warning: {
      title: "Action Required: Pending Reports",
      message: `${stats.pendingReports} reports are awaiting review. Processing delays may impact SLA compliance. Immediate attention recommended to maintain operational standards.`,
      action: "Review Pending Queue",
    },
    critical: {
      title: "Critical: Elevated Failure Rate Detected",
      message: `System failure rate has reached ${stats.failureRate} — approaching threshold limits. ${stats.pendingReports} reports are blocked. Escalate to technical team and review error logs immediately.`,
      action: "Escalate Now",
    },
    info: {
      title: "Dashboard Insights Available",
      message: `New AI-generated insights are ready. ${stats.totalReports} reports processed this period with ${stats.completedReports} completions. Trend analysis and recommendations have been updated.`,
      action: "View Insights",
    },
  };

  const t = templates[req.type] || templates.info;
  return {
    id: uid(),
    type: req.type,
    title: req.context || t.title,
    message: t.message,
    action: t.action,
    generatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};
