import React, { useState } from "react";
import { Form } from "react-bootstrap";
import './addplan.css'
import { div } from "framer-motion/client";

const Addplan = () => {
  const [formData, setFormData] = useState({
    ibPlanName: "",
    ibPlanType: "",
    symbolName: "",
    activeUser: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

    function gradient(arg0: number, deg: any, arg2: any, arg3: number, cd32: any, arg5: any, arg6: number, b300: any, arg8: any, arg9: number, f00: any) {
        throw new Error("Function not implemented.");
    }

  return (
    <div className="addplan-main">

      <h2 className="fw-bold " style={{    color: '#55da59'}}>Add IB Plan</h2>
    <div className="container mt-4">

      <div className="p-4  rounded">
        <Form onSubmit={handleSubmit}>
          {/* IB Plan Name */}
          <div className="d-flex gap-3">
            <Form.Group className="mb-3 w-50">
              <Form.Label>
                IB Plan Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="ibPlanName"
                placeholder="Enter IB Plan Name"
                value={formData.ibPlanName}
                onChange={handleChange}
                className="bg-light"
              />
            </Form.Group>

            {/* IB Plan Type */}
            <Form.Group className="mb-3 w-50">
              <Form.Label>
                IB Plan Type <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="ibPlanType"
                value={formData.ibPlanType}
                onChange={handleChange}
                className="bg-light"
              >
                <option value="">Select IB Plan Type</option>
                <option value="Type1">Type 1</option>
                <option value="Type2">Type 2</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* Select Symbol Names */}
          <Form.Group className="mb-3">
            <Form.Label>Select Symbol Names</Form.Label>
            <Form.Control
              type="text"
              name="symbolName"
              placeholder="Search Symbol Name"
              value={formData.symbolName}
              onChange={handleChange}
              className="bg-light"
            />
          </Form.Group>

          {/* Active User Checkbox */}
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Check
              type="checkbox"
              name="activeUser"
              checked={formData.activeUser}
              onChange={handleChange}
            />
            <Form.Label className="ms-2">Active User Required</Form.Label>
          </Form.Group>

          {/* Submit Button */}
          <div>
            <button className="btn  px-4 py-2" style={{background: "linear-gradient(45deg, #32cd32, #00b300, #007f00)",border:'none'}}>Submit Form</button>
          </div>
        </Form>
      </div>
    </div>
    </div>
  );
};

export default Addplan;
