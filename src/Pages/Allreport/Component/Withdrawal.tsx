import React, { useState } from "react";
import { Form, Col, Modal } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getWithdrawal } from "../../../api/client/getWithdrawal";
import './historyreport.css'
import { useTheme } from "../../../context/ThemeContext";

interface Filters {
  status: string;
  paymentMethod: string;
  fromDate: string;
  toDate: string;
}

interface Withdrawal {
  id: number;
  recipient: {
    name: string;
    email: string;
  };
  accountId: string;
  amount: number;
  bankAccount: string;
  type: string;
  note: string;
  comment: string;
  status: string;
  createdAt: string;
  creator?: {
    name: string;
  };
}

type SortConfig = {
  key: keyof Withdrawal | 'nameemail' | 'app_rej' | null;
  direction: "asc" | "desc" | null;
};

const Withdrawal = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    status: "",
    paymentMethod: "",
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  // Fetch withdrawals using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: getWithdrawal,
  });

  const withdrawals = data?.withdrawals || [];

  // Sorting function
  const requestSort = (key: keyof Withdrawal | 'nameemail' | 'app_rej') => {
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

  const getSortIcon = (columnKey: keyof Withdrawal | 'nameemail' | 'app_rej') => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Transform and filter data
  const filteredAndSortedWithdrawals = (() => {
    let filteredData = [...withdrawals];

    // Apply filters
    filteredData = filteredData.filter(withdrawal => {
      const matchesSearch = 
        withdrawal.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        withdrawal.recipient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (withdrawal.accountId && withdrawal.accountId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        withdrawal.amount.toString().includes(searchQuery.toLowerCase()) ||
        (withdrawal.type && withdrawal.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (withdrawal.note && withdrawal.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
        withdrawal.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !filters.status || withdrawal.status === filters.status;
      const matchesPaymentMethod = !filters.paymentMethod || withdrawal.type === filters.paymentMethod;
      
      const matchesFromDate = !filters.fromDate || new Date(withdrawal.createdAt) >= new Date(filters.fromDate);
      const matchesToDate = !filters.toDate || new Date(withdrawal.createdAt) <= new Date(filters.toDate);

      return matchesSearch && matchesStatus && matchesPaymentMethod && matchesFromDate && matchesToDate;
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case 'nameemail':
            aValue = `${a.recipient.name}/${a.recipient.email}`.toLowerCase();
            bValue = `${b.recipient.name}/${b.recipient.email}`.toLowerCase();
            break;
          case 'app_rej':
            aValue = (a.creator?.name || 'Admin').toLowerCase();
            bValue = (b.creator?.name || 'Admin').toLowerCase();
            break;
          case 'recipient':
            aValue = a.recipient.name.toLowerCase();
            bValue = b.recipient.name.toLowerCase();
            break;
          default:
            aValue = a[sortConfig.key as keyof Withdrawal];
            bValue = b[sortConfig.key as keyof Withdrawal];
        }

        // Handle numbers
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Handle strings
        if (typeof aValue === "string" && typeof bValue === "string") {
          // Handle dates
          if (!isNaN(Date.parse(aValue)) && !isNaN(Date.parse(bValue))) {
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

  const totalPages = Math.ceil(filteredAndSortedWithdrawals.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentWithdrawals = filteredAndSortedWithdrawals.slice(indexOfFirstEntry, indexOfLastEntry);

  // Format date for CSV
  const formatDateForCSV = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "Name / Email",
      "M5 ID", 
      "Amount",
      "Withdraw To",
      "Payment Method",
      "Note",
      "Comment",
      "Status",
      "Date",
      "Approved / Rejected By",
    ];
    csvRows.push(headers.join(","));

    currentWithdrawals.forEach((withdrawal) => {
      const row = [
        withdrawal.id,
        `"${withdrawal.recipient.name}/${withdrawal.recipient.email}"`,
        withdrawal.accountId || "-",
        withdrawal.amount,
        withdrawal.bankAccount || "-",
        `"${withdrawal.type || '-'}"`,
        withdrawal.note ? `"${withdrawal.note}"` : "-",
        withdrawal.comment ? `"${withdrawal.comment}"` : "-",
        withdrawal.status,
        `"${formatDateForCSV(withdrawal.createdAt || new Date().toISOString())}"`,
        `"${withdrawal.creator?.name || 'Admin'}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "withdrawal_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Print functionality
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Withdrawal Report - Print</title>
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
              .status-badge {
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 10px;
                  font-weight: bold;
                  text-transform: uppercase;
              }
              .status-pending {
                  background-color: #fff3cd;
                  color: #856404;
              }
              .status-approved {
                  background-color: #d4edda;
                  color: #155724;
              }
              .status-rejected {
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
          <h1>Withdrawal Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Name / Email</th>
                      <th>M5 ID</th>
                      <th>Amount</th>
                      <th>Withdraw To</th>
                      <th>Payment Method</th>
                      <th>Note</th>
                      <th>Comment</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Approved / Rejected By</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentWithdrawals.map((withdrawal, index) => `
                      <tr>
                          <td>${index + 1}</td>
                          <td>${withdrawal.recipient.name}/${withdrawal.recipient.email}</td>
                          <td>${withdrawal.accountId || '-'}</td>
                          <td>$${withdrawal.amount.toFixed(2)}</td>
                          <td>${withdrawal.bankAccount || '-'}</td>
                          <td>${withdrawal.type || '-'}</td>
                          <td>${withdrawal.note || "-"}</td>
                          <td>${withdrawal.comment || "-"}</td>
                          <td>
                              <span class="status-badge status-${withdrawal.status}">
                                  ${withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                              </span>
                          </td>
                          <td>${new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                          })}</td>
                          <td>${withdrawal.creator?.name || 'Admin'}</td>
                      </tr>
                  `).join('')}
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

  if (isLoading) {
    return <div className="withdrawal-report-main1">Loading withdrawals...</div>;
  }

  if (error) {
    return <div className="withdrawal-report-main1">Error loading withdrawals: {error.message}</div>;
  }

  // Define table columns with sorting
  const columns = [
    { key: "id", label: "#" },
    { key: "nameemail", label: "Name / Email" },
    { key: "accountId", label: "M5 ID" },
    { key: "amount", label: "Amount" },
    { key: "bankAccount", label: "Withdraw To" },
    { key: "type", label: "Payment Method" },
    { key: "note", label: "Note" },
    { key: "comment", label: "Comment" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date" },
    { key: "app_rej", label: "Approved / Rejected By" },
  ];

  return (
    <div className="withdrawal-report-main1">
      <div className={`news-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
        <div className="user-list-main">
          <div style={{ display: "flex", justifyContent: "space-between", flexDirection: 'column', marginBottom: "20px" }}>
            <h1 className="fw-bold">Withdrawal Report</h1>
            <div className="flex gap-4" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Status Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Status</label>
                <select name="status" value={filters.status} onChange={handleChange} style={{ width: "250px" }} className={`status ${
                    theme === "dark"
                      ? "bg-dark text-light dark-placeholder"
                      : "bg-white"
                  }`}>
                  <option value="">Select...</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Payment Method Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={filters.paymentMethod}
                  onChange={handleChange}
                  className={`border rounded-md p-2 ${
                    theme === "dark"
                      ? "bg-dark text-light dark-placeholder"
                      : "bg-white"
                  }`}
                  style={{ width: "250px" }}
                >
                  <option value="">Select...</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                </select>
              </div>

              {/* Date Pickers */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold" style={{ width: "250px" }}>From</label>
                <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} className={`border rounded-md p-2 ${
                    theme === "dark"
                      ? "bg-dark text-light dark-placeholder date-input-dark"
                      : "bg-white"
                  }`} />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold" style={{ width: "250px" }}>To</label>
                <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} className={`border rounded-md p-2 ${
                    theme === "dark"
                      ? "bg-dark text-light dark-placeholder date-input-dark"
                      : "bg-white"
                  }`} />
              </div>
            </div>
          </div>

          <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
            <div className="search-section">
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label></Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`${theme === "dark" ? "bg-black text-light dark-placeholder" : "bg-white"}`}
                  required 
                />
                <Form.Control.Feedback type="invalid">search...</Form.Control.Feedback>
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
                        onClick={() => requestSort(column.key as keyof Withdrawal | 'nameemail' | 'app_rej')}
                        style={{ cursor: "pointer", minWidth: "180px", width: "220px" }}
                      >
                        {column.label}
                        <span style={{ marginLeft: "8px" }}>
                          {getSortIcon(column.key as keyof Withdrawal | 'nameemail' | 'app_rej')}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentWithdrawals.length > 0 ? (
                    currentWithdrawals.map((withdrawal, index) => (
                      <tr key={withdrawal.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{indexOfFirstEntry + index + 1}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.recipient.name}/{withdrawal.recipient.email}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.accountId || '-'}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>${withdrawal.amount.toFixed(2)}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.bankAccount || '-'}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.type || '-'}</td>
                        <td className={`text-truncate max-width-150 {theme === "dark" ? "dark-mode-td" : ""}`}>
                          {withdrawal.note || "-"}
                        </td>
                        <td className={`text-truncate max-width-150 {theme === "dark" ? "dark-mode-td" : ""}`}>
                          {withdrawal.comment || "-"}
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          <span
                            className={`badge ${
                              withdrawal.status === "pending"
                                ? "bg-warning"
                                : withdrawal.status === "approved"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {withdrawal.status.charAt(0).toUpperCase() +
                              withdrawal.status.slice(1)}
                          </span>
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                          })}
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.creator?.name || 'Admin'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
                        No withdrawals found
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
                  {Math.min(indexOfLastEntry, filteredAndSortedWithdrawals.length)} of{" "}
                  {filteredAndSortedWithdrawals.length} entries
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
                  disabled={currentPage === totalPages || totalPages === 0} 
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;