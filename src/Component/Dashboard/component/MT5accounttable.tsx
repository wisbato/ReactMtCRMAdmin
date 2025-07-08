import { useQuery } from "@tanstack/react-query";
import { Form, Col } from "react-bootstrap";
import { useState } from "react";
import { getMT5accounts } from "../../../api/user_all_details/getMT5Account";
import { useTheme } from "../../../context/ThemeContext";

interface MT5Account {
  id: number;
  mt5Id: string;
  name: string;
  groupName: string;
  investorPassword: string;
  mainPassword: string;
  date: string;
  createdAt: string;
}

const MT5accounttable = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MT5Account | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  // Fetch MT5 accounts using TanStack Query
  const { data: mt5Data, isLoading, isError } = useQuery({
    queryKey: ['mt5Accounts'],
    queryFn: () => getMT5accounts(13), // Replace with dynamic user ID if needed
  });

  // Process data for table display
  const processedAccounts: MT5Account[] = mt5Data?.accounts?.map((account, index) => ({
    id: index + 1,
    mt5Id: account.accountid,
    name: account.name,
    groupName: account.groupName,
    investorPassword: account.iPassword,
    mainPassword: account.mPassword,
    date: new Date(account.createdAt).toLocaleDateString(),
    createdAt: account.createdAt
  })) || [];

  const requestSort = (key: keyof MT5Account) => {
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

  const getSortIcon = (columnKey: keyof MT5Account) => {
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

  // Filter and sort MT5 accounts
  const sortedAndFilteredAccounts = (() => {
    let filteredData = [...processedAccounts];

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

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Handle dates
          if (sortConfig.key === 'createdAt' || sortConfig.key === 'date') {
            const aDate = sortConfig.key === 'createdAt' ? new Date(a.createdAt) : new Date(a.date);
            const bDate = sortConfig.key === 'createdAt' ? new Date(b.createdAt) : new Date(b.date);
            return sortConfig.direction === "asc"
              ? aDate.getTime() - bDate.getTime()
              : bDate.getTime() - aDate.getTime();
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

  const totalPages = Math.ceil(sortedAndFilteredAccounts.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedAndFilteredAccounts.slice(indexOfFirstEntry, indexOfLastEntry);

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      '#', 
      'MT5 Id', 
      'Name', 
      'Group Name', 
      'Investor Password', 
      'Main Password', 
      'Date'
    ];
    csvRows.push(headers.join(','));

    processedAccounts.forEach((account) => {
      const row = [
        account.id,
        `"${account.mt5Id}"`,
        `"${account.name}"`,
        `"${account.groupName}"`,
        `"${account.investorPassword}"`,
        `"${account.mainPassword}"`,
        `"${account.date}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'mt5_accounts.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>MT5 Accounts Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #2c3e50; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .print-info { text-align: center; margin-bottom: 15px; font-size: 14px; color: #666; }
          .password-cell { font-family: monospace; }
        </style>
      </head>
      <body>
        <h1>MT5 Accounts Report</h1>
        <div class="print-info">
          Generated on: ${new Date().toLocaleString()}<br>
          Total Records: ${processedAccounts.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>MT5 Id</th>
              <th>Name</th>
              <th>Group Name</th>
              <th>Investor Password</th>
              <th>Main Password</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${processedAccounts.map((account) => `
              <tr>
                <td>${account.id}</td>
                <td>${account.mt5Id}</td>
                <td>${account.name}</td>
                <td>${account.groupName}</td>
                <td class="password-cell">${account.investorPassword}</td>
                <td class="password-cell">${account.mainPassword}</td>
                <td>${account.date}</td>
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
    `);
    printWindow.document.close();
  };

  if (isLoading) return <div>Loading MT5 accounts...</div>;
  if (isError) return <div>Error loading MT5 accounts</div>;

  return (
    <div className='user-list-main' style={{ marginTop: '30px' }}>
      <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-light"}`}>
        <div className='search-section'>
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
          </Form.Group>
          <div className='user-list-btn'>
            <button onClick={exportToCSV}>
              <i className="fa-solid fa-file-csv"></i> CSV
            </button>
            <button onClick={handlePrint}>
              <i className="fa-solid fa-print"></i> PRINT
            </button>
          </div>
        </div>
        
        <div className='table-container'>
          <table className="table caption-top table-hover">
            <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
              <tr>
                {[
                  'id', 
                  'mt5Id', 
                  'name', 
                  'groupName', 
                  'investorPassword', 
                  'mainPassword', 
                  'date'
                ].map((col) => (
                  <th 
                    key={col} 
                    scope="col" 
                    onClick={() => requestSort(col as keyof MT5Account)}
                    style={{ cursor: "pointer" }}
                  >
                    {col === 'id' ? '#' : 
                     col === 'mt5Id' ? 'MT5 Id' :
                     col === 'name' ? 'Name' :
                     col === 'groupName' ? 'Group Name' :
                     col === 'investorPassword' ? 'Investor Password' :
                     col === 'mainPassword' ? 'Main Password' : 'Date'}
                    <span style={{ marginLeft: "8px" }}>
                      {getSortIcon(col as keyof MT5Account)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((account) => (
                  <tr key={account.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <th className={theme === "dark" ? "dark-mode-th" : ""}>{account.id}</th>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.mt5Id}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.name}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.groupName}</td>
                    <td className={`${theme === "dark" ? "dark-mode-td" : ""} password-cell`}>{account.investorPassword}</td>
                    <td className={`${theme === "dark" ? "dark-mode-td" : ""} password-cell`}>{account.mainPassword}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{account.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
                    No MT5 accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='pagination-container'>
          <div className='table-bottom-content'>
            <span>
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, sortedAndFilteredAccounts.length)} of {sortedAndFilteredAccounts.length} entries
            </span>
            <select 
              value={entriesPerPage} 
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className='pagination-controls'>
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

export default MT5accounttable;