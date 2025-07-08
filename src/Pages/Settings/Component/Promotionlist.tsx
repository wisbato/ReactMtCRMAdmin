import { Form, Col, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addPromotion } from "../../../api/promotion/addPromotion";
import { getPromotion } from "../../../api/promotion/getPromotion";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

const Promotionlist = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("Text");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState<File | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { theme } = useTheme();
  
  // Fetch promotions data
  const { 
    data: promotionsData, 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['promotions'],
    queryFn: getPromotion,
  });

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  const [users, setUsers] = useState<Array<{
    id: number;
    Type: string;
    PromotionImage: string | null;
    Status: string;
    Date: string;
  }>>([]);

  useEffect(() => {
    if (promotionsData?.data) {
      const formattedPromotions = promotionsData.data.map(promotion => ({
        id: promotion.id,
        Type: promotion.type,
        PromotionImage: promotion.Image, // Use the actual image URL from the API
        Status: promotion.status,
        Date: new Date(promotion.createdAt).toISOString().split('T')[0]
      }));
      setUsers(formattedPromotions);
    }
  }, [promotionsData]);

  const { mutate: addPromotionMutation, isPending } = useMutation({
    mutationFn: addPromotion,
    onSuccess: (data) => {
      console.log("Promotion added successfully:", data);
      toast.success("Promotion added successfully!");
      setShowModal(false);
      setSelectedType("Text");
      setDescription("");
      setStatus("Active");
      setImage(null);
      refetch();
    },
    onError: (error) => {
      console.error("Error adding promotion:", error);
      toast.error("Failed to add promotion");
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const totalPages = Math.ceil(users.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = users.slice(indexOfFirstEntry, indexOfLastEntry);

  const toggleStatus = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              Status: user.Status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  const handleSubmit = () => {
    if (selectedType === "Text" && !description.trim()) {
      toast.error("Description is required for Text type promotion");
      return;
    }
    
    if (selectedType === "Image" && !image) {
      toast.error("Image is required for Image type promotion");
      return;
    }

    const promotionDetails = {
      type: selectedType,
      status: status,
      ...(selectedType === "Text" && { description }),
      ...(selectedType === "Image" && image && { Image: image }),
    };

    addPromotionMutation(promotionDetails);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setDescription("");
    setImage(null);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading promotions...</div>;
  }

  if (isError) {
    return <div className="text-center py-4 text-danger">Error loading promotions</div>;
  }

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className={`user-list-main ${theme === "dark" ? "dark-mode" : ""}`} style={{ padding: "20px" }}>
      <div
        className="user-list-btn"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h3 className="fw-bold" style={{ color: "var(--primary-color)" }}>
          Promotion List
        </h3>
        <div className="user-list-btn">
          <button
            style={{
              fontSize: "18px",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              minWidth: "200px",
            }}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Create Promotion
          </button>
        </div>
      </div>

      <div className={`userlist-container ${theme === "dark" ? "dark-mode" : ""}`}>
        <div className="search-section">
          <Form.Group as={Col} md="3">
            <Form.Control type="text" placeholder="Search..." className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`} required />
          </Form.Group>
        </div>

        <div className="table-container">
          <table className="table caption-top table-hover">
            <thead className={`table-light ${theme === "dark" ? "dark-mode" : ""}`}>
              <tr>
                {[
                  "#",
                  "Type",
                  "Promotion Image",
                  "Status",
                  "Date",
                  "Action",
                ].map((col, index) => (
                  <th key={index} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className={theme === "dark" ? "dark-mode-tr" : ""}>
                  <th className={theme === "dark" ? "dark-mode-th" : ""}>{user.id}</th>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Type}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>
                    {user.PromotionImage ? (
                      <img
                        src={user.PromotionImage}
                        alt="Promotion"
                        className="img-thumbnail document-thumbnail cursor-zoom"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        onClick={() => handleImageClick(user.PromotionImage as string)}
                        title="Click to view full image"
                      />
                    ) : (
                      <span>{user.Type === "Text" ? "Text" : "No Image"}</span>
                    )}
                  </td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>
                    <span className={`badge ${
                      user.Status === "Active" ? "bg-success" : "bg-danger"
                    }`}>
                      {user.Status}
                    </span>
                  </td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>{user.Date}</td>
                  <td className={theme === "dark" ? "dark-mode-td" : ""}>
                    <button
                      onClick={() => toggleStatus(user.id)}
                      style={{
                        backgroundColor:
                          user.Status === "Active" ? "#D32F2F" : "#2E7D32",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {user.Status === "Active" ? "Inactive" : "Active"}
                    </button>
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
              alt="Promotion preview"
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

      {/* Add Promotion Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        style={{ padding: "12px", marginTop: "10px" }}
      >
        <Modal.Header
          closeButton
          style={{ borderBottom: "none", background: "#fafafa" }}
          className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}
        >
          <Modal.Title style={{ fontWeight: "bold" , color: "var(--primary-color)" }}>
            Add Promotion
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}>
          <Form>
            <Form.Group controlId="promotionType" className="mb-3">
              <Form.Label>
                Type <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                value={selectedType}
                onChange={handleTypeChange}
                style={inputStyle}
                className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
              >
                <option value="Text">Text</option>
                <option value="Image">Image</option>
              </Form.Select>
            </Form.Group>

            {selectedType === "Image" ? (
              <Form.Group controlId="promotionImage" className="mb-3">
                <Form.Label>
                  Promotion Image <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                />
                {image && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Selected: {image.name}
                    </small>
                  </div>
                )}
              </Form.Group>
            ) : (
              <Form.Group controlId="promotionDescription" className="mb-3">
                <Form.Label>
                  Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
                  required
                />
              </Form.Group>
            )}

            <Form.Group controlId="promotionStatus" className="mb-3">
              <Form.Label>
                Status <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                style={{
                  height: "45px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  ...inputStyle
                }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={theme === "dark" ? "dark-mode-placeholder" : "bg-light"}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer
          style={{
            borderTop: "none",
            display: "flex",
            justifyContent: "start",
          }}
          className={`${theme === "dark" ? "bg-dark text-light dark-placeholder" : "bg-white"}`}
        >
          <Button
            style={{
              background: "var(--primary-gradient)",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
              marginRight: "10px",
              fontSize: "16px",
              fontWeight: "700",
            }}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button
            style={{
              background: "var(--primary-color)",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
              fontSize: "16px",
              fontWeight: "700",
            }}
            onClick={() => setShowModal(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Promotionlist;