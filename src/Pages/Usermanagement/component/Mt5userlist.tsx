import { Form, Col } from 'react-bootstrap';
import './userlist.css';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getallMT5Users } from '../../../api/mt5_acc/getMT5Userlist';
import { toast } from 'react-hot-toast';
import { useTheme } from "../../../context/ThemeContext";
interface MT5User {
  id: number;
  accountId: number;
  name: string;
  email: string;
  group: string;
  currency: string;
  balance: string;
  phone?: string;
  country?: string;
  createdAt?: string;
}

interface SortConfig {
  key: keyof MT5User | null;
  direction: 'asc' | 'desc' | null;
}

const Mt5userlist = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<MT5User[]>([]);
  const { theme } = useTheme();

  // Use mutation to fetch MT5 users
  const fetchUsersMutation = useMutation({
    mutationFn: getallMT5Users,
    onSuccess: (data) => {
      if (data.success && data.accounts) {
        setUsers(data.accounts.map((account, index) => ({
          id: index + 1,
          accountId: account.accountId,
          name: account.name || 'N/A',
          email: account.email || 'N/A',
          group: account.group || 'N/A',
          currency: account.currency || 'N/A',
          balance: account.balance?.toString() || '0',
          phone: account.phone || 'N/A',
          country: account.country || 'N/A',
          createdAt: account.createdAt || 'N/A'
        })));
      }
    },
    onError: (error) => {
      console.error("Error fetching MT5 users:", error);
      toast.error(error.message || 'Failed to load MT5 users');
    }
  });

  useEffect(() => {
    fetchUsersMutation.mutate();
  }, []);

  const requestSort = (key: keyof MT5User) => {
    let direction: 'asc' | 'desc' | null = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: keyof MT5User) => {
    if (sortConfig.key !== columnKey) {
      return <i className="fa-solid fa-arrows-up-down" />;
    }

    if (sortConfig.direction === 'asc') {
      return <i className="fa-solid fa-arrow-up" />;
    }

    if (sortConfig.direction === 'desc') {
      return <i className="fa-solid fa-arrow-down" />;
    }

    return <i className="fa-solid fa-arrows-up-down" />;
  };

  const sortedAndFilteredUsers = (() => {
    let filteredData = [...users];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((user) =>
        Object.values(user)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof MT5User];
        const bValue = b[sortConfig.key as keyof MT5User];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Handle numeric values
          if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
            return sortConfig.direction === 'asc'
              ? Number(aValue) - Number(bValue)
              : Number(bValue) - Number(aValue);
          }

          // Handle dates
          if (!isNaN(Date.parse(aValue))) {
            return sortConfig.direction === 'asc'
              ? new Date(aValue).getTime() - new Date(bValue).getTime()
              : new Date(bValue).getTime() - new Date(aValue).getTime();
          }

          // Handle regular strings
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: { key: keyof MT5User; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'accountId', label: 'MT5 ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'group', label: 'Group' },
    { key: 'currency', label: 'Currency' },
    { key: 'balance', label: 'Balance' },
  ];

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      'ID',
      'MT5 ID',
      'Name',
      'Email',
      'Group',
      'Currency',
      'Balance',
      'Phone',
      'Country',
      'Created At',
    ];
    csvRows.push(headers.join(','));

    users.forEach((user) => {
      const row = [
        user.id,
        user.accountId,
        `"${user.name}"`,
        user.email,
        user.group,
        user.currency,
        user.balance,
        user.phone,
        user.country,
        `"${formatDateForCSV(user.createdAt || '')}"`,
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>MT5 Users List - Print</title>
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
          <h1>MT5 Users List Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
              <br>
              Total Records: ${sortedAndFilteredUsers.length}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>MT5 ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Group</th>
                      <th>Currency</th>
                      <th>Balance</th>
                      <th>Phone</th>
                      <th>Country</th>
                      <th>Created At</th>
                  </tr>
              </thead>
              <tbody>
                  ${sortedAndFilteredUsers
                    .map(
                      (user) => `
                      <tr>
                          <td>${user.id}</td>
                          <td>${user.accountId}</td>
                          <td>${user.name}</td>
                          <td>${user.email}</td>
                          <td>${user.group}</td>
                          <td>${user.currency}</td>
                          <td>${user.balance}</td>
                          <td>${user.phone}</td>
                          <td>${user.country}</td>
                          <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'N/A'}</td>
                      </tr>
                  `
                    )
                    .join('')}
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

  if (fetchUsersMutation.isPending) {
    return (
      <div className="user-list-main" style={{ padding: '30px' }}>
        <h1 className="mt5userlist-titlee" style={{ fontWeight: 'bolder' }}>MT5 User List</h1>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (fetchUsersMutation.isError) {
    return (
      <div className="user-list-main" style={{ padding: '30px' }}>
        <h1 className="mt5userlist-titlee" style={{ fontWeight: 'bolder' }}>MT5 User List</h1>
        <div className="error">Error loading MT5 users</div>
      </div>
    );
  }

  return (
    <div className="user-list-main ">
      <h1 className="mt5userlist-titlee" style={{ fontWeight: 'bolder' }}>MT5 User List</h1>

      <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <div className="search-section">
          <Form.Group as={Col} md="3" controlId="validationCustom04">
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
                    onClick={() => requestSort(column.key)}
                    style={{ cursor: 'pointer', minWidth: '180px' }}
                  >
                    {column.label}
                    <span style={{ marginLeft: '8px' }}>
                      {getSortIcon(column.key)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.id}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.accountId}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.name}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.email}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.group}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.currency}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.balance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <div className="table-bottom-content">
            <span>
              Showing {indexOfFirstEntry + 1} to{' '}
              {Math.min(indexOfLastEntry, sortedAndFilteredUsers.length)} of{' '}
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
                className={currentPage === index + 1 ? 'active' : ''}
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

export default Mt5userlist;