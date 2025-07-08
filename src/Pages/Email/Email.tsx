import { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Badge } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getName } from "../../api/bank/getName";
import { addEmail } from "../../api/email/addEmail"; // Import the addEmail function
import { toast } from "react-hot-toast";
import "./email.css";
import { useTheme } from "../../context/ThemeContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
}

const Email = () => {
  const { theme } = useTheme();
  const [emailData, setEmailData] = useState<{
    sendTo: "ALL" | "SELECTED"; // Make sure this matches your option values
    clientNames: string[];
    subject: string;
    content: string;
  }>({
    sendTo: "ALL",
    clientNames: [],
    subject: "",
    content: "",
  });

  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [quillKey, setQuillKey] = useState(0);
  const [errors, setErrors] = useState({
    clientNames: "",
    subject: "",
    content: "",
  });

  // TanStack Query for fetching users
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getName,
    staleTime: 5 * 60 * 1000,
  });

  // TanStack Mutation for sending email
  // TanStack Mutation for sending email
// TanStack Mutation for sending email
const { mutate: sendEmail, isPending: isSending } = useMutation({
    mutationFn: addEmail,
    onSuccess: () => {
      console.log("Email sent successfully - resetting form");
      toast.success("Email sent successfully!");
      // Reset all form states
      setEmailData({
        sendTo: "ALL",
        clientNames: [],
        subject: "", // Clear subject
        content: "", // Clear content
      });
      setSelectedClients([]);
      setClientSearchTerm("");
      setErrors({
        clientNames: "",
        subject: "",
        content: "",
      });
      setQuillKey((prevKey) => prevKey + 1); // Increment key to force re-render
    },
    onError: (error: Error) => {
      console.log("Email failed:", error);
      toast.error(error.message || "Failed to send email");
    },
  });

  useEffect(() => {
    console.log("Updated subject value:", emailData.subject);
  }, [emailData.subject]);

  const users = Array.isArray(usersData?.data) ? usersData?.data : [];

  // Filter users based on search term and exclude already selected users
  const filteredUsers = users?.filter(
    (user: User) =>
      (user.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(clientSearchTerm.toLowerCase())) &&
      !selectedClients.some((selected) => selected.id === user.id)
  );

  const handleClientSelect = (user: User) => {
    setSelectedClients([...selectedClients, user]);
    setEmailData({
      ...emailData,
      clientNames: [...emailData.clientNames, user.id.toString()],
    });
    setClientSearchTerm("");
    setShowDropdown(false);
  };

  const removeClient = (userId: number) => {
    setSelectedClients(
      selectedClients.filter((client) => client.id !== userId)
    );
    setEmailData({
      ...emailData,
      clientNames: emailData.clientNames.filter(
        (id) => id !== userId.toString()
      ),
    });
  };

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleChange = (field: string, value: string) => {
    setEmailData({ ...emailData, [field]: value });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { clientNames: "", subject: "", content: "" };
    if (emailData.sendTo === "SELECTED" && emailData.clientNames.length === 0) {
      newErrors.clientNames = "Please select at least one client";
      valid = false;
    }
    if (!emailData.subject) {
      newErrors.subject = "Subject is required";
      valid = false;
    }
    if (!emailData.content) {
      newErrors.content = "Email content is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Prepare the data for the API
    const emailPayload = {
      sendTo: emailData.sendTo,
      subject: emailData.subject,
      body: emailData.content,
      ...(emailData.sendTo === "SELECTED" && {
        selectedUserIds: emailData.clientNames,
      }),
    };
    // Call the mutation
    sendEmail(emailPayload);
  };
  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className={`email-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
      <Container className={`mt-3 p-4 ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <h2
          className="mb-4"
          style={{ color: "var(--primary-color)", fontSize: "30px", fontWeight: "bolder" }}
        >
          Send Email
        </h2>

        {usersError && (
          <Alert variant="danger" className="mb-3">
            Error loading clients: {(usersError as Error).message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Send To */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              Send To <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={emailData.sendTo}
              onChange={(e) => handleChange("sendTo", e.target.value)}
              style={inputStyle}
              className={theme === "dark" ? "dark-mode-placeholder" : ""}
            >
              <option value="ALL">All CRM Users</option>
              <option value="SELECTED">Selected Users</option>{" "}
              {/* Change to "SELECTED" */}
            </Form.Select>
          </Form.Group>

          {/* Conditionally render Client Name field */}
          {emailData.sendTo === "SELECTED" && (
            <Form.Group
              controlId="clientName"
              className={`mb-3 position-relative ${theme === "dark" ? "dark-mode-placeholder" : ""}`}
            >
              <Form.Label className="fw-bold">
                Select Client(s) <span className="text-danger">*</span>
              </Form.Label>

              {/* Input field with selected clients inside */}
              <div
                className={`form-control d-flex flex-wrap align-items-center gap-2 p-2 position-relative ${theme === "dark" ? "bg-black" : ""}`}
                style={{ minHeight: "42px" }}
              >
                {/* Selected clients pills inside the input */}
                {selectedClients.map((client) => (
                  <Badge
                    key={client.id}
                    pill
                    className="d-flex align-items-center px-3 py-2"
                    style={{ fontSize: "0.9rem",background: "var(--primary-gradient)" }}
                  >
                    {client.name}
                    <button
                      type="button"
                      className="ms-2 btn-close btn-close-white"
                      style={{ fontSize: "0.5rem" }}
                      onClick={() => removeClient(client.id)}
                      aria-label="Remove"
                    />
                  </Badge>
                ))}

                {/* Search input */}
                <input
                  type="text"
                  placeholder={
                    selectedClients.length === 0
                      ? isLoadingUsers
                        ? "Loading clients..."
                        : "Start typing client name or email..."
                      : ""
                  }
                  value={clientSearchTerm}
                  onChange={handleClientInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  disabled={isLoadingUsers}
                  className={`${theme === "dark" ? "bg-black text-light" : ""}`}
                  style={{
                    border: "none",
                    outline: "none",
                    flex: "1",
                    minWidth: "120px",
                    backgroundColor: "transparent",
                    paddingRight: selectedClients.length > 0 ? "30px" : "0",
                  }}
                />

                {/* Clear all icon at the end */}
                {selectedClients.length > 0 && (
                  <button
                    type="button"
                    className="btn-close position-absolute"
                    style={{
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "0.7rem",
                    }}
                    onClick={() => {
                      setSelectedClients([]);
                      setEmailData({ ...emailData, clientNames: [] });
                    }}
                    aria-label="Clear all selections"
                    title="Clear all selections"
                  />
                )}
              </div>

              {showDropdown &&
                Array.isArray(filteredUsers) &&
                filteredUsers.length > 0 && (
                  <div className="client-dropdown">
                    {filteredUsers?.map((user: User) => (
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

              {showDropdown &&
                clientSearchTerm &&
                filteredUsers?.length === 0 &&
                !isLoadingUsers && (
                  <div className="client-dropdown">
                    <div className="p-2 text-muted">
                      No clients found matching "{clientSearchTerm}"
                    </div>
                  </div>
                )}

              {errors.clientNames && (
                <small className="text-danger">{errors.clientNames}</small>
              )}
              <Form.Control
                type="hidden"
                name="clientNames"
                value={emailData.clientNames.join(",")}
              />
            </Form.Group>
          )}

          {/* Subject */}
          <Form.Group className="mb-3">
  <Form.Label className="fw-bold">
    Subject <span className="text-danger">*</span>
  </Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter Subject"
    value={emailData.subject} // Ensure this is linked to the state
    onChange={(e) => handleChange("subject", e.target.value)} // Update state on change
    isInvalid={!!errors.subject}
    style={inputStyle}
    className={theme === "dark" ? "dark-mode-placeholder" : ""}
  />
  {errors.subject && (
    <Form.Control.Feedback type="invalid">
      {errors.subject}
    </Form.Control.Feedback>
  )}
</Form.Group>

          {/* Email Content */}
          <Form.Group className="mb-3">
  <Form.Label className="fw-bold">
    Email Content <span className="text-danger">*</span>
  </Form.Label>
  <ReactQuill
  key={quillKey}
  value={emailData.content}
  onChange={(value) => handleChange("content", value)}
  style={theme === "dark" ? { color: "white" } : {}}
  className={`${errors.content ? "is-invalid" : ""} ${theme === "dark" ? "bg-black quill-light" : ""}`}
/>

  {errors.content && (
    <div className="text-danger small mt-1">{errors.content}</div>
  )}
</Form.Group>

          {/* Submit Button */}
          <Button
            type="submit"
            className="fw-bold px-4"
            style={{
              background: "var(--primary-gradient)",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Submit"}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Email;
