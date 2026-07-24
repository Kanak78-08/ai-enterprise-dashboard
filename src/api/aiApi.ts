import axios from "axios";

// 1. OLLAMA CONFIGURATION (Option 1)
const OLLAMA_URL = "http://localhost:11434/api/generate";

export const chatWithAI = async (prompt: string): Promise<string> => {
  // Try to use Local Ollama first
  try {
    const response = await axios.post(
      OLLAMA_URL,
      {
        model: "llama3",
        prompt: prompt,
        stream: false,
      },
      {
        timeout: 2000,
      }
    );
    return response.data.response;
  } catch (error) {
    // ------------------------------------------------------------------------
    // SMART LOCAL MOCK ENGINE with Intent Detection
    // ------------------------------------------------------------------------
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    const userQuestion = prompt.split("Answer user question: ")[1]?.trim() || "";
    const q = userQuestion.toLowerCase();
    
    // Extract context variables from the prompt
    const totalMatch = prompt.match(/Reports:\s*([\d,]+)/i);
    const completedMatch = prompt.match(/Completed:\s*([\d,]+)/i);
    const pendingMatch = prompt.match(/Pending:\s*([\d,]+)/i);
    const failureMatch = prompt.match(/Failure Rate:\s*([\d.]+%)/i);

    const total = totalMatch ? totalMatch[1] : "0";
    const completed = completedMatch ? completedMatch[1] : "0";
    const pending = pendingMatch ? pendingMatch[1] : "0";
    const failure = failureMatch ? failureMatch[1] : "0%";

    let intent = "unknown";
    let response = "";

    // Keyword matching with simple typo tolerance
    if (q.match(/summary|sumary|overvew|overview|stats|statistics/)) {
      intent = "summary";
      response = `### Dashboard Summary 📊\nHere is your current analytics overview:\n- **Total Reports:** ${total}\n- **Completed:** ${completed}\n- **Pending:** ${pending}\n- **Failure Rate:** ${failure}`;
    } 
    else if (q.match(/report|reports|reps/)) {
      intent = "reports";
      response = `We currently have **${total}** reports in the system. **${completed}** are completed and **${pending}** are still pending.`;
    }
    else if (q.match(/pending|queue|waiting/)) {
      intent = "pending";
      response = `There are currently **${pending}** reports pending processing.`;
    }
    else if (q.match(/failure|fail|error|errors/)) {
      intent = "failures";
      response = `The current failure rate is **${failure}**. Make sure to monitor this if it goes above 5%.`;
    }
    else if (q.match(/user|users|people/)) {
      intent = "users";
      // We don't have total users in context, we will mock it dynamically or fetch it
      response = `We currently have multiple active users in the system managing the ${total} reports. You can view them in the Users module.`;
    }
    else if (q.match(/analytic|analytics|data|insight/)) {
      intent = "analytics";
      response = `Today's insights: Failure rate is at ${failure} and we have processed ${completed} reports successfully. The queue has ${pending} items.`;
    }
    else if (q.match(/trend|trends/)) {
      intent = "trends";
      response = `Recent trends show a solid completion rate. With ${completed} completed out of ${total}, the workflow is stable.`;
    }
    else if (q.match(/setting|settings|config/)) {
      intent = "settings";
      response = `You can update your application preferences, dark mode, and notifications in the Settings module.`;
    }
    else if (q.match(/hello|hi|hey/)) {
      intent = "greeting";
      response = `Hello! I am your AI Enterprise Assistant. Ask me anything about the dashboard data, reports, or analytics.`;
    }
    else {
      intent = "unknown";
      response = "I couldn't understand your request. Please ask about reports, analytics, users, settings, or dashboard statistics.";
    }

    console.log("Question:", userQuestion);
    console.log("Intent:", intent);
    console.log("Response:", response);

    return response;
  }
};
