import React, { useState } from "react";
import { Form, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Chartgraph from "./Chartgraph";
import './challengestatistics.css'

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
    status:'fhjh',
    date:'23-07-23'
  },
];


const Challengestatistics = () => {
  // Moved useState inside the functional component
  const [sortState, setSortState] = useState<boolean | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    paymentMethod: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const toggleSortDirection = () => {
    setSortState(sortState === null ? true : sortState ? false : null);
  };

  const totalPages = Math.ceil(users.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = users.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="news-wrapper2">
      <div className="user-list-main">
        <div style={{ display: "flex", justifyContent: "space-between",flexDirection:'column', marginBottom: "20px" }}>
          <h1 className="fw-bold">Challenge Statistics</h1>
          <div className="flex gap-4  "style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            {/* Status Dropdown */}
            <div className="flex flex-col" >
              <label className="text-sm font-semibold">Status</label>
              <select name="status" value={filters.status} onChange={handleChange}   style={{ width: "350px" }} >
                <option value="">Select...</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Method Dropdown */}
           

            {/* Date Pickers */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold" style={{ width: "350px" }}>From</label>
              <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} className="border rounded-md p-2" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold" style={{ width: "350px" }}>To</label>
              <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} className="border rounded-md p-2" />
            </div>
          </div>
        </div>
        <div className="chart-container">
    {[0, 1].map((row) => (
        <div className="chart-container-sub" key={row}>
            <Chartgraph />
            <Chartgraph />
        </div>
    ))}
</div>


      
<div>
<h1 className="fw-bold">Accounts in challenges</h1>


        <div className="userlist-container">
          <div className="search-section">
            <Form.Group as={Col} md="3" controlId="validationCustom04">
              <Form.Label></Form.Label>
              <Form.Control type="text" placeholder="Search..." required />
              <Form.Control.Feedback type="invalid">search...</Form.Control.Feedback>
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
              <thead className="table-light" style={{ minWidth: "180px", width: "220px" }}>
              <tr>
                  {["#", "Name / Email", "m5Id", "Amount", "Payment Method", "Note", "Status", 'Date'].map((col, index) => (
                    <th key={index} scope="col" onClick={toggleSortDirection} style={{ minWidth: "180px", width: "220px" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <th>{user.nameemail}</th>
                    <td>{user.m5id}</td>
                    <td>{user.amount}</td>
                    <td>{user.paymentmethod}</td>
                    <td>{user.note}</td>
                    <td>{user.status}</td>
                    <td>{user.date}</td>
                    <td>{user.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            <div className="table-bottom-content">
              <span>
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, users.length)} of {users.length} entries
              </span>
              <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                {[5, 10, 15, 20].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="pagination-controls">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                ❮
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                ❯
              </button>
            </div>
          </div>
        </div>
</div>
      </div>
    </div>
  );
};

export default Challengestatistics;
