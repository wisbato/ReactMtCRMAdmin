import { Form, Col } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGroup as getAllGroups } from '../../../api/group/getGroup'; // Adjust the import path
import { toast } from 'react-hot-toast';
import useCan from "../../../../src/hooks/useCan";
import { useTheme } from "../../../context/ThemeContext";

interface Group {
  id: number;
  groupName: string;
  mt5GroupName: string;
  groupType: string;
  currencyUnit: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SortConfig {
  key: keyof Group | null;
  direction: 'asc' | 'desc' | null;
}

const Grouplist = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const can= useCan();
  const navigateToGrouplistedit = (groupId: number) => {
    navigate(`/grouplistedit/${groupId}`);
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // UseQuery to fetch groups data
  const { data: groupsData, isLoading, isError, error } = useQuery({
    queryKey: ['groups'],
    queryFn: getAllGroups,
  });

  // Use the actual data from API or fallback to empty array
  const groups = groupsData?.groups || [];

  const requestSort = (key: keyof Group) => {
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

  const getSortIcon = (columnKey: keyof Group) => {
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

  const sortedAndFilteredGroups = (() => {
    let filteredData = [...groups];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((group) =>
        Object.values(group)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Group];
        const bValue = b[sortConfig.key as keyof Group];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
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

  const totalPages = Math.ceil(sortedAndFilteredGroups.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentGroups = sortedAndFilteredGroups.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: { key: keyof Group; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'groupName', label: 'Group Name' },
    { key: 'mt5GroupName', label: 'MT5 Group Name' },
    { key: 'groupType', label: 'Group Type' },
    { key: 'currencyUnit', label: 'Currency Unit' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created At' },
  ];

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      'ID',
      'Group Name',
      'MT5 Group Name',
      'Group Type',
      'Currency Unit',
      'Status',
      'Created At',
      'Updated At',
    ];
    csvRows.push(headers.join(','));

    groups.forEach((group) => {
      const row = [
        group.id,
        `"${group.groupName}"`,
        group.mt5GroupName,
        group.groupType,
        group.currencyUnit,
        group.status,
        `"${formatDateForCSV(group.createdAt)}"`,
        `"${formatDateForCSV(group.updatedAt)}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'groups_list.csv');
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
          <title>Groups List - Print</title>
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
              .status-active {
                  background-color: #d4edda;
                  color: #155724;
              }
              .status-inactive {
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
          <h1>Groups List Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Group Name</th>
                      <th>MT5 Group Name</th>
                      <th>Group Type</th>
                      <th>Currency Unit</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentGroups
                    .map(
                      (group) => `
                      <tr>
                          <td>${group.id}</td>
                          <td>${group.groupName}</td>
                          <td>${group.mt5GroupName}</td>
                          <td>${group.groupType}</td>
                          <td>${group.currencyUnit}</td>
                          <td>
                              <span class="status-badge status-${group.status.toLowerCase()}">
                                  ${group.status}
                              </span>
                          </td>
                          <td>${new Date(group.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}</td>
                          <td>${new Date(group.updatedAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}</td>
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

  if (isLoading) {
    return (
      <div className="grouplist" style={{ padding: '30px' }}>
        <div className="user-list-main">
          <h1 className="fw-bold">Groups List</h1>
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
    toast.error(error.message || 'Failed to load groups');
    return (
      <div className="grouplist" style={{ padding: '30px' }}>
        <div className="user-list-main">
          <h1 className="fw-bold">Groups List</h1>
          <div className="error">Error loading groups: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grouplist" style={{ padding: '30px' }}>
      <div className="user-list-main">
        <h1 className="fw-bold">Groups List</h1>

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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentGroups.length > 0 ? (
                  currentGroups.map((group) => (
                    <tr key={group.id}>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{group.id}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{group.groupName}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{group.mt5GroupName}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{group.groupType}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{group.currencyUnit}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        <span
                          className={`badge ${
                            group.status === 'active'
                              ? 'bg-success'
                              : 'bg-secondary'
                          }`}
                        >
                          {group.status.charAt(0).toUpperCase() +
                            group.status.slice(1)}
                        </span>
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{formatDate(group.createdAt)}</td>
                      { can('edit_group') && <td className={theme === "dark" ? "dark-mode-td" : ""} onClick={() => navigateToGrouplistedit(group.id)} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faPen} />
                      </td>}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1} className={`text-center ${theme === "dark" ? "dark-mode-td" : ""}`}>
                      No groups found
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
                {Math.min(indexOfLastEntry, sortedAndFilteredGroups.length)} of{' '}
                {sortedAndFilteredGroups.length} entries
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
    </div>
  );
};

export default Grouplist;