import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMT5Users } from "../../../api/mt5_acc/getMT5";
import { updateLeverage, AddLeverageCredentials } from "../../../api/leverage/addLeverage";
import { toast } from "react-hot-toast";
import "./mt5account.css";
import { useTheme } from "../../../context/ThemeContext";

interface MT5Account {
  id: number;
  accountid: string;
  User: {
    id: number;
    name: string;
    email: string;
  };
}

const Updatemt5leverage = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    mt5Id: "",
    leverage: "",
  });

  const [errors, setErrors] = useState<{
    mt5Id?: string;
    leverage?: string;
  }>({});

  // Fetch MT5 accounts data
  const {
    data: mt5Data,
    isLoading: isLoadingMT5,
    error: mt5Error,
  } = useQuery({
    queryKey: ["mt5Accounts"],
    queryFn: getMT5Users,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for updating leverage
  const { mutate, isPending } = useMutation({
    mutationFn: updateLeverage,
    onSuccess: (data) => {
      // Display the success message from the response
      toast.success(data.message);
      // Reset form after successful submission
      setFormData({
        mt5Id: "",
        leverage: "",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update MT5 leverage");
      console.error(error);
    },
  });

  const mt5Accounts: MT5Account[] = mt5Data?.accounts || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { mt5Id?: string; leverage?: string } = {};
    if (!formData.mt5Id.trim()) newErrors.mt5Id = "MT5 ID is required";
    if (!formData.leverage.trim()) newErrors.leverage = "Leverage is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const leverageDetails: AddLeverageCredentials = {
      accountId: parseInt(formData.mt5Id),
      leverage: parseInt(formData.leverage),
    };

    mutate(leverageDetails);
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <Container className={`mt-4 ${theme === "dark" ? "bg-black" : ""}`}>
      <h3 className="fw-bold" style={{ color: "var(--primary-color)" }}>
        Update MT5 Leverage
      </h3>

      {mt5Error && (
        <Alert variant="danger" className="mb-3">
          Error loading MT5 accounts: {mt5Error.message}
        </Alert>
      )}

      <Card className={`p-4 shadow-sm ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Select MT5 ID <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="mt5Id"
                  value={formData.mt5Id}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                  disabled={isLoadingMT5 || isPending}
                >
                  <option value="">Select MT5 account</option>
                  {mt5Accounts.map((account) => (
                    <option key={account.id} value={account.accountid}>
                      {account.accountid} - {account.User?.name || "Unknown User"}
                    </option>
                  ))}
                </Form.Select>
                {errors.mt5Id && (
                  <small className="text-danger">{errors.mt5Id}</small>
                )}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Leverage <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                  disabled={isPending}
                >
                  <option value="">Select leverage</option>
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
            disabled={isLoadingMT5 || isPending}
          >
            {isPending ? "Updating..." : "Update Leverage"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Updatemt5leverage;
