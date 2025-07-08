import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTheme } from "../../../context/ThemeContext";

const Depositbankdetails = () => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        accountName: "",
        accountNumber: "",
        bankName: "",
        ifscSwiftCode: "",
        ibanNumber: "",
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    const inputStyle = {
        backgroundColor: theme === "dark" ? "#000000" : "",
        color: theme === "dark" ? "#ffffff" : "",
        borderColor: theme === "dark" ? "#212529" : ""
      };

    return (
        <div className="container mt-4">
            <h2 className="fw-bold" style={{ color: 'var(--primary-color)',fontSize:'30px' }}>Deposit Bank Details</h2>

            <div className={`p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Account Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="accountName"
                                placeholder="Enter Account Name"
                                value={formData.accountName}
                                onChange={handleChange}
                                style={inputStyle}
                                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Account No <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="accountNumber"
                                placeholder="Enter Account Number"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                style={inputStyle}
                                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            />
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Bank Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="bankName"
                                placeholder="Enter Bank Name"
                                value={formData.bankName}
                                onChange={handleChange}
                                style={inputStyle}
                                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>IFSC/Swift Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="ifscSwiftCode"
                                placeholder="Enter IFSC/Swift Code"
                                value={formData.ifscSwiftCode}
                                onChange={handleChange}
                                style={inputStyle}
                                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            />
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-3 col-md-6">
                        <Form.Label>IBAN No <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="ibanNumber"
                            placeholder="Enter IBAN No"
                            value={formData.ibanNumber}
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                        />
                    </Form.Group>
                    <Button
                        type="submit"
                        style={{ background: "var(--primary-gradient)", border: "none" }}
                        className="btn fw-bold px-4 text-white shadow-sm"
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Depositbankdetails;
