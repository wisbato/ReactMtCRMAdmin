import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addGroup, AddgroupCredentials } from "../../../api/group/addGroup";
import { getGroupName } from "../../../api/group/getGrpName"; // Import the getGroupName function
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import './addgroup.css';
import { useTheme } from "../../../context/ThemeContext";

const Addgroup = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    groupName: "",
    mt5GroupName: "",
    groupStatus: "",
    groupType: "",
    currencyUnit: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch MT5 group names using useQuery
  const { data: groupsData, isLoading: isGroupsLoading, error: groupsError } = useQuery({
    queryKey: ['mt5Groups'],
    queryFn: getGroupName,
  });

  // Define the mutation for adding a group
  const addGroupMutation = useMutation({
    mutationFn: (groupData: AddgroupCredentials) => addGroup(groupData),
    onSuccess: (data) => {
      toast.success(data.message || "Group added successfully!");
      navigate("/groupmanagement/grouplist");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add group");
    }
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    
    Object.keys(formData).forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `Please fill the ${field.replace(/([A-Z])/g, " $1")}`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const groupData: AddgroupCredentials = {
        groupName: formData.groupName,
        mt5GroupName: formData.mt5GroupName,
        groupType: formData.groupType,
        currencyUnit: formData.currencyUnit,
        status: formData.groupStatus
      };

      addGroupMutation.mutate(groupData);
    }
  };

  const getInputClass = (field: string) => (errors[field] ? "is-invalid" : "");
  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className="addgroup-wrapper">
      <div className="container mt-4">
        <h2 className="text" style={{color:'var(--primary-color)',fontSize:'30px',fontWeight:'bolder' }}>Add Group</h2>
        <Card className={`p-4 shadow-sm ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Group Name <span className="required-star">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleChange}
                  placeholder="Enter Group Name"
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                />
                {errors.groupName && (
                  <small className="text-danger">{errors.groupName}</small>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>MT5 Group Name <span className="required-star">*</span></Form.Label>
                <Form.Select
                  name="mt5GroupName"
                  value={formData.mt5GroupName}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  disabled={isGroupsLoading || !!groupsError}
                >
                  <option value="">Select MT5 Group Name</option>
                  {isGroupsLoading ? (
                    <option disabled>Loading groups...</option>
                  ) : groupsError ? (
                    <option disabled>Error loading groups</option>
                  ) : (
                    groupsData?.data.map((group) => (
                      <option key={group.id} value={group.groupName}>
                        {group.groupName}
                      </option>
                    ))
                  )}
                </Form.Select>
                {errors.mt5GroupName && (
                  <small className="text-danger">{errors.mt5GroupName}</small>
                )}
                {groupsError && (
                  <small className="text-danger">Failed to load MT5 groups</small>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Group Status <span className="required-star">*</span></Form.Label>
                <Form.Select
                  name="groupStatus"
                  value={formData.groupStatus}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                >
                  <option value="">Select Group Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
                {errors.groupStatus && (
                  <small className="text-danger">{errors.groupStatus}</small>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Group Type <span className="required-star">*</span></Form.Label>
                <Form.Select
                  name="groupType"
                  value={formData.groupType}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                >
                  <option value="">Select Group Type</option>
                  <option value="Live">Live</option>
                  <option value="Demo">Demo</option>
                </Form.Select>
                {errors.groupType && (
                  <small className="text-danger">{errors.groupType}</small>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Currency Unit <span className="required-star">*</span></Form.Label>
                <Form.Select
                  name="currencyUnit"
                  value={formData.currencyUnit}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                >
                  <option value="">Select Currency Unit</option>
                  <option value="Dollar">Dollar</option>
                  <option value="Cent">Cent</option>
                </Form.Select>
                {errors.currencyUnit && (
                  <small className="text-danger">{errors.currencyUnit}</small>
                )}
              </Form.Group>
            </Col>            
          </Row>
          <div className="user-list-btn">
            <button 
              type="submit"
              style={{fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}
              disabled={addGroupMutation.isPending}
            >
              {addGroupMutation.isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </Form>
        </Card>
      </div>
    </div>
  );
};

export default Addgroup;