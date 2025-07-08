import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import './challengeconfiguaration.css'
import Phaseconfiguration from "./Phaseconfiguaration";

const Challengeconfiguaration = () => {
    const [formData, setFormData] = useState({
        challenge: "",
        description: "",
        currency: "",
        system: "",
        branch: "",
        operation: "",
        fee: "0",
        hidden: false,
        challengeStatic: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked; // Only applicable for checkboxes
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Form Submitted", formData);
        alert("Challenge Details Submitted!");
    };

    return (
        <div className="challenge-wrapper">
            <div className="p-4 rounded" style={{ background: "#fff" }}>
                <h3 className="fw-bold" style={{ color: "#55da59" }}>Challenge Details</h3>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Challenge</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="challenge"
                                    placeholder="Enter Challenge"
                                    value={formData.challenge}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Currency</Form.Label>
                                <Form.Select name="currency" value={formData.currency} onChange={handleChange}>
                                    <option value="">Select...</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control

                                    name="description"
                                    placeholder="Enter description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>System</Form.Label>
                                <Form.Select name="system" value={formData.system} onChange={handleChange}>
                                    <option value="">Select...</option>
                                    <option value="System1">System1</option>
                                    <option value="System2">System2</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Branch</Form.Label>
                                <Form.Select name="branch" value={formData.branch} onChange={handleChange}>
                                    <option value="">Select...</option>
                                    <option value="Branch1">Branch1</option>
                                    <option value="Branch2">Branch2</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Operation</Form.Label>
                                <Form.Select name="operation" value={formData.operation} onChange={handleChange}>
                                    <option value="">Select...</option>
                                    <option value="Op1">Operation 1</option>
                                    <option value="Op2">Operation 2</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Fee</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="fee"
                                    value={formData.fee}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Check
                                type="checkbox"
                                label="Hidden"
                                name="hidden"
                                checked={formData.hidden}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Check
                                type="checkbox"
                                label="Challenge Static"
                                name="challengeStatic"
                                checked={formData.challengeStatic}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    <Button
                        type="submit"
                        className="fw-bold px-4"
                        style={{
                            background: 'linear-gradient(45deg, #32cd32, #00b300, #007f00)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        Submit
                    </Button>
                </Form>
            </div>
            <div className="challenge-btn">
                <h1>Phase Configuration</h1>
                <div className='user-list-btn' >
                    <button style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', fontSize: '30px', padding: '12px' }}>+</button>
                </div>
            </div>
            <div>

            <Phaseconfiguration />
            </div> <div className='user-list-btn' >
                        <button className="challenge-btn-new" style={{display:'flex',textAlign:'center',justifyContent:'center',fontSize:'16px',marginTop:'20px'}}>Submit</button>
                    </div>  
            </div>
             

             

        // </div>
    );
};

export default Challengeconfiguaration;