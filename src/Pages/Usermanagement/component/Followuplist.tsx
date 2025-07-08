import { Form, Col } from 'react-bootstrap';
import './userlist.css';
import { useState } from 'react';
import { useTheme } from "../../../context/ThemeContext";

const followupuserss = [
  {
    id: 1,
    Name: 'Mark',
    Email: 'Otto',
    Phonenumber: '123-456-7890',
    Lastname: '@mdo',
    Country: 'USA',
    Date: '2023-01-01',
    phone: '123-456-7890',
    MT5GroupName: 'Group1',
    inverstorpassword: 'pass123',
    password: 'pass123',
    regDate: '2023-01-01',
  },
  {
    id: 2,
    Name: 'Geethu',
    Email: 'geethu@example.com',
    Phonenumber: '987-654-3210',
    Lastname: 'Mathew',
    Country: 'India',
    Date: '2023-02-14',
    phone: '987-654-3210',
    MT5GroupName: 'Group2',
    inverstorpassword: 'pass456',
    password: 'pass456',
    regDate: '2023-02-14',
  },
];

const Followuplist = () => {
  const [sortState, setSortState] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  const toggleSortDirection = () => {
    setSortState(sortState === null ? true : sortState ? false : null);
  };

  // Filter users based on search input
  const filteredUsers = followupuserss.filter((user) =>
    Object.values(user)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Country',
      'Wallet Balance',
      'IB Name',
      'MT5 ID',
      'Registration Date',
    ];
    csvRows.push(headers.join(','));

    filteredUsers.forEach((user) => {
      const row = [
        user.id,
        user.Name,
        user.phone,
        user.MT5GroupName,
        user.inverstorpassword,
        user.password,
        user.regDate,
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'followup_users.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printSection = document.getElementById('print-section');
    const printContents = printSection ? printSection.innerHTML : '';
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="user-list-main">
      <h1 className="fw-bold">Follow Up List</h1>

      <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <div className="search-section">
          <Form.Group as={Col} md="3" controlId="validationCustom04">
            <Form.Label></Form.Label>
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
            <Form.Control.Feedback type="invalid">search...</Form.Control.Feedback>
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
                {['#', 'Name', 'Email', 'Phone Number', 'Last Name', 'Country', 'Date'].map((col, index) => (
                  <th key={index} scope="col" onClick={toggleSortDirection}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                  <th className={theme === "dark" ? "dark-mode-td" : ""}>{user.id}</th>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Name}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Email}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Phonenumber}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Lastname}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Country}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="table-bottom-content">
            <span>
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredUsers.length)} of{' '}
              {filteredUsers.length} entries
            </span>
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
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

export default Followuplist;
