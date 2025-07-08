import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Row, Col } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getName } from "../../../api/bank/getName";
import { patchChangePassword } from "../../../api/password/chang_pass"; // Import the API function
import { toast } from "react-hot-toast";
import "./adduser.css";
import { useTheme } from "../../../context/ThemeContext";

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

const ChangeUserPassword = () => {
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  // TanStack Query for fetching users
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getName,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for changing password
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: ({ userId, newPassword }: { userId: number, newPassword: string }) => 
      patchChangePassword(userId.toString(), { newPassword }),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      // Reset form
      setSelectedClient(null);
      setClientSearchTerm("");
      setPassword("");
      // Invalidate any related queries if needed
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
      console.error(error);
    }
  });

  const users = Array.isArray(usersData?.data) ? usersData?.data : [];

  // Filter users based on search term
  const filteredUsers = users && users.filter((user: User) =>
    user.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const handleClientSelect = (user: User) => {
    setSelectedClient(user);
    setClientSearchTerm(user.name);
    setShowDropdown(false);
  };

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientSearchTerm(value);
    setShowDropdown(true);
    
    if (selectedClient && selectedClient.name !== value) {
      setSelectedClient(null);
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !password) {
      setErrorMessage("Please select a client and enter a password.");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    // Call the mutation to change password
    changePassword({ userId: selectedClient.id, newPassword: password });
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <Container className={`mt-4 ${theme === "dark" ? "bg-black" : ""}`}>
      <h3 className="fw-bold" style={{color: 'var(--primary-color)'}}>Change User Password</h3>
      
      {/* Error Alert */}
      {showError && (
        <Alert variant="danger" dismissible onClose={() => setShowError(false)}>
          <Alert.Heading>Error!</Alert.Heading>
          {errorMessage}
        </Alert>
      )}
      
      <Card className={`p-4 shadow-sm ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group controlId="clientName" className="mb-3 position-relative">
                <Form.Label>Select Client Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder={isLoading ? "Loading clients..." : "Start typing client name..."}
                  value={clientSearchTerm}
                  onChange={handleClientInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  disabled={isLoading}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                />
                
                {error && (
                  <div className="text-danger small mt-1">
                    Error loading clients: {error.message}
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

                {showDropdown && clientSearchTerm && filteredUsers?.length === 0 && !isLoading && (
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
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>New Password <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  style={inputStyle}
                  required 
                />
              </Form.Group>
            </Col>
          </Row>

          <Button 
            type="submit" 
            style={{ background: 'var(--primary-gradient)', border: 'none' }} 
            className="btn fw-bold px-4"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ChangeUserPassword;