import { Form, Col } from 'react-bootstrap';
import './userlist.css';
import { ReactNode, useState } from 'react';
import { useTheme } from "../../../context/ThemeContext";

const followupuserss: {
    id: number;
    Name: string;
    phone: string;
    MT5GroupName: string;
    inverstorpassword: string;
    password: string;
    regDate: string;
}[] = [
    {
        id: 1,
        Name: 'Mark',
        phone: '123-456-7890',
        MT5GroupName: 'Group1',
        inverstorpassword: 'invpass123',
        password: 'pass123',
        regDate: '23-01-01'
    },
    {
        id: 2,
        Name: 'Jane',
        phone: '987-654-3210',
        MT5GroupName: 'Group2',
        inverstorpassword: 'invpass456',
        password: 'pass456',
        regDate: '23-02-15'
    }
];

const Userpasswordlist = () => {
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const { theme } = useTheme();

    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

    const filteredUsers = followupuserss.filter(user =>
        Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const exportToCSV = () => {
        const csvRows = [];

        const headers = [
            'ID',
            'Name',
            'Phone',
            'MT5 Group',
            'Investor Password',
            'Password',
            'Registration Date'
        ];
        csvRows.push(headers.join(','));

        filteredUsers.forEach(user => {
            const row = [
                user.id,
                user.Name,
                user.phone,
                user.MT5GroupName,
                user.inverstorpassword,
                user.password,
                user.regDate
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'user_password_list.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handlePrint = () => {
        const printSection = document.getElementById('print-section');
        const printContents = printSection ? printSection.innerHTML : '';
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (
        <div className='user-list-main'>
            <h1 className="fw-bold">User Password List</h1>

            <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                <div className='search-section'>
                    <Form.Group as={Col} md="3">
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}
                        />
                    </Form.Group>
                    <div className='user-list-btn'>
                        <button onClick={exportToCSV}><i className="fa-solid fa-file-csv"></i> CSV</button>
                        <button onClick={handlePrint}><i className="fa-solid fa-print"></i> PRINT</button>
                    </div>
                </div>

                <div className='table-container' id="print-section">
                    <table className="table caption-top table-hover">
                        <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
                        <tr>
                                {['#', 'Name', 'Email', 'Password', 'Phone Number', 'User Type'].map((col, index) => (
                                    <th key={index} scope="col" onClick={toggleSortDirection}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                                    <th className={theme === "dark" ? "dark-mode-td" : ""}>{user.id}</th>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Name}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.phone}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.MT5GroupName}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.inverstorpassword}</td>
                                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.password}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='pagination-container'>
                    <div className='table-bottom-content'>
                        <span>
                            Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredUsers.length)} of {filteredUsers.length} entries
                        </span>
                        <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                            {[5, 10, 15, 20].map(num => (
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

export default Userpasswordlist;
