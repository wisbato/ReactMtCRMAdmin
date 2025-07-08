import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
// import "./mt5account.css";

const  Moveclienttoib = () => {
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
      <h3 className="fw-bold" style={{color:'#55da59'}}>Assign Client To Under IB</h3>

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
          <Form.Group className="mb-3">
            <Form.Label>
              Select IB <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select 
              name="group" 
              value={formData.group} 
              onChange={handleChange}
              className="bg-light"
            >
              <option value="">Enter Clientname or Email</option>
              <option value="group1">Group 1</option>
              <option value="group2">Group 2</option>
              <option value="group3">Group 3</option>
            </Form.Select>
            {errors.group && <small className="text-danger">{errors.group}</small>}
          </Form.Group>

          {/* MT5 ID */}
         

          {/* Submit Button */}
          <div className="user-list-btn">
            <button style={{fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>Submit</button>

          </div>
        </Form>
      </div>
    </div>
  );
};

export default Moveclienttoib;
