import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTheme } from "../../../context/ThemeContext";

const IBwithdraw = () => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        ib: "",
        withdrawType: "",
        mt5Id: "",
        amount: "",
        comment: "",
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
            <h2 className="fw-bold" style={{ color: 'var(--primary-color)' ,fontSize:'30px'}}>IB Withdraw</h2>

            <div className={`p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Select IB <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="ib"
                            placeholder="Enter client name or email"
                            value={formData.ib}
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Withdraw Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                            name="withdrawType"
                            value={formData.withdrawType}
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                        >
                            <option value="">Select...</option>
                            <option value="Bank">Bank</option>
                            <option value="Wallet">Wallet</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex gap-3">
                        <Form.Group className="mb-3 w-50">
                            <Form.Label>
                                Select MT5 ID <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                name="mt5Id"
                                value={formData.mt5Id}
                                onChange={handleChange}
                                style={inputStyle}
                                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            >
                                <option value="">Select bank Account No.</option>
                                <option value="12345">12345</option>
                                <option value="67890">67890</option>
                                <option value="11223">11223</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 w-50">
                            <Form.Label>
                                Amount <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="amount"
                                placeholder="Enter Amount"
                                value={formData.amount}
                                onChange={handleChange}
                                style={inputStyle}
                                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Comment <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="comment"
                            placeholder="Comment..."
                            value={formData.comment}
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        style={{
                            background: "var(--primary-gradient)",
                            border: "none",
                            borderRadius: "8px",
                        }}
                        className="btn fw-bold px-4"
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default IBwithdraw;
