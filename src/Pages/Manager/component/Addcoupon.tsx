import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";

const Addcoupon = () => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        amount: "",
        startDate: "",
        endDate: "",
        type: "",
        status: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Coupon Data:", formData);
    };

    return (
        <div style={{ padding: '80px 30px', marginTop: '20px' }}>
            <div className="container mt-4">
                <h2 className="fw-bold" style={{ color: '#55da59', fontSize: '30px' }}>
                    Add Coupon
                </h2>

                <div className=" rounded">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Enter Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="code"
                                        placeholder="Enter Code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        placeholder="Enter Description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="amount"
                                        placeholder="Enter Amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="bg-light"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Fixed">Fixed</option>
                                        <option value="Percentage">Percentage</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="bg-light"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button
                            type="submit"
                            style={{
                                background: "linear-gradient(45deg, #32cd32, #00b300)",
                                border: "none",
                                marginTop: "10px",
                                boxShadow: "0 4px 8px rgba(0, 128, 0, 0.3)"
                            }}
                            className="btn fw-bold px-4 text-white"
                        >
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Addcoupon;
