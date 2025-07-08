import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getName } from "../../../api/bank/getName";
import { getGroup } from "../../../api/group/getGroup";
import { createMT5Account , AddMt5Credentials } from "../../../api/mt5_acc/addMT5"; // Import the new API function
import "./mt5account.css";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  wallet_balance?: number;
}

interface Group {
  id: number;
  groupName: string;
  mt5GroupName: string;
}

const Changepassword = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    group: "",
    leverage: "10",
  });

  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme } = useTheme();
  const [errors, setErrors] = useState<{
    clientName?: string;
    group?: string;
    leverage?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");

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

  // TanStack Mutation for creating MT5 account
  const createAccountMutation = useMutation({
    mutationFn: createMT5Account,
    onSuccess: (data) => {
      toast.success(`MT5 Account created successfully! Account ID: ${data.account.accountid}`);
      // Reset form after successful submission
      setFormData({
        clientName: "",
        group: "",
        leverage: "10",

      });
      setSelectedClient(null);
      setClientSearchTerm("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { clientName?: string; group?: string; leverage?: string; balance?: string } = {};
    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!formData.group.trim()) newErrors.group = "Group is required";
    if (!formData.leverage.trim()) newErrors.leverage = "Leverage is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In your handleSubmit function, add this line to normalize the group name:

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (!validateForm()) return;
  
    if (!selectedClient) {
      setErrors({ ...errors, clientName: "Please select a valid client" });
      return;
    }
  
    const selectedGroup = groups!.find((g: Group) => g.id.toString() === formData.group);
    if (!selectedGroup) {
      setErrors({ ...errors, group: "Please select a valid group" });
      return;
    }
  
    console.log("Selected client:", selectedClient);
    console.log("Selected group:", selectedGroup);
  
    // FIXED: Properly normalize the group name
    // Convert double backslashes to single backslashes
    let groupName = selectedGroup.mt5GroupName;
    
    // Replace any sequence of multiple backslashes with single backslash
    groupName = groupName.replace(/\\+/g, '\\');
    
    console.log("Original group name:", selectedGroup.mt5GroupName);
    console.log("Normalized group name:", groupName);
  
    const accountDetails: AddMt5Credentials = {
      userId: selectedClient.id,
      name: selectedClient.name,
      email: selectedClient.email,
      phone: selectedClient.phone || "",
      country: selectedClient.country || "",
      balance: Number(selectedClient.wallet_balance) || 0,
      leverage: Number(formData.leverage),
      groupName: groupName,
    };
    
    console.log("=== Complete Account Details Payload ===");
    console.log("userId:", accountDetails.userId, typeof accountDetails.userId);
    console.log("name:", accountDetails.name, typeof accountDetails.name);
    console.log("email:", accountDetails.email, typeof accountDetails.email);
    console.log("phone:", accountDetails.phone, typeof accountDetails.phone);
    console.log("country:", accountDetails.country, typeof accountDetails.country);
    console.log("balance:", accountDetails.balance, typeof accountDetails.balance);
    console.log("leverage:", accountDetails.leverage, typeof accountDetails.leverage);
    console.log("groupName:", accountDetails.groupName, typeof accountDetails.groupName);
    console.log("Raw group name (no JSON.stringify):", accountDetails.groupName);
    
    createAccountMutation.mutate(accountDetails);
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <Container className={`mt-4 ${theme === "dark" ? "bg-black" : ""}`}>
      <h3 className="fw-bold" style={{ color: "var(--primary-color)" }}>
        Create MT5 Account
      </h3>

      {groupsError && (
        <Alert variant="danger" className="mb-3">
          Error loading groups: {groupsError.message}
        </Alert>
      )}

      {createAccountMutation.isError && (
        <Alert variant="danger" className="mb-3">
          Error: {(createAccountMutation.error as Error).message}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="mb-3">
          {successMessage}
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
                  className={`${theme === "dark" ? "bg-black text-light" : "bg-white"}`}
                  disabled={isLoadingGroups}
                  style={inputStyle}
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

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Leverage <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleChange}
                  className={`${theme === "dark" ? "bg-black text-light" : "bg-white"}`}
                  style={inputStyle}
                >
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                </Form.Select>
                {errors.leverage && (
                  <small className="text-danger">{errors.leverage}</small>
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
            disabled={isLoadingUsers || isLoadingGroups || createAccountMutation.isPending}
          >
            {createAccountMutation.isPending ? "Creating..." : "Create Account"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Changepassword;