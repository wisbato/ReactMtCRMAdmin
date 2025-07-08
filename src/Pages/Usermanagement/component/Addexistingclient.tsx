import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getName } from "../../../api/bank/getName";
import { getGroup } from "../../../api/group/getGroup";
import { toast } from "react-hot-toast";
import "./mt5account.css";
import { useTheme } from "../../../context/ThemeContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
}

interface Group {
  id: number;
  groupName: string;
  mt5GroupName: string;
}

interface FormControlElement extends HTMLElement {
  name: string;
  value: string;
}

const Addexistingclient = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    group: "",
    mt5Id: "",
  });

  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme } = useTheme();
  const [errors, setErrors] = useState<{
    clientName?: string;
    group?: string;
    mt5Id?: string;
  }>({});

  // TanStack Query for fetching users
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getName,
    staleTime: 5 * 60 * 1000,
  });

  // TanStack Query for fetching groups
  const {
    data: groupsData,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroup,
    staleTime: 5 * 60 * 1000,
  });

  const users = Array.isArray(usersData?.data) ? usersData?.data : [];
  const groups = Array.isArray(groupsData?.groups) ? groupsData?.groups : [];

  // Filter users based on search term
  const filteredUsers =
    users &&
    users.filter(
      (user: User) =>
        user.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(clientSearchTerm.toLowerCase())
    );

  const handleClientSelect = (user: User) => {
    setSelectedClient(user);
    setClientSearchTerm(user.name);
    setFormData({ ...formData, clientName: user.id.toString() });
    setShowDropdown(false);
  };

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientSearchTerm(value);
    setShowDropdown(true);

    if (selectedClient && selectedClient.name !== value) {
      setSelectedClient(null);
      setFormData({ ...formData, clientName: "" });
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { clientName?: string; group?: string; mt5Id?: string } = {};
    if (!formData.clientName.trim()) newErrors.clientName = "Please select a client";
    if (!formData.group.trim()) newErrors.group = "Group is required";
    if (!formData.mt5Id.trim()) newErrors.mt5Id = "MT5 ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!selectedClient) {
      setErrors({ ...errors, clientName: "Please select a valid client" });
      return;
    }

    const selectedGroup = groups?.find((g: Group) => g.id.toString() === formData.group);
    if (!selectedGroup) {
      setErrors({ ...errors, group: "Please select a valid group" });
      return;
    }

    // Here you would typically call your API to add the existing client
    console.log("Adding existing client:", {
      userId: selectedClient.id,
      mt5Id: formData.mt5Id,
      groupId: formData.group
    });

    // Simulate API call
    try {
      // await addExistingClientAPI(selectedClient.id, formData.mt5Id, formData.group);
      toast.success("Existing client added successfully!");
      
      // Reset form
      setFormData({
        clientName: "",
        group: "",
        mt5Id: ""
      });
      setSelectedClient(null);
      setClientSearchTerm("");
    } catch (err) {
      toast.error("Failed to add existing client");
      console.error(err);
    }
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <Container className={`mt-4 ${theme === "dark" ? "bg-black" : ""}`}>
      <h3 className="fw-bold" style={{ color: "var(--primary-color)" }}>
        Add Existing Client
      </h3>

      {usersError && (
        <Alert variant="danger" className="mb-3">
          Error loading users: {usersError.message}
        </Alert>
      )}

      {groupsError && (
        <Alert variant="danger" className="mb-3">
          Error loading groups: {groupsError.message}
        </Alert>
      )}

      <Card className={`p-4 shadow-sm ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group
                controlId="clientName"
                className="mb-3 position-relative"
              >
                <Form.Label>
                  Select Client Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={
                    isLoadingUsers
                      ? "Loading clients..."
                      : "Start typing client name or email..."
                  }
                  value={clientSearchTerm}
                  onChange={handleClientInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  disabled={isLoadingUsers}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                />

                {usersError && (
                  <div className="text-danger small mt-1">
                    Error loading clients: {usersError.message}
                  </div>
                )}

                {showDropdown && filteredUsers && filteredUsers.length > 0 && (
                  <div className="client-dropdown">
                    {filteredUsers.map((user: User) => (
                      <div
                        key={user.id}
                        style={inputStyle}
                        className="client-dropdown-item"
                        onMouseDown={() => handleClientSelect(user)}
                      >
                        <div className="fw-semibold">{user.name}</div>
                        <div className={`small ${theme === "dark" ? "color-white" : "text-muted"}`}>{user.email}</div>
                      </div>
                    ))}
                  </div>
                )}

                {showDropdown &&
                  clientSearchTerm &&
                  filteredUsers?.length === 0 &&
                  !isLoadingUsers && (
                    <div className="client-dropdown">
                      <div className="p-2 text-muted">
                        No clients found matching "{clientSearchTerm}"
                      </div>
                    </div>
                  )}

                {selectedClient && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <small className="text-success">
                      ✓ Selected: {selectedClient.name} ({selectedClient.email})
                    </small>
                  </div>
                )}
                {errors.clientName && (
                  <small className="text-danger">{errors.clientName}</small>
                )}
                <Form.Control
                  type="hidden"
                  name="clientName"
                  value={formData.clientName}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Select Group <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  disabled={isLoadingGroups}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                >
                  <option value="">Select a group</option>
                  {groups &&
                    groups.map((group: Group) => (
                      <option key={group.id} value={group.id}>
                        {group.groupName} (MT5: {group.mt5GroupName})
                      </option>
                    ))}
                </Form.Select>
                {isLoadingGroups && (
                  <small className="text-muted">Loading groups...</small>
                )}
                {errors.group && (
                  <small className="text-danger">{errors.group}</small>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  MT5 ID <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="mt5Id"
                  value={formData.mt5Id}
                  onChange={handleChange}
                  placeholder="Enter MT5 account ID"
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                />
                {errors.mt5Id && (
                  <small className="text-danger">{errors.mt5Id}</small>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            style={{
              background: "var(--primary-gradient)",
              border: "none",
            }}
            className="btn fw-bold px-4"
            disabled={isLoadingUsers || isLoadingGroups}
          >
            Add Client
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Addexistingclient;