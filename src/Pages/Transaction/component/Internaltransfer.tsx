import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMT5Users, MT5Account } from "../../../api/mt5_acc/getMT5";
import { getName } from "../../../api/bank/getName";
import { addInternaltransfer } from "../../../api/internal/internal_transfer";
import './internaltransfer.css'
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

const Internaltransfer = () => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        fromMt5: "",
        toMt5: "",
        amount: "",
    });
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

    // Mutation for internal transfer
    const transferMutation = useMutation({
        mutationFn: (transferData: {
            fromAccountId: string;
            toAccountId: string;
            amount: number;
            userId: number;
        }) => addInternaltransfer(transferData),
        onSuccess: (data) => {
            toast.success(data.message || "Transfer completed successfully!");
            // Reset form on successful submission
            setFormData({
                fromMt5: "",
                toMt5: "",
                amount: "",
            });
            setSelectedClient(null);
            setClientSearchTerm("");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Transfer failed");
        }
    });

    // Get all users and MT5 accounts
    const users = Array.isArray(usersData?.data) ? usersData?.data : [];
    const allMT5Accounts = mt5Data?.accounts ?? [];
    
    // Filter MT5 accounts by selected client
    const clientMT5Accounts = selectedClient 
        ? allMT5Accounts.filter((account: MT5Account) => account.userId === selectedClient.id)
        : [];

    // Filter users based on search term
    const filteredUsers = users!.filter(
        (user: User) =>
            user.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(clientSearchTerm.toLowerCase())
    );

    const handleClientSelect = (user: User) => {
        setSelectedClient(user);
        setClientSearchTerm(user.name);
        setShowDropdown(false);
        // Reset form MT5 selections when client changes
        setFormData({
            ...formData,
            fromMt5: "",
            toMt5: "",
        });
    };

    const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClientSearchTerm(value);
        setShowDropdown(true);

        if (selectedClient && selectedClient.name !== value) {
            setSelectedClient(null);
            // Reset form MT5 selections when client is cleared
            setFormData({
                ...formData,
                fromMt5: "",
                toMt5: "",
            });
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
        if (!formData.fromMt5 || !formData.toMt5 || !formData.amount) {
            toast.error("From MT5, To MT5, and Amount are required");
            return;
        }

        // Check if from and to accounts are different
        if (formData.fromMt5 === formData.toMt5) {
            toast.error("From MT5 and To MT5 accounts must be different");
            return;
        }

        // Get the user ID - use selected client if available, otherwise use current user (you might need to adjust this)
        const userId = selectedClient?.id || /* current user ID if needed */ 0;

        const transferData = {
            fromAccountId: formData.fromMt5,
            toAccountId: formData.toMt5,
            amount: parseFloat(formData.amount),
            userId: userId
        };

        // Execute mutation
        transferMutation.mutate(transferData);
    };

    const inputStyle = {
        backgroundColor: theme === "dark" ? "#000000" : "",
        color: theme === "dark" ? "#ffffff" : "",
        borderColor: theme === "dark" ? "#212529" : ""
      };

    return (
        <div className="internal-transfer-page">
            <div className="container mt-4">
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '30px' }}>Internal Transfer</h2>

                <div className={`p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                    <Form onSubmit={handleSubmit}>
                        {/* Client Search Field */}
                        <Form.Group className="mb-3 position-relative">
                            <Form.Label>Select Client <span className="text-danger">*</span></Form.Label>
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
                                disabled={isLoadingUsers || isLoadingMT5 || transferMutation.isPending}
                                style={inputStyle}
                                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            />

                            {/* Dropdown for client selection */}
                            {showDropdown && filteredUsers.length > 0 && (
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

                            {showDropdown && clientSearchTerm && filteredUsers.length === 0 && !isLoadingUsers && (
                                <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1 p-2">
                                    <div className="text-muted">
                                        No clients found matching "{clientSearchTerm}"
                                    </div>
                                </div>
                            )}

                            {selectedClient && (
                                <div className="mt-2 p-2 bg-light rounded">
                                    <small className="text-success">
                                        ✓ Selected: {selectedClient.name} ({selectedClient.email}) - ID: {selectedClient.id}
                                    </small>
                                </div>
                            )}
                        </Form.Group>

                        <div className="d-flex gap-3 mb-3">
                            <Form.Group className="w-50">
                                <Form.Label>From MT5 <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="fromMt5"
                                    value={formData.fromMt5}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    className={theme === "dark" ? "dark-mode-placeholder" : ""}
                                    disabled={isLoadingMT5 || transferMutation.isPending}
                                >
                                    <option value="">
                                        {isLoadingMT5 ? "Loading MT5 accounts..." : "Select MT5 ID"}
                                    </option>
                                    {(selectedClient ? clientMT5Accounts : allMT5Accounts).map((account: MT5Account) => (
                                        <option key={`from-${account.id}`} value={account.accountid}>
                                            {account.accountid} - {account.User?.name || 'Unknown'} 
                                            (Balance: ${account.balance}, Group: {account.groupName})
                                        </option>
                                    ))}
                                </Form.Select>
                                {isLoadingMT5 && (
                                    <small className="text-muted">Loading MT5 accounts...</small>
                                )}
                            </Form.Group>

                            <Form.Group className="w-50">
                                <Form.Label>To MT5 <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="toMt5"
                                    value={formData.toMt5}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    className={theme === "dark" ? "dark-mode-placeholder" : ""}
                                    disabled={isLoadingMT5 || transferMutation.isPending}
                                >
                                    <option value="">
                                        {isLoadingMT5 ? "Loading MT5 accounts..." : "Select MT5 ID"}
                                    </option>
                                    {(selectedClient ? clientMT5Accounts : allMT5Accounts)
                                        .filter((account: MT5Account) => account.accountid !== formData.fromMt5)
                                        .map((account: MT5Account) => (
                                            <option key={`to-${account.id}`} value={account.accountid}>
                                                {account.accountid} - {account.User?.name || 'Unknown'} 
                                                (Balance: ${account.balance}, Group: {account.groupName})
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                                {isLoadingMT5 && (
                                    <small className="text-muted">Loading MT5 accounts...</small>
                                )}
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                placeholder="Enter Amount"
                                value={formData.amount}
                                onChange={handleChange}
                                style={inputStyle}
                                className={theme === "dark" ? "dark-mode-placeholder" : ""}
                                disabled={transferMutation.isPending}
                                min="0"
                                step="0.01"
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            style={{
                                background: "var(--primary-gradient)",
                                border: "none",
                                borderRadius: "8px",
                            }}
                            className="btn fw-bold px-4"
                            disabled={isLoadingMT5 || transferMutation.isPending}
                        >
                            {transferMutation.isPending ? "Processing..." : "Submit"}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Internaltransfer;