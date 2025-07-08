import { Form, Col, Modal } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeposit } from "../../../api/pending_transaction/getDeposit";
import {
  approveDeposit,
  rejectDeposit,
} from "../../../api/pending_transaction/app_rejTrans";
import { useTheme } from "../../../context/ThemeContext";

interface Deposit {
  id: number;
  creator: {
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
}

type SortConfig = {
  key: keyof Deposit | null;
  direction: "asc" | "desc" | null;
};

const PendingDeposit = () => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [currentRejectId, setCurrentRejectId] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  // Fetch deposits using useQuery
  const {
    data: depositsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["deposits"],
    queryFn: getDeposit,
  });

  const deposits = depositsData?.deposits || [];

  // Sorting function
  const requestSort = (key: keyof Deposit) => {
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

  const getSortIcon = (columnKey: keyof Deposit) => {
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

  // Filter and sort deposits
  const filteredAndSortedDeposits = (() => {
    let filteredData = [...deposits];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((deposit) =>
        Object.values(deposit).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle nested properties (like creator.name)
        if (sortConfig.key === 'creator') {
          const aName = a.creator.name.toLowerCase();
          const bName = b.creator.name.toLowerCase();
          return sortConfig.direction === "asc" 
            ? aName.localeCompare(bName) 
            : bName.localeCompare(aName);
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

  // Pagination calculations based on filtered and sorted deposits
  const totalPages = Math.ceil(filteredAndSortedDeposits.length / entriesPerPage);
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

  const queryClient = useQueryClient();

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: approveDeposit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      toast.success(data.message);
      
      // Update the local comment to show 'Approved'
      queryClient.setQueryData(['deposits'], (oldData: any) => {
        if (!oldData?.deposits) return oldData;
        return {
          ...oldData,
          deposits: oldData.deposits.map((deposit: any) => 
            deposit.id === data.deposit.id 
              ? { ...deposit, comment: 'Approved' } 
              : deposit
          )
        };
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      rejectDeposit(id, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      toast.success(data.message);
      setShowRejectModal(false);
      setRejectComment("");
      setCurrentRejectId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setShowRejectModal(false);
      setRejectComment("");
      setCurrentRejectId(null);
    },
  });

  // Confirm rejection
  const confirmRejection = () => {
    if (!currentRejectId || !rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    rejectMutation.mutate({ id: currentRejectId, reason: rejectComment });
  };

  // Handle approve
  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  // Handle reject
  const handleReject = (id: number) => {
    setCurrentRejectId(id);
    setShowRejectModal(true);
  };

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
      "Name",
      "Email", 
      "Mt5 ID",
      "Amount",
      "Payment Method",
      "Note",
      "Comment",
      "Status",
      "Created Date",
    ];
    csvRows.push(headers.join(","));

    currentDeposits.forEach((deposit) => {
      const row = [
        deposit.id,
        `"${deposit.creator.name}"`,
        `"${deposit.creator.email || ''}"`,
        deposit.accountId,
        deposit.amount,
        `"${deposit.type}"`,
        deposit.note ? `"${deposit.note}"` : "-",
        deposit.status === "approved" ? "Approved" : (deposit.comment ? `"${deposit.comment}"` : "-"),
        deposit.status,
        `"${formatDateForCSV(deposit.createdAt || new Date().toISOString())}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "pending_deposits.csv");
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
          <title>Pending Deposits - Print</title>
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
          <h1>Pending Deposits Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Mt5 ID</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Note</th>
                      <th>Comment</th>
                      <th>Status</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentDeposits.map((deposit, index) => `
                      <tr>
                          <td>${index + 1}</td>
                          <td>${deposit.creator.name}</td>
                          <td>${deposit.accountId}</td>
                          <td>${deposit.amount}</td>
                          <td>${deposit.type}</td>
                          <td>${deposit.note || "-"}</td>
                          <td>${deposit.status === "approved" ? "Approved" : (deposit.comment || "-")}</td>
                          <td>
                              <span class="status-badge status-${deposit.status}">
                                  ${deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                              </span>
                          </td>
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
    return <div className="loading">Loading deposits...</div>;
  }

  if (isError) {
    return <div className="error">Error: {error?.message}</div>;
  }

  // Define table columns with sorting
  const columns = [
    { key: "id", label: "#" },
    { key: "creator", label: "Name / Email" },
    { key: "accountId", label: "Mt5 id" },
    { key: "amount", label: "Amount" },
    { key: "type", label: "Payment Method" },
    { key: "note", label: "Note" },
    { key: "comment", label: "Comment" },
    { key: "status", label: "Status" },
    { key: "depositProof", label: "Deposit Proof" },
    { key: "action", label: "Action" },
  ];

  return (
    <div className="user-list-main">
      <h1 className="fw-bold">Pending Deposit</h1>

      <div className={`userlist-container ${theme === "dark" ? "bg-dark" : ""}`}>
        <div className="search-section">
          <Form.Group as={Col} md="3" controlId="validationCustom04">
            <Form.Label></Form.Label>
            <Form.Control
              type="text"
              placeholder="Search..."
              required
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
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

        <div className="table-container" id="print-section">
          <table className="table caption-top table-hover">
            <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => column.key !== "action" && requestSort(column.key as keyof Deposit)}
                    style={{ cursor: column.key !== "action" ? "pointer" : "default" }}
                  >
                    {column.label}
                    {column.key !== "action" && (
                      <span style={{ marginLeft: "8px" }}>
                        {getSortIcon(column.key as keyof Deposit)}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentDeposits.length > 0 ? (
                currentDeposits.map((deposit, index) => (
                  <tr key={deposit.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <th className={theme === "dark" ? "dark-mode-th" : ""}>{indexOfFirstEntry + index + 1}</th>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.creator.name}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.accountId}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.amount}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.type}</td>
                    <td className={`text-truncate max-width-150 ${theme === "dark" ? "dark-mode-td" : ""}`}>
                      {deposit.note || "-"}
                    </td>
                    <td className={`text-truncate max-width-150 {theme === "dark" ? "dark-mode-td" : ""}`}>
                      {deposit.status === "approved" ? "Approved" : deposit.comment || "-"}
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
                      {deposit.depositProof ? (
                        <img
                          src={deposit.depositProof}
                          alt="Deposit proof"
                          className="img-thumbnail document-thumbnail cursor-zoom"
                          onClick={() => handleImageClick(deposit.depositProof)}
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
                      <div className="d-flex flex-wrap gap-1">
                        <button
                          className="btn btn-success btn-sm flex-grow-1"
                          onClick={() => handleApprove(deposit.id)}
                          disabled={
                            deposit.status !== "pending" ||
                            approveMutation.isPending
                          }
                        >
                          {approveMutation.isPending &&
                          approveMutation.variables === deposit.id ? (
                            <span className="spinner-border spinner-border-sm me-1"></span>
                          ) : null}
                          Approve
                        </button>

                        <button
                          className="btn btn-danger btn-sm flex-grow-1"
                          onClick={() => handleReject(deposit.id)}
                          disabled={
                            deposit.status !== "pending" ||
                            rejectMutation.isPending
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
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
              {Math.min(indexOfLastEntry, filteredAndSortedDeposits.length)} of{" "}
              {filteredAndSortedDeposits.length} entries
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

      {/* Rejection Reason Modal */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
        className="reject-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reject Deposit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="rejectReason">
            <Form.Label>Reason for rejection:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Enter reason for rejection..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowRejectModal(false)}
            disabled={rejectMutation.isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={confirmRejection}
            disabled={!rejectComment.trim() || rejectMutation.isPending}
          >
            {rejectMutation.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Rejecting...
              </>
            ) : (
              "Confirm Rejection"
            )}
          </button>
        </Modal.Footer>
      </Modal>

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

export default PendingDeposit;