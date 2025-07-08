import { Form, Col, Modal, Button, Dropdown, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserList.css";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "../../../api/user/getAllUsers";
import { deleteUser } from "../../../api/user/deleteUser";
import { updateUser, EdituserCredentials } from "../../../api/user/editAllUsers";
import { toast } from 'react-hot-toast';
import useCan from "../../../../src/hooks/useCan";
import { useTheme } from "../../../context/ThemeContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  wallet_balance: string;
  lb_name: string | null;
  mt5Id?: string;
  status: string;
  createdAt: string;
  role: string;
  isIB: boolean;
}

type SortConfig = {
  key: keyof User | null;
  direction: "asc" | "desc" | null;
};

interface Country {
  cca2: string;
  callingCodes: string[];
  name: {
    common: string;
  };
  flag: string;
}

const Userlist = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Add this useEffect to fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v2/all?fields=alpha2Code,name,flag,callingCodes");
        const data = await response.json();
        
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
        setLoadingCountries(false);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        toast.error("Failed to load country data");
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Add this handler for country selection
  const handleCountrySelect = (country: Country) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        country: country.name.common
      });
    }
    setShowCountryDropdown(false);
  };
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const can= useCan();

  // Fetch users with TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (response) => {
      console.log('Update response:', response); // Debug log
      
      // The response is the user object directly, not wrapped in a user property
      if (!response || !response.id) {
        console.error('Invalid response structure:', response);
        toast.error('Invalid response from server');
        return;
      }

      // Update the cache with the new user data
      queryClient.setQueryData(['users'], (oldData: User[] | undefined) => {
        if (!oldData || !Array.isArray(oldData)) {
          console.warn('Old data is not an array:', oldData);
          return oldData;
        }
        
        return oldData.map(user => 
          user.id === response.id ? { ...user, ...response } : user
        );
      });
      
      toast.success('User updated successfully');
      setShowModal(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
      console.error('Update user error:', error);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Refresh the users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });

  // Ensure users is always an array
  const users: User[] = Array.isArray(data) ? data : [];
  console.log("User data:", users);

  const handleViewMore = () => {
    navigate("/viewuserlist");
  };

  const handleSave = async () => {
    if (!selectedUser) {
      toast.error('No user selected');
      return;
    }

    // Prepare update data without password
    const updateData: EdituserCredentials = {
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      country: selectedUser.country,
      phone: selectedUser.phone,
      status: selectedUser.status
    };

    updateUserMutation.mutate(updateData);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) {
      toast.error('No user selected for deletion');
      return;
    }

    deleteUserMutation.mutate({ id: userToDelete.id });
  };

  const requestSort = (key: keyof User) => {
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

  const getSortIcon = (columnKey: keyof User) => {
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

  const sortedAndFilteredUsers = (() => {
    let filteredData = [...users];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((user) =>
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle currency values
        if (typeof aValue === "string" && typeof bValue === "string") {
          if (aValue.startsWith("$") && bValue.startsWith("$")) {
            const aNum = parseFloat(aValue.replace("$", "").replace(",", ""));
            const bNum = parseFloat(bValue.replace("$", "").replace(",", ""));
            return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
          }

          // Handle dates
          if (!isNaN(Date.parse(aValue)) && !isNaN(Date.parse(bValue))) {
            return sortConfig.direction === "asc"
              ? new Date(aValue).getTime() - new Date(bValue).getTime()
              : new Date(bValue).getTime() - new Date(aValue).getTime();
          }

          // Handle regular strings
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle numbers
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return filteredData;
  })();

  const totalPages = Math.ceil(sortedAndFilteredUsers.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = sortedAndFilteredUsers.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const formatDateForCSV = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Country",
      "Status",
      "Wallet Balance",
      "IB Name",
      "Registration Date",
    ];
    csvRows.push(headers.join(","));

    users.forEach((user) => {
      const row = [
        user.id,
        `"${user.name}"`, // Wrap in quotes to handle commas in names
        user.email,
        user.phone,
        `"${user.country}"`, // Wrap in quotes to handle commas in country names
        user.status,
        user.wallet_balance,
        user.lb_name ? `"${user.lb_name}"` : "-",
        `"${formatDateForCSV(user.createdAt)}"`, // Format date properly
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "users.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>User List - Print</title>
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
              tbody tr:hover {
                  background-color: #e9ecef;
              }
              .status-badge {
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 10px;
                  font-weight: bold;
                  text-transform: uppercase;
              }
              .status-active {
                  background-color: #d4edda;
                  color: #155724;
              }
              .status-blocked {
                  background-color: #f8d7da;
                  color: #721c24;
              }
              .status-pending {
                  background-color: #fff3cd;
                  color: #856404;
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
          <h1>User List Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Country</th>
                      <th>Status</th>
                      <th>Wallet Balance</th>
                      <th>IB Name</th>
                      <th>Registration Date</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentUsers.map(user => `
                      <tr>
                          <td>${user.id}</td>
                          <td>${user.name}</td>
                          <td>${user.email}</td>
                          <td>${user.phone}</td>
                          <td>${user.country}</td>
                          <td>
                              <span class="status-badge status-${user.status.toLowerCase()}">
                                  ${user.status}
                              </span>
                          </td>
                          <td>${user.wallet_balance}</td>
                          <td>${user.lb_name || "-"}</td>
                          <td>${new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</td>
                      </tr>
                  `).join('')}
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

  const columns: { key: keyof User; label: string }[] = [
    { key: "id", label: "#" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "country", label: "Country" },
    { key: "status", label: "Status" },
    { key: "wallet_balance", label: "Wallet Balance" },
    { key: "lb_name", label: "IB Name" },
    { key: "createdAt", label: "Registration Date" },
  ];

  // Loading state
  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  // Error state
  if (isError && error instanceof Error) {
    return <div className="error">Error loading users: {error.message}</div>;
  }

  return (
    <div className="user-list-main">
      <h1 className="fw-bold">User List</h1>

      <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
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
              className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}
            />
            <Form.Control.Feedback type="invalid">
              search...
            </Form.Control.Feedback>
          </Form.Group>
          <div className="user-list-btn">
            <button onClick={exportToCSV}>
              <i className="fa-solid fa-file-csv"></i> CSV
            </button>
            <button onClick={handlePrint}>
              <i className="fa-solid fa-print"></i> PRINT
            </button>
          </div>
        </div>

        <div className="table-container" id="print-section">
          <table className="table caption-top table-hover">
            <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => requestSort(column.key)}
                    style={{ cursor: "pointer" }}
                  >
                    {column.label}
                    <span style={{ marginLeft: "8px" }}>
                      {getSortIcon(column.key)}
                    </span>
                  </th>
                ))}
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.id}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.name}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.email}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.phone}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.country}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      <span
                        className={`status-badge status-${user.status.toLowerCase()}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.wallet_balance}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.lb_name || "-"}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      <div className="action-container">
                        <div className="icon-row">
                          { can('edit_user') && <i
                            className="fa-solid fa-pen-to-square action-icon"
                            onClick={() => {
                              setSelectedUser({ ...user });
                              setShowModal(true);
                            }}
                          ></i> }
                          { can('delete_user') && <i 
                            className="fa-solid fa-trash action-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUserToDelete(user);
                              setShowDeleteConfirm(true);
                            }}
                            title="Delete user"
                          ></i>}
                          { can('view_user') && <i
                            className="fa-solid fa-eye action-icon"
                            onClick={handleViewMore}
                          ></i>}
                        </div>
                        {can('promote_user_to_ib') && (!user?.isIB && (
  <button className="promote-btn">Promote As IB</button>
))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="table-bottom-content">
            <span>
              Showing {indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, sortedAndFilteredUsers.length)} of{" "}
              {sortedAndFilteredUsers.length} entries
            </span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ❮
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              ❯
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className={`${theme === "dark" ? "bg-black" : ""}`}>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${theme === "dark" ? "bg-black" : ""}`}>
          Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className={`${theme === "dark" ? "bg-black" : ""}`}>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowDeleteConfirm(false);
              setUserToDelete(null);
            }}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          if (!updateUserMutation.isPending) {
            setShowModal(false);
            setSelectedUser(null);
          }
        }}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header 
  closeButton
  style={{ 
    borderBottom: "none", 
    background: theme === "dark" ? "#000000" : "#fafafa",
    color: theme === "dark" ? "#ffffff" : ""
  }}
  className={`${theme === "dark" ? "bg-black" : ""}`}
