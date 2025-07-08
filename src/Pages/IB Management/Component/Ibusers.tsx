import { Form, Col, Dropdown } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faCopy, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const users = [
    { id: 1, Name: 'tony', Email: 'anu@gmail.com', PhoneNumber: '8978687', IBName: 'dfghd', AvailableCommission: 'dfhdg', TotalCommission: '45674', Refferallink: 'djhfjdf', selfibcommission: 'dfda', MT5id: '12345', Equity: '1000' },
    { id: 2, Name: 'john', Email: 'john@gmail.com', PhoneNumber: '1234567', IBName: 'abcd', AvailableCommission: 'abcd', TotalCommission: '78910', Refferallink: 'abcdlink', selfibcommission: 'abcd', MT5id: '67890', Equity: '2000' },
];

const Ibusers = () => {
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedIds, setCopiedIds] = useState<number[]>([]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: { target: any; }) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpenId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDropdownToggle = (id: number | null) => {
        setDropdownOpenId(prevId => (prevId === id ? null : id));
    };

    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

    // Handle copy link and toggle icon
    const handleCopyLink = (userId: number, referralLink: string) => {
        // Copy to clipboard functionality
        navigator.clipboard.writeText(referralLink).then(() => {
            // Toggle the copied state for this user
            setCopiedIds(prev => {
                if (prev.includes(userId)) {
                    return prev.filter(id => id !== userId);
                } else {
                    return [...prev, userId];
                }
            });
            
            // Reset back to copy icon after 2 seconds
            setTimeout(() => {
                setCopiedIds(prev => prev.filter(id => id !== userId));
            }, 2000);
        });
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

    // CSV Export
    const exportToCSV = () => {
        const csvRows = [];
        const headers = [
            'ID',
            'Name',
            'Email',
            'Phone Number',
            'IB Name',
            'Available Commission',
            'Total Commission',
            'Referral Link',
            'Self IB Commission',
            'MT5 ID',
            'Equity'
        ];
        csvRows.push(headers.join(','));

        users.forEach((user) => {
            const row = [
                user.id,
                user.Name,
                user.Email,
                user.PhoneNumber,
                user.IBName,
                user.AvailableCommission,
                user.TotalCommission,
                user.Refferallink,
                user.selfibcommission,
                user.MT5id,
                user.Equity
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'ib_users.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Print
    const handlePrint = () => {
        const printSection = document.getElementById('print-section');
        const printContents = printSection ? printSection.innerHTML : '';
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };

    // Action handlers
    const handleViewLevel = (userId: number) => {
        console.log(`View Level for user with ID: ${userId}`);
        // Implement view level functionality
        setDropdownOpenId(null);
    };

    const handleViewCommission = (userId: number) => {
        console.log(`View Commission for user with ID: ${userId}`);
        // Implement view commission functionality
        setDropdownOpenId(null);
    };

    return (
        <div className='user-list-main'>
            <h1 className="fw-bold">IB Users</h1>

            <div className='userlist-container'>
                <div className='search-section'>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); 
                            }}
                            required
                        />
                        <Form.Control.Feedback type="invalid">search...</Form.Control.Feedback>
                    </Form.Group>

                    <div className='user-list-btn'>
                        <button onClick={exportToCSV}><i className="fa-solid fa-file-csv"></i> CSV</button>
                        <button onClick={handlePrint}><i className="fa-solid fa-print"></i> PRINT</button>
                    </div>
                </div>

                {/* Table Section */}
                <div className='table-container' id="print-section">
                    <table className="table caption-top table-hover">
                        <thead className="table-light" style={{ minWidth: "180px", width: "220px" }}>
                            <tr>
                                {['#', 'Name', 'Email', 'Phone Number', 'IB Number', 'Available Commission', 'Total Commission', 'Referral Link', 'Self IB Commission', 'MT5 ID', 'Equity', 'Action'].map((col, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        onClick={toggleSortDirection}
                                        style={{ minWidth: "180px", width: "220px" }}
                                    >
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
                                    <td>{user.Email}</td>
                                    <td>{user.PhoneNumber}</td>
                                    <td>{user.IBName}</td>
                                    <td>{user.AvailableCommission}</td>
                                    <td>{user.TotalCommission}</td>
                                    <td style={{ color: 'green', cursor: 'pointer' }} onClick={() => handleCopyLink(user.id, user.Refferallink)}>
                                        <FontAwesomeIcon icon={copiedIds.includes(user.id) ? faCircleCheck : faCopy}  />
                                    </td>
                                    <td>{user.selfibcommission}</td>
                                    <td>{user.MT5id}</td>
                                    <td>{user.Equity}</td>
                                    <td>
                                        <div className='relative' ref={dropdownOpenId === user.id ? dropdownRef : null}>
                                            <FontAwesomeIcon 
                                                icon={faEllipsis} 
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDropdownToggle(user.id)}
                                            />
                                            
                                            {dropdownOpenId === user.id && (
                                                <div className="dropdown-menu show" style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    left: 'auto',
                                                    zIndex: 1000,
                                                    minWidth: '10rem',
                                                    padding: '0.5rem 0',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '0.25rem',
                                                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                                                    border: '1px solid rgba(0,0,0,.15)',
                                                    marginRight:'70px'
                                                }}>
                                                    <button 
                                                        className="dropdown-item" 
                                                        style={{ 
                                                            padding: '0.5rem 1.5rem',
                                                            clear: 'both',
                                                            fontWeight: 400,
                                                            color: '#212529',
                                                            textAlign: 'inherit',
                                                            whiteSpace: 'nowrap',
                                                            backgroundColor: 'transparent',
                                                            border: 0,
                                                            cursor: 'pointer',
                                                            width: '100%',
                                                           
                                                        }}
                                                        onClick={() => handleViewLevel(user.id)}
                                                    >
                                                        View Level
                                                    </button>
                                                    <button 
                                                        className="dropdown-item" 
                                                        style={{ 
                                                            padding: '0.5rem 1.5rem',
                                                            clear: 'both',
                                                            fontWeight: 400,
                                                            color: '#212529',
                                                            textAlign: 'inherit',
                                                            whiteSpace: 'nowrap',
                                                            backgroundColor: 'transparent',
                                                            border: 0,
                                                            cursor: 'pointer',
                                                            width: '100%',
                                                         
                                                           
                                                        }}
                                                        onClick={() => handleViewCommission(user.id)}
                                                    >
                                                        View Commission
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                <div className='pagination-container'>
                    <div className='table-bottom-content'>
                        <span>Showing {filteredUsers.length === 0 ? 0 : indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredUsers.length)} of {filteredUsers.length} entries</span>

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
        </div>
    );
};

export default Ibusers;