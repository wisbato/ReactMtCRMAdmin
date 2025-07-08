import { div } from "framer-motion/client";
import React, { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import '../sales.css'

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  source: string;
  description: string;
}

const Addlead = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    status: "",
    source: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.status.trim()) newErrors.status = "Status is required";
    if (!formData.source.trim()) newErrors.source = "Source is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

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
    <div className="addlead-conatainer">
    <div className="addsales-wrapper">
      <h3 className="fw-bold" style={{ color: "#55da59" }}>Add Lead</h3>
      <div className="container mt-4 p-4 bg-white rounded shadow-sm">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="fullName">
                <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="phone">
                <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Enter Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-dark text-white color-white custom-placeholder"
                />
                {errors.phone && <small className="text-danger">{errors.phone}</small>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="country">
                <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select a country</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="India">India</option>
                </Form.Select>
                {errors.country && <small className="text-danger">{errors.country}</small>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="status">
                <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select Lead Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                </Form.Select>
                {errors.status && <small className="text-danger">{errors.status}</small>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="source">
                <Form.Label>Source <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select Lead Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                </Form.Select>
                {errors.source && <small className="text-danger">{errors.source}</small>}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
            <Form.Control
             
             
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <small className="text-danger">{errors.description}</small>}
          </Form.Group>

          <Button
            type="submit"
            className="fw-bold px-4"
            style={{
              backgroundColor: "#00cc00",
              border: "none",
              borderRadius: "8px",
              padding: "10px 25px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            Submit Form
          </Button>
        </Form>
      </div>
    </div>
    </div>
  );
};

export default Addlead;
