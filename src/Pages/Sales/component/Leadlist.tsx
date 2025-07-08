import { Form, Col, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

// Initial user data
const initialUsers = [
  { 
    id: 1, 
    Name: 'tony', 
    Email: 'anu@gmail.com', 
    Phoneno: 'bcn', 
    Country: 'njnj', 
    Description: 'dfd', 
    Names: 'dhb', 
    namee: 'fggs', 
    action: '' 
  },
  { 
    id: 2, 
    Name: 'tonee', 
    Email: 'anu@gmail.com', 
    Phoneno: 'bcn', 
    Country: 'njnj', 
    Description: 'dfd', 
    Names: 'dhb', 
    namee: 'fggs', 
    action: '' 
  }
];

const Leadlist = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [sortState, setSortState] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<{
    id: number;
    Name: string;
    Email: string;
  } | null>(null);

  // Navigation handler
  const navigateToAddLead = () => {
    navigate('/addlead');
  };

  // Sort toggle handler
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

  // Modal open handler for edit
  const handleEdit = (user: any) => {
    setEditingUser({
      id: user.id,
      Name: user.Name,
      Email: user.Email
    });
    setShowModal(true);
  };

  // Modal close handler
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  // Form change handler
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [id === 'formFullName' ? 'Name' : 'Email']: value
      });
    }
  };

  // Form submit handler
  const handleSubmit = () => {
    if (editingUser) {
      // Update user in the list
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, Name: editingUser.Name, Email: editingUser.Email } 
          : user
      ));
      handleCloseModal();
    }
  };

  // Delete user handler
  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className='user-list-main'>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
        <h1 className="fw-bold">Lead List</h1>
        <div className='user-list-btn'>
          <button
            style={{
              fontSize: '18px',
              whiteSpace: 'nowrap',
              display: 'flex', 
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              minWidth: '200px',
            }}
            onClick={navigateToAddLead}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Lead List
          </button>
        </div>
      </div>

      <div className='userlist-container'>
        <div className='search-section'>
          <Form.Group as={Col} md="3" controlId="searchInput">
            <Form.Label></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required 
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
            <thead className="table-light">
              <tr>
                {['#', 'Name', 'Email', 'Phone no', 'Country', 'Description', 'Name', 'Name', 'Action'].map((col, index) => (
                  <th 
                    key={index} 
                    scope="col" 
                    onClick={index < 8 ? toggleSortDirection : undefined}
                    style={{ minWidth: "180px", width: "220px" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.Name}</td>
                  <td>{user.Email}</td>
                  <td>{user.Phoneno}</td>
                  <td>{user.Country}</td>
                  <td>{user.Description}</td>
                  <td>{user.Names}</td>
                  <td>{user.namee}</td>
                  <td>
                    <div style={{display:'flex', gap:'10px'}}>
                      <FontAwesomeIcon 
                        icon={faPenToSquare} 
                        style={{cursor: 'pointer'}}
                        onClick={() => handleEdit(user)}
                      />
                      <FontAwesomeIcon 
                        icon={faTrash} 
                        style={{cursor: 'pointer'}}
                        onClick={() => handleDelete(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className='pagination-container'>
          <div className='table-bottom-content'>
            <span>
              Showing {users.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, users.length)} of {users.length} entries
            </span>
            <select 
              value={entriesPerPage} 
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className='pagination-controls'>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ❮
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              ❯
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
          <Modal.Title>
            Edit Lead List
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {/* Full Name */}
            <Form.Group className="mb-3" controlId="formFullName">
              <Form.Label>
                Full Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                className="py-2"
                value={editingUser?.Name || ''}
                onChange={handleFormChange}
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>
                Email <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="py-2"
                value={editingUser?.Email || ''}
                onChange={handleFormChange}
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
            onClick={handleSubmit}
          >
            Update
          </Button>
          <Button
            style={{
              background: "linear-gradient(90deg, #ff3333, #cc0000)",
              border: "none",
              padding: "10px 30px",
              borderRadius: "8px",
              fontWeight: "600",
              boxShadow: "2px 2px 8px rgba(255, 51, 51, 0.4)"
            }}
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leadlist;