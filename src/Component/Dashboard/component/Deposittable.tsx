import { useQuery } from "@tanstack/react-query";
import { Form, Col } from "react-bootstrap";
import { useState } from "react";
import { getDepositDetail } from "../../../api/user_all_details/getDeposit";
import { useTheme } from "../../../context/ThemeContext";

interface Deposit {
  id: number;
  mt5Id: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  note: string;
  comment: string;
  status: string;
  date: string;
  createdAt: string;
}

const Deposittable = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Deposit | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  // Fetch deposits using TanStack Query
  const { data: depositsData, isLoading, isError } = useQuery({
    queryKey: ['deposits'],
    queryFn: () => getDepositDetail(13), // Replace with dynamic user ID if needed
  });

  // Process data for table display
  const processedDeposits: Deposit[] = depositsData?.deposits?.map((deposit, index) => ({
    id: index + 1,
    mt5Id: deposit.accountId,
    amount: deposit.amount,
    paymentMethod: deposit.type,
    transactionId: deposit.transactionId,
    note: deposit.note || 'N/A',
    comment: deposit.comment || 'N/A',
    status: deposit.status,
    date: new Date(deposit.createdAt).toLocaleDateString(),
    createdAt: deposit.createdAt
  })) || [];

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
  const sortedAndFilteredDeposits = (() => {
    let filteredData = [...processedDeposits];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((deposit) =>
        Object.values(deposit)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Deposit];
        const bValue = b[sortConfig.key as keyof Deposit];

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

  const totalPages = Math.ceil(sortedAndFilteredDeposits.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedAndFilteredDeposits.slice(indexOfFirstEntry, indexOfLastEntry);

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      '#', 
      'MT5 Id', 
      'Amount', 
      'Payment Method', 
      'Transaction ID',
      'Note', 
      'Comment', 
      'Status', 
      'Date'
    ];
    csvRows.push(headers.join(','));

    processedDeposits.forEach((deposit) => {
      const row = [
        deposit.id,
        `"${deposit.mt5Id}"`,
        deposit.amount,
        `"${deposit.paymentMethod}"`,
        `"${deposit.transactionId}"`,
        `"${deposit.note}"`,
        `"${deposit.comment}"`,
        deposit.status,
        `"${deposit.date}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'deposits.csv');
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
        <title>Deposits Report</title>
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
        <h1>Deposits Report</h1>
        <div class="print-info">
          Generated on: ${new Date().toLocaleString()}<br>
          Total Records: ${processedDeposits.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>MT5 Id</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Note</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${processedDeposits.map((deposit) => `
              <tr>
                <td>${deposit.id}</td>
                <td>${deposit.mt5Id}</td>
                <td>${deposit.amount}</td>
                <td>${deposit.paymentMethod}</td>
                <td>${deposit.transactionId}</td>
                <td>${deposit.note}</td>
                <td>${deposit.comment}</td>
                <td><span class="status-${deposit.status.toLowerCase()}">${deposit.status}</span></td>
                <td>${deposit.date}</td>
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

  if (isLoading) return <div>Loading deposits...</div>;
  if (isError) return <div>Error loading deposits</div>;

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
                  'paymentMethod', 
                  'transactionId',
                  'note', 
                  'comment', 
                  'status', 
                  'date'
                ].map((col) => (
                  <th 
                    key={col} 
                    scope="col" 
                    onClick={() => requestSort(col as keyof Deposit)}
                    style={{ cursor: "pointer" }}
                  >
                    {col === 'id' ? '#' : 
                     col === 'mt5Id' ? 'MT5 Id' :
                     col === 'amount' ? 'Amount' :
                     col === 'paymentMethod' ? 'Payment Method' :
                     col === 'transactionId' ? 'Transaction ID' :
                     col === 'note' ? 'Note' :
                     col === 'comment' ? 'Comment' :
                     col === 'status' ? 'Status' : 'Date'}
                    <span style={{ marginLeft: "8px" }}>
                      {getSortIcon(col as keyof Deposit)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((deposit) => (
                  <tr key={deposit.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <th className={theme === "dark" ? "dark-mode-th" : ""}>{deposit.id}</th>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.mt5Id}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.amount}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.paymentMethod}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.transactionId}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.note}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.comment}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      <span className={`status-badge status-${deposit.status.toLowerCase()}`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{deposit.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
                    No deposits found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='pagination-container'>
          <div className='table-bottom-content'>
            <span>
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, sortedAndFilteredDeposits.length)} of {sortedAndFilteredDeposits.length} entries
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

export default Deposittable;