import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Row, Col, Alert } from "react-bootstrap";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./adduser.css";
import "./uploaduserdocument.css";
// Import your external functions
import { getName } from "../../../api/bank/getName";
import { addBankDetail } from "../../../api/bank/addUser"; // Add this import
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

// Embedded styles for the dropdown functionality
const dropdownStyles = `
  .client-dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #dee2e6;
    transition: background-color 0.2s ease;
  }

  .client-dropdown-item:hover {
    background-color: #f8f9fa;
  }

  .client-dropdown-item:last-child {
    border-bottom: none;
  }

  .client-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = dropdownStyles;
  if (!document.head.querySelector('style[data-component="bank-details-dropdown"]')) {
    styleElement.setAttribute('data-component', 'bank-details-dropdown');
    document.head.appendChild(styleElement);
  }
}

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

interface Country {
  cca2: string;
  callingCodes: string[];
  name: {
    common: string;
  };
  flag: string;
}

interface BankFormData {
  accountName: string;
  accountType: string;
  accountNumber: string;
  ifscCode: string;
  ibanNumber: string;
  bankName: string;
  bankAddress: string;
  country: string;
}

// QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const Addbankdetails = () => {
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [bankBook, setBankBook] = useState<File | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const { theme } = useTheme();
  const [formData, setFormData] = useState<BankFormData>({
    accountName: "",
    accountType: "",
    accountNumber: "",
    ifscCode: "",
    ibanNumber: "",
    bankName: "",
    bankAddress: "",
    country: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryClientInstance = useQueryClient();

  // TanStack Query for fetching users
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getName,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch countries data from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v2/all?fields=alpha2Code,name,flag,callingCodes");
        const data = await response.json();
        
        // Transform data to match our interface structure
        const formattedData = data
          .filter((country: any) => country.callingCodes && country.callingCodes.length > 0 && country.callingCodes[0] !== "")
          .map((country: any) => ({
            cca2: country.alpha2Code,
            name: { common: country.name },
            flag: country.flag,
            callingCodes: country.callingCodes
          }))
          .sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
        
        setCountries(formattedData);
        
        // Set default country (optional)
        if (formattedData.length > 0) {
          const usCountry = formattedData.find((c: Country) => c.cca2 === "US") || formattedData[0];
          setFormData(prev => ({
            ...prev,
            country: usCountry.name.common
          }));
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        toast.error("Failed to load country data");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // TanStack Mutation for adding bank details
  const addBankDetailMutation = useMutation({
    mutationFn: ({ bankDetails, file }: { bankDetails: any; file?: File }) => 
      addBankDetail(bankDetails, file),
    onSuccess: (data:any) => {
      toast.success("Bank details added successfully!", data);
      
      // Reset form
      setFormData({
        accountName: "",
        accountType: "",
        accountNumber: "",
        ifscCode: "",
        ibanNumber: "",
        bankName: "",
        bankAddress: "",
        country: countries.length > 0 ? (countries.find((c: Country) => c.cca2 === "US") || countries[0]).name.common : "",
      });
      setSelectedClient(null);
      setClientSearchTerm("");
      setBankBook(null);
      
      // Clear form inputs
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.reset();
      
      // Optionally invalidate and refetch related queries
      // queryClientInstance.invalidateQueries({ queryKey: ['bankDetails'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add bank details");
      
    },
  });

  const users = Array.isArray(usersData?.data) ? usersData?.data : [];

  // Filter users based on search term
  const filteredUsers = users && users.filter((user: User) =>
    user.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const handleInputChange = (field: keyof BankFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setBankBook(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !formData.accountType || !bankBook || !formData.country) {
      setErrorMessage("Please fill all required fields and select a client.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    // Prepare bank details object according to API interface
    const bankDetails = {
      userId: selectedClient.id,
      account_name: formData.accountName,
      account_type: formData.accountType,
      account_number: formData.accountNumber,
      ifsc_swift_code: formData.ifscCode,
      iban_number: formData.ibanNumber,
      bank_name: formData.bankName,
      bank_address: formData.bankAddress,
      country: formData.country,
    };

    // Execute mutation
    addBankDetailMutation.mutate({ bankDetails, file: bankBook });
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
    <QueryClientProvider client={queryClient}>
      <div className="bank-details-wrapper" style={{color:'var(--primary-color)'}}>
        <Container className="mt-4">
          <h3 className="fw-bold">Add Bank Details</h3>
          
          {/* Success Alert */}
          {showSuccess && (
            <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
              <Alert.Heading>Success!</Alert.Heading>
              Bank details have been added successfully.
            </Alert>
          )}
          
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
                        {filteredUsers.map((user) => (
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
                  <Form.Group controlId="accountName" className="mb-3">
                    <Form.Label>Account Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter Account Name" 
                      value={formData.accountName}
                      onChange={(e) => handleInputChange('accountName', e.target.value)}
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required 
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group controlId="accountType" className="mb-3">
                    <Form.Label>Account Type <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      value={formData.accountType} 
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="accountNumber" className="mb-3">
                    <Form.Label>Account No. <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter Account Number" 
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="ifscCode" className="mb-3">
                    <Form.Label>IFSC/Swift Code <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter IFSC/Swift Code" 
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="ibanNumber" className="mb-3">
                    <Form.Label>IBAN No. <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter IBAN Number" 
                      value={formData.ibanNumber}
                      onChange={(e) => handleInputChange('ibanNumber', e.target.value)}
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="bankName" className="mb-3">
                    <Form.Label>Bank Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter Bank Name" 
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="bankAddress" className="mb-3">
                    <Form.Label>Bank Address <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter Bank Address" 
                      value={formData.bankAddress}
                      onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="country" className="mb-3">
                    <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      value={formData.country} 
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      disabled={loadingCountries}
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required
                    >
                      <option value="">{loadingCountries ? "Loading countries..." : "Select a country"}</option>
                      {countries.map((country) => (
                        <option key={country.cca2} value={country.name.common}>
                          {country.name.common}
                        </option>
                      ))}
                    </Form.Select>
                    {loadingCountries && (
                      <div className="text-muted small mt-1">
                        Loading country data...
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="bankBook" className="mb-3">
                    <Form.Label>Bank Book <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="file" 
                      onChange={handleFileChange} 
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      style={inputStyle}
                      className={theme === "dark" ? "dark-mode-placeholder" : ""}
                      required 
                    />
                    {bankBook && (
                      <div className="mt-2 text-success small">
                        ✓ Selected file: {bankBook.name}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                className="btn fw-bold px-4"
                style={{ background: "var(--primary-gradient)", border: "none" }}
                disabled={addBankDetailMutation.isPending || loadingCountries}
              >
                {addBankDetailMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </Form>
          </Card>
        </Container>
      </div>
    </QueryClientProvider>
  );
};

export default Addbankdetails;