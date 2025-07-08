import { Form, Col } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Managerlist = () => {
    const navigate = useNavigate();
    const navigateToAddnews = () => {
        navigate('/addmanager');}
    const [users, setUsers] = useState([
        {
            id: 1, Name: "Image", Platform: "📷", PlatformType: "Inactive", Userid: "2025-03-03",
            password: 'dda', Server: 'sdsa', FailoverServer: 'vhvh', FailoverServer2: 'vvhh',
            CrmApi: 'vhvh', EvaluationApi: 'b b', RiskApi: 'nbnb', Status: "Inactive"
        },
        {
            id: 2, Name: "Text", Platform: "Text", PlatformType: "Inactive", Userid: "2025-03-04",
            password: 'dda', Server: 'sdsa', FailoverServer: 'vhvh', FailoverServer2: 'vvhh',
            CrmApi: 'vhvh', EvaluationApi: 'bnbnbn', RiskApi: 'nbnb', Status: "Inactive"
        },
        {
            id: 3, Name: "Text", Platform: "Text", PlatformType: "Inactive", Userid: "2025-03-07",
            password: 'dda', Server: 'sdsa', FailoverServer: 'vhvh', FailoverServer2: 'vvhh',
            CrmApi: 'vhvh', EvaluationApi: 'vbv', RiskApi: 'nbnb', Status: "Inactive"
        },
        {
            id: 4, Name: "Image", Platform: "📷", PlatformType: "Active", Userid: "2025-03-07",
            password: 'dda', Server: 'sdsa', FailoverServer: 'vhvh', FailoverServer2: 'vvhh',
            CrmApi: 'vhvh', EvaluationApi: 'bbn', RiskApi: 'nbnb', Status: "Active"
        }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const totalPages = Math.ceil(users.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = users.slice(indexOfFirstEntry, indexOfLastEntry);

    const toggleStatus = (id: number) => {
        setUsers((prevUsers) =>
            prevUsers.map(user =>
                user.id === id ? { ...user, Status: user.Status === "Active" ? "Inactive" : "Active" } : user
            )
        );
    };

    return (
        <div className='user-list-main'>
            <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 className="fw-bold" style={{ color: '#55da59' }}>Manager List</h3>
                <div className='user-list-btn'>
                    <button
                        style={{
                            fontSize: '18px',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 18px',
                            minWidth: '200px',
                        }}
                        onClick={navigateToAddnews} 
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Manager
                    </button>
                </div>
            </div>

            <div className='userlist-container'>
                <div className='search-section'>
                    <Form.Group as={Col} md="3">
                        <Form.Control type="text" placeholder="Search..." required />
                    </Form.Group>
                </div>

                <div className='table-container'>
                    <table className="table caption-top table-hover">
                        <thead className="table-light">
                            <tr>
                                {['#', 'Name', 'Platform', 'Platform Type', 'User ID', 'Password', 'Server', 'Failover Server', 'Failover Server 2', 'Crm API', 'Evaluation API', 'Risk API', 'Action'].map((col, index) => (
                                    <th key={index} scope="col">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <th>{user.id}</th>
                                    <td>{user.Name}</td>
                                    <td>{user.Platform}</td>
                                    <td >{user.PlatformType}</td>
                                    <td>{user.Userid}</td>
                                    <td>{user.password}</td>
                                    <td>{user.Server}</td>
                                    <td>{user.FailoverServer}</td>
                                    <td>{user.FailoverServer2}</td>
                                    <td>{user.CrmApi}</td>
                                    <td>{user.EvaluationApi}</td>
                                    <td>{user.RiskApi}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faPenToSquare} style={{ cursor: "pointer", marginRight: 10 }} />
                                        <FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", marginRight: 10 }} />
                                        <button
                                            onClick={() => toggleStatus(user.id)}
                                            style={{
                                                backgroundColor: user.Status === "Active" ? "#D32F2F" : "#2E7D32",
                                                color: "white",
                                                border: "none",
                                                padding: "8px 12px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {user.Status === "Active" ? "Inactive" : "Active"}
                                        </button>
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

export default Managerlist;
