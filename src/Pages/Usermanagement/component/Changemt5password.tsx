import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, Container, Card } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getMT5Users, MT5Account } from "../../../api/mt5_acc/getMT5";
import { toast } from "react-hot-toast";
import { updateMT5Password , EditMT5PasswordCredentials } from "../../../api/mt5_acc/updateMT5Password";
import { useTheme } from "../../../context/ThemeContext";

interface MT5AccountExtended extends MT5Account {
  User: {
    id: number;
    name: string;
    email: string;
  };
}

interface FormControlElement extends HTMLElement {
  name: string;
  value: string;
}

const Changemt5password = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    mt5Account: "",
    passwordType: "Both",
    mainPassword: "",
    investorPassword: "",
  });

  const [errors, setErrors] = useState<{ 
    mt5Account?: string; 
    mainPassword?: string; 
    investorPassword?: string 
  }>({});

  // TanStack Query for fetching MT5 accounts
  const {
    data: mt5Data,
    isLoading: isLoadingMT5,
    error: mt5Error,
  } = useQuery({
    queryKey: ["mt5Accounts"],
    queryFn: getMT5Users,
    staleTime: 5 * 60 * 1000,
  });

  const mt5Accounts: MT5AccountExtended[] = mt5Data?.accounts || [];

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { 
      mt5Account?: string; 
      mainPassword?: string; 
      investorPassword?: string 
    } = {};
    
    if (!formData.mt5Account.trim()) {
      newErrors.mt5Account = "MT5 Account is required";
    }
    
    // Validate based on password type
    if (formData.passwordType === "Both" || formData.passwordType === "Main") {
      if (!formData.mainPassword.trim()) {
        newErrors.mainPassword = "Main Password is required";
      } else if (formData.mainPassword.length < 8) {
        newErrors.mainPassword = "Password must be at least 8 characters";
      }
    }
    
    if (formData.passwordType === "Both" || formData.passwordType === "Investor") {
      if (!formData.investorPassword.trim()) {
        newErrors.investorPassword = "Investor Password is required";
      } else if (formData.investorPassword.length < 8) {
        newErrors.investorPassword = "Password must be at least 8 characters";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      // Prepare the request data
      const requestData: EditMT5PasswordCredentials = {
        accountId: Number(formData.mt5Account),
        passwordType: formData.passwordType as 'Main' | 'Investor' | 'Both',
      };
  
      // Conditionally include passwords
      if (formData.passwordType === 'Both' || formData.passwordType === 'Main') {
        requestData.mPassword = formData.mainPassword;
      }
      if (formData.passwordType === 'Both' || formData.passwordType === 'Investor') {
        requestData.iPassword = formData.investorPassword;
      }
  
      console.log('Submitting:', requestData); // Debug log
  
      const result = await updateMT5Password(requestData);
      
      toast.success(result.message || 'Password updated successfully!');
      
      // Reset form
      setFormData({
        mt5Account: "",
        passwordType: "Both",
        mainPassword: "",
        investorPassword: "",
      });
    } catch (err: any) {
      console.error('Error updating password:', {
        error: err,
        requestData: formData,
      });
  
      let errorMessage = err.message;
      
      // Handle specific error cases
      if (err.message.includes('500')) {
        errorMessage = 'Server error. Please try again later or contact support.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Network connection problem. Please check your internet.';
      }
  
      toast.error(errorMessage);
    }
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <Container className={`mt-4 ${theme === "dark" ? "bg-black" : ""}`}>
      <h3 className="fw-bold" style={{ color: "var(--primary-color)" }}>Change MT5 Password</h3>

      {mt5Error && (
        <Alert variant="danger" className="mb-3">
          Error loading MT5 accounts: {mt5Error.message}
        </Alert>
      )}

      <Card className={`p-4 shadow-sm ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* MT5 Account */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Select MT5 Account <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="mt5Account"
                  value={formData.mt5Account}
                  onChange={handleChange}
                  disabled={isLoadingMT5}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                >
                  <option value="">Select MT5 account</option>
                  {mt5Accounts.map((account) => (
                    <option key={account.id} value={account.accountid}>
                      {account.accountid} - {account.User?.name || 'Unknown User'}
                      {account.groupName ? ` (${account.groupName})` : ''}
                    </option>
                  ))}
                </Form.Select>
                {isLoadingMT5 && (
                  <small className="text-muted">Loading MT5 accounts...</small>
                )}
                {errors.mt5Account && (
                  <small className="text-danger">{errors.mt5Account}</small>
                )}
              </Form.Group>
            </Col>

            {/* Password Type */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Password Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="passwordType"
                  value={formData.passwordType}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                >
                  <option value="Both">Both Passwords</option>
                  <option value="Main">Main Password Only</option>
                  <option value="Investor">Investor Password Only</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Main Password */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Main Password <span className="text-danger">
                    {formData.passwordType !== "Investor" ? "*" : ""}
                  </span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="mainPassword"
                  value={formData.mainPassword}
                  onChange={handleChange}
                  disabled={formData.passwordType === "Investor"}
                  required={formData.passwordType !== "Investor"}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                />
                {errors.mainPassword && (
                  <small className="text-danger">{errors.mainPassword}</small>
                )}
              </Form.Group>
            </Col>

            {/* Investor Password */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Investor Password <span className="text-danger">
                    {formData.passwordType !== "Main" ? "*" : ""}
                  </span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="investorPassword"
                  value={formData.investorPassword}
                  onChange={handleChange}
                  disabled={formData.passwordType === "Main"}
                  required={formData.passwordType !== "Main"}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                />
                {errors.investorPassword && (
                  <small className="text-danger">{errors.investorPassword}</small>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Submit Button */}
          <Button 
            type="submit" 
            style={{ 
              background: 'var(--primary-gradient)', 
              border: 'none' 
            }} 
            className="btn fw-bold px-4"
            disabled={isLoadingMT5}
          >
            Change Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Changemt5password;