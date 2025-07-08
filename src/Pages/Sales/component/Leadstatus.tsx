import { Form, Col, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const Leadstatus = () => {
  const [users, setUsers] = useState([
    { id: 1, Name: 'tony', order: 'anu@gmail.com', action: '' },
    { id: 2, Name: 'manu', order: 'anu@gmail.com', action: '' }

  ]);

  const [sortState, setSortState] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editedName, setEditedName] = useState('');
  const [editedOrder, setEditedOrder] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
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
  const handleEdit = (user: { id: any; Name: any; order: any; action?: string; }) => {
    console.log('Edit button clicked for user:', user);
    setIsEditMode(true);
    setEditedName(user.Name);
    setEditedOrder(user.order);
    setCurrentUserId(user.id);
    setShowModal(true);
    console.log('Modal should be open now, showModal:', true);
  };

  const handleSave = () => {
    console.log('Saving changes...');
    if (editedName.trim() === '' || editedOrder.trim() === '') {
      console.log('Name or order is empty, not saving');
      return;
    }

    if (isEditMode && currentUserId !== null) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === currentUserId ? { ...u, Name: editedName, order: editedOrder } : u
        )
      );
      console.log('Updated existing user');
    } else {
      const newUser = {
        id: users.length + 1,
        Name: editedName,
        order: editedOrder,
        action: '',
      };
      setUsers([...users, newUser]);
      console.log('Added new user');
    }

    setShowModal(false);
    setEditedName('');
    setEditedOrder('');
    setIsEditMode(false);
    setCurrentUserId(null);
  };

  const handleAddNew1 = () => {
    console.log('Add New button clicked');
    setEditedName('');
    setEditedOrder('');
    setIsEditMode(false);
    setCurrentUserId(null);
    setShowModal(true);
    console.log('Modal should be open now, showModal set to:', true);
  };

  const handleClose = () => {
    console.log('Closing modal');
    setShowModal(false);
  };

  return (
    <div className="user-list-main">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 className="fw-bold">Lead Status</h1>
        <div className="user-list-btn">
          <button
            onClick={handleAddNew1}
            style={{
              fontSize: '18px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              minWidth: '200px',
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Lead Status
          </button>
        </div>
      </div>

      <div className="userlist-container">
        <div className="search-section">
          <Form.Group as={Col} md="3">
            <Form.Control type="text" placeholder="Search..."
             value={searchTerm}
             onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setCurrentPage(1); 
             }}
             required />
          </Form.Group>
          <div className="user-list-btn">
            <button><i className="fa-solid fa-file-csv"></i> CSV</button>
            <button><i className="fa-solid fa-print"></i> PRINT</button>
          </div>
        </div>

        <div className="table-container">
          <table className="table caption-top table-hover">
            <thead className="table-light">
              <tr>
                {['#', 'Name', 'Order', 'Action'].map((col, index) => (
                  <th key={index} scope="col" onClick={toggleSortDirection}>
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
                  <td>{user.order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <FontAwesomeIcon 
                        icon={faPenToSquare} 
                        onClick={() => handleEdit(user)} 
                        style={{ cursor: 'pointer' }} 
                      />
                      <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="table-bottom-content">
            <span>
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, users.length)} of {users.length} entries
            </span>
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="pagination-controls">
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

      {/* Modal */}
      <Modal 
        show={showModal} 
        onHide={handleClose} 
        centered 
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
          <Modal.Title>{isEditMode ? 'Edit Lead Status' : 'Add Lead Status'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-4" controlId="formFullName">
              <Form.Label>
                Full Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Full Name"
                className="py-2"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="formOrder">
              <Form.Label>
                Order <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Order"
                className="py-2"
                value={editedOrder}
                onChange={(e) => setEditedOrder(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer style={{ borderTop: "none", display: 'flex', justifyContent: 'start', gap: '1rem' }}>
          <Button
            style={{
              background: "linear-gradient(90deg, #00c800, #00b300)",
              border: "none",
              padding: "10px 30px",
              borderRadius: "8px",
              fontWeight: "600",
              boxShadow: "2px 2px 8px rgba(0, 200, 0, 0.4)"
            }}
            onClick={handleSave}
          >
            Submit
          </Button>
          <Button
            style={{
              background: "white",
              color: "#333",
              border: "1px solid #ddd",
              padding: "10px 30px",
              borderRadius: "8px",
              fontWeight: "600"
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leadstatus;