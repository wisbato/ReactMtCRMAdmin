import React, { useState } from "react";
import { Form, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./historyreport.css";
import { useTheme } from "../../../context/ThemeContext";

// Define the type for filters
interface Filters {
  status: string;
  paymentMethod: string;
  fromDate: string;
  toDate: string;
}

const users = [
  {
    id: 1,
    nameemail: "tony",
    m5id: "anu@gmail.com",
    amount: "cvjv",
    withdrawto: "dgd",
    paymentmethod: "dhf",
    note: "cbs",
    comment: "dd",
    status: "fhjh",
    date: "23-07-23",
  },
  {
    id: 2,
    nameemail: "teena",
    m5id: "anu@gmail.com",
    amount: "cvjv",
    withdrawto: "dgd",
    paymentmethod: "dhf",
    note: "cbs",
    comment: "dd",
    status: "fhjh",
    date: "23-07-23",
  },
];

const Historyreport = () => {
  const { theme } = useTheme();
  // Moved useState inside the functional component
  const [sortState, setSortState] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<Filters>({
    status: "",
    paymentMethod: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const toggleSortDirection = () => {
    setSortState(sortState === null ? true : sortState ? false : null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nameemail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.m5id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.paymentmethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="historyreport-main1">
      <div className={`news-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
        <div className="user-list-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              marginBottom: "20px",
            }}
          >
            <h1 className="fw-bold">History Report</h1>
            <div
              className="flex gap-4  "
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Status Dropdown */}
              <Col md={3}>
                <Form.Group controlId="status" className="mb-3">
                  <Form.Label>
                    Status <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={filters.status}
                    name="status"
                    onChange={handleChange}
                    className={`${
                      theme === "dark"
                        ? "bg-dark text-light dark-placeholder"
                        : "bg-white"
                    }`}
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Date Pickers */}

              <Col md={4}>
                <label className="text-sm font-semibold">From</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleChange}
                  className={`border rounded-md p-2 ${
                    theme === "dark"
                      ? "bg-dark text-light dark-placeholder date-input-dark"
                      : "bg-white"
                  }`}
                />
              </Col>
              <Col md={4}>
                <label className="text-sm font-semibold">To</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleChange}
                  className={`border rounded-md p-2 ${
                    theme === "dark"
                      ? "bg-dark text-light dark-placeholder date-input-dark"
                      : "bg-white"
                  }`}
                />
              </Col>
            </div>
          </div>

          <div
            className={`userlist-container ${
              theme === "dark" ? "bg-dark text-light" : "bg-white"
            }`}
          >
            <div className="search-section">
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${
                    theme === "dark"
                      ? "bg-black text-light dark-placeholder"
                      : "bg-white"
                  }`}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  search...
                </Form.Control.Feedback>
              </Form.Group>
              <div className="user-list-btn">
                <button>
                  <i className="fa-solid fa-file-csv"></i> CSV
                </button>
                <button>
                  <i className="fa-solid fa-print"></i> PRINT
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="table caption-top table-hover">
                <thead
                  className={`table-light ${
                    theme === "dark" ? "dark-mode" : ""
                  }`}
                  style={{ minWidth: "180px", width: "220px" }}
                >
                  <tr>
                    {[
                      "#",
                      "Name / Email",
                      "m5Id",
                      "Amount",
                      "Payment Method",
                      "Note",
                      "Status",
                      "Date",
                    ].map((col, index) => (
                      <th
                        key={index}
                        scope="col"
                        onClick={toggleSortDirection}
                        style={{ minWidth: "180px", width: "220px" }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={theme === "dark" ? "dark-mode-tr" : ""}
                    >
                      <th className={theme === "dark" ? "dark-mode-th" : ""}>
                        {user.nameemail}
                      </th>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {user.m5id}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {user.amount}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {user.paymentmethod}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {user.note}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {user.status}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {user.date}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {user.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-container">
              <div className="table-bottom-content">
                <span>
                  Showing {indexOfFirstEntry + 1} to{" "}
                  {Math.min(indexOfLastEntry, users.length)} of {users.length}{" "}
                  entries
                </span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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
            <div
              className={`history-cards ${theme === "dark" ? "bg-black" : ""}`}
            >
              <div
                className={`history-card-body ${
                  theme === "dark" ? "bg-dark" : ""
                }`}
              >
                <p className={theme === "dark" ? "text-light" : ""}>Deposit</p>
              </div>
              <div
                className={`history-card-body ${
                  theme === "dark" ? "bg-dark" : ""
                }`}
              >
                <p className={theme === "dark" ? "text-light" : ""}>Deposit</p>
              </div>
              <div
                className={`history-card-body ${
                  theme === "dark" ? "bg-dark" : ""
                }`}
              >
                <p className={theme === "dark" ? "text-light" : ""}>Deposit</p>
              </div>
              <div
                className={`history-card-body ${
                  theme === "dark" ? "bg-dark" : ""
                }`}
              >
                <p className={theme === "dark" ? "text-light" : ""}>Deposit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historyreport;
