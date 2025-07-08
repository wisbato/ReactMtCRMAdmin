import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, Container, Card } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMT5Users, MT5Account } from "../../../api/mt5_acc/getMT5";
import { addBonus } from "../../../api/bonus/addBonus";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

interface MT5AccountExtended extends MT5Account {
  User: {
    id: number;
    name: string;
    email: string;
  };
}

const Removebonus = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    mt5Id: "",
    amount: "",
    comment: "",
  });

  const [errors, setErrors] = useState<{ 
    mt5Id?: string;
    amount?: string;
    comment?: string;
  }>({});

  // Fetch MT5 accounts
  const { 
    data: mt5Data, 
    isLoading: isLoadingMT5, 
    error: mt5Error 
  } = useQuery({
    queryKey: ["mt5Accounts"],
    queryFn: getMT5Users,
    staleTime: 5 * 60 * 1000,
  });

  // Bonus removal mutation (using addBonus API with type 'OUT') - using isPending instead of isLoading
  const { 
    mutate: removeBonus, 
    isPending: isSubmitting 
  } = useMutation({
    mutationFn: (bonusData: {
      accountId: string;
      amount: number;
      type: 'OUT';
      currencyUnit: string;
      comment: string;
    }) => addBonus(bonusData),
    onSuccess: (data) => {
      toast.success(data.message);
      setFormData({
        mt5Id: "",
        amount: "",
        comment: "",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const mt5Accounts: MT5AccountExtended[] = mt5Data?.accounts || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      mt5Id: !formData.mt5Id.trim() ? "Please select an MT5 account" : undefined,
      amount: !formData.amount.trim() ? "Please enter an amount" : undefined,
      comment: !formData.comment.trim() ? "Please enter a comment" : undefined,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    removeBonus({
      accountId: formData.mt5Id,
      amount: amount,
      type: 'OUT', // Set as OUT for bonus removal
      currencyUnit: "USD", // You can change this or make it configurable
      comment: formData.comment
    });
  };
  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <Container className={`mt-4 mb-5 ${theme === "dark" ? "bg-black" : ""}`}>
      <h3 className="fw-bold" style={{ color: "var(--primary-color)" }}>Remove Bonus</h3>

      {mt5Error && (
        <Alert variant="danger" className="mb-3">
          Error loading MT5 accounts: {mt5Error.message}
        </Alert>
      )}

      <Card className={`p-4 shadow-sm mb-1 ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Select MT5 Account <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="mt5Id"
                  value={formData.mt5Id}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                  disabled={isLoadingMT5}
                  isInvalid={!!errors.mt5Id}
                >
                  <option value="">Select MT5 account</option>
                  {mt5Accounts.map((account) => (
                    <option key={account.id} value={account.accountid}>
                      {account.accountid} - {account.User?.name || 'Unknown User'}
                      {account.groupName ? ` (${account.groupName})` : ''}
                    </option>
                  ))}
                </Form.Select>
                {isLoadingMT5 && <small className="text-muted">Loading MT5 accounts...</small>}
                {errors.mt5Id && <small className="text-danger">{errors.mt5Id}</small>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  isInvalid={!!errors.amount}
                  min="0.01"
                  step="0.01"
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                />
                {errors.amount && <small className="text-danger">{errors.amount}</small>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Comment <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="comment"
                  placeholder="Enter Comment"
                  value={formData.comment}
                  onChange={handleChange}
                  isInvalid={!!errors.comment}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                />
                {errors.comment && <small className="text-danger">{errors.comment}</small>}
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
            disabled={isLoadingMT5 || isSubmitting}
          >
            {isSubmitting ? 'Removing...' : 'Remove Bonus'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Removebonus;