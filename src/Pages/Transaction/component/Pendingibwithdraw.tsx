import { Form, Col } from 'react-bootstrap';
// import './userlist.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "../../../context/ThemeContext";

const users = [
    {
        id: 1, nameemail: 'tony', Mt5id: 'anu@gmail.com', email: 'anu@gmail.com', amount: '8978687', paymentMethod
            : 'dfghd', WithdrawTo
            : 'dfhdg', Note: 'dgfdhs', WithdrawStatus
            : 'bdfha', date: '22-09-25'
    },
    {
        id: 2, nameemail: 'john', Mt5id: 'anu@gmail.com', email: 'anu@gmail.com', amount: '8978687', paymentMethod
            : 'dfghd', WithdrawTo
            : 'dfhdg', Note: 'dgfdhs', WithdrawStatus
            : 'bdfha', date: '22-09-25'
    }];

const Pendingibwithdraw = () => {
    const { theme } = useTheme();
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');


    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

    // Filter users based on search
    const filteredUsers = users.filter((user) =>
      Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    // Pagination calculations based on filtered users
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
  
        users.forEach((user) => {
            const row = [
                user.id,
                user.Mt5id,
                user.Mt5id, // Assuming Mt5id is used as email or replace with the correct property
                '',
                '', 
                '', 
                user.nameemail,
                user.Mt5id,
                user.date || '',
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
        <div className='user-list-main' style={{ padding: '20px' }}>
            <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Pending IB Withdrawal</h3>
                {/* <div>
                    <button
                        style={{
                            fontSize: '18px',
                            whiteSpace: 'nowrap',

                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Symbol
                    </button>
                </div> */}
            </div>

            <div className={`userlist-container ${theme === "dark" ? "bg-dark" : ""}`}>

                <div className='search-section'>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Search..."
                         value={searchTerm}
                         onChange={(e) => {
                             setSearchTerm(e.target.value);
                             setCurrentPage(1); 
                         }}
                         className={`${theme === "dark" ? "bg-black text-light dark-placeholder" : "bg-white"}`}
                         required />
                        <Form.Control.Feedback type="invalid">search...</Form.Control.Feedback>
                    </Form.Group>
                    <div className='user-list-btn'>
                        <button onClick={exportToCSV}><i className="fa-solid fa-file-csv"></i> CSV</button>
                        <button onClick={handlePrint}><i className="fa-solid fa-print"></i> PRINT</button>
                    </div>
                </div>
                <div className='table-container'>
                    <table className="table caption-top table-hover">
                        <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`} style={{ minWidth: "180px", width: "220px" }}>
                            <tr >
                                {['#', 'Name / Email', 'Mt5 id', 'amount', 'paymentMethod', 'Withdraw To', 'Note', 'Withdraw Status','Date', 'Action'].map((col, index) => (
                                    <th key={index} scope="col" onClick={toggleSortDirection} style={{ minWidth: "180px", width: "220px" }} >
                                        {col}
                                        {/* <span style={{ marginLeft: '8px' }}>
                                        <i className={`fa-solid ${sortState === null ? 'fa-arrows-up-down' : sortState ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                                    </span> */}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                                    <th className={theme === "dark" ? "dark-mode-th" : ""}>{user.id}</th>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.nameemail}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Mt5id}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.amount}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.paymentMethod}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.WithdrawTo}</td>

                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Note}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.WithdrawStatus}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.date}

                                    </td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}> 
                                        {/* <div className='action-btn1'>
                                                <button>Submit</button>
                                            </div> */}

                                    </td>
                                   
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='pagination-container'>
                    <div className='table-bottom-content'>

                        <span>Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, users.length)} of {users.length} entries</span>
                        <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                            {[5, 10, 15, 20].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <div className='pagination-controls'>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>❮</button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                className={currentPage === index + 1 ? 'active' : ''}
                                onClick={() => setCurrentPage(index + 1)}

                            >
                                {index + 1}
                            </button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>❯</button>
                    </div>
                </div>
            </div>


            {/* modal */}
            
        </div>
    );
};

export default Pendingibwithdraw;
