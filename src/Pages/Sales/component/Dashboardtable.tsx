import { Form, Col } from 'react-bootstrap';
// import './userlist.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

const users = [
    {
        id: 1, nameemail: 'tony', Mt5id: 'anu@gmail.com', amount: '8978687', paymentMethod
            : 'dfghd', WithdrawTo
            : 'dfhdg', Note: 'dgfdhs', WithdrawStatus
            : 'bdfha', date: '22-09-25'
    },
    {
        id: 2, nameemail: 'rony', Mt5id: 'anu@gmail.com', amount: '8978687', paymentMethod
            : 'dfghd', WithdrawTo
            : 'dfhdg', Note: 'dgfdhs', WithdrawStatus
            : 'bdfha', date: '22-09-25'
    }];

const Dashboardtable = () => {
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
    return (
        <div className='user-list-main' style={{marginBottom:'30px',height:'100vh'}}>
            <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {/* <h3 className="fw-bold" style={{ color: '#55da59' }}>Pending IB Withdrawal</h3> */}
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

            <div className='userlist-container'>

                <div className='search-section'>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Search..."
                         value={searchTerm}
                         onChange={(e) => {
                             setSearchTerm(e.target.value);
                             setCurrentPage(1); // Reset page when searching
                         }}
                         required />
                        <Form.Control.Feedback type="invalid">search...</Form.Control.Feedback>
                    </Form.Group>
                    <div className='user-list-btn'>
                        <button><i className="fa-solid fa-file-csv"></i> CSV</button>
                        <button><i className="fa-solid fa-print"></i> PRINT</button>
                    </div>
                </div>
                <div className='table-container'>
                    <table className="table caption-top table-hover">
                        <thead className="table-light" style={{ minWidth: "180px", width: "220px" }}>
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
                                <tr key={user.id} >
                                    <th >{user.id}</th>
                                    <td>{user.nameemail}</td>
                                    <td>{user.Mt5id}</td>
                                    <td>{user.amount}</td>
                                    <td>{user.paymentMethod}</td>
                                    <td>{user.WithdrawTo}</td>

                                    <td>{user.Note}</td>
                                    <td>{user.WithdrawStatus}</td>
                                    <td>{user.date}

                                    </td>
                                    <td> 
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
        </div>
    );
};

export default Dashboardtable;
