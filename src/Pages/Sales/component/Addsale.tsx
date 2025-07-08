import React, { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
// import './addsales.css';

interface FormData {
  email: string;
  password: string;
  fullName: string;
}

const AddSale = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "admin@gmail.com",
    password: "",
    fullName: "",
  }); 

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Please enter your full name";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="addsales-wrapper">
      <h3 className="fw-bold " style={{color:'#55da59'}}>Add Sales</h3>
      <div className="container mt-4 p-4  rounded">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formFullName">
                <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="bg-light text-dark"
                />
              </Form.Group>
            </Col>
          </Row>
          <Col md={6}>
          
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <Alert variant="danger" className="mt-1">{errors.password}</Alert>}
          </Form.Group>
          </Col>


          <Button
            type="submit"
            className="fw-bold px-4"
            style={{
              background: 'linear-gradient(45deg, #32cd32, #00b300, #007f00)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddSale;
