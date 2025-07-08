import { Form, Col, Modal, Button } from 'react-bootstrap';
// import './userlist.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEllipsis, faCopy, faPenToSquare, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const users = [
    {
        
        id: 1, Planname: 'tony', Groupname: 'anu@gmail.com', Level1commission: '8978687', Level1d2: 'dfghd', Level1d3: 'dfhdg', Level2d3: '11-09-2023', Level3d3: 'dfhdg', Level1d4: 'dfhdg', Level2d4: 'dfhdg', Level1d5: 'dfhdg', Level2d5: 'dfhdg', Level3d5: 'dfhdg', Level4d5: 'dfhdg', Level5d5: 'dfhdg', date: '22-07-22'
     },
     {
        
        id: 2, Planname: 'teena', Groupname: 'anu@gmail.com', Level1commission: '8978687', Level1d2: 'dfghd', Level1d3: 'dfhdg', Level2d3: '11-09-2023', Level3d3: 'dfhdg', Level1d4: 'dfhdg', Level2d4: 'dfhdg', Level1d5: 'dfhdg', Level2d5: 'dfhdg', Level3d5: 'dfhdg', Level4d5: 'dfhdg', Level5d5: 'dfhdg', date: '22-07-22'
     }];

const Commissiongroup = () => {
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    // const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();


    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

    // Filter users based on search
    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Pagination calculations based on filtered users
    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);
    const handleTabChange = (tab: string) => {
        if (tab === 'traditional') {
            setActiveTab('traditional');
            // Stay on the current page, but set state to show the traditional component
        } else if (tab === 'retail') {
            setActiveTab('retail');
            navigate('/commissiongrpretail');
        }
    };

    // Handle navigation to add commission group
    const navigateToAddCommission = () => {
        navigate('/addcommissiongroup');
    };


    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{
        id?: number;
        ibPlanName?: string;
        groupName?: string;
        level1Commission?: string;
        level2Commission?: string;
    } | null>(null);

    // Sample IB Plan data
    const [ibPlans, setIbPlans] = useState([
        {
            id: 1,
            ibPlanName: "TESTPLAN1",
            groupName: "real\\WECNUSD-6+6com",
            level1Commission: "10",
            level2Commission: "5",
        },
        {
            id: 2,
            ibPlanName: "PLAN2",
            groupName: "real\\WECNUSD-7+7com",
            level1Commission: "8",
            level2Commission: "4",
        },
    ]);

    const handleEditClick = (item: { id?: number; ibPlanName?: string; groupName?: string; level1Commission?: string; level2Commission?: string }) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setSelectedItem((prev) => ({
            ...(prev || {}),
            [name]: value,
        }));
    };

    // Removed duplicate handleSubmit function
    interface CommissionItem {
        id?: number;
        Planname?: string;
        Groupname?: string;
        Level1commission?: string;
        Level1d2?: string;
        Level2d2?: string;
        Level1d3?: string;
        Level2d3?: string;
        Level3d3?: string;
        Level1d4?: string;
        Level2d4?: string;
        Level1d5?: string;
        Level2d5?: string;
        Level3d5?: string;
        Level4d5?: string;
        Level5d5?: string;
        date?: string;
    }
    // Removed duplicate handleInputChange function

    const handleSubmit = () => {
        if (!selectedItem) return;
        
        // Update the users array with the edited item
        const updatedUsers = users.map(user => 
            user.id === selectedItem.id ? { ...selectedItem } : user
        );
        
        // In a real app, you would typically send this to an API
        console.log("Updated user:", selectedItem);
        console.log("Updated users array:", updatedUsers);
        
        setShowModal(false);
    };

    return (
        <div className='user-list-main'>
            <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', }}>

                    <button style={{ fontSize: '20px' }} onClick={() => handleTabChange('traditional')}>Traditional</button>
                    <button style={{ fontSize: '20px' }} onClick={() => handleTabChange('retail')}>Retail Scaling</button>
                </div>
                <div>
                    <button
                        style={{
                            fontSize: '18px',
                            whiteSpace: 'nowrap', // Prevents wrapping
                            display: 'flex',
                            alignItems: 'center', // Aligns icon and text
                            gap: '8px', // Spacing between icon and text
                            padding: '12px 24px',
                            minWidth: '250px',
                        }}
                        onClick={navigateToAddCommission}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Commission Group
                    </button>
                </div>

            </div>

            <div className='userlist-container'>

                <div className='search-section'>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Search..."
                         value={searchQuery}
                         onChange={(e) => {
                           setSearchQuery(e.target.value);
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
                                {['#', 'Plan Name', 'Groupname', 'Level 1 commission', 'Level 1 (D2)', 'Level 2 (D2)', 'Level 1 (D3)', 'Level 2 (D3)', 'Level 3 (D3)', 'Level 1 (D4)', 'Level 2 (D4)', 'Level 1 (D5)', 'Level 2 (D5)', 'Level 3 (D5)', 'Level 4 (D5)', 'Level 4 (D5)', 'Date', 'Action'].map((col, index) => (
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
                                <tr key={user.id}>
                                    <th>{user.id}</th>
                                    <td>{user.Planname}</td>
                                    <td>{user.Groupname}</td>
                                    <td>{user.Level1commission}</td>
                                    <td>{user.Level1d2}</td>
                                    <td>{user.Level1d2}</td>
                                    <td>{user.Level1d3}</td>
                                    <td>{user.Level2d3}</td>
                                    <td>{user.Level3d3}</td>
                                    <td>{user.Level1d4}</td>
                                    <td>{user.Level2d4}</td>
                                    <td>{user.Level1d5}</td>
                                    <td>{user.Level2d5}</td>
                                    <td>{user.Level3d5}</td>
                                    <td>{user.Level4d5}</td>
                                    <td>{user.date}</td>
                                    <td>{user.date}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faEdit}

                                            onClick={() => handleEditClick(user)}
                                        />
                                        {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
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
            {/* modal for edit */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton style={{ borderBottom: "none", background: "#fafafa" }}>
                    <Modal.Title>Edit Tradinional</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {selectedItem && (
                        <Form>
                            <Form.Group controlId="ibPlanName" className="mb-3">
                                <Form.Label>IB Plan Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ibPlanName"
                                    value={selectedItem.ibPlanName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="groupName" className="mb-3">
                                <Form.Label>Group Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="groupName"
                                    value={selectedItem.groupName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>




                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 1 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level1Commission"
                                        value={selectedItem.level1Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>


                            </div>



                            <div className="row" style={{marginTop: "50px"}}>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 1 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level1Commission"
                                        value={selectedItem.level1Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>

                            <div className="row" style={{ marginTop: "50px" }}>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 1 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level1Commission"
                                        value={selectedItem.level1Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                           
                            <div className="row" style={{ marginTop: "50px" }}>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 1 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level1Commission"
                                        value={selectedItem.level1Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                            <div className="row" style={{ marginTop: "50px" }}>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 1 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level1Commission"
                                        value={selectedItem.level1Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                            <div className="row" style={{ marginTop: "50px" }}>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 1 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level1Commission"
                                        value={selectedItem.level1Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                            <div className="row" style={{ marginTop: "50px" }}>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 1 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level1Commission"
                                        value={selectedItem.level1Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                            <div className="row" style={{ marginTop: "50px" }}>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 1 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level1Commission"
                                        value={selectedItem.level1Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Label>Level 2 Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="level2Commission"
                                        value={selectedItem.level2Commission}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: "none", justifyContent: "start" }}>
                    <Button
                        style={{ background: "green", border: "none" }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                   
                </Modal.Footer>
            </Modal>



        </div>
    );
};

export default Commissiongroup;
function setActiveTab(arg0: string) {
    throw new Error('Function not implemented.');
}

