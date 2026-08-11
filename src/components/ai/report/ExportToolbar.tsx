import { Box, Button, Tooltip, Snackbar, Alert } from "@mui/material";
import {
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Refresh as RegenerateIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { useState } from "react";
import type { GeneratedReport } from "../../../types/aiWorkflow";

interface ExportToolbarProps {
  report: GeneratedReport;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const reportToText = (report: GeneratedReport): string => {
  const lines = [
    `${"=".repeat(60)}`,
    report.title.toUpperCase(),
    `Generated: ${report.generatedAt}`,
    `${"=".repeat(60)}`,
    "",
  ];
  report.sections.forEach((s, i) => {
    lines.push(`${i + 1}. ${s.title.toUpperCase()}`);
    lines.push("-".repeat(40));
    // Strip markdown bold
    lines.push(s.content.replace(/\*\*(.*?)\*\*/g, "$1"));
    lines.push("");
  });
  return lines.join("\n");
};

export default function ExportToolbar({ report, onRegenerate, isRegenerating }: ExportToolbarProps) {
  const [snack, setSnack] = useState<{ open: boolean; msg: string }>({ open: false, msg: "" });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportToText(report));
    setSnack({ open: true, msg: "Report copied to clipboard!" });
  };

  const handleDownload = () => {
    const text = reportToText(report);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSnack({ open: true, msg: "Report downloaded!" });
  };

  const handlePrint = () => {
    const text = reportToText(report);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`<pre style="font-family:monospace;padding:2rem;">${text}</pre>`);
      win.document.close();
      win.print();
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RegenerateIcon />}
          onClick={onRegenerate}
          disabled={isRegenerating}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          {isRegenerating ? "Regenerating…" : "Regenerate"}
        </Button>
        <Tooltip title="Copy report as text">
          <Button
            variant="outlined"
            size="small"
            startIcon={<CopyIcon />}
            onClick={handleCopy}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Copy
          </Button>
        </Tooltip>
        <Tooltip title="Download as .txt file">
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            }}
          >
            Download
          </Button>
        </Tooltip>
        <Tooltip title="Print report">
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Print
          </Button>
        </Tooltip>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ open: false, msg: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
