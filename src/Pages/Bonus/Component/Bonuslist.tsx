import { Form, Col } from "react-bootstrap";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBonus, GetBonusResponse } from "../../../api/bonus/getBonus";
import { AxiosError } from "axios";
import { useTheme } from "../../../context/ThemeContext";

interface BonusTransaction {
  id: number;
  userId: number;
  mt5AccountId: number;
  type: string;
  amount: string;
  createdBy: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  mt5Account: {
    id: number;
    accountid: string;
    groupName: string;
  };
}

type SortConfig = {
  key: keyof BonusTransaction | null;
  direction: "asc" | "desc" | null;
};

const Bonuslist = () => {
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch bonus transactions
  const { data, isLoading, isError, error } = useQuery<
    GetBonusResponse,
    AxiosError
  >({
    queryKey: ["bonusTransactions"],
    queryFn: getBonus,
  });

  // Request sort function
  const requestSort = (key: keyof BonusTransaction) => {
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

  // Get sort icon
  const getSortIcon = (columnKey: keyof BonusTransaction) => {
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

  // Filter and sort transactions
  const sortedAndFilteredTransactions = (() => {
    let filteredData = data?.data || [];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((transaction) =>
        Object.values(transaction)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle string values
        if (typeof aValue === "string" && typeof bValue === "string") {
          // Handle amounts
          if (!isNaN(Number(aValue))) {
            return sortConfig.direction === "asc"
              ? Number(aValue) - Number(bValue)
              : Number(bValue) - Number(aValue);
          }

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

        if (sortConfig.key === "mt5Account") {
          return sortConfig.direction === "asc"
            ? a.mt5Account.accountid.localeCompare(b.mt5Account.accountid)
            : b.mt5Account.accountid.localeCompare(a.mt5Account.accountid);
        }

        return 0;
      });
    }

    return filteredData;
  })();

  const totalPages = Math.ceil(sortedAndFilteredTransactions.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentTransactions = sortedAndFilteredTransactions.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

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

  // Export to CSV
  const exportToCSV = () => {
    if (!data?.data || data.data.length === 0) {
      alert("No data to export");
      return;
    }

    const csvRows = [];
    const headers = [
      "ID",
      "MT5 ID",
      "Amount",
      "Type",
      "Comment",
      "Date"
    ];
    csvRows.push(headers.join(","));

    data.data.forEach((transaction) => {
      const row = [
        transaction.id,
        `"${transaction.mt5Account.accountid}"`,
        transaction.amount,
        transaction.type,
        `"${transaction.comment}"`,
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
    a.setAttribute("download", "bonus_transactions.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Print function
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Bonus Transactions - Print</title>
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
          <h1>Bonus Transactions Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>MT5 Account</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Comment</th>
                      <th>Date</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentTransactions.map(transaction => `
                      <tr>
                          <td>${transaction.id}</td>
                          <td>${transaction.mt5Account.accountid}</td>
                          <td>${transaction.amount}</td>
                          <td>${transaction.type}</td>
                          <td>${transaction.comment}</td>
                          <td>${new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
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

  // Loading state
  if (isLoading) {
    return <div className="text-center py-4">Loading bonus transactions...</div>;
  }

  // Error state
  if (isError) {
    return (
      <div className="alert alert-danger">
        Error: {error?.message || "Failed to load bonus transactions"}
      </div>
    );
  }

  // No data state
  if (!data?.data || data.data.length === 0) {
    return <div className="text-center py-4">No bonus transactions found</div>;
  }

  // Define columns for the table
  const columns: { key: keyof BonusTransaction | string; label: string }[] = [
    { key: "id", label: "#" },
    { key: "mt5Account", label: "MT5 Account" },
    { key: "amount", label: "Amount" },
    { key: "type", label: "Type" },
    { key: "comment", label: "Comment" },
    { key: "createdAt", label: "Date" },
  ];

  return (
    <div className="user-list-main">
      <h1 className="fw-bold">Bonus Transactions</h1>

      <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <div className="search-section">
          <Form.Group as={Col} md="3" controlId="validationCustom04">
            <Form.Label></Form.Label>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}
            />
            <Form.Control.Feedback type="invalid">
              Search...
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
                    onClick={() => requestSort(column.key as keyof BonusTransaction)}
                    style={{ cursor: "pointer" }}
                  >
                    {column.label}
                    <span style={{ marginLeft: "8px" }}>
                      {getSortIcon(column.key as keyof BonusTransaction)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.id}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.mt5Account.accountid}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.amount}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.type}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{transaction.comment}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="table-bottom-content">
            <span>
              Showing {indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, sortedAndFilteredTransactions.length)}{" "}
              of {sortedAndFilteredTransactions.length} entries
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

export default Bonuslist;