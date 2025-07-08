import { Form, Col, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

// Sample initial data
const initialUsers = [
  { id: 1, Name: 'tony', action: '' },
  { id: 2, Name: 'tony', action: '' },
];

const Leadsource = () => {
  // State management
  const [users, setUsers] = useState(initialUsers);
  const [sortState, setSortState] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
  });

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

  // Sort direction toggle
  const toggleSortDirection = () => {
    setSortState(sortState === null ? true : sortState ? false : null);
  };

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      fullName: value
    });
  };

  // Modal handlers
  const handleAddNew = () => {
    setFormData({ fullName: '' });
    setIsEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (userId: number, name: string) => {
    setFormData({ fullName: name });
    setIsEditMode(true);
    setEditId(userId);
    setShowModal(true);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSubmit = () => {
    if (formData.fullName.trim() === '') {
      alert('Name is required');
      return;
    }

    if (isEditMode && editId !== null) {
      setUsers(users.map(user =>
        user.id === editId ? { ...user, Name: formData.fullName } : user
      ));
    } else {
      const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
      setUsers([...users, { id: newId, Name: formData.fullName, action: '' }]);
    }

    setShowModal(false);
    setFormData({ fullName: '' });
  };

  const displayedUsers = searchTerm ? filteredUsers : currentUsers;

  return (
    <div className='user-list-main'>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 className="fw-bold">Lead Source</h1>
        <div className='user-list-btn'>
          <button
            onClick={handleAddNew}
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
            Add Lead Source
          </button>
        </div>
      </div>

      <div className='userlist-container'>
        <div className='search-section'>
          <Form.Group as={Col} md="3" controlId="searchInput">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <div className='user-list-btn'>
            <button><i className="fa-solid fa-file-csv"></i> CSV</button>
            <button><i className="fa-solid fa-print"></i> PRINT</button>
          </div>
        </div>

        <div className='table-container'>
          <table className="table caption-top table-hover">
            <thead className="table-light" style={{ minWidth: "180px", width: "220px" }}>
              <tr>
                {['#', 'Name', 'Action'].map((col, index) => (
                  <th
                    key={index}
                    scope="col"
                    onClick={index < 2 ? toggleSortDirection : undefined}
                    style={{ minWidth: "180px", width: "220px" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr key={user.id}>
                  <th>{user.id}</th>
                  <td>{user.Name}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(user.id, user.Name)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center">No records found</td>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
          <Modal.Title>{isEditMode ? 'Edit Lead Source' : 'Add Lead Source'}</Modal.Title>
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
                value={formData.fullName}
                onChange={handleChange}
              />
            </Form.Group>
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
          <Button
            style={{
              background: "linear-gradient(90deg, #ff3333, #cc0000)",
              border: "none",
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              boxShadow: "2px 2px 8px rgba(255, 51, 51, 0.4)"
            }}
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leadsource;
