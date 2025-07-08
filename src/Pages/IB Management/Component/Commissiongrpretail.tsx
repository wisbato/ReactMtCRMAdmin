import React, { FormEvent } from "react";
import { Form, useNavigate } from "react-router-dom"

const Commissiongrpretail = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('retail');
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        throw new Error("Function not implemented.")
    }

  const [formData, setFormData] = React.useState({
    ibPlanName: "",
    groupName: "",
  });


  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleTabChange = (tab: string) => {
    if (tab === 'traditional') {
        setActiveTab('traditional');
        navigate('/'); // Assuming your traditional view is at the root route
    } else if (tab === 'retail') {
        setActiveTab('retail');
        // Stay on the current page (retail view)
    }
};

// Handle back button click
const handleBack = () => {
    navigate('/'); // Navigate back to the main component
};

// Handle navigation to add commission group
const navigateToAddCommission = () => {
    navigate('/addcommissiongroup');
};

  return (
    <div className="addcommissiongrp-main">

    <div className="container mt-4">
      {/* Back Button & Action Buttons */}
      <div className="user-list-btn d-flex justify-content-between mb-3">
      <button
  className="btn btn-success d-flex align-items-center justify-content-center"
  style={{ fontSize: '18px', width: '100px' }}
  onClick={handleBack}
>
  Back
</button>
        <div className="user-list-btn">
          <button className="btn  me-2" style={{fontSize:'18px'}} onClick={() => handleTabChange('/traditional')}>Traditional</button>
          <button className="btn" style={{fontSize:'18px'}}     onClick={() => handleTabChange('/retail')} >Retail Scaling</button>
        </div>
      </div>

      {/* Form Title */}
      {/* <h2 className="fw-bold text-success">Add IB Plan</h2> */}

      <div className="p-4 bg-white shadow-sm rounded">
        <Form onSubmit={handleSubmit}>
          {/* IB Plan & Group Selection */}
          <div className="d-flex gap-3">
            <div className="mb-3 w-50">
              <label>
                Select IB Plan <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="ibPlanName"
                placeholder="Enter IB Plan Name"
                value={formData.ibPlanName}
                onChange={handleChange}
                className="form-control bg-light"
              />
            </div>

            <div className="mb-3 w-50">
              <label>
                Select Group <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="groupName"
                placeholder="Enter Group Name"
                value={formData.groupName}
                onChange={handleChange}
                className="form-control bg-light"
              />
            </div>
          </div>
        </Form>
          </div>
          </div>
          </div>
  )
}

export default Commissiongrpretail
