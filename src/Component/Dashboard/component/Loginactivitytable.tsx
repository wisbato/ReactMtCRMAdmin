import { useQuery } from "@tanstack/react-query";
import { Form, Col } from "react-bootstrap";
import { useState } from "react";
import { getUserLoginActivity } from "../../../api/user_all_details/getLogin";
import { useTheme } from "../../../context/ThemeContext";

interface LoginActivity {
  id: number;
  User: {
    name: string;
  };
  userAgent: string;
  ip: string;
  createdAt: string;
}

const Loginactivitytable = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LoginActivity | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  // Fetch login activities using TanStack Query
  const { data: loginActivities = [], isLoading, isError } = useQuery({
    queryKey: ['loginActivities'],
    queryFn: () => getUserLoginActivity(13), // Replace with dynamic user ID if needed
  });

  const requestSort = (key: keyof LoginActivity) => {
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

  const getSortIcon = (columnKey: keyof LoginActivity) => {
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

  // Filter and sort activities
  const sortedAndFilteredActivities = (() => {
    let filteredData = [...loginActivities];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((activity) =>
        Object.values(activity)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activity.User.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        // Handle nested User.name property
        if (sortConfig.key === 'User') {
          const aValue = a.User.name;
          const bValue = b.User.name;
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        const aValue = a[sortConfig.key as keyof LoginActivity];
        const bValue = b[sortConfig.key as keyof LoginActivity];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
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

        return 0;
      });
    }

    return filteredData;
  })();

  const totalPages = Math.ceil(sortedAndFilteredActivities.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentActivities = sortedAndFilteredActivities.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["ID", "Name", "UserAgent", "IP Address", "Date"];
    csvRows.push(headers.join(","));

    loginActivities.forEach((activity, index) => {
      const row = [
        index + 1,
        `"${activity.User.name}"`, // Wrap in quotes to handle commas
        `"${activity.userAgent}"`,
        activity.ip,
        new Date(activity.createdAt).toLocaleString(),
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "login_activities.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Login Activities Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #2c3e50; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .print-info { text-align: center; margin-bottom: 15px; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Login Activities Report</h1>
        <div class="print-info">
          Generated on: ${new Date().toLocaleString()}<br>
          Total Records: ${loginActivities.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>User Agent</th>
              <th>IP Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${loginActivities.map((activity, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${activity.User.name}</td>
                <td>${activity.userAgent}</td>
                <td>${activity.ip}</td>
                <td>${new Date(activity.createdAt).toLocaleString()}</td>
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
    `);
    printWindow.document.close();
  };

  if (isLoading) return <div>Loading login activities...</div>;
  if (isError) return <div>Error loading login activities</div>;

  return (
    <div className="user-list-main" style={{ marginTop: "30px" }}>
      <div className={`userlist-container ${theme === "dark" ? "bg-dark text-light" : "bg-light"}`}>
        <div className="search-section">
          <Form.Group as={Col} md="3" controlId="validationCustom04">
            <Form.Label></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={`${theme === "dark" ? "bg-black text-light dark-placeholder" : "bg-white"}`}
              required 
            />
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
        <div className="table-container">
          <table className="table caption-top table-hover">
            <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
              <tr>
                {["id", "User", "userAgent", "ip", "createdAt"].map(
                  (col) => (
                    <th 
                      key={col} 
                      scope="col" 
                      onClick={() => requestSort(col as keyof LoginActivity)}
                      style={{ cursor: "pointer" }}
                    >
                      {col === "User" ? "Name" : 
                       col === "userAgent" ? "User Agent" :
                       col === "ip" ? "IP Address" :
                       col === "createdAt" ? "Date" : "ID"}
                      <span style={{ marginLeft: "8px" }}>
                        {getSortIcon(col as keyof LoginActivity)}
                      </span>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {currentActivities.length > 0 ? (
                currentActivities.map((activity, index) => (
                  <tr key={activity.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <th className={theme === "dark" ? "dark-mode-th" : ""}>{indexOfFirstEntry + index + 1}</th>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{activity.User.name}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{activity.userAgent}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>{activity.ip}</td>
                    <td className={theme === "dark" ? "dark-mode-td" : ""}>
                      {new Date(activity.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }} className={theme === "dark" ? "dark-mode-td" : ""}>
                    No login activities found
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
              {Math.min(indexOfLastEntry, sortedAndFilteredActivities.length)} of{" "}
              {sortedAndFilteredActivities.length} entries
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
    </div>
  );
};

export default Loginactivitytable;