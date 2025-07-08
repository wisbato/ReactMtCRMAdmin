import { Form, Col, Row, Modal, Button } from 'react-bootstrap';
// import './userlist.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus, faTrash, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';



const Couponlist= () => {
    const navigate = useNavigate();

    const navigateToAddnews = () => {
        navigate('/addcoupon');}
    const [editingCoupon, setEditingCoupon] = useState<any | null>(null); // Define editingCoupon state
    const [users, setUsers] = useState([
        { id: 1, Name: 'John Doe', Code: 'ABC123', StartDate: '2024-03-01', EndDate: '2024-04-01', Coupantype: 'Discount', Amount: '10%', Status: 'Inactive', RegistrationDate: '2024-02-20', Action: '' },
        { id: 2, Name: 'Jane Smith', Code: 'XYZ456', StartDate: '2024-03-05', EndDate: '2024-04-10', Coupantype: 'Cashback', Amount: '$5', Status: 'Active', RegistrationDate: '2024-02-22', Action: '' },
    ]);
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    
    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

    const totalPages = Math.ceil(users.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = users.slice(indexOfFirstEntry, indexOfLastEntry);
    const toggleStatus = (id: number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, Status: user.Status === "Active" ? "Inactive" : "Active" } : user
            )
        );
    };

    function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        throw new Error('Function not implemented.');
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        throw new Error('Function not implemented.');
    }

    return (

        <div className='user-list-main' style={{padding:'30px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}>

            <h1 className="fw-bold">Coupons List</h1>
            <div className='user-list-btn'>

            <button
                   style={{
                       fontSize: '18px',
                       whiteSpace: 'nowrap', 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: '8px', 
                       padding: '12px 24px', 
                       minWidth: '170px', 
                   }}
                   onClick={navigateToAddnews}
               >
                   <FontAwesomeIcon icon={faPlus} />
                  Add Coupons
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
                                {['#', 'Name', 'Code', 'Start Date','End Date','Coupantype','Amount','Status','Registration Date','Action'].map((col, index) => (
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
                                    <td>{user.Code}</td>
                                    <td>{user.StartDate}</td>
                                    <td>{user.EndDate}</td>
                                    <td>{user.Coupantype}</td>
                                    <td>{user.Amount}</td>
                                    <td>
                                        {/* ✅ UPDATED: Fixed button toggle functionality */}
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
                                    {/* <td>{user.Challenge} */}
                                    {/* <FontAwesomeIcon icon={faCircleXmark}  /> */}

                                    {/* </td> */}
                                    <td>{user.RegistrationDate}</td>
                                 


                                   
                                   <td>
                                    {user.Action}
                                    <div style={{display:'flex',gap:'10px'}}>

                                   <FontAwesomeIcon icon={faPenToSquare} onClick={handleOpenModal} />
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
            {/* modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
  <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
    <Modal.Title>
      Edit Coupon List
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form>
      <Row>
        <Col md={6}>
          {/* Name */}
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              className="py-2"
              value={editingCoupon?.Name || 'test1'}
              onChange={handleFormChange}
              name="Name"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          {/* Code */}
          <Form.Group className="mb-3" controlId="formCode">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              className="py-2"
              value={editingCoupon?.Code || 'Krishn@12344'}
              onChange={handleFormChange}
              name="Code"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {/* Start Date */}
          <Form.Group className="mb-3" controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              className="py-2"
              value={editingCoupon?.StartDate || '2025-02-17'}
              onChange={handleFormChange}
              name="StartDate"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          {/* End Date */}
          <Form.Group className="mb-3" controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              className="py-2"
              value={editingCoupon?.EndDate || '2025-02-20'}
              onChange={handleFormChange}
              name="EndDate"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {/* Description */}
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              className="py-2"
              value={editingCoupon?.Description || 'this was test description'}
              onChange={handleFormChange}
              name="Description"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          {/* Amount */}
          <Form.Group className="mb-3" controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              className="py-2"
              value={editingCoupon?.Amount || '1500'}
              onChange={handleFormChange}
              name="Amount"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {/* Type */}
          <Form.Group className="mb-3" controlId="formType">
            <Form.Label>Type</Form.Label>
            <Form.Select 
              className="py-2"
              value={editingCoupon?.Type || 'Fixed'}
              onChange={handleFormChange}
              name="Type"
            >
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          {/* Status */}
          <Form.Group className="mb-3" controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select
              className="py-2"
              value={editingCoupon?.Status || 'Active'}
              onChange={handleFormChange}
              name="Status"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  </Modal.Body>

  <Modal.Footer style={{ borderTop: "none", display: 'flex', justifyContent: 'start', gap: '1rem' }}>
    <Button
      style={{
        background: "linear-gradient(90deg, #00c800, #00b300)",
        border: "none",
        padding: "8px 20px",
        borderRadius: "8px",
        fontWeight: "600",
        boxShadow: "2px 2px 8px rgba(0, 200, 0, 0.4)"
      }}
      onClick={handleSubmit}
    >
      Submit
    </Button>
   
  </Modal.Footer>
</Modal>
            
        </div>
    );
};

export default Couponlist;

