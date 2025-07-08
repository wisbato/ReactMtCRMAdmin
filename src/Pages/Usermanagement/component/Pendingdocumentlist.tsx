import { Form, Col } from "react-bootstrap";
import "./userlist.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getMultiUserDocuments } from "../../../api/pending_document/multiUser";
import { useTheme } from "../../../context/ThemeContext";

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface Document {
  file_url: string;
  status: string;
  uploaded: boolean;
}

interface Documents {
  proof_of_address?: Document;
  proof_of_identity?: Document;
  // Add other possible document types here if needed
}

interface UserDocument {
  id: number;
  userId: number;
  user: User;
  documents: Documents;
  createdAt: string;
  updatedAt: string;
}

type SortConfig = {
  key: keyof User | null;
  direction: "asc" | "desc" | null;
};

const Pendingdocumentlist = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user documents with TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDocuments"],
    queryFn: getMultiUserDocuments,
  });

  // Extract users with pending documents
  const userDocuments: UserDocument[] = data?.data ?? [];

  // Filter users who have pending documents
  const pendingUsers = userDocuments.filter((userDoc) => {
    const { documents } = userDoc;
    const hasPendingDocs = Object.values(documents).some(
      (doc) => doc && doc.status === "pending"
    );
    return hasPendingDocs;
  });

  const requestSort = (key: keyof User) => {
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

  const getSortIcon = (columnKey: keyof User) => {
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

  const sortedAndFilteredUsers = (() => {
    let filteredData = [...pendingUsers];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((userDoc) =>
        Object.values(userDoc.user)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a.user[sortConfig.key!];
        const bValue = b.user[sortConfig.key!];

        // Handle currency values
        if (typeof aValue === "string" && typeof bValue === "string") {
          if (aValue.startsWith("$") && bValue.startsWith("$")) {
            const aNum = parseFloat(aValue.replace("$", "").replace(",", ""));
            const bNum = parseFloat(bValue.replace("$", "").replace(",", ""));
            return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
          }

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

        // Handle numbers
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return filteredData;
  })();

  const totalPages = Math.ceil(sortedAndFilteredUsers.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = sortedAndFilteredUsers.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const navigateToPendinglist = (userId: number) => {
    navigate(
      `/usermanagement/pendingdocumentlist/pendingdocumentlistview/${userId}`
    );
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

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["ID", "Name", "Email", "Phone", "Registration Date"];
    csvRows.push(headers.join(","));

    currentUsers.forEach((userDoc) => {
      const user = userDoc.user;
      const row = [
        user.id,
        `"${user.name}"`,
        user.email,
        user.phone,
        `"${formatDateForCSV(user.createdAt)}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "pending_document_users.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Pending Document List - Print</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  color: #333;
              }
              h1 {
                  text-align: center;
                  color: limegreen;
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
          <h1>Pending Document List</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Registration Date</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentUsers
                    .map(
                      (userDoc) => `
                      <tr>
                          <td>${userDoc.user.id}</td>
                          <td>${userDoc.user.name}</td>
                          <td>${userDoc.user.email}</td>
                          <td>${userDoc.user.phone}</td>
                          <td>${new Date(
                            userDoc.user.createdAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}</td>
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

  const columns: { key: keyof User; label: string }[] = [
    { key: "id", label: "#" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone Number" },
    { key: "createdAt", label: "Registration Date" },
  ];

  // Loading state
  if (isLoading) {
    return <div className="loading">Loading user documents...</div>;
  }

  // Error state
  if (isError && error instanceof Error) {
    return (
      <div className="error">Error loading user documents: {error.message}</div>
    );
  }

  return (
    <div className={`user-list-main ${theme === "dark" ? "dark-mode" : ""}`}>
      <h1 className="fw-bold" style={{ color: "var(--primary-color)" }}>
        Pending Document List
      </h1>

      <div
        className={`userlist-container ${theme === "dark" ? "dark-mode" : ""}`}
      >
        <div className="search-section d-flex justify-content-between align-items-center">
          <Form.Group as={Col} md="3" controlId="searchInput">
            <Form.Control
              className={`userlist-inputbox ${
                theme === "dark" ? "dark-mode" : ""
              }`}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Form.Group>

          <div className="user-list-btn d-flex gap-2">
            <button className="btn btn-success" onClick={exportToCSV}>
              <i className="fa-solid fa-file-csv me-1"></i> CSV
            </button>
            <button className="btn btn-success" onClick={handlePrint}>
              <i className="fa-solid fa-print me-1"></i> PRINT
            </button>
          </div>
        </div>

        <div className="table-container mt-3" id="print-section">
          <table className="table caption-top table-hover">
            <thead
              className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}
            >
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => requestSort(column.key)}
                    style={{ cursor: "pointer" }}
                    className={theme === "dark" ? "dark-mode-th" : ""}
                  >
                    {column.label}
                    <span style={{ marginLeft: "8px" }}>
                      {getSortIcon(column.key)}
                    </span>
                  </th>
                ))}
                <th className={theme === "dark" ? "dark-mode-th" : ""}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === "dark" ? "dark-mode-tbody" : ""}`}>
              {currentUsers.length > 0 ? (
                currentUsers.map((userDoc) => (
                  <tr
                    key={userDoc.user.id}
                    className={theme === "dark" ? "dark-mode-tr" : ""}
                  >
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      {userDoc.user.id}
                    </td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      {userDoc.user.name}
                    </td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      {userDoc.user.email}
                    </td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      {userDoc.user.phone}
                    </td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      {new Date(userDoc.user.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className={theme === "dark" ? "dark-mode-td" : ""}
                      onClick={() => navigateToPendinglist(userDoc.user.id)}
                      style={{ cursor: "pointer" }}
                      title="View documents"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className={theme === "dark" ? "dark-mode-tr" : ""}>
                  <td
                    colSpan={6}
                    className={`text-center ${
                      theme === "dark" ? "dark-mode-td" : ""
                    }`}
                  >
                    No users found with pending documents.
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
              {Math.min(indexOfLastEntry, sortedAndFilteredUsers.length)} of{" "}
              {sortedAndFilteredUsers.length} entries
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
  );
};

export default Pendingdocumentlist;
