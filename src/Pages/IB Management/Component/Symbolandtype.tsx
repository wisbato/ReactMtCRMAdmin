import { Form, Col, Modal, Button } from 'react-bootstrap';
// import './userlist.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

const users = [
  { id: 1, name: 'tony', type: 'anu@gmail.com', mt5GroupName: '8978686', Name: 'dfghd', date: 'dfhdg' },
  { id: 2, name: 'teena', type: 'anu@gmail.com', mt5GroupName: '8978687', Name: 'dfghd', date: 'dfhdg' }
  ,];

const Symbolandtype = () => {
  const [sortState, setSortState] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setEditShowModal] = useState(false);


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


  function setShow(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className='user-list-main'>
      <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 className="fw-bold" style={{ color: '#55da59' }}>Symbol List</h3>
        <div>
          <button
            style={{
              fontSize: '18px',
              whiteSpace: 'nowrap',

            }}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Symbol
          </button>
        </div>
      </div>

      <div className='userlist-container'>

        <div className='search-section'>
          <Form.Group as={Col} md="3" controlId="validationCustom04">
            <Form.Label></Form.Label>
            <Form.Control type="text" placeholder="Search..."
             value={searchTerm}
             onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setCurrentPage(1); 
             }}
             required />
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
                {['#', 'Name', 'Type', 'mt5 Group Name', 'Name', 'Date', 'Action'].map((col, index) => (
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
                  <td>{user.name}</td>
                  <td>{user.type}</td>
                  <td>{user.mt5GroupName}</td>
                  <td>{user.Name}</td>
                  <td>{user.date}</td>

                  <td onClick={() => setShowModal(true)} >
                  <FontAwesomeIcon icon={faPenToSquare} />
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" style={{ padding: '12px' }}>
        <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
          <Modal.Title>
            Add IB User Commission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Select IB */}
            <Form.Select
              name="clientName"
              //   value={formData.clientName} 
              //   onChange={handleChange}
              className="bg-light"
            >
              <option value="">Enter IB Name or Email</option>
              <option value="client1">Client 1</option>
              <option value="client2">Client 2</option>
              <option value="client3">Client 3</option>
            </Form.Select>


            {/* IB Plan Type */}
            <Form.Group controlId="ibPlanType" className="mt-3">
              <Form.Label>
                IB Plan Type <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                name="clientName"

                className="bg-light"
              >
                <option value="">Select...</option>
                <option value="client1">Client 1</option>
                <option value="client2">Client 2</option>
                <option value="client3">Client 3</option>
              </Form.Select>
            </Form.Group>

            {/* Select IB Plan */}
            <Form.Group controlId="selectIBPlan" className="mt-3">
              <Form.Label>
                Select IB Plan <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter IB Plan"
                style={{
                  height: "45px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", display: 'flex', justifyContent: 'start' }}>
          <Button
            style={{
              background: "green",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            }}
            onClick={() => setShow(false)}
          >
            Submit
          </Button>
          <Button
            style={{
              background: "green",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            }}
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit modal */}
<Modal show={showEditModal} onHide={() => setEditShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
          <Modal.Title>Edit Symbol And Types</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Group <span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Select className="bg-light">
                <option>Zero Spread - real\\WECNUSD</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Symbol Name <span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Select className="bg-light">
                <option>FRANCE40</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Type <span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Select className="bg-light">
                <option>Metal</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", justifyContent: 'start' }}>
          <Button variant="success" onClick={() => setEditShowModal(false)}>Submit</Button>
          <Button variant="secondary" onClick={() => setEditShowModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Symbolandtype;
