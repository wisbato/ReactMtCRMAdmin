import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import ReactQuill from "react-quill";

const Addnewgateway = () => {
    const [formData, setFormData] = useState({
        gatewayType: "",
        type: "",
        title: "",
        depositBy: "",
        depositCurrency: "",
        conversionPrice: "",
        titleDescription: "",
        minimum: "",
        maximum: "",
        depositDetails: "",
        image: null,
        logo: null,
        qrCode: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as any;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Manual Payment Gateway Data:", formData);
    };

    return (
        <div style={{ padding: "80px 30px", marginTop: "20px" }}>
            <div className="container mt-4">
                <h2 className="fw-bold" style={{ color: "#55da59", fontSize: "30px" }}>
                    Manual Payment Gateway
                </h2>

                <Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Type of Gateway</Form.Label>
                                <Form.Control type="text" name="gatewayType" placeholder="Enter gateway name" value={formData.gatewayType} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Control type="text" name="type" placeholder="Enter type" value={formData.type} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" name="image" onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" placeholder="Enter title" value={formData.title} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Deposit By</Form.Label>
                                <Form.Control type="text" name="depositBy" placeholder="Enter deposit by" value={formData.depositBy} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Deposit Currency</Form.Label>
                                <Form.Control type="text" name="depositCurrency" placeholder="Enter deposit currency" value={formData.depositCurrency} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Conversation Price</Form.Label>
                                <Form.Control type="text" name="conversionPrice" placeholder="Enter conversation price" value={formData.conversionPrice} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title Description</Form.Label>
                                <Form.Control type="text" name="titleDescription" placeholder="Enter title description" value={formData.titleDescription} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Minimum</Form.Label>
                                <Form.Control type="text" name="minimum" placeholder="Enter minimum price" value={formData.minimum} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Maximum</Form.Label>
                                <Form.Control type="text" name="maximum" placeholder="Enter maximum price" value={formData.maximum} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Deposit Details</Form.Label>
                        {/* <Form.Group className="mb-3"> */}
                       
                                               {/* Rich Text Editor */}
                                               <ReactQuill
                                                   value={formData.depositDetails}
                                                   onChange={(value) => setFormData({ ...formData, depositDetails: value })}
                                               />
                                           </Form.Group>
                    {/* </Form.Group> */}

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Logo</Form.Label>
                                <Form.Control type="file" name="logo" onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>QR Code</Form.Label>
                                <Form.Control type="file" name="qrCode" onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        type="submit"
                        className="btn text-white fw-bold"
                        style={{
                            background: "linear-gradient(45deg, #32cd32, #00b300)",
                            border: "none",
                            boxShadow: "0 4px 8px rgba(0, 128, 0, 0.3)"
                        }}
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Addnewgateway;
