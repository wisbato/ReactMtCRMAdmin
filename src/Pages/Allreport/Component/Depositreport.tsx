import React, { useState } from "react";
import { Form, Col, Modal } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getDeposit } from "../../../api/deposit/getDeposit";
import "./historyreport.css";
import { useTheme } from "../../../context/ThemeContext";

interface Filters {
  status: string;
  paymentMethod: string;
  fromDate: string;
  toDate: string;
}

interface Deposit {
  id: number;
  recipient: {
    name: string;
    email: string;
  };
  accountId: string;
  amount: number;
  type: string;
  note: string;
  comment: string;
  status: string;
  depositProof: string;
  createdAt: string;
  creator?: {
    name: string;
  };
}

type SortConfig = {
  key: keyof Deposit | "nameemail" | "app_rej" | null;
  direction: "asc" | "desc" | null;
};

const Depositreport = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    status: "",
    paymentMethod: "",
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  // Fetch deposits using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["deposits"],
    queryFn: getDeposit,
  });

  const deposits = data?.deposits || [];

  // Sorting function
  const requestSort = (key: keyof Deposit | "nameemail" | "app_rej") => {
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

  const getSortIcon = (columnKey: keyof Deposit | "nameemail" | "app_rej") => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Transform and filter data
  const filteredAndSortedDeposits = (() => {
    let filteredData = [...deposits];

    // Apply filters
    filteredData = filteredData.filter((deposit) => {
      const matchesSearch =
        deposit.recipient.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        deposit.recipient.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        deposit.accountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deposit.amount.toString().includes(searchQuery.toLowerCase()) ||
        (deposit.type &&
          deposit.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (deposit.note &&
          deposit.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
        deposit.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        !filters.status || deposit.status === filters.status;
      const matchesPaymentMethod =
        !filters.paymentMethod || deposit.type === filters.paymentMethod;

      const matchesFromDate =
        !filters.fromDate ||
        new Date(deposit.createdAt) >= new Date(filters.fromDate);
      const matchesToDate =
        !filters.toDate ||
        new Date(deposit.createdAt) <= new Date(filters.toDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPaymentMethod &&
        matchesFromDate &&
        matchesToDate
      );
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case "nameemail":
            aValue = `${a.recipient.name}/${a.recipient.email}`.toLowerCase();
            bValue = `${b.recipient.name}/${b.recipient.email}`.toLowerCase();
            break;
          case "app_rej":
            aValue = (a.creator?.name || "Admin").toLowerCase();
            bValue = (b.creator?.name || "Admin").toLowerCase();
            break;
          case "recipient":
            aValue = a.recipient.name.toLowerCase();
            bValue = b.recipient.name.toLowerCase();
            break;
          default:
            aValue = a[sortConfig.key as keyof Deposit];
            bValue = b[sortConfig.key as keyof Deposit];
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

  const totalPages = Math.ceil(
    filteredAndSortedDeposits.length / entriesPerPage
  );
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentDeposits = filteredAndSortedDeposits.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  // Format date for CSV
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

  // Export to CSV functionality
  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "Name / Email",
      "M5 ID",
      "Amount",
      "Payment Method",
      "Note",
      "Comment",
      "Status",
      "Date",
      "Approved / Rejected By",
    ];
    csvRows.push(headers.join(","));

    currentDeposits.forEach((deposit) => {
      const row = [
        deposit.id,
        `"${deposit.recipient.name}/${deposit.recipient.email}"`,
        deposit.accountId,
        deposit.amount,
        `"${deposit.type || "Admin"}"`,
        deposit.note ? `"${deposit.note}"` : "-",
        deposit.comment ? `"${deposit.comment}"` : "-",
        deposit.status,
        `"${formatDateForCSV(deposit.createdAt || new Date().toISOString())}"`,
        `"${deposit.creator?.name || "Admin"}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "deposit_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Print functionality
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Deposit Report - Print</title>
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
          <h1>Deposit Report</h1>
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
                      <th>Payment Method</th>
                      <th>Note</th>
                      <th>Comment</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Approved / Rejected By</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentDeposits
                    .map(
                      (deposit, index) => `
                      <tr>
                          <td>${index + 1}</td>
                          <td>${deposit.recipient.name}/${
                        deposit.recipient.email
                      }</td>
                          <td>${deposit.accountId}</td>
                          <td>$${deposit.amount.toFixed(2)}</td>
                          <td>${deposit.type || "Admin"}</td>
                          <td>${deposit.note || "-"}</td>
                          <td>${deposit.comment || "-"}</td>
                          <td>
                              <span class="status-badge status-${
                                deposit.status
                              }">
                                  ${
                                    deposit.status.charAt(0).toUpperCase() +
                                    deposit.status.slice(1)
                                  }
                              </span>
                          </td>
                          <td>${new Date(deposit.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}</td>
                          <td>${deposit.creator?.name || "Admin"}</td>
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

  if (isLoading) {
    return <div className="loading">Loading deposits...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  // Define table columns with sorting
  const columns = [
    { key: "id", label: "#" },
    { key: "nameemail", label: "Name / Email" },
    { key: "accountId", label: "M5 ID" },
    { key: "amount", label: "Amount" },
    { key: "type", label: "Payment Method" },
    { key: "note", label: "Note" },
    { key: "comment", label: "Comment" },
    { key: "depositProof", label: "Deposit Proof" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date" },
    { key: "app_rej", label: "Approved / Rejected By" },
  ];

  return (
    <div className="depositreport-main1">
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
            <h1 className="fw-bold">Deposit Report</h1>
            <div
              className="flex gap-4"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Status Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Status</label>
                <select
                  className={`w-full md:w-[250px] ${
                    theme === "dark"
                      ? "bg-dark text-light dark-placeholder"
                      : "bg-white"
                  }`}
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  style={{ width: "250px" }}
                >
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
                  className={`status border rounded-md p-2 ${
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
                <label
                  className="text-sm font-semibold"
                  style={{ width: "250px" }}
                >
                  From
                </label>
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
              </div>

              <div className="flex flex-col">
                <label
                  className="text-sm font-semibold"
                  style={{ width: "250px" }}
                >
                  To
                </label>
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

            <div className="table-container" id="print-section">
              <table className="table caption-top table-hover">
                <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        onClick={() =>
                          requestSort(
                            column.key as
                              | keyof Deposit
                              | "nameemail"
                              | "app_rej"
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {column.label}
                        <span style={{ marginLeft: "8px" }}>
                          {getSortIcon(
                            column.key as
                              | keyof Deposit
                              | "nameemail"
                              | "app_rej"
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentDeposits.length > 0 ? (
                    currentDeposits.map((deposit, index) => (
                      <tr key={deposit.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                        <th className={theme === "dark" ? "dark-mode-th" : ""}>{indexOfFirstEntry + index + 1}</th>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          {deposit.recipient.name}/{deposit.recipient.email}
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.accountId}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>${deposit.amount.toFixed(2)}</td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.type || "Admin"}</td>
                        <td className={`text-truncate max-width-150 {theme === "dark" ? "dark-mode-td" : ""}`}>
                          {deposit.note || "-"}
                        </td>
                        <td className={`text-truncate max-width-150 {theme === "dark" ? "dark-mode-td" : ""}`}>
                          {deposit.comment || "-"}
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          {deposit.depositProof ? (
                            <img
                              src={deposit.depositProof ?? ""}
                              alt="Deposit proof"
                              className="img-thumbnail document-thumbnail cursor-zoom"
                              onClick={() =>
                                handleImageClick(deposit.depositProof ?? "")
                              }
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                              title="Click to view full image"
                            />
                          ) : (
                            <span>No image</span>
                          )}
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          <span
                            className={`badge ${
                              deposit.status === "pending"
                                ? "bg-warning"
                                : deposit.status === "approved"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {deposit.status.charAt(0).toUpperCase() +
                              deposit.status.slice(1)}
                          </span>
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>
                          {new Date(deposit.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}
                        </td>
                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.creator?.name || "Admin"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={11}
                        style={{ textAlign: "center", padding: "20px" }}
                        className={theme === "dark" ? "dark-mode-td" : ""}
                      >
                        No deposits found
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
                  {Math.min(indexOfLastEntry, filteredAndSortedDeposits.length)}{" "}
                  of {filteredAndSortedDeposits.length} entries
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

      {/* Image Preview Modal */}
      <Modal
        show={showImageModal}
        onHide={handleCloseModal}
        centered
        size="xl"
        fullscreen
        className="image-preview-modal"
        contentClassName="bg-transparent border-0"
      >
        <Modal.Body
          className="d-flex justify-content-center align-items-center p-0"
          onClick={handleCloseModal}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Deposit proof preview"
              className="img-fluid"
              style={{
                height: "60vh",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Depositreport;
