import { Form, Col, Modal, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select } from 'antd';

const Ibplan = () => {
  const [sortState, setSortState] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ibPlanName, setIbPlanName] = useState('');
  const [activeUserRequired, setActiveUserRequired] = useState(false);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [minimumBalance, setMinimumBalance] = useState('');
  const [minimumLotSize, setMinimumLotSize] = useState('');
  const [minActiveUser, setMinActiveUser] = useState<string>('');
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const users = [
    {
      id: 1,
      Planname: 'tony',
      minimumlot: '1.2',
      minimumbalance: '500',
      minimumactiveusers: '3',
      PhoneNumber: '',
      Email: 'tony@example.com',
      symbolname: 'EURUSD, GBPUSD',
      date: '11-09-2023',
      IBName: 'Default IB Name',
      AvailableCommission: '',
      TotalCommission: '',
      Refferallink: '',
      selfibcommission: '',
      Equity: '',
      MT5id: ''
    },
    {
      id: 2,
      Planname: 'akhil',
      minimumlot: '1.2',
      minimumbalance: '500',
      minimumactiveusers: '3',
      PhoneNumber: '',
      Email: 'tony@example.com',
      symbolname: 'EURUSD, GBPUSD',
      date: '11-09-2023',
      IBName: 'Default IB Name',
      AvailableCommission: '',
      TotalCommission: '',
      Refferallink: '',
      selfibcommission: '',
      Equity: '',
      MT5id: ''
    }
  ];

  const symbolOptions = [
    { label: "EURUSD - Euro vs US Dollar", value: "EURUSD" },
    { label: "GBPUSD - British Pound vs US Dollar", value: "GBPUSD" },
    { label: "USDJPY - US Dollar vs Japanese Yen", value: "USDJPY" },
    { label: "BTCUSD - Bitcoin vs US Dollar", value: "BTCUSD" },
    { label: "XAUUSD - Gold vs US Dollar", value: "XAUUSD" },
  ];

  const filteredUsers = users.filter(user =>
    Object.values(user).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  const handleSubmit = () => {
    if (editingPlan) {
      // Update the plan
      console.log('Updated IB Plan:', {
        id: editingPlan.id,
        ibPlanName,
        symbols,
        activeUserRequired,
        minActiveUser,
        minimumBalance,
        minimumLotSize
      });
    } else {
      // Add new plan
      console.log({
        ibPlanName,
        symbols,
        activeUserRequired,
        minActiveUser,
        minimumBalance,
        minimumLotSize
      });
    }
    setShowModal(false);
  };

  const toggleSortDirection = () => {
    setSortState(prev => (prev === null ? true : prev ? false : null));
  };

  const handleEditClick = (plan: any) => {
    setEditingPlan(plan);
    setIbPlanName(plan.Planname);
    setSymbols(plan.symbolname.split(', ').map((symbol: string) => symbol));
    setActiveUserRequired(plan.minimumactiveusers !== '0');
    setMinActiveUser(plan.minimumactiveusers);
    setMinimumBalance(plan.minimumbalance);
    setMinimumLotSize(plan.minimumlot);
    setShowModal(true);
  };

  return (
    <div className='user-list-main'>
      <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          <button
            style={{
              fontSize: '20px',
              backgroundColor: location.pathname === '/ibmanagement/ibplan' ? '#f0f0f0' : 'transparent'
            }}
            onClick={() => navigate('/ibmanagement/ibplan')}
          >
            Traditional
          </button>
          <button
            style={{
              fontSize: '20px',
              backgroundColor: location.pathname === '/retail' ? '#f0f0f0' : 'transparent'
            }}
            onClick={() => navigate('/retail')}
          >
            Retail Scaling
          </button>
        </div>
        <button
          style={{
            fontSize: '18px',
            whiteSpace: 'nowrap',
          }}
          onClick={() => navigate('/addplan')}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Plan
        </button>
      </div>

      <div className='userlist-container'>
        <div className='search-section'>
          <Form.Group as={Col} md="3">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Form.Group>
          <div className='user-list-btn'>
            <button><i className="fa-solid fa-file-csv"></i> CSV</button>
            <button><i className="fa-solid fa-print"></i> PRINT</button>
          </div>
        </div>

        <div className='table-container'>
          <table className="table caption-top table-hover">
            <thead className="table-light"style={{width:'370px'}}>
              <tr style={{width:'370px'}}>
                {['#', 'Plan Name', 'Minimum Lot', 'Minimum Balance', 'Minimum Active Users', 'Symbol Name', 'Date', 'Action'].map((col, index) => (
                  <th key={index} onClick={toggleSortDirection} style={{ cursor: 'pointer' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <th>{user.id}</th>
                  <td>{user.Planname}</td>
                  <td>{user.minimumlot}</td>
                  <td>{user.minimumbalance}</td>
                  <td>{user.minimumactiveusers}</td>
                  <td >{user.symbolname}More...</td>
                  <td>{user.date}</td>
                  <td onClick={() => handleEditClick(user)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center">No results found.</td>
                </tr>
              )}
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
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
          <Modal.Title>{editingPlan ? 'Edit' : 'Add'} IB Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>IB Plan Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter IB Plan"
                value={ibPlanName}
                onChange={(e) => setIbPlanName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Symbol and Name</Form.Label>
              <Select
                mode="multiple"
                options={symbolOptions}
                value={symbols}
                onChange={(val) => setSymbols(val)}
                placeholder="Select symbols"
                style={{ width: '100%' }}
              />
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center gap-2">
              <Form.Check
                type="checkbox"
                checked={activeUserRequired}
                onChange={(e) => setActiveUserRequired(e.target.checked)}
              />
              <Form.Label className="m-0">Active User Required</Form.Label>
            </Form.Group>

           
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <button
            style={{
              background: "green",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            }}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
      {/* search symbol modal */}
      
    </div>
  );
};

export default Ibplan;
