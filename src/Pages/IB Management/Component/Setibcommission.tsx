import { Form, Col, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

const usersData = [
  { id: 1, Plantype: 'tony', planname: 'anu@gmail.com', email: '8978687', name: 'dfghd', Date: 'dfhdg' },
  { id: 2, Plantype: 'ragu', planname: 'anu@gmail.com', email: '8978687', name: 'dfghd', Date: 'dfhdg' }
];

const Setibcommission = () => {
  const [sortState, setSortState] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSortDirection = () => {
    setSortState(sortState === null ? true : sortState ? false : null);
  };

  const filteredUsers = usersData.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className='user-list-main'>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 className="fw-bold">IB Commission List</h1>
        <div className='user-list-btn'>
          <button
            style={{
              fontSize: '18px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              minWidth: '250px',
            }}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add User Commission
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
                setCurrentPage(1);
              }}
              required />
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
                {['#', 'Plan Type', 'Plan Name', 'Email', 'Name', 'Date', 'Action'].map((col, index) => (
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
                  <td>{user.Plantype}</td>
                  <td>{user.planname}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.Date}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='pagination-container'>
          <div className='table-bottom-content'>
            <span>Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredUsers.length)} of {filteredUsers.length} entries</span>
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

        {/* Add User Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
            <Modal.Title style={{ fontWeight: "bold" }}>Add IB User Commission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Select className="bg-light">
                <option value="">Enter IB Name or Email</option>
                <option value="client1">Client 1</option>
                <option value="client2">Client 2</option>
                <option value="client3">Client 3</option>
              </Form.Select>

              <Form.Group controlId="ibPlanType" className="mt-3">
                <Form.Label>IB Plan Type <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Select className="bg-light">
                  <option value="">Select...</option>
                  <option value="traditional">Traditional</option>
                  <option value="modern">Modern</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="selectIBPlan" className="mt-3">
                <Form.Label>Select IB Plan <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  as="select"
                  style={{
                    height: "45px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option>Select...</option>
                  <option>Gold Plan</option>
                  <option>Silver Plan</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: "none", display: 'flex', justifyContent: 'start' }}>
            <Button
              style={{ background: "green", border: "none", padding: "10px 20px", borderRadius: "5px" }}
              onClick={() => setShowModal(false)}
            >
              Submit
            </Button>
            <Button
              style={{ background: "green", border: "none", padding: "10px 20px", borderRadius: "5px" }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit User Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
          <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
            <Modal.Title style={{ fontWeight: "bold", fontSize: "20px" }}>
              Edit Commission
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label>IB Plan Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser.planname}
                    onChange={(e) => setSelectedUser({ ...selectedUser, planname: e.target.value })}
                    className="bg-light"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="bg-light"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>IB Plan Type</Form.Label>
                  <Form.Select
                    className="bg-light"
                    value={selectedUser.Plantype}
                    onChange={(e) => setSelectedUser({ ...selectedUser, Plantype: e.target.value })}
                  >
                    <option>Traditional</option>
                    <option>Modern</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Select IB Plan</Form.Label>
                  <Form.Select
                    className="bg-light"
                    value={selectedUser.planname}
                    onChange={(e) => setSelectedUser({ ...selectedUser, planname: e.target.value })}
                  >
                    <option>Gold Plan</option>
                    <option>Silver Plan</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer style={{ borderTop: "none", justifyContent: "flex-start" }}>
  <Button
    style={{
      backgroundColor: "green",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
    }}
    onClick={() => {
      console.log('Updated user:', selectedUser);
      setShowEditModal(false);
    }}
  >
    Submit
  </Button>
</Modal.Footer>

        </Modal>
      </div>
    </div>
  );
};

export default Setibcommission;
