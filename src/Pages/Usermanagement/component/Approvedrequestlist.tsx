import { Form, Col } from "react-bootstrap";
import "./userlist.css";
import { useState } from "react";
import "./approverequest.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMultiUserDocuments } from "../../../api/pending_document/multiUser";
import { Modal } from "react-bootstrap";
import { useTheme } from "../../../context/ThemeContext";

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface Document {
  file_url: string;
  status: string;
  uploaded: boolean;
  comment?: string;
}

interface Documents {
  proof_of_address?: Document;
  proof_of_identity?: Document;
}

interface UserDocument {
  id: number;
  userId: number;
  user: User;
  documents: Documents;
  createdAt: string;
  updatedAt: string;
}

interface DocumentRow {
  id: number;
  name: string;
  email: string;
  documentType: string;
  status: string;
  comment: string;
  image: string;
  registerDate: string;
  userId: number;
}

const Approverequestlist = () => {
  const { theme } = useTheme();
  const { userId } = useParams<{ userId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDocuments", userId],
    queryFn: getMultiUserDocuments,
  });

  const getDocumentRows = (): DocumentRow[] => {
    if (!data?.data || !userId) return [];

    const userDocuments: UserDocument[] = Array.isArray(data.data)
      ? data.data
      : [];
    const userDoc = userDocuments.find(
      (doc) => doc.user.id === parseInt(userId)
    );

    if (!userDoc) return [];

    const rows: DocumentRow[] = [];
    const { user, documents } = userDoc;

    Object.entries(documents).forEach(([docType, doc]) => {
      if (doc && doc.uploaded && doc.status === "approved") {
        const documentTypeName = docType
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        rows.push({
          id: userDoc.id,
          name: user.name,
          email: user.email,
          documentType: documentTypeName,
          status: doc.status,
          comment: doc.comment || "-",
          image: doc.file_url,
          registerDate: user.createdAt,
          userId: user.id,
        });
      }
    });

    return rows;
  };

  const documentRows = getDocumentRows();

  const filteredDocs = documentRows.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDocs.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstEntry, indexOfLastEntry);

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "Name",
      "Email",
      "Document Type",
      "Status",
      "Register Date",
    ];
    csvRows.push(headers.join(","));

    currentDocs.forEach((doc) => {
      const row = [
        doc.id,
        `"${doc.name}"`,
        doc.email,
        `"${doc.documentType}"`,
        doc.status,
        `"${new Date(doc.registerDate).toLocaleDateString()}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "approved_documents.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Approved Documents - Print</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  color: #333;
              }
              h1 {
                  text-align: center;
                  color: #55da59;
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
          <h1>Approved Documents</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Document Type</th>
                      <th>Status</th>
                      <th>Register Date</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentDocs
                    .map(
                      (doc) => `
                      <tr>
                          <td>${doc.id}</td>
                          <td>${doc.name}</td>
                          <td>${doc.email}</td>
                          <td>${doc.documentType}</td>
                          <td>${doc.status}</td>
                          <td>${new Date(doc.registerDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}</td>
                      </tr>
                  `
                    )
                    .join("")}
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

  if (isLoading) {
    return <div className="loading">Loading approved requests...</div>;
  }

  if (isError && error instanceof Error) {
    return (
      <div className="error">
        Error loading approved requests: {error.message}
      </div>
    );
  }

  return (
    <div className={`approverequest-list-main ${theme === "dark" ? "bg-black" : ""}`}>
      <div className="user-list-main">
        <h1 className="fw-bold" style={{ color: "var(--primary-color)" }}>
          Approved Request List
        </h1>

        <div
          className={`userlist-container ${
            theme === "dark" ? "dark-mode" : ""
          }`}
        >
          <div className="search-section d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-3 gap-2 gap-md-0">
            <Form.Group as={Col} md="4" lg="3">
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`${theme === "dark" ? "bg-black text-light dark-placeholder" : "bg-white"}`}
              />
            </Form.Group>

            <div className="user-list-btn d-flex gap-2">
              <button className="btn btn-success" onClick={exportToCSV}>
                <i className="fa-solid fa-file-csv me-1"></i>
                <span className="d-none d-sm-inline">CSV</span>
              </button>
              <button className="btn btn-success" onClick={handlePrint}>
                <i className="fa-solid fa-print me-1"></i>
                <span className="d-none d-sm-inline">PRINT</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
                <tr>
                  <th className="min-width-50">Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Document Type</th>
                  <th>Status</th>
                  <th>Comment</th>
                  <th>Image</th>
                  <th>Register Date</th>
                </tr>
              </thead>
              <tbody>
                {currentDocs.length > 0 ? (
                  currentDocs.map((doc, index) => (
                    <tr key={`${index}`} className={theme === "dark" ? "dark-mode-tr" : ""}>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{doc.id}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{doc.name}</td>
                      <td className={`text-truncate max-width-150 ${theme === "dark" ? "dark-mode-td" : ""}`}>
                        {doc.email}
                      </td>
                      <td className={`text-truncate max-width-150 ${theme === "dark" ? "dark-mode-td" : ""}`}>
                        {doc.documentType}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        <span className="badge bg-success">
                          {doc.status.charAt(0).toUpperCase() +
                            doc.status.slice(1)}
                        </span>
                      </td>
                      <td className={`text-truncate max-width-100 ${theme === "dark" ? "dark-mode-td" : ""}`}>
                        {doc.comment || "-"}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {doc.image ? (
                          <img
                            src={doc.image}
                            alt="document"
                            className="img-thumbnail document-thumbnail cursor-zoom"
                            onClick={() => handleImageClick(doc.image)}
                            title="Click to view full image"
                          />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>
                      <td className={`nowrap ${theme === "dark" ? "dark-mode-td" : ""}`}>
                        {new Date(doc.registerDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <td colSpan={8} className={`text-center ${theme === "dark" ? "dark-mode-tr" : ""}`}>
                      {userId
                        ? "No approved documents found for this user."
                        : "User ID not provided."}
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
                {Math.min(indexOfLastEntry, filteredDocs.length)} of{" "}
                {filteredDocs.length} entries
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

      {/* Image Preview Modal */}
      <Modal
        show={showImageModal}
        onHide={handleCloseModal}
        centered
        size="xl"
        fullscreen
        className="image-preview-modal"
        contentClassName="bg-transparent border-0"
      >
        <Modal.Body
          className="d-flex justify-content-center align-items-center p-0"
          onClick={handleCloseModal}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Document preview"
              className="img-fluid"
              style={{
                height: "60vh",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Approverequestlist;