>
          <Modal.Title className={`${theme === "dark" ? "bg-black" : ""}`}>Edit User</Modal.Title>
        </Modal.Header>

        <Modal.Body className={`${theme === "dark" ? "bg-black" : ""}`}>
          {selectedUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>
                  Full Name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  disabled={updateUserMutation.isPending}
                  className={`${theme === "dark" ? "bg-black text-white" : ""}`}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  disabled={updateUserMutation.isPending}
                  className={`${theme === "dark" ? "bg-black text-white" : ""}`}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Phone Number <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.phone}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                  disabled={updateUserMutation.isPending}
                  className={`${theme === "dark" ? "bg-black text-white" : ""}`}
                />
              </Form.Group>

              <Form.Group className="mb-3">
    <Form.Label>
      Country <span style={{ color: "red" }}>*</span>
    </Form.Label>
    <InputGroup>
      <Dropdown show={showCountryDropdown} onToggle={(isOpen) => setShowCountryDropdown(isOpen)}>
        <Dropdown.Toggle 
          variant="light" 
          id="dropdown-country-code"
          className={`country-code-dropdown ${theme === "dark" ? "bg-dark" : ""}`}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: theme === "dark" ? "#000000" : "#f8f9fa",
            borderColor: '#ced4da',
            color: theme === "dark" ? '#ffffff' : '#000000'
          }}
        >
          {loadingCountries ? (
            "Loading..."
          ) : (
            selectedUser?.country && (
              <>
                {countries.find(c => c.name.common === selectedUser.country) && (
                  <img 
                    src={countries.find(c => c.name.common === selectedUser.country)?.flag} 
                    alt="country flag"
                    style={{ width: '20px', height: 'auto', marginRight: '5px' }}
                  />
                )}
                {selectedUser.country}
              </>
            )
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu 
          style={{ 
            maxHeight: '300px', 
            overflow: 'auto',
            backgroundColor: theme === "dark" ? "#000000" : "",
            color: theme === "dark" ? "#ffffff" : ""
          }}
        >
          {countries.map((country) => (
            <Dropdown.Item 
              key={country.cca2} 
              onClick={() => handleCountrySelect(country)}
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: theme === "dark" ? "#000000" : "",
                color: theme === "dark" ? "#ffffff" : ""
              }}
            >
              <span className="flag-icon me-2">
                <img 
                  src={country.flag} 
                  alt={`${country.name.common} flag`}
                  style={{ width: '24px', height: 'auto', marginRight: '5px', marginLeft: '8px' }}
                />
              </span>
              <span>{country.name.common}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </InputGroup>
  </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  Status <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Select
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: e.target.value,
                    })
                  }
                  disabled={updateUserMutation.isPending}
                  className={`${theme === "dark" ? "bg-black text-white" : ""}`}
                >
                  <option>active</option>
                  <option>blocked</option>
                  <option>pending</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer style={{ borderTop: "none" }} className={`${theme === "dark" ? "bg-black text-white" : ""}`}>
          <Button
            onClick={handleSave}
            disabled={updateUserMutation.isPending || !selectedUser}
            style={{
              background: "var(--primary-gradient)",
              padding: "10px 30px",
              borderRadius: "7px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
              fontWeight: 600,
            }}
          >
            {updateUserMutation.isPending ? 'Updating...' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Userlist;