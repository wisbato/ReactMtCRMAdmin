import { Form, Col } from 'react-bootstrap';
import './userlist.css';
import { useState, ReactNode, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getBank } from '../../../api/bank/getBank';
import { Modal } from 'react-bootstrap';
import { useTheme } from '../../../context/ThemeContext';

interface BankDetail {
  id: number;
  AccountName: string;
  AccountNumber: string;
  Country: string;
  BankAddress: string;
  Status: string;
  BankName: string;
  RegistrationDate: string;
  BankBook: string;
  IBAN: string;
  Comment: string;
  originalData: any;
}

interface SortConfig {
  key: keyof BankDetail | null;
  direction: 'asc' | 'desc' | null;
}

const Bankdetailslist = () => {
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [bankDetails, setBankDetails] = useState<any[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Use useMutation to handle the API call
  const bankMutation = useMutation({
    mutationFn: getBank,
    onSuccess: (data) => {
      setBankDetails(data.data);
    },
    onError: (error: any) => {
      console.error("Error fetching bank details:", error.message);
    }
  });

  useEffect(() => {
    bankMutation.mutate();
  }, []);

  const requestSort = (key: keyof BankDetail) => {
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

  const getSortIcon = (columnKey: keyof BankDetail) => {
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

  // Image handling functions
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  // Transform the API data to match your table structure
  const transformedBankDetails: BankDetail[] = bankDetails.map((detail) => ({
    id: detail.id,
    AccountName: detail.account_name,
    AccountNumber: detail.account_number,
    Country: detail.country || 'N/A',
    BankAddress: detail.bank_address || 'N/A',
    Status: detail.status,
    BankName: detail.bank_name,
    RegistrationDate: new Date(detail.createdAt).toLocaleDateString('en-CA'),
    BankBook: detail.passbook_file,
    IBAN: detail.iban_number || 'N/A',
    Comment: '',
    originalData: detail
  }));

  const sortedAndFilteredUsers = (() => {
    let filteredData = [...transformedBankDetails];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((detail) =>
        [detail.AccountName, detail.AccountNumber, detail.Country, detail.BankName, detail.Status, detail.IBAN]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof BankDetail];
        const bValue = b[sortConfig.key as keyof BankDetail];

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
  const currentUsers = sortedAndFilteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  const columns: { key: keyof BankDetail; label: string }[] = [
    { key: 'id', label: '#' },
    { key: 'AccountName', label: 'Account Name' },
    { key: 'AccountNumber', label: 'Account Number' },
    { key: 'Country', label: 'Country' },
    { key: 'BankAddress', label: 'Bank Address' },
    { key: 'Status', label: 'Status' },
    { key: 'BankName', label: 'Bank Name' },
    { key: 'RegistrationDate', label: 'Registration Date' },
    { key: 'IBAN', label: 'IBAN No' },
  ];

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      'ID',
      'Account Name',
      'Account Number',
      'Country',
      'Bank Address',
      'Status',
      'Bank Name',
      'Registration Date',
      'Bank Book',
      'IBAN',
      'Comment',
    ];
    csvRows.push(headers.join(','));

    sortedAndFilteredUsers.forEach((user) => {
      const row = [
        user.id,
        `"${user.AccountName}"`,
        user.AccountNumber,
        user.Country,
        `"${user.BankAddress}"`,
        user.Status,
        `"${user.BankName}"`,
        user.RegistrationDate,
        user.BankBook || 'No image',
        user.IBAN,
        `"${user.Comment}"`,
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
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Bank Details List - Print</title>
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
                  font-size: 10px;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 6px;
                  text-align: left;
                  word-wrap: break-word;
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
              .bank-book-cell {
                  max-width: 80px;
                  overflow: hidden;
                  text-overflow: ellipsis;
              }
          </style>
      </head>
      <body>
          <h1>Bank Details List Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
              <br>
              Total Records: ${sortedAndFilteredUsers.length}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Account Name</th>
                      <th>Account Number</th>
                      <th>Country</th>
                      <th>Bank Address</th>
                      <th>Status</th>
                      <th>Bank Name</th>
                      <th>Registration Date</th>
                      <th>Bank Book</th>
                      <th>IBAN</th>
                      <th>Comment</th>
                  </tr>
              </thead>
              <tbody>
                  ${sortedAndFilteredUsers
                    .map(
                      (detail) => `
                      <tr>
                          <td>${detail.id}</td>
                          <td>${detail.AccountName}</td>
                          <td>${detail.AccountNumber}</td>
                          <td>${detail.Country}</td>
                          <td>${detail.BankAddress}</td>
                          <td>${detail.Status}</td>
                          <td>${detail.BankName}</td>
                          <td>${detail.RegistrationDate}</td>
                          <td class="bank-book-cell">${detail.BankBook ? 'Has Image' : 'No Image'}</td>
                          <td>${detail.IBAN}</td>
                          <td>${detail.Comment}</td>
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

  const handleApprove = (bankDetailId: number) => {
    console.log('Approving bank detail with ID:', bankDetailId);
  };

  if (bankMutation.isPending) {
    return (
      <div className="user-list-main">
        <h1 className='fw-bold'>Bank Details List</h1>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (bankMutation.isError) {
    return (
      <div className="user-list-main">
        <h1 className='fw-bold'>Bank Details List</h1>
        <div className="error">Error loading bank details</div>
      </div>
    );
  }

  return (
    <div className="user-list-main">
      <h1 className='fw-bold'>Bank Details List</h1>

      <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <div className='search-section'>
          <Form.Group as={Col} md='3' controlId='validationCustom04'>
            <Form.Control
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}
            />
          </Form.Group>

          <div className='user-list-btn'>
            <button onClick={exportToCSV}>
              <i className='fa-solid fa-file-csv'></i> CSV
            </button>
            <button onClick={handlePrint}>
              <i className='fa-solid fa-print'></i> PRINT
            </button>
          </div>
        </div>

        <div className='table-container' id='print-section'>
          <table className='table caption-top table-hover'>
            <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope='col'
                    onClick={() => requestSort(column.key)}
                    style={{ cursor: 'pointer' }}
                    className={`col-${columns.indexOf(column)}`}
                  >
                    {column.label}
                    <span style={{ marginLeft: '8px' }}>
                      {getSortIcon(column.key)}
                    </span>
                  </th>
                ))}
                <th scope='col' className="col-8">Bank Book</th>
                <th scope='col' className="col-10">Comment</th>
                <th scope='col' className="col-11">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <th className={`col-0 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.id}</th>
                  <td className={`col-1 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.AccountName}</td>
                  <td className={`col-2 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.AccountNumber}</td>
                  <td className={`col-3 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.Country}</td>
                  <td className={`col-4 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.BankAddress}</td>
                  <td className={`col-5 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.Status}</td>
                  <td className={`col-6 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.BankName}</td>
                  <td className={`col-7 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.RegistrationDate}</td>
                  <td className={`col-8 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.IBAN}</td>
                  <td className={`col-9 ${theme === "dark" ? "dark-mode-td" : ""}`}>
                    {user.BankBook ? (
                      <img
                        src={user.BankBook}
                        alt="Bank Book"
                        className="img-thumbnail document-thumbnail cursor-zoom"
                        style={{ maxWidth: '100px', maxHeight: '60px' }}
                        onClick={() => handleImageClick(user.BankBook)}
                        title="Click to view full image"
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td className={`col-10 ${theme === "dark" ? "dark-mode-td" : ""}`}>{user.Comment}</td>
                  <td className={`col-11 column-container ${theme === "dark" ? "dark-mode-td" : ""}`} colSpan={2}>
                    <div style={{ textAlign: 'center' }}>
                      <div className='action-btn1'>
                        <button onClick={() => handleApprove(user.id)}>Approve</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={12} className='text-center'>
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='pagination-container'>
          <div className='table-bottom-content'>
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

          <div className='pagination-controls'>
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
              alt="Bank book preview"
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

export default Bankdetailslist;