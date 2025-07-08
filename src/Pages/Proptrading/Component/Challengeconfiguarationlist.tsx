import { Form, Col } from 'react-bootstrap';
// import './userlist.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus, faTrash, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './challengeconfiguaration.css'
import { div } from 'framer-motion/client';

const users = [
    {
        id: 1, Challenge: ' ', Currency
            : 'anu@gmail.com', System: '', Branch: '', Operation: '', Fee
            : '', Hidden: '', ChallengeStatistics: '', Date: '',
    },];

const Challengeconfiguarationlist = () => {
    const navigate = useNavigate();

    const navigateToAddnews = () => {
        navigate('/challengeconfiguaration');
    }
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

    return (

        <div className='challengeconfiguarationlist-container'>
            <div className='user-list-main' style={{ padding: '30px' }}>
                <div className='challengeconfiguaration-title' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>

                    <h1 className="fw-boldd">Challenge Configuration List</h1>
                    <div className='user-list-btn'>

                        <button
                            style={{
                                fontSize: '18px',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                minWidth: '290px',
                            }}
                            onClick={navigateToAddnews}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Add Challenge configuration
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
                                    {['#', 'Challenge', 'Currency', 'System', 'Branch', 'Operation', 'Fee', 'Hidden', 'Challenge Statistics', 'Date', 'Action'].map((col, index) => (
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
                                        <td>{user.Challenge}</td>
                                        <td>{user.Currency}</td>
                                        <td>{user.System}</td>
                                        <td>{user.Branch}</td>
                                        <td>{user.Operation}</td>
                                        <td>{user.Fee}</td>
                                        <td>{user.Hidden}
                                            <FontAwesomeIcon icon={faCircleCheck} />
                                        </td>
                                        <td>{user.Challenge}
                                            <FontAwesomeIcon icon={faCircleXmark} />

                                        </td>
                                        <td>{user.ChallengeStatistics}
                                        </td>


                                        <td>
                                            <div style={{ display: 'flex', gap: '10px' }}>

                                                <FontAwesomeIcon icon={faPenToSquare} />
                                                <FontAwesomeIcon icon={faTrash} />
                                            </div>

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
        </div>
    );
};

export default Challengeconfiguarationlist;
