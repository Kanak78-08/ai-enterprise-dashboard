import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box, Typography, Tabs, Tab, useTheme, Paper,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Assessment as ReportIcon,
  Email as EmailIcon,
  AutoFixHigh as AutofillIcon,
  NotificationsActive as NotifIcon,
  LibraryBooks as PromptIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import ChatWindow from "../../components/ai/ChatWindow";
import AIReportGenerator from "../../components/ai/report/AIReportGenerator";
import AIFormAssistant from "../../components/ai/AIFormAssistant";
import AIEmailComposer from "../../components/ai/AIEmailComposer";
import AINotificationGenerator from "../../components/ai/AINotificationCard";
import PromptLibrary from "../../components/ai/PromptLibrary";
import ConversationHistory from "../../components/ai/ConversationHistory";

interface TabConfig {
  label: string;
  icon: React.ElementType;
  component: React.ReactNode;
  badge?: string;
}

export default function AiAssistantPage() {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialTab = parseInt(searchParams.get("tab") || "0", 10);
  const [activeTab, setActiveTab] = useState(isNaN(initialTab) ? 0 : initialTab);

  useEffect(() => {
    const tabFromUrl = parseInt(searchParams.get("tab") || "0", 10);
    if (!isNaN(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchParams({ tab: newValue.toString() });
  };


  const tabs: TabConfig[] = [
    { label: "Chat", icon: ChatIcon, component: <ChatWindow /> },
    { label: "Report Generator", icon: ReportIcon, component: <AIReportGenerator />, badge: "AI" },
    { label: "Form Autofill", icon: AutofillIcon, component: <AIFormAssistant />, badge: "AI" },
    { label: "Email Assistant", icon: EmailIcon, component: <AIEmailComposer />, badge: "AI" },
    { label: "Notifications", icon: NotifIcon, component: <AINotificationGenerator />, badge: "AI" },
    { label: "Prompt Library", icon: PromptIcon, component: <PromptLibrary /> },
    { label: "AI History", icon: HistoryIcon, component: <ConversationHistory /> },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
          <Box
            sx={{
              width: 44, height: 44, borderRadius: 2,
              background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(88,68,255,0.3)",
            }}
          >
            <ChatIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              AI Assistant
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              AI-powered productivity tools — reports, emails, autofill, notifications & more
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "12px 12px 0 0",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 1,
            "& .MuiTabs-indicator": {
              background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 52,
              color: "text.secondary",
              "&.Mui-selected": { color: "#5844FF", fontWeight: 700 },
            },
          }}
        >
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.label}
                id={`ai-tab-${i}`}
                aria-controls={`ai-tabpanel-${i}`}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Icon sx={{ fontSize: 18 }} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <Box sx={{
                        px: 0.75, py: 0.1,
                        borderRadius: 1,
                        background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
                        color: "white",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        lineHeight: 1.5,
                      }}>
                        {tab.badge}
                      </Box>
                    )}
                  </Box>
                }
              />
            );
          })}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          overflow: "auto",
          p: { xs: 2, md: 3 },
        }}
      >
        {tabs.map((tab, i) => (
          <Box
            key={tab.label}
            role="tabpanel"
            id={`ai-tabpanel-${i}`}
            aria-labelledby={`ai-tab-${i}`}
            hidden={activeTab !== i}
            sx={{
              height: activeTab === 0 || activeTab === 6 ? "100%" : "auto",
            }}
          >
            {activeTab === i && tab.component}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
