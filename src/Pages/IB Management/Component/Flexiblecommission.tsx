import { Form, Col, Modal, Row, Button } from 'react-bootstrap';
// import './userlist.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

const users = [
    {
        id: 1, name: 'tony', mt5GroupName: 'anu@gmail.com', Name: 'dfghd', Majorcurrency: 'dfhdg', Minorcurrency: 'dfhdg', Exotic: 'dfhdg', Metal: 'dgfh', Indices: 'ggg', Crypto: 'fghh', Energy: 'sdhsd', Date: 'dhf'
    },
];

const Flexiblecommission = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    
    // Form state
    const [formData, setFormData] = useState({
        group: '',
        commissionName: '',
        majorCurrency: '',
        minorCurrency: '',
        exotic: '',
        metal: '',
        indices: '',
        crypto: '',
        energy: ''
    });

    // Edit form state - initialize with the values you want to edit
    const [editFormData, setEditFormData] = useState({
        group: 'Standard - real\\WECNUSD',
        commissionName: 'test',
        majorCurrency: '1',
        minorCurrency: '1',
        exotic: '1',
        metal: '1',
        indices: '1',
        crypto: '',
        energy: '1'
    });

    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

    const handleChange = (event: ChangeEvent<any>) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditChange = (event: ChangeEvent<any>) => {
        const { name, value } = event.target;
        setEditFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log('Form submitted:', formData);
        setShowModal(false);
    };

    const handleEditSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log('Edit form submitted:', editFormData);
        setShowEditModal(false);
    };

    const handleEdit = (userId: number) => {
        setShowEditModal(true);
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

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    function gradient(arg0: number, deg: any, arg2: any, arg3: number, cd32: any, arg5: any, arg6: number, b300: any, arg8: any, arg9: number, f00: any) {
        throw new Error('Function not implemented.');
    }

    return (
      <div className='flexiblecommission'>
        <div className='user-list-main'>
            <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 className="fw-bold" style={{ color: '#55da59' }}>Flexible Commission List</h3>
                <div>
                    <button
                    className='flexiblecommission-btn'
                        style={{
                            fontSize: '18px',
                            whiteSpace: 'nowrap', 
                            display: 'flex',
                            alignItems: 'center', 
                            gap: '8px', 
                            padding: '12px 22px',
                            width:'auto',
                            minWidth: '260px',
                            backgroundColor: '#55da59',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowModal(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Flexible Commission
                    </button>
                </div>
            </div>

            <div className='userlist-container'>
                <div className='search-section'>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Control 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
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
                                {['#', 'Name', 'mt5 Group Name', 'Name', 'Major currency', 'Minor currency', 'Exotic', 'Metal', 'Indices', 'Crypto', 'Energy', 'Date', 'Action'].map((col, index) => (
                                    <th key={index} scope="col" onClick={toggleSortDirection} style={{ minWidth: "180px", width: "220px" }} >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <th>{user.id}</th>
                                    <td>{user.name}</td>
                                    <td>{user.mt5GroupName}</td>
                                    <td>{user.Majorcurrency}</td>
                                    <td>{user.Minorcurrency}</td>
                                    <td>{user.Exotic}</td>
                                    <td>{user.Metal}</td>
                                    <td>{user.Indices}</td>
                                    <td>{user.Crypto}</td>
                                    <td>{user.Energy}</td>
                                    <td>{user.Date}</td>
                                    <td>
                                        <FontAwesomeIcon 
                                            icon={faPenToSquare} 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={() => handleEdit(user.id)}
                                        />
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

            {/* Add Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton style={{ borderBottom: "none", background: "#f8f9fa" }}>
                    <Modal.Title>Add Flexible Commission</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-3">
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Select Group <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="group"
                                        value={formData.group}
                                        onChange={handleChange}
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    >
                                        <option value="">Enter Group Name</option>
                                        <option value="group1">Group 1</option>
                                        <option value="group2">Group 2</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Flexible Commission Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="commissionName"
                                        value={formData.commissionName}
                                        onChange={handleChange}
                                        placeholder="Enter Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Major Currency <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="majorCurrency"
                                        value={formData.majorCurrency}
                                        onChange={handleChange}
                                        placeholder="Enter Major Currency Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Minor Currency <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="minorCurrency"
                                        value={formData.minorCurrency}
                                        onChange={handleChange}
                                        placeholder="Enter Minor Currency Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Exotic <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="exotic"
                                        value={formData.exotic}
                                        onChange={handleChange}
                                        placeholder="Enter exotic Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Metal <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="metal"
                                        value={formData.metal}
                                        onChange={handleChange}
                                        placeholder="Enter metal Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Indices <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="indices"
                                        value={formData.indices}
                                        onChange={handleChange}
                                        placeholder="Enter indices Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Crypto <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="crypto"
                                        value={formData.crypto}
                                        onChange={handleChange}
                                        placeholder="Enter crypto Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Energy <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="energy"
                                        value={formData.energy}
                                        onChange={handleChange}
                                        placeholder="Enter energy Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: "none", justifyContent: 'flex-start', padding: "0 24px 24px 24px" }}>
                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        style={{ 
                            minWidth: "100px", 
                            height: "40px", 
                            borderRadius: "4px",
                            fontWeight: "700",
                            background: 'linear-gradient(45deg, #32cd32, #00b300, #007f00)',
                            border:'none',
                            fontSize:'16px',
                        }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => setShowModal(false)}
                        style={{ 
                            minWidth: "100px", 
                            height: "40px", 
                            borderRadius: "4px",
                            marginLeft: "10px",
                            borderColor: "#ced4da",
                            background: 'linear-gradient(45deg, #32cd32, #00b300, #007f00)',
                            border:'none',
                            color:'white',
                            fontWeight: "700",
                            fontSize:'16px',
                        }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
                <Modal.Header closeButton style={{ borderBottom: "none", background: "#f8f9fa" }}>
                    <Modal.Title>Edit Flexible Commission</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-3">
                    <Form onSubmit={handleEditSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Select Group <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="group"
                                        value={editFormData.group}
                                        onChange={handleEditChange}
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    >
                                        <option value="Standard - real\WECNUSD">Standard - real\WECNUSD</option>
                                        <option value="Premium">Premium</option>
                                        <option value="VIP">VIP</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Flexible Commission Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="commissionName"
                                        value={editFormData.commissionName}
                                        onChange={handleEditChange}
                                        placeholder="Enter Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Major Currency <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="majorCurrency"
                                        value={editFormData.majorCurrency}
                                        onChange={handleEditChange}
                                        placeholder="Enter Major Currency Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Minor Currency <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="minorCurrency"
                                        value={editFormData.minorCurrency}
                                        onChange={handleEditChange}
                                        placeholder="Enter Minor Currency Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Exotic <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="exotic"
                                        value={editFormData.exotic}
                                        onChange={handleEditChange}
                                        placeholder="Enter exotic Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Metal <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="metal"
                                        value={editFormData.metal}
                                        onChange={handleEditChange}
                                        placeholder="Enter metal Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Indices <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="indices"
                                        value={editFormData.indices}
                                        onChange={handleEditChange}
                                        placeholder="Enter indices Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Crypto <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="crypto"
                                        value={editFormData.crypto}
                                        onChange={handleEditChange}
                                        placeholder="Enter crypto Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Energy <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="energy"
                                        value={editFormData.energy}
                                        onChange={handleEditChange}
                                        placeholder="Enter energy Name"
                                        style={{ height: "48px", borderColor: "#ced4da" }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: "none", justifyContent: 'flex-start', padding: "0 24px 24px 24px" }}>
                    <Button
                        variant="success"
                        onClick={handleEditSubmit}
                        style={{ 
                            minWidth: "100px", 
                            height: "40px", 
                            borderRadius: "4px",
                            fontWeight: "700",
                            background: 'linear-gradient(45deg, #32cd32, #00b300, #007f00)',
                            border:'none',
                            fontSize:'16px',
                        }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => setShowEditModal(false)}
                        style={{ 
                            minWidth: "100px", 
                            height: "40px", 
                            borderRadius: "4px",
                            marginLeft: "10px",
                            borderColor: "#ced4da",
                            background: 'linear-gradient(45deg, #32cd32, #00b300, #007f00)',
                            border:'none',
                            color:'white',
                            fontWeight: "700",
                            fontSize:'16px',
                        }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </div>
    );
};

export default Flexiblecommission;