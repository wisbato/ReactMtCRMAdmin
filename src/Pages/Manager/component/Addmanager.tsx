import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";

const Addmanager = () => {
    const [formData, setFormData] = useState({
        managerName: "",
        password: "",
        platform: "",
        platformType: "",
        userId: "admin@gmail.com",
        server: "",
        failoverServer: "",
        failoverServer2: "",
        platformAPI: "",
        crmAPI: "",
        evaluationAPI: "",
        riskAPI: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    return (
        <div style={{
            // padding: '80px 30PX',
            // marginTop: '20px'
            minHeight:'900px    '
        }}>
            <div className="container mt-4">
                <h2 className="fw-bold " style={{ color: '#55da59', fontSize: '30px' }}>Add Manager</h2>

                <div className="p-4 bg-white shadow-sm rounded">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Manager Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="managerName"
                                        placeholder="Enter Name"
                                        value={formData.managerName}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Platform</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="platform"
                                        placeholder="Enter Platform"
                                        value={formData.platform}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Platform Type</Form.Label>
                                    <Form.Select
                                        name="platformType"
                                        value={formData.platformType}
                                        onChange={handleChange}
                                        className="bg-light"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Type1">Type 1</option>
                                        <option value="Type2">Type 2</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>User Id</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="userId"
                                        value={formData.userId}
                                        disabled
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Server</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="server"
                                        placeholder="Enter server"
                                        value={formData.server}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Failover Server</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="failoverServer"
                                        placeholder="Enter Failover Server"
                                        value={formData.failoverServer}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Failover Server 2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="failoverServer2"
                                        placeholder="Enter Failover Server 2"
                                        value={formData.failoverServer2}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Platform API</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="platformAPI"
                                        placeholder="Enter Platform API"
                                        value={formData.platformAPI}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CRM API</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="crmAPI"
                                        placeholder="Enter CRM API"
                                        value={formData.crmAPI}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Evaluation API</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="evaluationAPI"
                                        placeholder="Enter Evaluation API"
                                        value={formData.evaluationAPI}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>RISK API</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="riskAPI"
                                        placeholder="Enter RISK API"
                                        value={formData.riskAPI}
                                        onChange={handleChange}
                                        className="bg-light"
                                    />
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

export default Addmanager;
