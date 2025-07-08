// src/components/Addnews.tsx
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addNews, AddNewsCredentials } from "../../../api/news/addNews";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

const Addnews = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Title: "",
        Description: "",
        Short_description: "",
        status: "",
        Image: null as File | null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as any;

        if (name === "Image" && files && files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const mutation = useMutation({
        mutationFn: (newsData: AddNewsCredentials) => addNews(newsData),
        onSuccess: () => {
            toast.success("News added successfully!");
            navigate("/news");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add news");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Add validation
        if (!formData.Title || !formData.Description || !formData.Short_description || !formData.status) {
            alert("Please fill in all required fields");
            return;
        }
        
        if (!formData.Image) {
            alert("Please upload an image");
            return;
        }
    
        // Log the data being sent
        console.log("Submitting:", formData);
    
        mutation.mutate({
            Title: formData.Title,
            Description: formData.Description,
            Short_description: formData.Short_description,
            status: formData.status,
            Image: formData.Image
        });
    };

    const inputStyle = {
        backgroundColor: theme === "dark" ? "#000000" : "",
        color: theme === "dark" ? "#ffffff" : "",
        borderColor: theme === "dark" ? "#212529" : ""
      };

    return (
        <div className={`container mt-4 ${theme === "dark" ? "bg-black" : ""}`} style={{ 
            padding: '80px 30px',
            marginTop: '20px',
            background: '#e5e7eb'
        }}>
            <h2 className="fw-bold" style={{ color: "var(--primary-color)", fontSize: '30px' }}>Add News</h2>

            <div className={`p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="Title"
                            placeholder="Enter Title"
                            value={formData.Title}
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Description"
                            placeholder="Enter Description"
                            value={formData.Description}
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Short Description <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="Short_description"
                            placeholder="Short Description"
                            value={formData.Short_description}
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Published">Published</option>
                            <option value="Unpublished">Unpublished</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>News Image <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="file"
                            name="Image"
                            accept="image/*"
                            onChange={handleChange}
                            style={inputStyle}
                            className={theme === "dark" ? "dark-mode-placeholder" : ""}
                            required
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        style={{ background: "var(--primary-background)", border: "none" }}
                        className="fw-bold px-4 text-white shadow-sm"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Submitting..." : "Submit"}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Addnews;