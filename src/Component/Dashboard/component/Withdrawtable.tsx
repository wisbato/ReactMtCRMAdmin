import { useQuery } from "@tanstack/react-query";
import { Form, Col } from "react-bootstrap";
import { useState } from "react";
import { getWithdrawalDetail } from "../../../api/user_all_details/getWithdrawal";
import { useTheme } from "../../../context/ThemeContext";

interface Withdrawal {
  id: number;
  mt5Id: string;
  amount: number;
  withdrawTo: string;
  paymentMethod: string;
  note: string;
  comment: string;
  status: string;
  date: string;
  createdAt: string;
}

const Withdrawtable = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Withdrawal | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  // Fetch withdrawals using TanStack Query
  const { data: withdrawalsData, isLoading, isError } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: () => getWithdrawalDetail(13), // Replace with dynamic user ID if needed
  });

  // Process data for table display
  const processedWithdrawals: Withdrawal[] = withdrawalsData?.withdrawals?.map((withdrawal, index) => ({
    id: index + 1,
    mt5Id: withdrawal.accountId,
    amount: withdrawal.amount,
    withdrawTo: withdrawal.bankAccount || 'N/A',
    paymentMethod: withdrawal.type || 'N/A',
    note: withdrawal.note || 'N/A',
    comment: withdrawal.comment || 'N/A',
    status: withdrawal.status,
    date: new Date(withdrawal.createdAt).toLocaleDateString(),
    createdAt: withdrawal.createdAt
  })) || [];

  const requestSort = (key: keyof Withdrawal) => {
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

  const getSortIcon = (columnKey: keyof Withdrawal) => {
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

  // Filter and sort withdrawals
  const sortedAndFilteredWithdrawals = (() => {
    let filteredData = [...processedWithdrawals];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((withdrawal) =>
        Object.values(withdrawal)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Withdrawal];
        const bValue = b[sortConfig.key as keyof Withdrawal];

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

        // Handle numbers (amount)
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        }

        return 0;
      });
    }

    return filteredData;
  })();

  const totalPages = Math.ceil(sortedAndFilteredWithdrawals.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedAndFilteredWithdrawals.slice(indexOfFirstEntry, indexOfLastEntry);

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      '#', 
      'MT5 Id', 
      'Amount', 
      'Withdraw To', 
      'Payment Method', 
      'Note', 
      'Comment', 
      'Status', 
      'Date'
    ];
    csvRows.push(headers.join(','));

    processedWithdrawals.forEach((withdrawal) => {
      const row = [
        withdrawal.id,
        `"${withdrawal.mt5Id}"`,
        withdrawal.amount,
        `"${withdrawal.withdrawTo}"`,
        `"${withdrawal.paymentMethod}"`,
        `"${withdrawal.note}"`,
        `"${withdrawal.comment}"`,
        withdrawal.status,
        `"${withdrawal.date}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'withdrawals.csv');
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
        <title>Withdrawals Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #2c3e50; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .print-info { text-align: center; margin-bottom: 15px; font-size: 14px; color: #666; }
          .status-pending { background-color: #fff3cd; color: #856404; padding: 3px 6px; border-radius: 4px; }
          .status-completed { background-color: #d4edda; color: #155724; padding: 3px 6px; border-radius: 4px; }
          .status-rejected { background-color: #f8d7da; color: #721c24; padding: 3px 6px; border-radius: 4px; }
          .status-processing { background-color: #cce5ff; color: #004085; padding: 3px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Withdrawals Report</h1>
        <div class="print-info">
          Generated on: ${new Date().toLocaleString()}<br>
          Total Records: ${processedWithdrawals.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>MT5 Id</th>
              <th>Amount</th>
              <th>Withdraw To</th>
              <th>Payment Method</th>
              <th>Note</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${processedWithdrawals.map((withdrawal) => `
              <tr>
                <td>${withdrawal.id}</td>
                <td>${withdrawal.mt5Id}</td>
                <td>${withdrawal.amount}</td>
                <td>${withdrawal.withdrawTo}</td>
                <td>${withdrawal.paymentMethod}</td>
                <td>${withdrawal.note}</td>
                <td>${withdrawal.comment}</td>
                <td><span class="status-${withdrawal.status.toLowerCase()}">${withdrawal.status}</span></td>
                <td>${withdrawal.date}</td>
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

  if (isLoading) return <div>Loading withdrawals...</div>;
  if (isError) return <div>Error loading withdrawals</div>;

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
                  'amount', 
                  'withdrawTo', 
                  'paymentMethod', 
                  'note', 
                  'comment', 
                  'status', 
                  'date'
                ].map((col) => (
                  <th 
                    key={col} 
                    scope="col" 
                    onClick={() => requestSort(col as keyof Withdrawal)}
                    style={{ cursor: "pointer" }}
                  >
                    {col === 'id' ? '#' : 
                     col === 'mt5Id' ? 'MT5 Id' :
                     col === 'amount' ? 'Amount' :
                     col === 'withdrawTo' ? 'Withdraw To' :
                     col === 'paymentMethod' ? 'Payment Method' :
                     col === 'note' ? 'Note' :
                     col === 'comment' ? 'Comment' :
                     col === 'status' ? 'Status' : 'Date'}
                    <span style={{ marginLeft: "8px" }}>
                      {getSortIcon(col as keyof Withdrawal)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((withdrawal) => (
                  <tr key={withdrawal.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <th className={theme === "dark" ? "dark-mode-th" : ""}>{withdrawal.id}</th>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.mt5Id}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.amount}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.withdrawTo}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.paymentMethod}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.note}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.comment}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      <span className={`status-badge status-${withdrawal.status.toLowerCase()}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{withdrawal.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
                    No withdrawals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='pagination-container'>
          <div className='table-bottom-content'>
            <span>
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, sortedAndFilteredWithdrawals.length)} of {sortedAndFilteredWithdrawals.length} entries
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

export default Withdrawtable;