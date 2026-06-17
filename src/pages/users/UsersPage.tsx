import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, IconButton, Stack, TextField, Avatar } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AppDataTable from "../../components/table/AppDataTable";
import type { Column } from "../../components/table/AppDataTable";
import AppModal from "../../components/common/AppModal";
import SearchToolbar from "../../components/common/SearchToolbar";
import FilterDropdown from "../../components/common/FilterDropdown";
import StatusChip from "../../components/common/StatusChip";
import { userService } from "../../services/userService";
import type { User } from "../../types";
import { useTheme } from "@mui/material/styles";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"),
  password: yup.string().required("Password is required"),
  status: yup.string().required("Status is required"),
});

type UserFormData = yup.InferType<typeof schema>;

// Helper for avatar initials
function getInitials(name: string) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export default function UsersPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", role: "Viewer", password: "", status: "Active" }
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      reset({
        name: user.name || "",
        email: user.email,
        role: user.role || "Viewer",
        password: user.password || "",
        status: user.status || "Active",
      });
    } else {
      setSelectedUser(null);
      reset({ name: "", email: "", role: "Viewer", password: "", status: "Active" });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const generateUserId = () => `USR-${Math.floor(1000 + Math.random() * 9000)}`;

  const onSubmit = async (data: UserFormData) => {
    try {
      if (selectedUser && selectedUser.id) {
        await userService.updateUser(selectedUser.id, data);
      } else {
        const newUser = {
          ...data,
          id: generateUserId(),
          lastLogin: "Never",
        };
        await userService.createUser(newUser);
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const confirmDelete = async () => {
    if (selectedUser && selectedUser.id) {
      try {
        await userService.deleteUser(selectedUser.id);
        setDeleteModalOpen(false);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = u.name || "";
      const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter ? u.role === roleFilter : true;
      const matchStatus = statusFilter ? u.status === statusFilter : true;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const columns: Column<User>[] = [
    {
      id: "name",
      label: "Name",
      render: (u) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.875rem" }}>
            {getInitials(u.name || "")}
          </Avatar>
          <Typography variant="body2">{u.name}</Typography>
        </Stack>
      )
    },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
    { id: "status", label: "Status", render: (u) => <StatusChip status={u.status || "Unknown"} /> },
    { id: "lastLogin", label: "Last Login" },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (u) => (
        <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
          <IconButton size="small" color="primary" onClick={() => handleOpenModal(u)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => { setSelectedUser(u); setDeleteModalOpen(true); }}><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Users Management</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Create User
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <SearchToolbar value={search} onChange={setSearch} placeholder="Search by name or email..." darkMode={darkMode} />
        <FilterDropdown
          label="Role" value={roleFilter} onChange={setRoleFilter} darkMode={darkMode}
          options={[{ label: "Admin", value: "Admin" }, { label: "Analyst", value: "Analyst" }, { label: "Viewer", value: "Viewer" }]}
        />
        <FilterDropdown
          label="Status" value={statusFilter} onChange={setStatusFilter} darkMode={darkMode}
          options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]}
        />
      </Box>

      <AppDataTable columns={columns} data={filteredUsers} loading={loading} clientPagination darkMode={darkMode} />

      <AppModal
        open={modalOpen} onClose={handleCloseModal} title={selectedUser ? "Edit User" : "Create User"} darkMode={darkMode}
        actions={<><Button onClick={handleCloseModal}>Cancel</Button><Button variant="contained" onClick={handleSubmit(onSubmit)}>Save</Button></>}
      >
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Controller name="name" control={control} render={({ field }) => <TextField {...field} label="Name" error={!!errors.name} helperText={errors.name?.message} fullWidth size="small" />} />
          <Controller name="email" control={control} render={({ field }) => <TextField {...field} label="Email" type="email" error={!!errors.email} helperText={errors.email?.message} fullWidth size="small" />} />
          <Controller name="role" control={control} render={({ field }) => <TextField {...field} label="Role" error={!!errors.role} helperText={errors.role?.message} fullWidth size="small" />} />
          <Controller name="password" control={control} render={({ field }) => <TextField {...field} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message} fullWidth size="small" />} />
          <Controller name="status" control={control} render={({ field }) => <TextField {...field} label="Status" error={!!errors.status} helperText={errors.status?.message} fullWidth size="small" />} />
        </Box>
      </AppModal>

      <AppModal
        open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete" darkMode={darkMode}
        actions={<><Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button></>}
      >
        <Typography>Are you sure you want to delete this user?</Typography>
      </AppModal>
    </Box>
  );
}
