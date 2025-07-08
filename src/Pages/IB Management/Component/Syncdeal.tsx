import React, { useState } from "react";
import { Form } from "react-bootstrap";

const Syncdeal = () => {
  const [activeForm, setActiveForm] = useState("mt5"); // Default to showing MT5 form
  const [formData, setFormData] = useState({
    mt5Id: "",
    clientName: "", // Added for client form
    fromDate: "2025-02-25",
    toDate: "2025-03-07",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="container mt-4">
      {/* Page Title */}
      <h2 className="fw-bold" style={{color: '#55da59'}}>Sync Deal</h2>

      {/* Sync Buttons */}
      <div className='user-list-btn' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "center",
          flexWrap: "nowrap"
        }}>
          <button 
            style={{
              fontSize: '18px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              minWidth: '200px',
              backgroundColor: activeForm === "mt5" ? "#198754" : "", // Highlight active button
              color: activeForm === "mt5" ? "white" : ""
            }} 
            onClick={() => setActiveForm("mt5")}
          >
            Sync With MT5 Id
          </button>

          <button 
            style={{
              fontSize: '18px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              minWidth: '250px',
              backgroundColor: activeForm === "client" ? "#198754" : "", // Highlight active button
              color: activeForm === "client" ? "white" : ""
            }} 
            onClick={() => setActiveForm("client")}
          >
            Sync With Client Name
          </button>
        </div>
      </div>

      {/* Conditional Form Display */}
      {activeForm === "mt5" && (
        <div className="p-4 bg-white shadow-sm rounded">
          <Form onSubmit={handleSubmit}>
            {/* MT5 ID */}
            <Form.Group className="mb-3">
              <Form.Label>
                Select MT5 Account <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="mt5Id"
                placeholder="Enter MT5 ID"
                value={formData.mt5Id}
                onChange={handleChange}
                className="bg-light"
              />
            </Form.Group>

            {/* Date Fields */}
            <div className="d-flex gap-3">
              <Form.Group className="mb-3 w-50">
                <Form.Label>
                  From <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3 w-50">
                <Form.Label>
                  To <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            {/* Submit Button */}
            <div className="user-list-btn">
              <button type="submit" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Submit</button>
            </div>
          </Form>
        </div>
      )}

      {activeForm === "client" && (
        <div className="p-4 bg-white shadow-sm rounded">
          <Form onSubmit={handleSubmit}>
            {/* Client Name */}
            <Form.Group className="mb-3">
              <Form.Label>
                Select IB <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="clientName"
                placeholder="Enter Client Name"
                value={formData.clientName}
                onChange={handleChange}
                className="bg-light"
              />
            </Form.Group>

            {/* Date Fields */}
            <div className="d-flex gap-3">
              <Form.Group className="mb-3 w-50">
                <Form.Label>
                  From <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3 w-50">
                <Form.Label>
                  To <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            {/* Submit Button */}
            <div className="user-list-btn">
              <button type="submit" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Submit</button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Syncdeal;