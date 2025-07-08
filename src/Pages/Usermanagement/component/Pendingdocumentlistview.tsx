import { Form, Col } from "react-bootstrap";
import "./userlist.css";
import "./Pendingdocumentlist.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMultiUserDocuments } from "../../../api/pending_document/multiUser";
import { app_rejUser } from "../../../api/pending_document/app_rejUser"; // Update the import path
import { Modal } from "react-bootstrap";
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "react-hot-toast";

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
  documentType: string; // Display name ("Proof Of Identity")
  originalDocType: string; // API type ("proof_of_identity")
  status: string;
  comment: string;
  image: string;
  registerDate: string;
  userId: number;
}

const Pendingdocumentlistview = () => {
  const { theme } = useTheme();
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [currentRejectDoc, setCurrentRejectDoc] = useState<{
    id: number;
    docType: string;
  } | null>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  // Helper function to convert document type to API format
  const convertDocTypeToApiFormat = (docType: string): string => {
    const typeMap: { [key: string]: string } = {
      "Proof Of Address": "proof_of_address",
      "Proof Of Identity": "proof_of_identity",
      proof_of_address: "proof_of_address",
      proof_of_identity: "proof_of_identity",
    };
    return typeMap[docType] || docType.toLowerCase().replace(/\s+/g, "_");
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDocuments", userId],
    queryFn: getMultiUserDocuments,
  });

  // Mutation for approving documents
  const approveAddressMutation = useMutation({
    mutationFn: async (userId: number) => {
      return app_rejUser({
        userId,
        type: "proof_of_address",
        status: "approved",
        comment: "",
      });
    },
    onSuccess: (data) => {
      console.log("Approval success:", data); // Debug log
      queryClient.invalidateQueries({ queryKey: ["userDocuments", userId] });
      toast.success("Document approved successfully!");
    },
    onError: (error: any) => {
      console.error("Approval failed:", error);
      toast.error(`Failed to approve document: ${error.message}`);
    },
  });

  const approveIdentityMutation = useMutation({
    mutationFn: async (userId: number) => {
      return app_rejUser({
        userId,
        type: "proof_of_identity",
        status: "approved",
        comment: "",
      });
    },
    onSuccess: (data) => {
      console.log("Approval success:", data); // Debug log
      queryClient.invalidateQueries({ queryKey: ["userDocuments", userId] });
      toast.success("Document approved successfully!");
    },
    onError: (error: any) => {
      console.error("Approval failed:", error);
      toast.error(`Failed to approve document: ${error.message}`);
    },
  });

  // Mutation for rejecting documents
  const rejectMutation = useMutation({
    mutationFn: async (document: {
      id: number;
      type: string;
      comment: string;
    }) => {
      console.log("Rejecting document:", document); // Debug log
      return app_rejUser({
        userId: document.id,
        type: document.type,
        status: "rejected",
        comment: document.comment || "Rejected",
      });
    },
    onSuccess: (data) => {
      console.log("Rejection success:", data); // Debug log
      queryClient.invalidateQueries({ queryKey: ["userDocuments", userId] });
      setShowRejectModal(false);
      setRejectComment("");
      setCurrentRejectDoc(null);
      toast.success("Document rejected successfully!");
    },
    onError: (error: any) => {
      console.error("Rejection failed:", error);
      toast.error(`Failed to reject document: ${error.message}`);
    },
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
      if (doc && doc.uploaded) {
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
          originalDocType: convertDocTypeToApiFormat(docType), // Use the conversion function
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
  console.log(currentDocs);

  const handleApprove = (userId: number, docType: string) => {
    if (docType === "proof_of_address") {
      approveAddressMutation.mutate(userId);
    } else {
      approveIdentityMutation.mutate(userId);
    }
  };

  const handleReject = (userId: number, docType: string) => {
    console.log("handleReject called with:", { userId, docType }); // Debug log
    const apiType = convertDocTypeToApiFormat(docType);
    setCurrentRejectDoc({ id: userId, docType: apiType });
    setShowRejectModal(true);
  };

  const confirmRejection = () => {
    if (!currentRejectDoc || !rejectComment.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    console.log("Confirming rejection:", currentRejectDoc, rejectComment); // Debug log

    rejectMutation.mutate({
      id: currentRejectDoc.id,
      type: currentRejectDoc.docType,
      comment: rejectComment.trim(),
    });
  };

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
    a.setAttribute("download", "user_documents.csv");
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
                <title>User Documents - Print</title>
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
                <h1>User Documents</h1>
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
                                <td>${new Date(
                                  doc.registerDate
                                ).toLocaleDateString("en-US", {
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
    return <div className="loading">Loading user documents...</div>;
  }

  if (isError && error instanceof Error) {
    return (
      <div className="error">Error loading user documents: {error.message}</div>
    );
  }

  return (
    <div className={`user-list-main1 ${theme === "dark" ? "bg-black" : ""}`}>
      <div className="user-list-main">
        <h1 className="fw-bold" style={{ color: "var(--primary-color)" }}>
          User Document Details
        </h1>

        <div
          className={`userlist-container ${
            theme === "dark" ? "bg-dark text-light" : ""
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
                  <th className="min-width-200">Action</th>
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
                        <span
                          className={`badge ${
                            doc.status === "pending"
                              ? "bg-warning"
                              : doc.status === "approved"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
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
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        <div className="d-flex flex-wrap gap-1">
                          <button
                            className="btn btn-success btn-sm flex-grow-1"
                            onClick={() =>
                              handleApprove(doc.userId, doc.originalDocType)
                            }
                            disabled={
                              doc.status === "approved" ||
                              (doc.originalDocType === "proof_of_address"
                                ? approveAddressMutation.isPending
                                : approveIdentityMutation.isPending)
                            }
                            title="Approve document"
                          >
                            {doc.originalDocType === "proof_of_address" ? (
                              approveAddressMutation.isPending
                            ) : approveIdentityMutation.isPending ? (
                              <span className="spinner-border spinner-border-sm me-1"></span>
                            ) : null}
                            <span className="d-none d-md-inline">
                              {doc.originalDocType === "proof_of_address"
                                ? approveAddressMutation.isPending
                                  ? "Approving..."
                                  : "Approve"
                                : approveIdentityMutation.isPending
                                ? "Approving..."
                                : "Approve"}
                            </span>
                            <span className="d-inline d-md-none">✓</span>
                          </button>

                          <button
                            className="btn btn-danger btn-sm flex-grow-1"
                            onClick={() =>
                              handleReject(doc.userId, doc.originalDocType)
                            }
                            disabled={
                              doc.status === "rejected" ||
                              rejectMutation.isPending
                            }
                            title="Reject document"
                          >
                            <span className="d-none d-md-inline">Reject</span>
                            <span className="d-inline d-md-none">✗</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className={theme === "dark" ? "dark-mode-tr" : ""}>
                    <td colSpan={9} className={`text-center ${theme === "dark" ? "dark-mode-tr" : ""}`}>
                      {userId
                        ? "No documents found for this user."
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

      {/* Rejection Reason Modal */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
        className="reject-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reject Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="rejectReason">
            <Form.Label>Reason for rejection:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Enter the reason for rejecting this document..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowRejectModal(false)}
            disabled={rejectMutation.isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={confirmRejection}
            disabled={!rejectComment.trim() || rejectMutation.isPending}
          >
            {rejectMutation.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Rejecting...
              </>
            ) : (
              "Confirm Rejection"
            )}
          </button>
        </Modal.Footer>
      </Modal>

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

export default Pendingdocumentlistview;
