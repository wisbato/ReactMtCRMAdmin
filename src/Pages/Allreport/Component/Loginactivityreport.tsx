import React, { useState } from "react";
import { Form, Col, Row } from "react-bootstrap";
import { useTheme } from "../../../context/ThemeContext";

// Define the type for filters
interface Filters {
    status: string;
    paymentMethod: string;
    fromDate: string;
    toDate: string;
}

const users = [
    {
        id: 1,
        LoginId
            : "1",
        Name: "anu@gmail.com",
        Email: "cvjv",
        Useragent: "dgd",
        Ipaddress: "dhf",
        Date: "cbs",
        paymentmethod: "Credit Card",
        status: "Pending", 


    },
    {
        id: 2,
        LoginId
            : "2",
        Name: "geethu123@gmail.com",
        Email: "cvjv",
        Useragent: "dgd",
        Ipaddress: "dhf",
        Date: "cbs",
        paymentmethod: "Credit Card",
        status: "Pending",


    },
    {
        id: 3,
        LoginId
            : "3",
        Name: "amar@gmail.com",
        Email: "cvjv",
        Useragent: "dgd",
        Ipaddress: "dhf",
        Date: "cbs",
        paymentmethod: "Credit Card",
        status: "Pending", 


    },
    {
        id: 4,
        LoginId
            : "4",
        Name: "amala123@gmail.com",
        Email: "cvjv",
        Useragent: "dgd",
        Ipaddress: "dhf",
        Date: "cbs",
        paymentmethod: "Credit Card",
        status: "Pending", 


    },
    {
        id: 5,
        LoginId
            : "5",
        Name: "reshmi@gmail.com",
        Email: "cvjv",
        Useragent: "dgd",
        Ipaddress: "dhf",
        Date: "cbs",
        paymentmethod: "Credit Card",
        status: "Pending", 


    },
    {
        id: 6,
        LoginId
            : "6",
        Name: "arunima123@gmail.com",
        Email: "cvjv",
        Useragent: "dgd",
        Ipaddress: "dhf",
        Date: "cbs",
        paymentmethod: "Credit Card",
        status: "Pending", 


    }
];

const Loginactivityreport = () => {
    const { theme } = useTheme();
    // Moved useState inside the functional component
    const [sortState, setSortState] = useState<boolean | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [filters, setFilters] = useState<Filters>({
        status: "",
        paymentMethod: "",
        fromDate: "",
        toDate: "",
    });
    const [country, setCountry] = useState<string>("");

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const toggleSortDirection = () => {
        setSortState(sortState === null ? true : sortState ? false : null);
    };

    const filteredUsers = users.filter(user =>
        user.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // user.paymentmethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // user.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.Date.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);
    return (
        <div className={`news-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
            <div className="user-list-main">
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: 'column', marginBottom: "20px" }}>
                    <h1 className="fw-bold">Login Activity Report</h1>
                    <div className="flex w-full">
                        <Row className="mb-3">
                            {/* Status Dropdown */}
                            <Col md={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                                    <Form.Select value={filters.status} name="status" onChange={handleChange} className={`${
                      theme === "dark"
                        ? "bg-dark text-light dark-placeholder"
                        : "bg-white"
                    }`}>
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {/* Payment Method Dropdown */}
                            <Col md={6}>
                                <Form.Group controlId="paymentMethod" className="mb-3">
                                    <Form.Label>Payment Method <span className="text-danger">*</span></Form.Label>
                                    <Form.Select value={filters.paymentMethod} name="paymentMethod" onChange={handleChange} className={`${
                      theme === "dark"
                        ? "bg-dark text-light dark-placeholder"
                        : "bg-white"
                    }`}>
                                        <option value="">Select Payment Method</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                </div>




                <div className={`userlist-container ${
              theme === "dark" ? "bg-dark text-light" : "bg-white"
            }`}>
                    <div className="search-section">
                        <Form.Group as={Col} md="3" controlId="validationCustom04">
                            <Form.Label></Form.Label>
                            <Form.Control type="text" placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`${
                                    theme === "dark"
                                      ? "bg-black text-light dark-placeholder"
                                      : "bg-white"
                                  }`}
                                required />
                            <Form.Control.Feedback type="invalid">search...</Form.Control.Feedback>
                        </Form.Group>
                        <div className="user-list-btn">
                            <button>
                                <i className="fa-solid fa-file-csv"></i> CSV
                            </button>
                            <button>
                                <i className="fa-solid fa-print"></i> PRINT
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="table caption-top table-hover">
                            <thead className={`table-light ${
                    theme === "dark" ? "dark-mode" : ""
                  }`} style={{ minWidth: "180px", width: "220px" }}>
                                <tr>
                                    {["Login Id", "Name", 'Email', "User agent", "Ip address", 'Date'].map((col, index) => (
                                        <th key={index} scope="col" onClick={toggleSortDirection} style={{ minWidth: "180px", width: "220px" }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                                        <th className={theme === "dark" ? "dark-mode-th" : ""}>{user.LoginId}</th>
                                        <th className={theme === "dark" ? "dark-mode-th" : ""}>{user.Name}</th>

                                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Email}</td>
                                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Useragent}</td>
                                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Ipaddress}</td>
                                        {/* <td></td> */}
                                        <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Date}</td>
                                        <td className={theme === "dark" ? "dark-mode-td" : ""}></td>

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
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="pagination-controls">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                                ❮
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </button>
                            ))}
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                                ❯
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loginactivityreport;
