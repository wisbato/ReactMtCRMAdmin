import { Form, Col } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubadmin } from '../../../api/subadmin/getSubadmin';
import useCan from "../../../../src/hooks/useCan";
import { useTheme } from "../../../context/ThemeContext";

const Subadminlist = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const can= useCan();
    
    // Modified to pass subadmin data when navigating
    const navigateToEditPermission = (subadmin: any) => {
        navigate('/addpermission', { 
            state: { 
                subadmin: subadmin 
            } 
        });
    }

    // Fetch subadmins using TanStack Query
    const { data: subadminsData, isLoading, error } = useQuery({
        queryKey: ['subadmins'],
        queryFn: getSubadmin,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);


    // Use actual data from API or empty array if loading/error
    const users = subadminsData?.data || [];
    
    const totalPages = Math.ceil(users.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = users.slice(indexOfFirstEntry, indexOfLastEntry);

    if (isLoading) {
        return <div>Loading subadmins...</div>;
    }

    if (error) {
        return <div>Error loading subadmins: {error.message}</div>;
    }

    return (
        <div className='user-list-main' style={{padding:'20px'}}>
            <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Sub Admin List</h3>
            </div>

            <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                <div className='search-section'>
                    <Form.Group as={Col} md="3">
                        <Form.Control type="text" placeholder="Search..." className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`} required />
                    </Form.Group>
                </div>

                <div className='table-container'>
                    <table className="table caption-top table-hover">
                        <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
                            <tr>
                                {['#', 'Name', 'Email', 'Password', 'Sub admin type', 'Group names', 'Date', 'Action'].map((col, index) => (
                                    <th key={index} scope="col">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={user.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                                    <th className={theme === "dark" ? "dark-mode-th" : ""}>{indexOfFirstEntry + index + 1}</th>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.name}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.email}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.password}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.permissiontype}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                                        {/* Only show group names for MT5GroupWise type */}
                                        {user.permissiontype === 'MT5GroupWise' 
                                            ? (user.groupPermissions && user.groupPermissions.length > 0 
                                                ? user.groupPermissions.map(g => g.groupName).join(', ')
                                                : 'No groups assigned')
                                            : 'N/A'}
                                    </td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                                        <div className='user-list-btn'>
                                            { can(['edit_permission', 'add_permission']) && <button
                                                style={{
                                                    fontSize: '14px',
                                                    whiteSpace: 'nowrap',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '12px 16px',
                                                    minWidth: '150px',
                                                }}
                                                onClick={() => navigateToEditPermission(user)} 
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                                Edit Permission
                                            </button>}
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
        </div>
    );
};

export default Subadminlist;