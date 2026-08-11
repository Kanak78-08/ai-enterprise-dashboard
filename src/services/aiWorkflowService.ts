import axiosClient from "../api/axiosClient";
import type {
  GenerateReportRequest,
  GeneratedReport,
  AutofillRequest,
  AutofillResponse,
  GenerateEmailRequest,
  GeneratedEmail,
  GenerateNotificationRequest,
  GeneratedNotification,
  PromptTemplate,
  Conversation,
  ConversationMessage,
} from "../types/aiWorkflow";

export const generateAIReport = async (req: GenerateReportRequest): Promise<GeneratedReport> => {
  const { data } = await axiosClient.post<GeneratedReport>("/api/ai/generate-report", req);
  return data;
};

export const autofillForm = async (req: AutofillRequest): Promise<AutofillResponse> => {
  const { data } = await axiosClient.post<AutofillResponse>("/api/ai/autofill", req);
  return data;
};

export const generateEmail = async (req: GenerateEmailRequest): Promise<GeneratedEmail> => {
  const { data } = await axiosClient.post<GeneratedEmail>("/api/ai/generate-email", req);
  return data;
};

export const generateNotification = async (req: GenerateNotificationRequest): Promise<GeneratedNotification> => {
  const { data } = await axiosClient.post<GeneratedNotification>("/api/ai/generate-notification", req);
  return data;
};

export const getPrompts = async (): Promise<PromptTemplate[]> => {
  const { data } = await axiosClient.get<PromptTemplate[]>("/api/ai/prompts");
  return data;
};

export const savePrompt = async (
  prompt: Omit<PromptTemplate, "id" | "createdAt" | "usedCount">,
): Promise<PromptTemplate> => {
  const { data } = await axiosClient.post<PromptTemplate>("/api/ai/prompts", prompt);
  return data;
};

export const updatePrompt = async (id: string, changes: Partial<PromptTemplate>): Promise<PromptTemplate> => {
  const { data } = await axiosClient.put<PromptTemplate>(`/api/ai/prompts/${id}`, changes);
  return data;
};

export const deletePrompt = async (id: string): Promise<void> => {
  await axiosClient.delete(`/api/ai/prompts/${id}`);
};

export const usePromptById = async (id: string): Promise<PromptTemplate> => {
  const { data } = await axiosClient.post<PromptTemplate>(`/api/ai/prompts/${id}/use`);
  return data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await axiosClient.get<Conversation[]>("/api/ai/conversations");
  return data;
};

export const createConversation = async (firstMessage: string): Promise<Conversation> => {
  const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
  const { data } = await axiosClient.post<Conversation>("/api/ai/conversations", {
    firstMessage,
    title: title || "New conversation",
  });
  return data;
};

export const addMessageToConversation = async (
  convId: string,
  message: ConversationMessage,
): Promise<ConversationMessage> => {
  const { data } = await axiosClient.post<ConversationMessage>(`/api/ai/conversations/${convId}/messages`, message);
  return data;
};

export const deleteConversation = async (id: string): Promise<void> => {
  await axiosClient.delete(`/api/ai/conversations/${id}`);
};

export const sendContextualMessage = async (
  convId: string,
  userMessage: string,
  conversationHistory: ConversationMessage[],
): Promise<string> => {
  const { data } = await axiosClient.post<{ response: string }>(`/api/ai/conversations/${convId}/respond`, {
    userMessage,
    conversationHistory,
  });
  return data.response;
};
