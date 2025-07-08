import React, { useState } from "react";
import { Button, Form, Col, Row, Badge, Alert } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getGroup } from "../../../api/group/getGroup";
import { addSubadmin } from "../../../api/subadmin/addSubadmin";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

interface Group {
  id: number;
  groupName: string;
  mt5GroupName: string;
}

const Createsubadmin = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    permissiontype: "", // Changed from 'type' to 'permissiontype'
    groupIds: [] as string[],
  });
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  // Fetch groups using TanStack Query
  const {
    data: groupsData,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroup,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for creating subadmin
  const { mutate: createSubadmin, isPending: isSubmitting } = useMutation({
    mutationFn: addSubadmin,
    onSuccess: (data) => {
      toast.success(data.message || "Subadmin created successfully");
      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        password: "",
        permissiontype: "", // Changed from 'type' to 'permissiontype'
        groupIds: [],
      });
      setSelectedGroups([]);
      setGroupSearchTerm("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create subadmin");
    },
  });

  const groups = Array.isArray(groupsData?.groups) ? groupsData?.groups : [];

  // Filter groups based on search term and exclude already selected groups
  const filteredGroups = groups?.filter(
    (group: Group) =>
      group.groupName.toLowerCase().includes(groupSearchTerm.toLowerCase()) &&
      !selectedGroups.some((selected) => selected.id === group.id)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedGroups([...selectedGroups, group]);
    setFormData({
      ...formData,
      groupIds: [...formData.groupIds, group.id.toString()],
    });
    setGroupSearchTerm("");
    setShowGroupDropdown(false);
  };

  const removeGroup = (groupId: number) => {
    setSelectedGroups(selectedGroups.filter((group) => group.id !== groupId));
    setFormData({
      ...formData,
      groupIds: formData.groupIds.filter((id) => id !== groupId.toString()),
    });
  };

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSearchTerm(e.target.value);
    setShowGroupDropdown(true);
  };

  const handleGroupInputFocus = () => {
    setShowGroupDropdown(true);
  };

  const handleGroupInputBlur = () => {
    setTimeout(() => setShowGroupDropdown(false), 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the data for the API
    const subadminData = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      permissiontype: formData.permissiontype, // Changed from 'type' to 'permissiontype'
      ...(formData.permissiontype === "MT5GroupWise" && { groupIds: formData.groupIds }),
    };

    // Call the mutation
    createSubadmin(subadminData);
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className="container">
      <h2 className="fw-bold" style={{ color: "var(--primary-color)", fontSize: "30px" }}>
        Create Sub Admin
      </h2>

      <div className={`p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark" : "bg-white"}`}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Full Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Permission Type <span className="text-danger">*</span> {/* Updated label */}
                </Form.Label>
                <Form.Select
                  name="permissiontype" // Changed from 'type' to 'permissiontype'
                  value={formData.permissiontype} // Changed from 'type' to 'permissiontype'
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                >
                  <option value="">Select Permission Type</option> {/* Updated placeholder */}
                  <option value="MenuWise">MenuWise</option>
                  <option value="MT5GroupWise">MT5GroupWise</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Conditionally render Group Name field when MT5GroupWise is selected */}
          {formData.permissiontype === "MT5GroupWise" && ( // Changed from 'type' to 'permissiontype'
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>
                    Select Group(s) <span className="text-danger">*</span>
                  </Form.Label>

                  <div
                    className="form-control d-flex flex-wrap align-items-center gap-2 p-2 position-relative"
                    style={{ minHeight: "42px" }}
                  >
                    {/* Selected groups pills inside the input */}
                    {selectedGroups.map((group) => (
                      <Badge
                        key={group.id}
                        pill
                        bg="success"
                        className="d-flex align-items-center px-3 py-2"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {group.groupName}
                        <button
                          type="button"
                          className="ms-2 btn-close btn-close-white"
                          style={{ fontSize: "0.5rem" }}
                          onClick={() => removeGroup(group.id)}
                          aria-label="Remove"
                        />
                      </Badge>
                    ))}

                    {/* Search input */}
                    <input
                      type="text"
                      placeholder={
                        selectedGroups.length === 0
                          ? isLoadingGroups
                            ? "Loading groups..."
                            : "Start typing group name..."
                          : ""
                      }
                      value={groupSearchTerm}
                      onChange={handleGroupInputChange}
                      onFocus={handleGroupInputFocus}
                      onBlur={handleGroupInputBlur}
                      disabled={isLoadingGroups}
                      style={{
                        border: "none",
                        outline: "none",
                        flex: "1",
                        minWidth: "120px",
                        backgroundColor: "transparent",
                        paddingRight: selectedGroups.length > 0 ? "30px" : "0",
                      }}
                    />

                    {/* Clear all icon at the end */}
                    {selectedGroups.length > 0 && (
                      <button
                        type="button"
                        className="btn-close position-absolute"
                        style={{
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "0.7rem",
                        }}
                        onClick={() => {
                          setSelectedGroups([]);
                          setFormData({ ...formData, groupIds: [] });
                        }}
                        aria-label="Clear all selections"
                        title="Clear all selections"
                      />
                    )}
                  </div>

                  {groupsError && (
                    <Alert variant="danger" className="mt-2">
                      Error loading groups: {(groupsError as Error).message}
                    </Alert>
                  )}

                  {showGroupDropdown &&
                    filteredGroups &&
                    filteredGroups.length > 0 && (
                      <div className="client-dropdown">
                        {filteredGroups.map((group: Group) => (
                          <div
                            key={group.id}
                            className="client-dropdown-item"
                            onMouseDown={() => handleGroupSelect(group)}
                          >
                            <div className="fw-semibold">{group.groupName}</div>
                            <div className="text-muted small">
                              {group.mt5GroupName}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {showGroupDropdown &&
                    groupSearchTerm &&
                    filteredGroups?.length === 0 &&
                    !isLoadingGroups && (
                      <div className="client-dropdown">
                        <div className="p-2 text-muted">
                          No groups found matching "{groupSearchTerm}"
                        </div>
                      </div>
                    )}
                </Form.Group>
              </Col>
            </Row>
          )}

          <Button
            type="submit"
            style={{
              background: "var(--primary-gradient)",
              border: "none",
            }}
            className="btn fw-bold px-4 text-white shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Createsubadmin;