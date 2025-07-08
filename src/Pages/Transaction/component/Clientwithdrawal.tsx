import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getName } from "../../../api/bank/getName";
import { getMT5Users, MT5Account } from "../../../api/mt5_acc/getMT5";
import { addClient } from "../../../api/client/addClient";
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

const ClientWithdrawal = () => {
  const { theme } = useTheme();
  const [activeForm, setActiveForm] = useState("mt5");
  const [formData, setFormData] = useState({
    mt5Id: "",
    amount: "",
    comment: "",
    withdrawTo: "",
    clientName: "",
  });

  // Client search functionality
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

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

  // TanStack Query for fetching all MT5 accounts
  const {
    data: mt5Data,
    isLoading: isLoadingMT5,
    error: mt5Error,
  } = useQuery({
    queryKey: ["mt5Accounts"],
    queryFn: getMT5Users,
    staleTime: 5 * 60 * 1000,
  });

  // Withdrawal mutation
  const withdrawalMutation = useMutation({
    mutationFn: (withdrawalData: {
      accountId: string;
      amount: number;
      comment: string;
      userId: number;
    }) => addClient(withdrawalData),
    onSuccess: (data) => {
      toast.success(data.message || "Withdrawal request submitted successfully!");
      // Reset form
      setFormData({
        mt5Id: "",
        amount: "",
        comment: "",
        withdrawTo: "",
        clientName: "",
      });
      setSelectedClient(null);
      setClientSearchTerm("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Withdrawal request failed");
    }
  });

  const users = Array.isArray(usersData?.data) ? usersData?.data : [];
  
  // Get all MT5 accounts and filter by selected client's userId
  const allMT5Accounts = mt5Data?.accounts ?? [];
  const mt5Accounts = selectedClient 
    ? allMT5Accounts.filter((account: MT5Account) => account.userId === selectedClient.id)
    : [];

  // Filter users based on search term
  const filteredUsers = users && users.filter(
    (user: User) =>
      user.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const handleClientSelect = (user: User) => {
    setSelectedClient(user);
    setClientSearchTerm(user.name);
    setFormData({ ...formData, clientName: user.id.toString(), mt5Id: "" });
    setShowDropdown(false);
  };

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientSearchTerm(value);
    setShowDropdown(true);

    if (selectedClient && selectedClient.name !== value) {
      setSelectedClient(null);
      setFormData({ ...formData, clientName: "", mt5Id: "" });
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.mt5Id || !formData.amount) {
      toast.error("MT5 ID and Amount are required");
      return;
    }

    let userId: number;

    if (activeForm === "mt5") {
      // For MT5 form, find the userId from the selected MT5 account
      const selectedMT5Account = allMT5Accounts.find(
        (account: MT5Account) => account.accountid === formData.mt5Id
      );
      
      if (!selectedMT5Account) {
        toast.error("Selected MT5 account not found");
        return;
      }
      
      userId = selectedMT5Account.userId;
    } else {
      // For client form, use the selected client's ID
      if (!selectedClient) {
        toast.error("Please select a client");
        return;
      }
      userId = selectedClient.id;
    }

    const withdrawalData = {
      accountId: formData.mt5Id,
      amount: parseFloat(formData.amount),
      comment: formData.comment,
      userId: userId,
    };
    
    // Execute mutation
    withdrawalMutation.mutate(withdrawalData);
  };

  // Style objects for reuse
  const buttonStyle = {
    background: "var(--primary-gradient)",
    border: "none",
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '30px' }}>Client Withdrawal</h2>

      {/* Error handling for API */}
      {usersError && toast.error(`Error loading clients: ${usersError.message}`)}
      {mt5Error && toast.error(`Error loading MT5 accounts: ${mt5Error.message}`)}

      {/* Buttons Section */}
      <div className="d-flex gap-3 mb-4">
        <Button
          type="button"
          style={buttonStyle}
          className="btn fw-bold px-4"
          onClick={() => {
            setActiveForm("mt5");
            setSelectedClient(null);
            setClientSearchTerm("");
            setFormData({ mt5Id: "", amount: "", comment: "", withdrawTo: "", clientName: "" });
          }}
        >
          Withdraw With MT5 Id
        </Button>
        <Button
          type="button"
          style={buttonStyle}
          className="btn fw-bold px-4"
          onClick={() => {
            setActiveForm("client");
            setSelectedClient(null);
            setClientSearchTerm("");
            setFormData({ mt5Id: "", amount: "", comment: "", withdrawTo: "", clientName: "" });
          }}
        >
          Withdraw With Client Name
        </Button>
      </div>

      {/* MT5 ID Form */}
      {activeForm === "mt5" && (
        <div className={`p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Select MT5 Account <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="mt5Id"
                value={formData.mt5Id}
                onChange={handleChange}
                style={inputStyle}
                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                disabled={isLoadingMT5 || withdrawalMutation.isPending}
              >
                <option value="">Select MT5 ID</option>
                {allMT5Accounts.map((account: MT5Account) => (
                  <option key={account.id} value={account.accountid}>
                    {account.accountid} - {account.User?.name || 'Unknown'} 
                    (Balance: ${account.balance}, Group: {account.groupName})
                  </option>
                ))}
              </Form.Select>
              {isLoadingMT5 && (
                <small className="text-muted">Loading MT5 accounts...</small>
              )}
            </Form.Group>

            <div className="d-flex gap-3">
              <Form.Group className="mb-3 w-50">
                <Form.Label>
                  Amount <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  disabled={withdrawalMutation.isPending}
                  min="0"
                  step="0.01"
                />
              </Form.Group>

              <Form.Group className="mb-3 w-50">
                <Form.Label>
                  Comment
                </Form.Label>
                <Form.Control
                  type="text"
                  name="comment"
                  placeholder="Comment..."
                  value={formData.comment}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  disabled={withdrawalMutation.isPending}
                />
              </Form.Group>
            </div>

            <Button
              type="submit"
              style={buttonStyle}
              className="btn fw-bold px-4"
              disabled={isLoadingMT5 || withdrawalMutation.isPending}
            >
              {withdrawalMutation.isPending ? "Processing..." : "Submit"}
            </Button>
          </Form>
        </div>
      )}

      {/* Client Name Form */}
      {activeForm === "client" && (
        <div className={`p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              {/* Client Name with Search */}
              <Form.Group className="mb-3 col-md-6 position-relative">
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
                  disabled={isLoadingUsers || isLoadingMT5 || withdrawalMutation.isPending}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                />

                {/* Dropdown for client selection */}
                {showDropdown && filteredUsers && filteredUsers.length > 0 && (
                  <div 
                    className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" 
                    style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {filteredUsers.map((user: User) => (
                      <div
                        key={user.id}
                        className="p-2 border-bottom"
                        style={inputStyle}
                        onMouseDown={() => handleClientSelect(user)}
                      >
                        <div className="fw-semibold">{user.name}</div>
                        <div className={`small ${theme === "dark" ? "color-white" : "text-muted"}`}>{user.email}</div>
                        <div className={`small ${theme === "dark" ? "color-white" : "text-muted"}`}>ID: {user.id}</div>
                      </div>
                    ))}
                  </div>
                )}

                {showDropdown &&
                  clientSearchTerm &&
                  filteredUsers?.length === 0 &&
                  !isLoadingUsers && (
                    <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1 p-2">
                      <div className="text-muted">
                        No clients found matching "{clientSearchTerm}"
                      </div>
                    </div>
                  )}

                {/* Selected client info */}
                {selectedClient && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <small className="text-success">
                      ✓ Selected: {selectedClient.name} ({selectedClient.email}) - ID: {selectedClient.id}
                    </small>
                  </div>
                )}

                {/* Hidden input to store the selected client ID */}
                <Form.Control
                  type="hidden"
                  name="clientName"
                  value={formData.clientName}
                />
              </Form.Group>

              {/* MT5 ID - Now populated from API */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>
                  Select MT5 ID <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="mt5Id"
                  value={formData.mt5Id}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  disabled={!selectedClient || isLoadingMT5 || withdrawalMutation.isPending}
                >
                  <option value="">
                    {!selectedClient 
                      ? "Select a client first" 
                      : isLoadingMT5 
                      ? "Loading MT5 accounts..." 
                      : mt5Accounts.length === 0 
                      ? "No MT5 accounts found" 
                      : "Select MT5 account"
                    }
                  </option>
                  {mt5Accounts.map((account: MT5Account) => (
                    <option key={account.id} value={account.accountid}>
                      {account.accountid} - {account.groupName} (Balance: ${account.balance})
                    </option>
                  ))}
                </Form.Select>
                {isLoadingMT5 && (
                  <small className="text-muted">Loading MT5 accounts...</small>
                )}
                {selectedClient && mt5Accounts.length === 0 && !isLoadingMT5 && (
                  <small className="text-warning">No MT5 accounts found for this client</small>
                )}
              </Form.Group>
            </div>

            <div className="row">
              {/* Amount */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>
                  Amount <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  disabled={withdrawalMutation.isPending}
                  min="0"
                  step="0.01"
                />
              </Form.Group>

              {/* Comment */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>
                  Comment
                </Form.Label>
                <Form.Control
                  type="text"
                  name="comment"
                  placeholder="Comment..."
                  value={formData.comment}
                  onChange={handleChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  disabled={withdrawalMutation.isPending}
                />
              </Form.Group>
            </div>

            <Button
              type="submit"
              className="btn fw-bold px-4"
              style={buttonStyle}
              disabled={isLoadingUsers || isLoadingMT5 || withdrawalMutation.isPending}
            >
              {withdrawalMutation.isPending ? "Processing..." : "Submit"}
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ClientWithdrawal;