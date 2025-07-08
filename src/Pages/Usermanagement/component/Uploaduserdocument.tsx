import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Row, Col } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getName } from "../../../api/bank/getName";
import { addUserDocumentFromAdmin } from "../../../api/upload_user/addUser";
import { toast } from "react-hot-toast";
import "./adduser.css";
import './uploaduserdocument.css';
import { useTheme } from "../../../context/ThemeContext";

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

const Uploaduserdocument = () => {
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [proofOfIdentity, setProofOfIdentity] = useState<File | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { theme } = useTheme();

  const queryClient = useQueryClient();

  // TanStack Query for fetching users
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getName,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for uploading documents
  const uploadDocumentsMutation = useMutation({
    mutationFn: addUserDocumentFromAdmin,
    onSuccess: () => {
      toast.success("Documents uploaded successfully!");
      
      // Reset all form states
      setSelectedClient(null);
      setClientSearchTerm("");
      setProofOfAddress(null);
      setProofOfIdentity(null);
      setShowError(false);
      setErrorMessage("");
      setShowDropdown(false);
      
      // Clear file input fields
      const proofOfAddressInput = document.getElementById('proofOfAddress') as HTMLInputElement;
      const proofOfIdentityInput = document.getElementById('proofOfIdentity') as HTMLInputElement;
      if (proofOfAddressInput) proofOfAddressInput.value = '';
      if (proofOfIdentityInput) proofOfIdentityInput.value = '';
      
      // Optionally invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userDocuments'] });
    },
    onError: (error: any) => {
      toast.error(error.message || error || "Failed to upload documents");
    },
    onMutate: () => {
      console.log("Upload mutation started");
    },
    onSettled: () => {
      console.log("Upload mutation settled");
    }
  });

  const users = Array.isArray(usersData?.data) ? usersData?.data : [];

  // Filter users based on search term
  const filteredUsers = users && users.filter((user: User) =>
    user.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted, validating...");
    
    if (!selectedClient || !proofOfAddress || !proofOfIdentity) {
      setErrorMessage("Please select a client and upload all required documents.");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    console.log("Validation passed, preparing data...");
    console.log("Selected client:", selectedClient);
    console.log("Proof of address file:", proofOfAddress?.name, proofOfAddress?.size);
    console.log("Proof of identity file:", proofOfIdentity?.name, proofOfIdentity?.size);

    const documentData = {
      userId: selectedClient.id,
      proof_of_address: proofOfAddress,
      proof_of_identity: proofOfIdentity,
    };

    console.log("Starting upload...");
    uploadDocumentsMutation.mutate(documentData);
  };

  const handleClientSelect = (user: User) => {
    setSelectedClient(user);
    setClientSearchTerm(user.name);
    setShowDropdown(false);
  };

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientSearchTerm(value);
    setShowDropdown(true);
    
    // Clear selected client if input doesn't match
    if (selectedClient && selectedClient.name !== value) {
      setSelectedClient(null);
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <Container className={`mt-4 ${theme === "dark" ? "bg-black" : ""}`}>
      <h3 className="fw-bold" style={{color: 'var(--primary-color)'}}>Upload User Document</h3>
      
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
                  disabled={isLoading || uploadDocumentsMutation.isPending}
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

            <Col md={6}>
              <Form.Group controlId="proofOfAddress" className="mb-3">
                <Form.Label>Proof of Address <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="file" 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setProofOfAddress)} 
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={uploadDocumentsMutation.isPending}
                  className={`${theme === "dark" ? "bg-black text-light border-black" : ""}`}
                  required 
                />
                {proofOfAddress && (
                  <div className="mt-2 text-success small">
                    ✓ Selected file: {proofOfAddress.name}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="proofOfIdentity" className="mb-3">
                <Form.Label>Proof of Identity <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="file" 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setProofOfIdentity)}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={uploadDocumentsMutation.isPending}
                  className={`${theme === "dark" ? "bg-black text-light border-black" : "bg-white"}`}
                  required 
                />
                {proofOfIdentity && (
                  <div className="mt-2 text-success small">
                    ✓ Selected file: {proofOfIdentity.name}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Button 
            type="submit" 
            style={{ background: 'var(--primary-gradient)', border: 'none' }} 
            className="btn fw-bold px-4"
            disabled={uploadDocumentsMutation.isPending}
          >
            {uploadDocumentsMutation.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Uploaduserdocument;