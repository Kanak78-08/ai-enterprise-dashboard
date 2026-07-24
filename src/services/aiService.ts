import { dashboardService } from "./dashboardService";
import { chatWithAI } from "../api/aiApi";

export const generateAIResponse = async (userQuery: string): Promise<string> => {
  try {
    // 1. Fetch current dashboard data to build context
    const stats = await dashboardService.getDashboardStats();
    
    // 2. Build the context string
    const context = `
You are an enterprise analytics assistant.
Dashboard Summary:
Reports: ${stats.totalReports}
Completed: ${stats.completedReports}
Pending: ${stats.pendingReports}
Failure Rate: ${stats.failureRate}
`;

    // 3. Construct the final prompt
    const prompt = `${context}\nAnswer user question: ${userQuery}`;

    // 4. Call the API
    const response = await chatWithAI(prompt);
    
    return response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Unable to contact AI Assistant");
  }
};
