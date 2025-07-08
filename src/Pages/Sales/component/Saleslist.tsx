import { SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Col, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const Saleslist = () => {
    const navigate = useNavigate();
    const navigateTosaleslist = () => {
        navigate('/sales/addsale');
    };
   

    const [users, setUsers] = useState([
        { id: 1, Name: 'tony', email: 'anu@gmail.com', mt5Id: 'MT5001', phone: '123-456-7890', country: 'USA', balance: 1000, regDate: '2023-01-01' },
        { id: 2, Name: 'tiny', email: 'anu@gmail.com', mt5Id: 'MT5001', phone: '123-456-7890', country: 'USA', balance: 1000, regDate: '2023-01-01' }

    ]);

    const [sortState, setSortState] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: number; Name: string; email: string } | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
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
    const handleEditClick = (user: { id: number; Name: string; email: string } | null) => {
        setSelectedUser(user);
        if (user) {
            setEditedName(user.Name);
            setEditedEmail(user.email);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleSaveChanges = () => {
        const updatedUsers = users.map((user) =>
            selectedUser && user.id === selectedUser.id
                ? { ...user, Name: editedName, email: editedEmail }
                : user
        );
        setUsers(updatedUsers);
        handleCloseModal();
    };

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
                user.mt5Id,
                user.email,
                user.phone,
                user.country,
                user.balance,
                user.Name,
                user.mt5Id,
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
        <div className='user-list-main'>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1 className="fw-bold">Sale List</h1>
                <div className='user-list-btn'>
                    <button
                        style={{
                            fontSize: '18px',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            minWidth: '180px',
                        }}
                        onClick={navigateTosaleslist}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Sales
                    </button>
                </div>
            </div>

            <div className='userlist-container'>
                <div className='search-section'>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
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
                            <tr>
                                {['#', 'Name', 'Email', 'Action'].map((col, index) => (
                                    <th key={index} scope="col" onClick={toggleSortDirection} style={{ minWidth: "180px", width: "220px" }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <th>{user.id}</th>
                                    <td>{user.Name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <FontAwesomeIcon icon={faPenToSquare} style={{ cursor: 'pointer' }} onClick={() => handleEditClick(user)} />
                                            <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer' }} />
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

            {/* EDIT MODAL */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fw-bold fs-5">Edit Sale List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label className="fw-semibold">
                                Full Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label className="fw-semibold">
                                Email <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={editedEmail}
                                onChange={(e) => setEditedEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-start">
                    <Button
                        onClick={handleSaveChanges}
                        style={{
                            background: 'linear-gradient(to right, #00c600, #00a300)',
                            border: 'none',
                            padding: '8px 24px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 198, 0, 0.3)',
                            fontWeight: 'bold'
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Saleslist;
