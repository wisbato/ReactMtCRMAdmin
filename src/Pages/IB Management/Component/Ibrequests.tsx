import { Form, Col } from 'react-bootstrap';
// import './userlist.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEllipsis, } from '@fortawesome/free-solid-svg-icons';

const users = [
    {
         id: 1, Name: 'tony', Email: 'anu@gmail.com', PhoneNumber: '8978687', Country: 'dfghd', RegistrationDate: 'dfhdg', Refferallink: 'example-link', AvailableCommission: 0, TotalCommission: 0, Equity: 0

         }
         ,
        {
            id: 2, Name: 'manu', Email: 'anu@gmail.com', PhoneNumber: '8978687', Country: 'dfghd', RegistrationDate: 'dfhdg', Refferallink: 'example-link', AvailableCommission: 0, TotalCommission: 0, Equity: 0
   
            }];

const Ibusers = () => {
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
        const [searchTerm, setSearchTerm] = useState('');
    

    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

   // 1. Filter users based on search
const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
);

// 2. Pagination based on filtered users
const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
const indexOfLastEntry = currentPage * entriesPerPage;
const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);


     // CSV export
     const exportToCSV = () => {
        const csvRows = [];
        const headers = [
            'ID',
            'Name',
            'Email',
            'Phone Number',
            'IB Name',
            'Available Commission',
            'Total Commission',
            'Referral Link',
            'Self IB Commission',
            'MT5 ID',
            'Equity'
        ];
        csvRows.push(headers.join(','));

        users.forEach((user) => {
            const row = [
                user.id,
                user.Name,
                user.Email,
                user.PhoneNumber,
                user.Name,
                user.AvailableCommission,
                user.TotalCommission || 0,
                user.Refferallink || '',
                '', // Placeholder for selfibcommission since it doesn't exist
                '', // Placeholder for MT5 ID since it doesn't exist
                user.Equity
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'ib_users.csv');
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
    };

    

    return (
        <div className='user-list-main'>
            <h1 className="fw-bold">Pending IB Request List</h1>

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
                        <button onClick={exportToCSV}><i className="fa-solid fa-file-csv"></i> CSV</button>
                        <button onClick={handlePrint}><i className="fa-solid fa-print"></i> PRINT</button>
                    </div>
                </div>
                <div className='table-container'>
                    <table className="table caption-top table-hover">
                        <thead className="table-light" style={{ minWidth: "180px", width: "220px" }}>
                            <tr >
                                {['#', 'Name', 'Email', 'Phone Number', 'Country', 'Registration Date', 'Action'].map((col, index) => (
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
                                    <td>{user.Name}</td>
                                    <td>{user.Email}</td>
                                    <td>{user.PhoneNumber}</td>
                                    <td>{user.Country}</td>
                                    <td>{user.RegistrationDate}</td>

                                    <td>
                                    </td>

                                    <td colSpan={2} >

                                        <FontAwesomeIcon icon={faEllipsis} />
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

export default Ibusers;
