import { useState } from "react";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Skeleton,
  Typography,
} from "@mui/material";

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  render?: (row: T) => ReactNode;
}

interface AppDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  totalCount?: number;
  emptyMessage?: string;
  darkMode?: boolean;
  clientPagination?: boolean;
}

export default function AppDataTable<T>({
  columns,
  data,
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
  emptyMessage = "No data found",
  darkMode = false,
  clientPagination = false,
}: AppDataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);

  const handlePageChange = (event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(event, newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(event);
    } else {
      setInternalRowsPerPage(+event.target.value);
      setInternalPage(0);
    }
  };

  const currentPage = onPageChange ? page : internalPage;
  const currentRowsPerPage = onRowsPerPageChange ? rowsPerPage : internalRowsPerPage;

  const displayData = clientPagination
    ? data.slice(currentPage * currentRowsPerPage, currentPage * currentRowsPerPage + currentRowsPerPage)
    : data;

  const rowCount = totalCount !== undefined ? totalCount : data.length;

  const tableHeaderStyle = {
    bgcolor: darkMode ? "#1e1e1e" : "#f5f7fc",
    color: darkMode ? "#ccc" : "#666",
    fontWeight: 600,
    borderBottom: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
  };

  const tableCellStyle = {
    color: darkMode ? "#fff" : "inherit",
    borderBottom: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: darkMode ? "#141414" : "white",
        borderRadius: 2,
        border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={tableHeaderStyle}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(currentRowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} sx={tableCellStyle}>
                      <Skeleton
                        animation="wave"
                        variant="text"
                        sx={{ bgcolor: darkMode ? "#333" : "auto" }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ ...tableCellStyle, py: 8 }}>
                  <Typography variant="body1" sx={{ color: darkMode ? "#999" : "text.secondary" }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row, rowIndex) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof T];
                    return (
                      <TableCell key={String(column.id)} align={column.align} sx={tableCellStyle}>
                        {column.render ? column.render(row) : (value as ReactNode)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rowCount}
        rowsPerPage={currentRowsPerPage}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sx={{
          color: darkMode ? "#fff" : "inherit",
          borderTop: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
          ".MuiTablePagination-selectIcon": {
            color: darkMode ? "#fff" : "inherit",
          },
        }}
      />
    </Paper>
  );
}
