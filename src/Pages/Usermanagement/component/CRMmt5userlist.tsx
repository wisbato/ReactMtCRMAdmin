import { useMutation } from '@tanstack/react-query';
import { getMT5Users , MT5Account } from '../../../api/mt5_acc/getMT5';
import { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import './userlist.css';
import { useTheme } from "../../../context/ThemeContext";

type SortableKey = keyof MT5Account;

interface SortConfig {
  key: SortableKey | null;
  direction: "asc" | "desc" | null;
}

const CRMmt5userlist = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<MT5Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Using useMutation to fetch MT5 users
  const fetchMT5UsersMutation = useMutation({
    mutationFn: getMT5Users,
    onSuccess: (data) => {
      setAccounts(data.accounts);
      setIsLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    setIsLoading(true);
    fetchMT5UsersMutation.mutate();
  }, []);

  // Sorting functionality
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

  // Enhanced filtering and sorting
  const sortedAndFilteredAccounts = (() => {
    let filteredData = [...accounts];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((account) =>
        Object.values(account)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof MT5Account];
        const bValue = b[sortConfig.key as keyof MT5Account];

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

  // Pagination logic
  const totalPages = Math.ceil(sortedAndFilteredAccounts.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = sortedAndFilteredAccounts.slice(indexOfFirstEntry, indexOfLastEntry);

  // Enhanced CSV Export
  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['ID', 'Name', 'MT5 ID', 'Group Name', 'Main Password', 'Investor Password', 'Registration Date', 'Phone', 'Country'];
    csvRows.push(headers.join(','));

    sortedAndFilteredAccounts.forEach((account) => {
      const row = [
        account.id,
        `"${account.name}"`,
        account.accountid,
        `"${account.groupName}"`,
        `"${account.mPassword}"`,
        `"${account.iPassword}"`,
        `"${formatDateForCSV(account.createdAt)}"`,
        account.phone,
        `"${account.country}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'mt5_users.csv');
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

  // Enhanced Print functionality
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>MT5 User List - Print</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  color: #333;
              }
              h1 {
                  text-align: center;
                  color: #55da59;
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
          <h1>CRM MT5 User List Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>MT5 ID</th>
                      <th>MT5 Group Name</th>
                      <th>Main Password</th>
                      <th>Investor Password</th>
                      <th>Registration Date</th>
                      <th>Phone</th>
                      <th>Country</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentUsers
                    .map(
                      (account) => `
                      <tr>
                          <td>${account.id}</td>
                          <td>${account.name}</td>
                          <td>${account.accountid}</td>
                          <td>${account.groupName}</td>
                          <td>${account.mPassword}</td>
                          <td>${account.iPassword}</td>
                          <td>${new Date(account.createdAt).toLocaleDateString()}</td>
                          <td>${account.phone}</td>
                          <td>${account.country}</td>
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

  // Column definitions for sorting
  const columns: { key: SortableKey; label: string }[] = [
    { key: "id", label: "#" },
    { key: "name", label: "Name" },
    { key: "accountid", label: "MT5 ID" },
    { key: "groupName", label: "MT5 Group Name" },
    { key: "mPassword", label: "Main Password" },
    { key: "iPassword", label: "Investor Password" },
    { key: "createdAt", label: "Registration Date" },
    { key: "phone", label: "Phone" },
    { key: "country", label: "Country" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list-main">
      <h1 className="fw-bold" style={{ color: 'var(--primary-color)' }}>
        CRM MT5 User List
      </h1>

      <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <div className="search-section">
          <Form.Group as={Col} md="3" controlId="searchBox">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}
            />
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
                    onClick={() => requestSort(column.key)}
                    style={{ cursor: "pointer", minWidth: "120px" }}
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
              {currentUsers.length > 0 ? (
                currentUsers.map((account) => (
                  <tr key={account.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <th className={theme === "dark" ? "dark-mode-td" : ""}>{account.id}</th>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.name}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.accountid}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.groupName}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.mPassword}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.iPassword}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{new Date(account.createdAt).toLocaleDateString()}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.phone}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.country}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      <i 
                        className="fa-solid fa-trash text-danger"
                        title="Delete user"
                        style={{ cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center">
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="table-bottom-content">
            <span>
              Showing {sortedAndFilteredAccounts.length === 0 ? 0 : indexOfFirstEntry + 1} to{' '}
              {Math.min(indexOfLastEntry, sortedAndFilteredAccounts.length)} of {sortedAndFilteredAccounts.length} entries
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
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              ❮
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              ❯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMmt5userlist;