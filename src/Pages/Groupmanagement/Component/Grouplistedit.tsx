import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { updateGroup, EditgroupCredentials } from "../../../api/group/editGroup";
import { getGroup as getAllGroups } from "../../../api/group/getGroup"; // Use the existing getGroup API
import { getGroupName } from "../../../api/group/getGrpName"; // Import for MT5 groups
import './addgroup.css';
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

const Grouplistedit = () => {
  const { id } = useParams<{ id: string }>();
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

  // Fetch all groups data and find the specific group by ID
  const { 
    data: groupsData, 
    isLoading: isGroupLoading, 
    isError: isGroupError,
    error: groupError 
  } = useQuery({
    queryKey: ['groups'],
    queryFn: getAllGroups,
    enabled: !!id, // Only run query if ID exists
  });

  // Find the specific group from the groups list
  const groupData = groupsData?.groups?.find(group => group.id === parseInt(id!));

  // Fetch MT5 group names
  const { 
    data: mt5GroupsData, 
    isLoading: isMT5GroupsLoading, 
    error: mt5GroupsError 
  } = useQuery({
    queryKey: ['mt5Groups'],
    queryFn: getGroupName,
  });

  // Update form data when group data is loaded
  useEffect(() => {
    if (groupData) {
      setFormData({
        groupName: groupData.groupName,
        mt5GroupName: groupData.mt5GroupName,
        groupStatus: groupData.status,
        groupType: groupData.groupType,
        currencyUnit: groupData.currencyUnit,
      });
    }
  }, [groupData]);

  const mutation = useMutation({
    mutationFn: (updatedGroup: EditgroupCredentials) => updateGroup(updatedGroup),
    onSuccess: (data) => {
      toast.success("Group updated successfully!");
      navigate("/groupmanagement/grouplist");
    },
    onError: (error: Error) => {
      toast.error(`Error updating group: ${error.message}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast.error("Group ID is missing");
      return;
    }

    const newErrors: { [key: string]: string } = {};
    
    // Validate required fields
    Object.keys(formData).forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `Please fill the ${field.replace(/([A-Z])/g, " $1")}`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const updatedGroupData: EditgroupCredentials = {
        id: parseInt(id),
        groupName: formData.groupName,
        mt5GroupName: formData.mt5GroupName,
        groupType: formData.groupType,
        currencyUnit: formData.currencyUnit,
        status: formData.groupStatus,
      };

      mutation.mutate(updatedGroupData);
    }
  };

  const getInputClass = (field: string) => (errors[field] ? "is-invalid" : "");

  // Loading state
  if (isGroupLoading) {
    return (
      <div className="grouplistedit-container">
        <div className="container mt-4 p-4 bg-white shadow-sm rounded">
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading group data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isGroupError) {
    return (
      <div className="grouplistedit-container">
        <div className="container mt-4 p-4 bg-white shadow-sm rounded">
          <div className="alert alert-danger">
            Error loading group data: {groupError?.message || "Unknown error"}
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate("/groupmanagement/grouplist")}
          >
            Back to Groups List
          </button>
        </div>
      </div>
    );
  }

  // Group not found state
  if (!groupData && !isGroupLoading) {
    return (
      <div className="grouplistedit-container">
        <div className="container mt-4 p-4 bg-white shadow-sm rounded">
          <div className="alert alert-warning">
            Group with ID {id} not found.
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate("/groupmanagement/grouplist")}
          >
            Back to Groups List
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className={`grouplistedit-container ${theme === "dark" ? "bg-black" : ""}`}>
      <div className={`container mt-4 p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark" : "bg-white"}`}>
        <h4 className="fw-bold mb-4" style={{ color: '#55da59' }}>Edit Group</h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="groupName">
                <Form.Label>Group Name <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  name="groupName" 
                  value={formData.groupName} 
                  onChange={handleChange} 
                  disabled={mutation.isPending}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  placeholder="Enter Group Name"
                />
                {errors.groupName && (
                  <small className="text-danger">{errors.groupName}</small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="mt5GroupName">
                <Form.Label>MT5 Group Name <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  name="mt5GroupName" 
                  value={formData.mt5GroupName} 
                  onChange={handleChange} 
                  disabled={mutation.isPending || isMT5GroupsLoading || !!mt5GroupsError}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                >
                  <option value="">Select MT5 Group Name</option>
                  {isMT5GroupsLoading ? (
                    <option disabled>Loading MT5 groups...</option>
                  ) : mt5GroupsError ? (
                    <option disabled>Error loading MT5 groups</option>
                  ) : (
                    mt5GroupsData?.data.map((group) => (
                      <option key={group.id} value={group.groupName}>
                        {group.groupName}
                      </option>
                    ))
                  )}
                </Form.Select>
                {errors.mt5GroupName && (
                  <small className="text-danger">{errors.mt5GroupName}</small>
                )}
                {mt5GroupsError && (
                  <small className="text-danger">Failed to load MT5 groups</small>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="groupStatus">
                <Form.Label>Group Status <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  name="groupStatus" 
                  value={formData.groupStatus} 
                  onChange={handleChange}
                  disabled={mutation.isPending}
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
              <Form.Group controlId="groupType">
                <Form.Label>Group Type <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  name="groupType" 
                  value={formData.groupType} 
                  onChange={handleChange}
                  disabled={mutation.isPending}
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
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="currencyUnit">
                <Form.Label>Currency Unit <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  name="currencyUnit" 
                  value={formData.currencyUnit} 
                  onChange={handleChange}
                  disabled={mutation.isPending}
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
              style={{
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                'Update Group'
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Grouplistedit;