import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Form, Col, Row, Modal, Button } from "react-bootstrap";
import Viewticket from "./Component/Viewticket";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../../api/ticket/tickets";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicket } from "../../api/ticket/deleteTicket";
import { toast } from "react-hot-toast";
import './tickets.css';
import { useTheme } from "../../context/ThemeContext";

interface Filters {
  status: string;
  paymentMethod: string;
  fromDate: string;
  toDate: string;
}

type SortableKey = keyof Ticket | "userName";

interface SortConfig {
  key: SortableKey | null;
  direction: "asc" | "desc" | null;
}

interface Ticket {
  id: number;
  userId: number;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  title: string;
  description: string;
  status: "Open" | "Closed";
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
}

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmationModalProps) => 

{
  const { theme } = useTheme();
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={`${theme === "dark" ? "bg-dark text-light" : ""}`}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${theme === "dark" ? "bg-dark text-light" : ""}`}>{message}</Modal.Body>
      <Modal.Footer className={`${theme === "dark" ? "bg-dark text-light" : ""}`}>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


const Tickets = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    paymentMethod: "",
    fromDate: "",
    toDate: "",
  });

  // Inside your Tickets component (before the return statement):
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      // Invalidate and refetch tickets query after successful deletion
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // You might want to add a toast notification here
      toast.success("Ticket deleted successfully");
    },
    onError: () => {
      // Handle error (show toast, etc.)
      toast.error("Error deleting ticket");
    },
  });

  const handleDeleteClick = (ticketId: number) => {
    setTicketToDelete(ticketId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (ticketToDelete) {
      deleteMutation.mutate({ id: ticketToDelete });
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTicketToDelete(null);
  };

  const {
    data: ticketsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
    staleTime: 5 * 60 * 1000,
  });

  const tickets = ticketsResponse?.data || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Then update your functions:
  const requestSort = (key: SortableKey) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: SortableKey) => {
    if (sortConfig.key !== columnKey) {
      return <i className="fa-solid fa-arrows-up-down" />;
    }

    if (sortConfig.direction === "asc") {
      return <i className="fa-solid fa-arrow-up" />;
    }

    if (sortConfig.direction === "desc") {
      return <i className="fa-solid fa-arrow-down" />;
    }

    return <i className="fa-solid fa-arrows-up-down" />;
  };

  const sortedAndFilteredTickets = (() => {
    let filteredData = [...tickets];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((ticket) =>
        Object.values({
          ...ticket,
          userName: ticket.user.name,
        })
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredData = filteredData.filter((ticket) =>
        ticket.status.toLowerCase().includes(filters.status.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        // Handle nested user.name property
        const aValue =
          sortConfig.key === "userName"
            ? a.user.name
            : a[sortConfig.key as keyof Ticket];
        const bValue =
          sortConfig.key === "userName"
            ? b.user.name
            : b[sortConfig.key as keyof Ticket];

        if (typeof aValue === "string" && typeof bValue === "string") {
          // Handle dates
          if (!isNaN(Date.parse(aValue))) {
            return sortConfig.direction === "asc"
              ? new Date(aValue).getTime() - new Date(bValue).getTime()
              : new Date(bValue).getTime() - new Date(aValue).getTime();
          }

          // Handle regular strings
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return filteredData;
  })();

  const totalPages = Math.ceil(
    sortedAndFilteredTickets.length / entriesPerPage
  );
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentTickets = sortedAndFilteredTickets.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: { key: SortableKey; label: string }[] = [
    { key: "id", label: "Id" },
    { key: "userName", label: "Name" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
  ];

  if (isLoading) {
    return (
      <div className="news-wrapper">
        <div className="user-list-main">
          <h1 className="fw-bold">Ticket List</h1>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="news-wrapper">
        <div className="user-list-main">
          <h1 className="fw-bold">Ticket List</h1>
          <div className="error">Error loading tickets</div>
        </div>
      </div>
    );
  }

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "User Name",
      "Title",
      "Category",
      "Priority",
      "Status",
      "Created At",
      "Updated At",
    ];
    csvRows.push(headers.join(","));

    tickets.forEach((ticket) => {
      const row = [
        ticket.id,
        `"${ticket.user.name}"`,
        `"${ticket.title}"`,
        ticket.category,
        ticket.priority,
        ticket.status,
        `"${formatDateForCSV(ticket.createdAt)}"`,
        `"${formatDateForCSV(ticket.updatedAt)}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "tickets.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDateForCSV = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ticket List - Print</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                h1 {
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 30px;
                    font-size: 24px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    font-size: 12px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                    color: #495057;
                }
                tbody tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                tbody tr:hover {
                    background-color: #e9ecef;
                }
                .priority-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .priority-critical {
                    background-color: #f8d7da;
                    color: #721c24;
                }
                .priority-high {
                    background-color: #fff3cd;
                    color: #856404;
                }
                .priority-medium {
                    background-color: #cce5ff;
                    color: #004085;
                }
                .priority-low {
                    background-color: #d4edda;
                    color: #155724;
                }
                .status-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .status-open {
                    background-color: #d4edda;
                    color: #155724;
                }
                .status-closed {
                    background-color: #f8d7da;
                    color: #721c24;
                }
                .print-info {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: #6c757d;
                }
                @media print {
                    body { margin: 0; }
                    .print-info { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Ticket List Report</h1>
            <div class="print-info">
                Generated on: ${new Date().toLocaleString()}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentTickets
                      .map(
                        (ticket) => `
                        <tr>
                            <td>${ticket.id}</td>
                            <td>${ticket.user.name}</td>
                            <td>${ticket.title}</td>
                            <td>${ticket.category}</td>
                            <td>
                                <span class="priority-badge priority-${ticket.priority.toLowerCase()}">
                                    ${ticket.priority}
                                </span>
                            </td>
                            <td>
                                <span class="status-badge status-${ticket.status.toLowerCase()}">
                                    ${ticket.status}
                                </span>
                            </td>
                            <td>${new Date(ticket.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}</td>
                            <td>${new Date(ticket.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
      `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className="ticket-container">
      <div className={`news-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
        <div className="user-list-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              marginBottom: "20px",
            }}
          >
            <h1 className="fw-bold">Ticket List</h1>
            <div className="flex w-full">
              <Form.Group as={Col} md="3" controlId="statusFilter">
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}
                >
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className={`userlist-container ${theme === "dark" ? "bg-dark" : ""}`}>
            <div className="search-section">
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  required
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`${theme === "dark" ? "bg-black text-light dark-placeholder" : "bg-white"}`}
                />
                <Form.Control.Feedback type="invalid">
                  search...
                </Form.Control.Feedback>
              </Form.Group>
              <div className="user-list-btn">
                <button onClick={exportToCSV}>
                  <i className="fa-solid fa-file-csv"></i> CSV
                </button>
                <button onClick={handlePrint}>
                  <i className="fa-solid fa-print"></i> PRINT
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="table caption-top table-hover">
                <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        onClick={() => requestSort(column.key as keyof Ticket)}
                        style={{ cursor: "pointer", minWidth: "180px" }}
                      >
                        {column.label}
                        <span style={{ marginLeft: "8px" }}>
                          {getSortIcon(column.key)}
                        </span>
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.length > 0 ? (
                    currentTickets.map((ticket) => (
                      <tr key={ticket.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{ticket.id}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{ticket.user.name}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{ticket.title}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{ticket.category}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          <span
                            className={`badge bg-${
                              ticket.priority === "Critical"
                                ? "danger"
                                : ticket.priority === "High"
                                ? "warning"
                                : ticket.priority === "Medium"
                                ? "info"
                                : "secondary"
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          <span
                            className={`badge bg-${
                              ticket.status === "Open"
                                ? "success"
                                : ticket.status === "Closed"
                                ? "danger"
                                : ticket.status === "In Progress"
                                ? "warning"
                                : "info"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{formatDate(ticket.createdAt)}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{formatDate(ticket.updatedAt)}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <FontAwesomeIcon
                              icon={faEye}
                              onClick={() =>
                                navigate(`/viewticket/${ticket.id}`, {
                                  state: { ticket },
                                })
                              }
                              style={{ cursor: "pointer" }}
                            />
                            {/* Only show close icon if ticket status is not "Closed" */}
                            {ticket.status !== "Closed" && (
                              <FontAwesomeIcon
                                icon={faXmark}
                                onClick={() => handleDeleteClick(ticket.id)}
                                style={{
                                  color: "#f31212",
                                  marginLeft: "10px",
                                  cursor: "pointer",
                                  fontSize: "20px",
                                }}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 1} className={`text-center ${theme === "dark" ? "dark-mode-td" : ""}`}>
                        No tickets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-container">
              <div className="table-bottom-content">
                <span>
                  Showing {indexOfFirstEntry + 1} to{" "}
                  {Math.min(indexOfLastEntry, sortedAndFilteredTickets.length)}{" "}
                  of {sortedAndFilteredTickets.length} entries
                </span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[5, 10, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pagination-controls">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ❮
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={currentPage === index + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showDeleteModal}
          onHide={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Close Ticket"
          message="Are you sure you want to close this ticket? This action cannot be undone."
          confirmText="Close"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default Tickets;