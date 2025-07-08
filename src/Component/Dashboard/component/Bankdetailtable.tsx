import { useQuery } from "@tanstack/react-query";
import { Form, Col } from "react-bootstrap";
import { useState } from "react";
import { getBankDetails } from "../../../api/user_all_details/getBankDetail";
import { useTheme } from "../../../context/ThemeContext";

interface BankDetail {
  id: number;
  account_name: string;
  account_number: string;
  ifsc_swift_code: string;
  iban_number: string;
  bank_name: string;
  country: string;
  comment: string;
  status: string;
  date: string;
  createdAt: string;
}

const Bankdetailtable = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BankDetail | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  // Fetch bank details using TanStack Query
  const { data: bankDetails, isLoading, isError } = useQuery({
    queryKey: ['bankDetails'],
    queryFn: () => getBankDetails(13), // Replace with dynamic user ID if needed
  });

  // Process data for table display
  const processedData: BankDetail[] = bankDetails?.data?.map((detail, index) => ({
    id: index + 1,
    account_name: detail.account_name,
    account_number: detail.account_number,
    ifsc_swift_code: detail.ifsc_swift_code,
    iban_number: detail.iban_number,
    bank_name: detail.bank_name,
    country: detail.country,
    comment: "",
    status: detail.status,
    date: new Date(detail.createdAt).toLocaleDateString(),
    createdAt: detail.createdAt
  })) || [];

  const requestSort = (key: keyof BankDetail) => {
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

  const getSortIcon = (columnKey: keyof BankDetail) => {
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

  // Filter and sort bank details
  const sortedAndFilteredData = (() => {
    let filteredData = [...processedData];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((detail) =>
        Object.values(detail)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof BankDetail];
        const bValue = b[sortConfig.key as keyof BankDetail];

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

  const totalPages = Math.ceil(sortedAndFilteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedAndFilteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      'ID', 
      'Account Name', 
      'Account No', 
      'IFSC/SWIFT Code', 
      'Iban No', 
      'Bank Name', 
      'Country', 
      'Status', 
      'Date'
    ];
    csvRows.push(headers.join(','));

    processedData.forEach((detail) => {
      const row = [
        detail.id,
        `"${detail.account_name}"`,
        `"${detail.account_number}"`,
        `"${detail.ifsc_swift_code}"`,
        `"${detail.iban_number}"`,
        `"${detail.bank_name}"`,
        `"${detail.country}"`,
        detail.status,
        `"${detail.date}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'bank_details.csv');
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
        <title>Bank Details Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #2c3e50; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .print-info { text-align: center; margin-bottom: 15px; font-size: 14px; color: #666; }
          .status-active { background-color: #d4edda; color: #155724; padding: 3px 6px; border-radius: 4px; }
          .status-pending { background-color: #fff3cd; color: #856404; padding: 3px 6px; border-radius: 4px; }
          .status-rejected { background-color: #f8d7da; color: #721c24; padding: 3px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Bank Details Report</h1>
        <div class="print-info">
          Generated on: ${new Date().toLocaleString()}<br>
          Total Records: ${processedData.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Account Name</th>
              <th>Account No</th>
              <th>IFSC/SWIFT Code</th>
              <th>Iban No</th>
              <th>Bank Name</th>
              <th>Country</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${processedData.map((detail) => `
              <tr>
                <td>${detail.id}</td>
                <td>${detail.account_name}</td>
                <td>${detail.account_number}</td>
                <td>${detail.ifsc_swift_code}</td>
                <td>${detail.iban_number}</td>
                <td>${detail.bank_name}</td>
                <td>${detail.country}</td>
                <td><span class="status-${detail.status.toLowerCase()}">${detail.status}</span></td>
                <td>${detail.date}</td>
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

  if (isLoading) return <div>Loading bank details...</div>;
  if (isError) return <div>Error loading bank details</div>;

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
                  'account_name', 
                  'account_number', 
                  'ifsc_swift_code', 
                  'iban_number', 
                  'bank_name', 
                  'country', 
                  'status', 
                  'date'
                ].map((col) => (
                  <th 
                    key={col} 
                    scope="col" 
                    onClick={() => requestSort(col as keyof BankDetail)}
                    style={{ cursor: "pointer" }}
                  >
                    {col === 'id' ? 'ID' : 
                     col === 'account_name' ? 'Account Name' :
                     col === 'account_number' ? 'Account No' :
                     col === 'ifsc_swift_code' ? 'IFSC/SWIFT Code' :
                     col === 'iban_number' ? 'Iban No' :
                     col === 'bank_name' ? 'Bank Name' :
                     col === 'country' ? 'Country' :
                     col === 'status' ? 'Status' : 'Date'}
                    <span style={{ marginLeft: "8px" }}>
                      {getSortIcon(col as keyof BankDetail)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((detail) => (
                  <tr key={detail.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <th className={theme === "dark" ? "dark-mode-th" : ""}>{detail.id}</th>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{detail.account_name}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{detail.account_number}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{detail.ifsc_swift_code}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{detail.iban_number}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{detail.bank_name}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{detail.country}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      <span className={`status-badge status-${detail.status.toLowerCase()}`}>
                        {detail.status}
                      </span>
                    </td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{detail.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
                    No bank details found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='pagination-container'>
          <div className='table-bottom-content'>
            <span>
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, sortedAndFilteredData.length)} of {sortedAndFilteredData.length} entries
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

export default Bankdetailtable;