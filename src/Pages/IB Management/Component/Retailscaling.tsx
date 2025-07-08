import { Form, Col } from 'react-bootstrap';
// import './userlist.css';
import './retail.css'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const users = [
    { id: 1, Planname: 'tony',SymbolName: 'anu@gmail.com', TotalLevel
        : '8978687', TotalScaling: 'dfghd', MinimumBalance: 'dfhdg', MinimumActiveTrade
        : '11-09-2023',Date:'',Action:'' },];

const Retailscaling = () => {
    const navigate = useNavigate();
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

    const totalPages = Math.ceil(users.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = users.slice(indexOfFirstEntry, indexOfLastEntry);
    const handleTraditionalClick = () => {
        navigate('/ibmanagement/ibplan'); // Navigate to traditional IBplan
    };

    const handleRetailClick = () => {
        // Already on retail, no navigation needed
    };

    const handleAddPlanClick = () => {
        navigate('/addplan');
    };

    return (
        <div className='retail-main'>

        <div className='user-list-main'>
            <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', }}>

                    <button style={{ fontSize: '20px' }}  onClick={handleTraditionalClick}>Traditional</button>
                    <button style={{ fontSize: '20px' }}>Retail Scaling</button>
                </div>
                <div>
                    <button
                        style={{
                            fontSize: '18px',
                            whiteSpace: 'nowrap',

                        }}
                        onClick={handleAddPlanClick}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Plan
                    </button>
                </div>
            </div>

            <div className='userlist-container'>

                <div className='search-section'>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Search..." required />
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
                                {['#', 'Plan Name', 'Symbol Name', 'Total Level', 'Total Scaling', 'Minimum Balance', 'Minimum Active Trade', 'Date'].map((col, index) => (
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
                                    <td>{user.Planname}</td>
                                    <td>{user.SymbolName}</td>
                                    <td>{user.TotalLevel}</td>
                                    <td>{user.TotalScaling}</td>
                                    <td>{user.MinimumBalance}</td>

                                    <td>{user.MinimumActiveTrade}</td>
                                    <td>{user.Date}</td>
                                    <td><FontAwesomeIcon icon={faPenToSquare} /></td>
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
        </div>
    );
};

export default Retailscaling;
