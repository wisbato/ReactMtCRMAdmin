import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";

const Addons = () => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        value: "",
        price: "",
        status: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    return (
        <div style={{ padding: '80px 30px', marginTop: '20px' }}>
            <div className="container mt-4">
                <h2 className="fw-bold" style={{ color: '#55da59', fontSize: '30px' }}>Add-Ons</h2>

                <div className="p-4 bg-white shadow-sm rounded">
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
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="bg-light"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Type1">Type 1</option>
                                        <option value="Type2">Type 2</option>
                                        <option value="Type3">Type 3</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Value</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="value"
                                        placeholder="Enter value"
                                        value={formData.value}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="price"
                                        placeholder="Enter price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
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
                            style={{ background: "linear-gradient(45deg, #32cd32, #00b300)", border: "none" }}
                            className="btn fw-bold px-4 text-white shadow-sm"
                        >
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Addons;