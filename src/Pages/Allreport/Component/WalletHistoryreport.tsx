import React, { useState } from "react";
import { Form, Col, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getWallet } from "../../../api/transaction/getWallet";
import './historyreport.css'
import { useTheme } from "../../../context/ThemeContext";

interface Filters {
  fromDate: string;
  toDate: string;
}

interface WalletTransaction {
  id: number;
  userId: number;
  mt5AccountId: string;
  to: string;
  amount: number;
  note: string | null;
  comment: string | null;
  createdAt: string;
  creator: {
    name: string;
    email: string;
  };
}

type SortConfig = {
  key: keyof WalletTransaction | 'nameemail' | null;
  direction: "asc" | "desc" | null;
};

const WalletHistoryreport = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  // Fetch wallet transactions using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: getWallet,
  });

  const transactions = data?.transactions || [];

  // Sorting function
  const requestSort = (key: keyof WalletTransaction | 'nameemail') => {
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

  const getSortIcon = (columnKey: keyof WalletTransaction | 'nameemail') => {
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
  const filteredAndSortedTransactions = (() => {
    let filteredData = [...transactions];

    // Apply filters
    filteredData = filteredData.filter(transaction => {
      const matchesSearch = 
        transaction.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.creator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.mt5AccountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toString().includes(searchQuery.toLowerCase()) ||
        transaction.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.note && transaction.note.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFromDate = !filters.fromDate || new Date(transaction.createdAt) >= new Date(filters.fromDate);
      const matchesToDate = !filters.toDate || new Date(transaction.createdAt) <= new Date(filters.toDate);

      return matchesSearch && matchesFromDate && matchesToDate;
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case 'nameemail':
            aValue = `${a.creator.name}/${a.creator.email}`.toLowerCase();
            bValue = `${b.creator.name}/${b.creator.email}`.toLowerCase();
            break;
          case 'creator':
            aValue = a.creator.name.toLowerCase();
            bValue = b.creator.name.toLowerCase();
            break;
          default:
            aValue = a[sortConfig.key as keyof WalletTransaction];
            bValue = b[sortConfig.key as keyof WalletTransaction];
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

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(indexOfFirstEntry, indexOfLastEntry);

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
      "Account ID", 
      "To",
      "Amount",
      "Note",
      "Date"
    ];
    csvRows.push(headers.join(","));

    currentTransactions.forEach((transaction) => {
      const row = [
        transaction.id,
        `"${transaction.creator.name}/${transaction.creator.email}"`,
        transaction.mt5AccountId,
        transaction.to,
        transaction.amount,
        transaction.note ? `"${transaction.note}"` : "",
        `"${formatDateForCSV(transaction.createdAt)}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "wallet_history_report.csv");
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
          <title>Wallet History Report - Print</title>
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
          <h1>Wallet History Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Name / Email</th>
                      <th>Account ID</th>
                      <th>To</th>
                      <th>Amount</th>
                      <th>Note</th>
                      <th>Date</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentTransactions.map((transaction, index) => `
                      <tr>
                          <td>${index + 1}</td>
                          <td>${transaction.creator.name}/${transaction.creator.email}</td>
                          <td>${transaction.mt5AccountId}</td>
                          <td>${transaction.to}</td>
                          <td>${transaction.amount}</td>
                          <td>${transaction.note || "-"}</td>
                          <td>${new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                          })}</td>
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
    return <div className="news-wrapper">Loading wallet transactions...</div>;
  }

  if (error) {
    return <div className="news-wrapper">Error loading wallet transactions: {error.message}</div>;
  }

  // Define table columns with sorting
  const columns = [
    { key: "id", label: "#" },
    { key: "nameemail", label: "Name / Email" },
    { key: "mt5AccountId", label: "Account ID" },
    { key: "to", label: "To" },
    { key: "amount", label: "Amount" },
    { key: "note", label: "Note" },
    { key: "createdAt", label: "Date" },
  ];

  return (
    <div className={`news-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
      <div className="user-list-main">
        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: 'column', marginBottom: "20px" }}>
          <h1 className="fw-bold">Wallet History Report</h1>
          <div className="flex w-full">
            <Row className="mb-3">
              {/* From Date Picker */}
              <Col md={6}>
                <Form.Group controlId="fromDate" className="mb-3">
                  <label className="text-sm font-semibold">From</label>
                  <input 
                    type="date" 
                    name="fromDate" 
                    value={filters.fromDate} 
                    onChange={handleChange} 
                    className={`border rounded-md p-2 ${
                      theme === "dark"
                        ? "bg-dark text-light dark-placeholder date-input-dark"
                        : "bg-white"
                    }`}
                  />
                </Form.Group>
              </Col>

              {/* To Date Picker */}
              <Col md={6}>
                <Form.Group controlId="toDate" className="mb-3">
                  <label className="text-sm font-semibold">To</label>
                  <input 
                    type="date" 
                    name="toDate" 
                    value={filters.toDate} 
                    onChange={handleChange} 
                    className={`border rounded-md p-2 ${
                      theme === "dark"
                        ? "bg-dark text-light dark-placeholder date-input-dark"
                        : "bg-white"
                    }`} 
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
          <div className="search-section">
            <Form.Group as={Col} md="3" controlId="validationCustom04">
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
              <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`} style={{ minWidth: "180px", width: "220px" }}>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      onClick={() => requestSort(column.key as keyof WalletTransaction | 'nameemail')}
                      style={{ cursor: "pointer", minWidth: "150px" }}
                    >
                      {column.label}
                      <span style={{ marginLeft: "8px" }}>
                        {getSortIcon(column.key as keyof WalletTransaction | 'nameemail')}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((transaction, index) => (
                    <tr key={transaction.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{indexOfFirstEntry + index + 1}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.creator.name}/{transaction.creator.email}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.mt5AccountId}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.to}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.amount}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.note || "-"}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
                      No wallet transactions found
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
                {Math.min(indexOfLastEntry, filteredAndSortedTransactions.length)} of{" "}
                {filteredAndSortedTransactions.length} entries
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
  );
};

export default WalletHistoryreport;