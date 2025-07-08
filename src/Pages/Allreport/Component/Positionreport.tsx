import React, { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import Depositcard from "../../../Component/Dashboard/component/Depositcard";
import './positionreport.css';
import { useTheme } from "../../../context/ThemeContext";

interface Filters {
    status: string;
    paymentMethod: string;
    fromDate: string;
    toDate: string;
}

const users = [
    {
        Loginid: 1,
        Symbol: "tony",
        Type: "anu@gmail.com",
        Volume: "cvjv",
        OpenPrice: "dgd",
        SL: "dhf",
        tp: "cbs",
        CurrentPrice: "dd",
        status: 'fhjh',
        Profit: '23-07-23',
        m5id: "exampleM5ID"
    },
    {
        Loginid: 2,
        Symbol: "manu",
        Type: "anu@gmail.com",
        Volume: "cvjv",
        OpenPrice: "dgd",
        SL: "dhf",
        tp: "cbs",
        CurrentPrice: "dd",
        status: 'completed',
        Profit: '23-07-23',
        m5id: "exampleM5ID2"
    },
];

const Positionreport = () => {
    const { theme } = useTheme();
    const [filters, setFilters] = useState<Filters>({
        status: "",
        paymentMethod: "",
        fromDate: "",
        toDate: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        return (
            user.Loginid.toString().includes(query) ||
            (user.Symbol || "").toLowerCase().includes(query) ||
            (user.Type || "").toLowerCase().includes(query) ||
            (user.Volume || "").toLowerCase().includes(query) ||
            (user.OpenPrice || "").toLowerCase().includes(query) ||
            (user.SL || "").toLowerCase().includes(query) ||
            (user.tp || "").toLowerCase().includes(query) ||
            (user.CurrentPrice || "").toLowerCase().includes(query) ||
            (user.status || "").toLowerCase().includes(query) ||
            (user.Profit || "").toLowerCase().includes(query) ||
            (user.m5id || "").toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    return (
        <div className="positionreport-main1">
            <div className={`news-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
                <div className="user-list-main">
                    <div>
                        <h1 className="fw-bold">Position Report</h1>
                        <div className="flex gap-4 w-full md:w-[250px]">
                            <Depositcard title={"Balance"} value={"0"} />
                            <Depositcard title={"Balance"} value={"0"} />
                            <Depositcard title={"Balance"} value={"0"} />
                            <Depositcard title={"Balance"} value={"0"} />
                        </div>
                    </div>

                    <div className="mt5-search-container" style={{ display: "flex", gap: '60px', marginBottom: "20px" }}>
                        <Col md={4} className="status-dropdown">
                            <Form.Group controlId="status" className="mb-3">
                                <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                                <Form.Select value={filters.status} name="status" onChange={handleChange} className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}>
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Button
                            type="button"
                            style={{
                                background: "var(--primary-gradient)",
                                border: "none",
                            }}
                            className="btn fw-bold px-4"
                        >
                            Search
                        </Button>
                    </div>

                    <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                        <div className="search-section">
                            <Form.Group as={Col} md="3" controlId="search">
                                <Form.Control
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`${theme === "dark" ? "bg-black text-light dark-placeholder" : "bg-white"}`}
                                />
                            </Form.Group>
                            <div className="user-list-btn">
                                <button><i className="fa-solid fa-file-csv"></i> CSV</button>
                                <button><i className="fa-solid fa-print"></i> PRINT</button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table caption-top table-hover">
                                <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
                                    <tr>
                                        {[
                                            "#",
                                            "Login Id",
                                            "Symbol",
                                            "Type",
                                            "Volume",
                                            "Open Price",
                                            "S/L",
                                            "Current Price",
                                            "Profit",
                                        ].map((col, index) => (
                                            <th key={index} scope="col">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user.Loginid} className={theme === "dark" ? "dark-mode-tr" : ""}>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Loginid}</td>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Symbol}</td>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Type}</td>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Volume}</td>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.OpenPrice}</td>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.SL}</td>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.CurrentPrice}</td>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Profit}</td>
                                            <td className={theme === "dark" ? "dark-mode-td" : ""}></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination-container">
                            <div className="table-bottom-content">
                                <span>
                                    Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredUsers.length)} of {filteredUsers.length} entries
                                </span>
                                <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                                    {[5, 10, 15, 20].map((num) => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="pagination-controls">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>❮</button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={currentPage === index + 1 ? "active" : ""}
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
            </div>
        </div>
    );
};

export default Positionreport;
