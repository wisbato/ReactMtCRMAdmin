import React, { useState } from "react";
import { Form, Col, Row } from "react-bootstrap";

const Viewcommissionlist = () => {
    const [filters, setFilters] = useState({
        fromDate: "2025-03-30",
        toDate: "2025-04-09",
    });

    const users: any[] = []; // Empty to simulate "No records"
    const totalCommission = 0.0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4">
            <h2 style={{ color: "limegreen", fontWeight: "bold" }}>Commission List</h2>
            <Row className="my-3">
                <Col md={3}>
                    <Form.Label>From</Form.Label>
                    <Form.Control
                        type="date"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={handleChange}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>To</Form.Label>
                    <Form.Control
                        type="date"
                        name="toDate"
                        value={filters.toDate}
                        onChange={handleChange}
                    />
                </Col>
                <Col md={3} className="d-flex align-items-end">
                    <div className="border rounded shadow-sm p-3 w-100 text-center" style={{ borderLeft: "5px solid green" }}>
                        <div style={{ fontSize: "20px", fontWeight: 600 }}>{totalCommission.toFixed(4)}</div>
                        <div style={{ color: "#777" }}>Total Commission</div>
                    </div>
                </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Control type="text" placeholder="Search..." style={{ width: "250px" }} />
                <div>
                    <button className="btn btn-success me-2"><i className="fa fa-file-csv"></i> CSV</button>
                    <button className="btn btn-success"><i className="fa fa-print"></i> PRINT</button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover table-bordered">
                    <thead className="table-light">
                        <tr>
                            {["Id", "MT5 Id", "Date", "Order", "Symbol", "Price", "Profit", "Volume", "My Commission", "Type"].map((header, idx) => (
                                <th key={idx}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-4 text-muted">
                                    <i className="fa fa-eye-slash mb-2" style={{ fontSize: "20px" }}></i>
                                    <div>No records</div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    {/* map your user data here */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-end align-items-center mt-2">
                <Form.Select style={{ width: "80px" }}>
                    {[10, 25, 50].map((n) => (
                        <option key={n}>{n}</option>
                    ))}
                </Form.Select>
            </div>
        </div>
    );
};

export default Viewcommissionlist;
