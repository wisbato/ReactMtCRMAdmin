import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./mt5account.css";

const Resendmt5datamail = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    group: "",
    mt5Id: "11111", // Pre-filled value
  });

  const [errors, setErrors] = useState<{ clientName?: string; group?: string; mt5Id?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { clientName?: string; group?: string; mt5Id?: string } = {};
    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!formData.group.trim()) newErrors.group = "Group is required";
    if (!formData.mt5Id.trim()) newErrors.mt5Id = "MT5 ID is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Client added successfully!");
    }
  };

  return (
    <div className="mt5account-wrapper">
      <h3 className="fw-bold text-success">Add Existing Client</h3>

      <div className="container mt-4 p-4 main-dashboard-form shadow-sm bg-white rounded">
        <Form onSubmit={handleSubmit}>
          {/* Client Name */}
          <Form.Group className="mb-3">
            <Form.Label>
              Select Client Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select 
              name="clientName" 
              value={formData.clientName} 
              onChange={handleChange}
              className="bg-light"
            >
              <option value="">Enter client name or email</option>
              <option value="client1">Client 1</option>
              <option value="client2">Client 2</option>
              <option value="client3">Client 3</option>
            </Form.Select>
            {errors.clientName && <small className="text-danger">{errors.clientName}</small>}
          </Form.Group>

          {/* Group */}
        

          {/* MT5 ID */}
         

          {/* Submit Button */}
          <Button type="submit" className="fw-bold px-4 btn" style={{ background: "green", border: "none", borderRadius: "5px" }}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Resendmt5datamail;
