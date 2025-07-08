import { Form, Col, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faEye,
  faXmark,
  faArrowUp,
  faArrowDown,
  faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import "./news.css";
import Addnews from "./Component/Addnews";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNews, NewsItem } from "../../api/news/getNews";
import { deleteNews } from "../../api/news/deleteNews";
import { toast } from "react-hot-toast";
import useCan from "../../../src/hooks/useCan";
import { useTheme } from "../../context/ThemeContext";

interface SortConfig {
  key: keyof NewsItem | null;
  direction: "asc" | "desc" | null;
}

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  const { theme } = useTheme();
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={`${theme === "dark" ? "bg-dark text-light" : ""}`}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${theme === "dark" ? "bg-dark text-light" : ""}`}>{message}</Modal.Body>
      <Modal.Footer className={`${theme === "dark" ? "bg-dark text-light" : ""}`}>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const News = () => {
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddNews, setShowAddNews] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const can= useCan();

  const { data: newsData, isLoading, isError, error } = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
  });

  const navigateToAddnews = () => {
    navigate("/addnews");
  };

  const navigateToEditNews = (newsId: number) => {
    navigate(`/editnews/${newsId}`);
  };

  const newsItems = newsData?.data || [];

  const requestSort = (key: keyof NewsItem) => {
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

  const getSortIcon = (columnKey: keyof NewsItem) => {
    if (sortConfig.key !== columnKey) {
      return <FontAwesomeIcon icon={faArrowsUpDown} />;
    }

    if (sortConfig.direction === "asc") {
      return <FontAwesomeIcon icon={faArrowUp} />;
    }

    if (sortConfig.direction === "desc") {
      return <FontAwesomeIcon icon={faArrowDown} />;
    }

    return <FontAwesomeIcon icon={faArrowsUpDown} />;
  };

  const sortedAndFilteredNews = (() => {
    let filteredData = [...newsItems];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((news) =>
        Object.values(news)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof NewsItem];
        const bValue = b[sortConfig.key as keyof NewsItem];

        if (typeof aValue === "string" && typeof bValue === "string") {
          // Handle dates
          if (!isNaN(Date.parse(aValue))) {
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

  const totalPages = Math.ceil(sortedAndFilteredNews.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentNews = sortedAndFilteredNews.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: { key: keyof NewsItem; label: string }[] = [
    { key: "id", label: "#" },
    { key: "Title", label: "Title" },
    { key: "Description", label: "Description" },
    { key: "Short_description", label: "Short Description" },
    { key: "status", label: "Status" },
    { key: "Image", label: "Image" },
    { key: "createdAt", label: "Date" },
  ];

  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("News deleted successfully");
      setShowDeleteModal(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete news");
      setShowDeleteModal(false);
    },
  });

  const handleDeleteClick = (id: number) => {
    setNewsToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (newsToDelete) {
      deleteMutation.mutate({ id: newsToDelete });
    }
  };

  const cancelDelete = () => {
    setNewsToDelete(null);
    setShowDeleteModal(false);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "Title",
      "Description",
      "Short Description",
      "Status",
      "Image URL",
      "Created At",
      "Updated At",
    ];
    csvRows.push(headers.join(","));

    newsItems.forEach((news: NewsItem) => {
      const row = [
        news.id,
        `"${news.Title}"`,
        `"${news.Description}"`,
        `"${news.Short_description}"`,
        news.status,
        `"${news.Image}"`,
        `"${formatDateForCSV(news.createdAt)}"`,
        `"${formatDateForCSV(news.updatedAt)}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "news.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDateForCSV = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>News List - Print</title>
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
              .status-inactive {
                  background-color: #f8d7da;
                  color: #721c24;
              }
              .print-info {
                  text-align: center;
                  margin-bottom: 20px;
                  font-size: 14px;
                  color: #6c757d;
              }
              .news-image {
                  max-width: 100px;
                  height: auto;
              }
              @media print {
                  body { margin: 0; }
                  .print-info { display: none; }
              }
          </style>
      </head>
      <body>
          <h1>News List Report</h1>
          <div class="print-info">
              Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Short Description</th>
                      <th>Status</th>
                      <th>Image</th>
                      <th>Created At</th>
                  </tr>
              </thead>
              <tbody>
                  ${currentNews
                    .map(
                      (news) => `
                      <tr>
                          <td>${news.id}</td>
                          <td>${news.Title}</td>
                          <td>${news.Short_description}</td>
                          <td>
                              <span class="status-badge status-${news.status.toLowerCase()}">
                                  ${news.status}
                              </span>
                          </td>
                          <td>
                              ${news.Image ? `<img src="${news.Image}" class="news-image" />` : "No Image"}
                          </td>
                          <td>${new Date(news.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}</td>
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
    return (
      <div className="news-wrapper">
        <div className="user-list-main">
          <h1 className="fw-bold">News List</h1>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="news-wrapper">
        <div className="user-list-main">
          <h1 className="fw-bold">News List</h1>
          <div className="error">Error loading news: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`news-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
      <div className="user-list-main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1 className="fw-bold">News List</h1>
          <div className="user-list-btn">
            { can('add_news') && <button
              style={{
                fontSize: "18px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                minWidth: "180px",
              }}
              onClick={navigateToAddnews}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add News
            </button>}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          show={showDeleteModal}
          onHide={cancelDelete}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this news item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />

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
                alt="News preview"
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

        <div className={`userlist-container ${theme === "dark" ? "bg-dark" : ""}`}>
          <div className="search-section">
            <Form.Group as={Col} md="3" controlId="validationCustom04">
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
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
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      onClick={() => requestSort(column.key)}
                      style={{ cursor: "pointer", minWidth: "180px" }}
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
                {currentNews.length > 0 ? (
                  currentNews.map((news: NewsItem) => (
                    <tr key={news.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{news.id}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{news.Title}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{news.Description}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{news.Short_description}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        <span
                          className={`badge bg-${
                            news.status === "Active" ? "success" : "danger"
                          }`}
                        >
                          {news.status}
                        </span>
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        {news.Image ? (
                          <img
                            src={news.Image}
                            alt="News"
                            width="50"
                            className="img-thumbnail document-thumbnail cursor-zoom"
                            onClick={() => handleImageClick(news.Image)}
                            style={{ cursor: "pointer" }}
                            title="Click to view full image"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>{formatDate(news.createdAt)}</td>
                      <td className={theme === "dark" ? "dark-mode-td" : ""}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          { can('edit_news') && <FontAwesomeIcon
                            icon={faPenToSquare}
                            onClick={() => navigateToEditNews(news.id)}
                            style={{ cursor: "pointer", color: "blue" }}
                          />}
                          { can('delete_news') && <FontAwesomeIcon
                            icon={faXmark}
                            onClick={() => handleDeleteClick(news.id)}
                            style={{
                              color: "#f31212",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                          />}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1} className={`text-center ${theme === "dark" ? "dark-mode-td" : ""}`}>
                      No news found
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
                {Math.min(indexOfLastEntry, sortedAndFilteredNews.length)} of{" "}
                {sortedAndFilteredNews.length} entries
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
    </div>
  );
};

export default News;