import React, { useState } from "react";
import { Form } from "react-bootstrap";
import './addcommissiongrp.css'
import { div } from "framer-motion/client";
import { useNavigate } from "react-router-dom";

const Addibplan = () => {
  const [formData, setFormData] = useState({
    ibPlanName: "",
    groupName: "",
    level1Commission: "",
    level2Commission: "",
    level3Commission: "0",
  });
  const navigate = useNavigate();


  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    <div className="addcommissiongrp-main">

    <div className="container mt-4">
      {/* Back Button & Action Buttons */}
      <div className="user-list-btn d-flex justify-content-between mb-3">
      <button
  className="btn btn-success d-flex align-items-center justify-content-center"
  style={{ fontSize: '18px', width: '100px' }}
>
  Back
</button>
        <div className="user-list-btn">
          <button className="btn  me-2" style={{fontSize:'18px'}}>Traditional</button>
          <button className="btn" style={{fontSize:'18px'}} onClick={() => navigate('/commissiongrpretail')}>Retail Scaling</button>
        </div>
      </div>

      {/* Form Title */}
      {/* <h2 className="fw-bold text-success">Add IB Plan</h2> */}

      <div className="p-4 bg-white shadow-sm rounded">
        <Form onSubmit={handleSubmit}>
          {/* IB Plan & Group Selection */}
          <div className="d-flex gap-3">
            <Form.Group className="mb-3 w-50">
              <Form.Label>
                Select IB Plan <span className="text-danger">*</span>
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

            <Form.Group className="mb-3 w-50">
              <Form.Label>
                Select Group <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="groupName"
                placeholder="Enter Group Name"
                value={formData.groupName}
                onChange={handleChange}
                className="bg-light"
              />
            </Form.Group>
          </div>

          {/* Level 1 Setting */}
          <h5 className="fw-bold">Level-1 Setting</h5>
          <Form.Group className="mb-3">
            <Form.Label>Level 1 Commission</Form.Label>
            <Form.Control
              type="text"
              name="level1Commission"
              placeholder="Enter Level 1 Commission"
              value={formData.level1Commission}
              onChange={handleChange}
              className="bg-light"
            />
          </Form.Group>

          {/* Level 2 Setting */}
          <h5 className="fw-bold">Level-2 Setting</h5>
          <div className="d-flex gap-3">
            <Form.Group className="mb-3 w-50">
              <Form.Label>Level 1 Commission</Form.Label>
              <Form.Control
                type="text"
                name="level1Commission"
                placeholder="Enter Level 1 Commission"
                value={formData.level1Commission}
                onChange={handleChange}
                className="bg-light"
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>Level 2 Commission</Form.Label>
              <Form.Control
                type="text"
                name="level2Commission"
                placeholder="Enter Level 2 Commission"
                value={formData.level2Commission}
                onChange={handleChange}
                className="bg-light"
              />
            </Form.Group>
          </div>

          {/* Level 3 Setting */}
          <h5 className="fw-bold">Level-3 Setting</h5>
          <div className="d-flex gap-3">
            <Form.Group className="mb-3 w-50">
              <Form.Label>Level 1 Commission</Form.Label>
              <Form.Control
                type="text"
                name="level1Commission"
                placeholder="Enter Level 1 Commission"
                value={formData.level1Commission}
                onChange={handleChange}
                className="bg-light"
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>Level 2 Commission</Form.Label>
              <Form.Control
                type="text"
                name="level2Commission"
                placeholder="Enter Level 2 Commission"
                value={formData.level2Commission}
                onChange={handleChange}
                className="bg-light"
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>Level 3 Commission</Form.Label>
              <Form.Control
                type="text"
                name="level3Commission"
                value={formData.level3Commission}
                readOnly
                className="bg-light"
              />
            </Form.Group>
            
          </div>
          {/* level4 */}
          <h5 className="fw-bold">Level-4 Setting</h5>
<div className="row">
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 1 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level1Commission"
        placeholder="Enter Level 1 Commission"
        value={formData.level1Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 2 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level2Commission"
        placeholder="Enter Level 2 Commission"
        value={formData.level2Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 3 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level3Commission"
        value={formData.level3Commission}
         placeholder="Enter Level 3 Commission"
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 4 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 4 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
</div>

 {/* level5 */}
 <h5 className="fw-bold">Level-5 Setting</h5>
<div className="row">
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 1 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level1Commission"
        placeholder="Enter Level 1 Commission"
        value={formData.level1Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 2 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level2Commission"
        placeholder="Enter Level 2 Commission"
        value={formData.level2Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 3 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level3Commission"
        value={formData.level3Commission}
         placeholder="Enter Level 3 Commission"
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 4 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 4 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 5 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 5 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
</div>
 {/* level7 */}
 <h5 className="fw-bold">Level-7 Setting</h5>
<div className="row">
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 1 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level1Commission"
        placeholder="Enter Level 1 Commission"
        value={formData.level1Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 2 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level2Commission"
        placeholder="Enter Level 2 Commission"
        value={formData.level2Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 3 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level3Commission"
        value={formData.level3Commission}
         placeholder="Enter Level 3 Commission"
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 4 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 4 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 5 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 5 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 6 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 6 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
</div>

<h5 className="fw-bold">Level-6 Setting</h5>
<div className="row">
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 1 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level1Commission"
        placeholder="Enter Level 1 Commission"
        value={formData.level1Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 2 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level2Commission"
        placeholder="Enter Level 2 Commission"
        value={formData.level2Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 3 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level3Commission"
        value={formData.level3Commission}
         placeholder="Enter Level 3 Commission"
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 4 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 4 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 5 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 5 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 6 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 6 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 7 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 6 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
</div>


 {/* level7 */}
 <h5 className="fw-bold">Level-8 Setting</h5>
<div className="row">
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 1 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level1Commission"
        placeholder="Enter Level 1 Commission"
        value={formData.level1Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 2 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level2Commission"
        placeholder="Enter Level 2 Commission"
        value={formData.level2Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 3 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level3Commission"
        value={formData.level3Commission}
         placeholder="Enter Level 3 Commission"
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 4 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 4 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 5 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 5 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 6 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 6 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
</div>

<h5 className="fw-bold">Level-6 Setting</h5>
<div className="row">
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 1 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level1Commission"
        placeholder="Enter Level 1 Commission"
        value={formData.level1Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 2 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level2Commission"
        placeholder="Enter Level 2 Commission"
        value={formData.level2Commission}
        onChange={handleChange}
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 3 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level3Commission"
        value={formData.level3Commission}
         placeholder="Enter Level 3 Commission"
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>

  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 4 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 4 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 5 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 5 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 6 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 6 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 7 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 7 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
  <div className="col-md-4">
    <Form.Group className="mb-3">
      <Form.Label>Level 8 Commission</Form.Label>
      <Form.Control
        type="text"
        name="level4Commission"
         placeholder="Enter Level 8 Commission"
        value={formData.level1Commission}
        readOnly
        className="bg-light"
      />
    </Form.Group>
  </div>
</div>

<div className="user-list-btn">
          <button className="btn  me-2" style={{fontSize:'18px'}}>Submit</button>
        </div>


        </Form>
      </div>
    </div>
    </div>
  );
};

export default Addibplan;
