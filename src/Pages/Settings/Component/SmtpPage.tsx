import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useCallback, useMemo } from "react";
import { Form, Col, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './smtp.css';
import { useTheme } from "../../../context/ThemeContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addSmtp } from "../../../api/smtp/addSmtp";
import { getSmtp , SmtpSettings } from "../../../api/smtp/getSmtp";
import toast from "react-hot-toast";

interface SmtpConfiguration {
  id: number;
  host: string;
  port: number;
  user: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SmtpModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (config: Omit<SmtpConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Omit<SmtpConfiguration, 'id' | 'createdAt' | 'updatedAt'>;
  isEdit?: boolean;
  isPending?: boolean;
}

type SortableKey = keyof SmtpConfiguration;

interface SortConfig {
  key: SortableKey | null;
  direction: "asc" | "desc" | null;
}

const SmtpModal: React.FC<SmtpModalProps> = ({ 
  show, 
  onHide, 
  onSubmit, 
  initialData, 
  isEdit = false,
  isPending = false
}) => {
  const [formData, setFormData] = useState(() => 
    initialData || { host: '', port: 587, user: '', password: '' }
  );
  const { theme } = useTheme();

  // Only reset form data when modal opens and initialData is provided
  React.useEffect(() => {
    if (show && initialData) {
      setFormData(initialData);
    } else if (show && !initialData) {
      setFormData({ host: '', port: 587, user: '', password: '' });
    }
  }, [show, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.host || !formData.user || !formData.password || !formData.port) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    onSubmit(formData);
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={`${theme === "dark" ? "bg-dark text-light" : ""}`}>
        <Modal.Title>{isEdit ? 'Edit SMTP' : 'Add SMTP'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${theme === "dark" ? "bg-dark text-light" : ""}`}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Host</Form.Label>
            <Form.Control
              type="text"
              name="host"
              value={formData.host}
              onChange={handleChange}
              placeholder="smtp.example.com"
              style={inputStyle}
              className={theme === "dark" ? "dark-mode-placeholder" : ""}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Port</Form.Label>
            <Form.Control
              type="number"
              name="port"
              value={formData.port}
              onChange={handleChange}
              placeholder="587"
              style={inputStyle}
              className={theme === "dark" ? "dark-mode-placeholder" : ""}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="your-email@example.com"
              style={inputStyle}
              className={theme === "dark" ? "dark-mode-placeholder" : ""}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={inputStyle}
              className={theme === "dark" ? "dark-mode-placeholder" : ""}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button 
              variant="secondary" 
              onClick={onHide} 
              className="me-2"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {isEdit ? 'Update' : 'Add'} SMTP
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const SmtpPage = () => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  
  // Fetch SMTP configurations with custom error handling
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['smtpConfigurations'],
    queryFn: getSmtp,
    retry: (failureCount, error) => {
      // Don't retry if it's a "not found" error
      if (error?.message === 'SMTP settings not found') {
        return false;
      }
      return failureCount < 3;
    },
    throwOnError: (error) => {
      // Don't throw error for "not found" case
      return error?.message !== 'SMTP settings not found';
    }
  });

  // Extract SMTP data - handle both single object and nested structure
  const smtpConfiguration = data?.smtp || data || null;
  const hasSmtpData = Boolean(smtpConfiguration);
  
  // Check if error is actually "not found" (which we treat as normal state)
  const isActualError = isError && error?.message !== 'SMTP settings not found';

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Add SMTP mutation
  const smtpMutation = useMutation({
    mutationFn: addSmtp,
    onMutate: (variables) => {
      const isEdit = variables !== undefined;
      toast.loading(isEdit ? 'Updating SMTP...' : 'Adding SMTP...', { id: 'smtp-mutation' });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['smtpConfigurations'] });
      const isEdit = variables !== undefined;
      toast.success(isEdit ? 'SMTP updated successfully!' : 'SMTP added successfully!', { id: 'smtp-mutation' });
      setShowAddModal(false);
      setShowEditModal(false);
    },
    onError: (error: Error) => {
      toast.error(error.message, { id: 'smtp-mutation' });
    }
  });

  const handleAddSmtp = useCallback((newConfig: Omit<SmtpConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => {
    smtpMutation.mutate(newConfig);
  }, [smtpMutation]);

  const handleEditSmtp = useCallback((updatedConfig: Omit<SmtpConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!smtpConfiguration || !('id' in smtpConfiguration)) return;
    
    // Include the ID from the existing configuration
    const configWithId = {
      ...updatedConfig,
      id: (smtpConfiguration as SmtpSettings).id
    };
    
    smtpMutation.mutate(configWithId);
  }, [smtpMutation, smtpConfiguration]);

  // Get current edit config for the modal
  const getCurrentEditConfig = useMemo(() => {
    if (!smtpConfiguration) return undefined;
    
    if ('host' in smtpConfiguration) {
      return {
        host: smtpConfiguration.host,
        port: smtpConfiguration.port,
        user: smtpConfiguration.user,
        password: smtpConfiguration.password
      };
    } else {
      return undefined;
    }
  }, [smtpConfiguration]);

  const requestSort = (key: SortableKey) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: SortableKey) => {
    if (sortConfig.key !== columnKey) {
      return <i className="fa-solid fa-arrows-up-down" />;
    }

    if (sortConfig.direction === "asc") {
      return <i className="fa-solid fa-arrow-up" />;
    }

    if (sortConfig.direction === "desc") {
      return <i className="fa-solid fa-arrow-down" />;
    }

    return <i className="fa-solid fa-arrows-up-down" />;
  };

  // For display purposes, we'll show the single configuration in a table format
  const configurationData = hasSmtpData ? [smtpConfiguration] : [];

  const sortedAndFilteredConfigurations = useMemo(() => {
    if (!hasSmtpData) return [];
    
    let filteredData = [...configurationData];
  
    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((config) => {
        if (config === null) return false;
        return Object.values(config)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }
  
    return filteredData;
  }, [configurationData, searchQuery, hasSmtpData]);

  const totalPages = Math.ceil(
    sortedAndFilteredConfigurations.length / entriesPerPage
  );
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentConfigurations = sortedAndFilteredConfigurations.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const columns: { key: SortableKey; label: string }[] = [
    { key: "id", label: "Id" },
    { key: "host", label: "Host" },
    { key: "port", label: "Port" },
    { key: "user", label: "User" },
    { key: "password", label: "Password" },
  ];

  const exportToCSV = () => {
    if (!hasSmtpData) {
      toast.error('No SMTP configuration to export');
      return;
    }

    const csvRows = [];
    const headers = [
      "ID",
      "Host",
      "Port",
      "Username",
      "Password",
    ];
    csvRows.push(headers.join(","));

    if (smtpConfiguration) {
      const row = [
        (smtpConfiguration as SmtpSettings).id,
        (smtpConfiguration as SmtpSettings).host,
        (smtpConfiguration as SmtpSettings).port,
        (smtpConfiguration as SmtpSettings).user,
        (smtpConfiguration as SmtpSettings).password,
      ];
      csvRows.push(row.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "smtp-configuration.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!hasSmtpData) {
      toast.error('No SMTP configuration to print');
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>SMTP Configuration - Print</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                h1 {
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 30px;
                    font-size: 24px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    font-size: 12px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                    color: #495057;
                }
                tbody tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .print-info {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: #6c757d;
                }
                @media print {
                    body { margin: 0; }
                    .print-info { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>SMTP Configuration Report</h1>
            <div class="print-info">
                Generated on: ${new Date().toLocaleString()}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Host</th>
                        <th>Port</th>
                        <th>Username</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${(smtpConfiguration as SmtpSettings).id}</td>
                        <td>${(smtpConfiguration as SmtpSettings).host}</td>
                        <td>${(smtpConfiguration as SmtpSettings).port}</td>
                        <td>${(smtpConfiguration as SmtpSettings).user}</td>
                        <td>${(smtpConfiguration as SmtpSettings).password}</td>
                    </tr>
                </tbody>
            </table>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
      `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="smtp-container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading SMTP configuration...</p>
        </div>
      </div>
    );
  }

  // Show error state only for actual errors (not "not found")
  if (isActualError) {
    return (
      <div className="smtp-container">
        <div className="alert alert-danger">
          <h4>Error Loading SMTP Configuration</h4>
          <p>{error?.message || 'An error occurred while fetching SMTP configuration'}</p>
          <button 
            className="btn btn-primary"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['smtpConfigurations'] })}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="smtp-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="fw-bold">SMTP</h1>
        {hasSmtpData ? (
          <button 
            className="btn add-smtp-btn "
            onClick={() => setShowEditModal(true)}
            style={{ backgroundColor: "var(--primary-background)", color: "#fff", marginLeft: "35px" }}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            Edit SMTP
          </button>
        ) : (
          <button 
            className="btn add-smtp-btn"
            onClick={() => setShowAddModal(true)}
            style={{ backgroundColor: "var(--primary-background)", color: "#fff" }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add SMTP
          </button>
        )}
      </div>

      <div className={`smtp-wrapper ${theme === "dark" ? "bg-dark" : "bg-white"}`}>
        <div className="smtp-list-main">
          <div className="smtplist-container">
            {/* Always show the table structure */}
            <div className="search-section">
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  required
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`${theme === "dark" ? "bg-black text-light dark-placeholder" : "bg-white"}`}
                  disabled={!hasSmtpData}
                />
                <Form.Control.Feedback type="invalid">
                  search...
                </Form.Control.Feedback>
              </Form.Group>
              <div className="user-list-btn">
                <button onClick={exportToCSV} disabled={!hasSmtpData}>
                  <i className="fa-solid fa-file-csv"></i> CSV
                </button>
                <button onClick={handlePrint} disabled={!hasSmtpData}>
                  <i className="fa-solid fa-print"></i> PRINT
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="table caption-top table-hover">
                <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        onClick={() => hasSmtpData && requestSort(column.key)}
                        style={{ cursor: hasSmtpData ? "pointer" : "default", minWidth: "120px" }}
                      >
                        {column.label}
                        {hasSmtpData && (
                          <span style={{ marginLeft: "8px" }}>
                            {getSortIcon(column.key)}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hasSmtpData ? (
                    currentConfigurations.length > 0 ? (
                      currentConfigurations.map((config, index) => (
                        <tr key={index} className={theme === "dark" ? "dark-mode-tr" : ""}>
                          <td className={theme === "dark" ? "dark-mode-td" : ""}>{index + 1}</td>
                          <td className={theme === "dark" ? "dark-mode-td" : ""}>{(config as SmtpSettings).host}</td>
                          <td className={theme === "dark" ? "dark-mode-td" : ""}>{(config as SmtpSettings).port}</td>
                          <td className={theme === "dark" ? "dark-mode-td" : ""}>{(config as SmtpSettings).user}</td>
                          <td className={theme === "dark" ? "dark-mode-td" : ""}>
                            {"*".repeat((config as SmtpSettings).password.length)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className={`text-center ${theme === "dark" ? "dark-mode-td" : ""}`}>
                          No matching SMTP configuration found
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className={`text-center ${theme === "dark" ? "dark-mode-td" : ""}`}>
                        No SMTP configuration found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add SMTP Modal */}
      <SmtpModal 
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSmtp}
        isPending={smtpMutation.isPending}
      />

      {/* Edit SMTP Modal */}
      <SmtpModal 
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={handleEditSmtp}
        initialData={getCurrentEditConfig}
        isEdit={true}
        isPending={smtpMutation.isPending}
      />
      </div>
    </div>
  );
};

export default SmtpPage;