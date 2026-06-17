import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, IconButton, Stack, TextField } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AppDataTable from "../../components/table/AppDataTable";
import type { Column } from "../../components/table/AppDataTable";
import AppModal from "../../components/common/AppModal";
import SearchToolbar from "../../components/common/SearchToolbar";
import FilterDropdown from "../../components/common/FilterDropdown";
import StatusChip from "../../components/common/StatusChip";
import { reportService } from "../../services/reportService";
import type { Report } from "../../types";
import { useTheme } from "@mui/material/styles";

const schema = yup.object({
  name: yup.string().required("Report Name is required"),
  category: yup.string().required("Category is required"),
  priority: yup.string().required("Priority is required"),
  status: yup.string().required("Status is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
  description: yup.string().default(""),
});

type ReportFormData = yup.InferType<typeof schema>;

export default function ReportsPage() {
  const theme = useTheme();
  // We'll pass darkMode as false or check from theme later, but the layout is already handling app background.
  const darkMode = theme.palette.mode === "dark";

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ReportFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "", category: "", priority: "", status: "Pending", startDate: "", endDate: "", description: ""
    }
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleOpenModal = (report?: Report) => {
    if (report) {
      setSelectedReport(report);
      reset({
        name: report.name,
        category: report.category,
        priority: report.priority,
        status: report.status,
        startDate: report.startDate || "",
        endDate: report.endDate || "",
        description: report.description || "",
      });
    } else {
      setSelectedReport(null);
      reset({ name: "", category: "", priority: "", status: "Pending", startDate: "", endDate: "", description: "" });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const generateReportId = () => `REP-${Math.floor(1000 + Math.random() * 9000)}`;

  const onSubmit = async (data: ReportFormData) => {
    try {
      if (selectedReport) {
        await reportService.updateReport(selectedReport.id, data);
      } else {
        const newReport = {
          ...data,
          id: generateReportId(),
          createdBy: "Current User",
          createdDate: new Date().toISOString().split("T")[0],
        };
        await reportService.createReport(newReport);
      }
      handleCloseModal();
      fetchReports();
    } catch (error) {
      console.error("Failed to save report", error);
    }
  };

  const confirmDelete = async () => {
    if (selectedReport) {
      try {
        await reportService.deleteReport(selectedReport.id);
        setDeleteModalOpen(false);
        fetchReports();
      } catch (error) {
        console.error("Failed to delete report", error);
      }
    }
  };

  // Filtering
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? r.status === statusFilter : true;
      const matchCategory = categoryFilter ? r.category === categoryFilter : true;
      const matchStart = dateRange.start ? r.startDate && r.startDate >= dateRange.start : true;
      const matchEnd = dateRange.end ? r.endDate && r.endDate <= dateRange.end : true;
      return matchSearch && matchStatus && matchCategory && matchStart && matchEnd;
    });
  }, [reports, search, statusFilter, categoryFilter, dateRange]);

  const columns: Column<Report>[] = [
    { id: "id", label: "Report ID" },
    { id: "name", label: "Name" },
    { id: "category", label: "Category" },
    { id: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
    { id: "priority", label: "Priority" },
    { id: "createdBy", label: "Created By" },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (r) => (
        <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
          <IconButton size="small" color="info"><ViewIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="primary" onClick={() => handleOpenModal(r)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => { setSelectedReport(r); setDeleteModalOpen(true); }}><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Reports Management</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Create Report
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <SearchToolbar value={search} onChange={setSearch} placeholder="Search by name or ID..." darkMode={darkMode} />
        <FilterDropdown
          label="Status" value={statusFilter} onChange={setStatusFilter} darkMode={darkMode}
          options={[{ label: "Completed", value: "Completed" }, { label: "Pending", value: "Pending" }, { label: "Failed", value: "Failed" }]}
        />
        <FilterDropdown
          label="Category" value={categoryFilter} onChange={setCategoryFilter} darkMode={darkMode}
          options={[{ label: "Operations", value: "Operations" }, { label: "Analytics", value: "Analytics" }, { label: "Maintenance", value: "Maintenance" }, { label: "Sales", value: "Sales" }]}
        />
        <TextField
          type="date" size="small" value={dateRange.start} onChange={(e) => setDateRange(p => ({ ...p, start: e.target.value }))}
          slotProps={{ inputLabel: { shrink: true } }} label="Start Date"
        />
        <TextField
          type="date" size="small" value={dateRange.end} onChange={(e) => setDateRange(p => ({ ...p, end: e.target.value }))}
          slotProps={{ inputLabel: { shrink: true } }} label="End Date"
        />
      </Box>

      <AppDataTable
        columns={columns}
        data={filteredReports}
        loading={loading}
        clientPagination
        darkMode={darkMode}
      />

      {/* Create / Edit Modal */}
      <AppModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={selectedReport ? "Edit Report" : "Create Report"}
        darkMode={darkMode}
        actions={
          <>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit as any)}>Save</Button>
          </>
        }
      >
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Controller name="name" control={control} render={({ field }) => <TextField {...field} label="Report Name" error={!!errors.name} helperText={errors.name?.message} fullWidth size="small" />} />
          <Controller name="category" control={control} render={({ field }) => <TextField {...field} label="Category" error={!!errors.category} helperText={errors.category?.message} fullWidth size="small" />} />
          <Controller name="priority" control={control} render={({ field }) => <TextField {...field} label="Priority" error={!!errors.priority} helperText={errors.priority?.message} fullWidth size="small" />} />
          <Controller name="status" control={control} render={({ field }) => <TextField {...field} label="Status" error={!!errors.status} helperText={errors.status?.message} fullWidth size="small" />} />
          <Controller name="startDate" control={control} render={({ field }) => <TextField {...field} type="date" label="Start Date" slotProps={{ inputLabel: { shrink: true } }} error={!!errors.startDate} helperText={errors.startDate?.message} fullWidth size="small" />} />
          <Controller name="endDate" control={control} render={({ field }) => <TextField {...field} type="date" label="End Date" slotProps={{ inputLabel: { shrink: true } }} error={!!errors.endDate} helperText={errors.endDate?.message} fullWidth size="small" />} />
          <Controller name="description" control={control} render={({ field }) => <TextField {...field} label="Description" multiline rows={3} fullWidth size="small" />} />
        </Box>
      </AppModal>

      {/* Delete Confirmation Modal */}
      <AppModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        darkMode={darkMode}
        actions={
          <>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <Typography>Are you sure you want to delete this report?</Typography>
      </AppModal>
    </Box>
  );
}
