import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { updateNews } from "../../../api/news/editNews";
import { getSingleNews } from "../../../api/news/getSingleNews";
import { useTheme } from "../../../context/ThemeContext";

// Define the types
interface EditnewsCredentials {
    id: number;
    Title: string;
    Description: string;
    Short_description: string;
    status: string;
    Image?: File | undefined;
}

const Editnews = () => {
    const { theme } = useTheme();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<{
        Title: string;
        Description: string;
        Short_description: string;
        status: string;
        Image: File | null;
        existingImage?: string;
    }>({
        Title: "",
        Description: "",
        Short_description: "",
        status: "Publish",
        Image: null
    });

    // Fetch existing news data
    const { data: existingNews, isLoading } = useQuery({
        queryKey: ['news', id],
        queryFn: () => getSingleNews({ id: parseInt(id!) }),
        enabled: !!id,
    });

    // Update form data when news data is loaded
    useEffect(() => {
        if (existingNews?.data) {
            setFormData({
                Title: existingNews.data.Title,
                Description: existingNews.data.Description,
                Short_description: existingNews.data.Short_description,
                status: existingNews.data.status,
                Image: null,
                existingImage: existingNews.data.Image
            });
        }
    }, [existingNews]);

    // Edit mutation
    const editMutation = useMutation({
        mutationFn: updateNews,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            toast.success("News updated successfully");
            navigate("/news");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update news");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === "file" && e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, [name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!id) {
            toast.error("News ID is required");
            return;
        }

        // If there's a new image file, use FormData for multipart upload
        if (formData.Image) {
            const editNewsCredentials: EditnewsCredentials = {
              id: parseInt(id),
              Title: formData.Title,
              Description: formData.Description,
              Short_description: formData.Short_description,
              status: formData.status,
              Image: formData.Image
            };
            editMutation.mutate(editNewsCredentials);
          }else {
            // If no new image, send as regular object
            const editNewsCredentials: EditnewsCredentials = {
                id: parseInt(id),
                Title: formData.Title,
                Description: formData.Description,
                Short_description: formData.Short_description,
                status: formData.status,
                Image: undefined
            };

            editMutation.mutate(editNewsCredentials);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!id) {
        return <div>Invalid news ID</div>;
    }

    const inputStyle = {
        backgroundColor: theme === "dark" ? "#000000" : "",
        color: theme === "dark" ? "#ffffff" : "",
        borderColor: theme === "dark" ? "#212529" : ""
      };

    return (
        <div className={`container ${theme === "dark" ? "bg-black" : ""}`} style={{
            padding: '80px 30px',
            marginTop: '20px', 
            background: '#e5e7eb'
        }}>
            <h2 style={{
                color: "#55da59",
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>
                Edit News
            </h2>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '500' }}>
                        Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="Title"
                        value={formData.Title}
                        onChange={handleChange}
                        className={`py-2 ${theme === "dark" ? "dark-mode-placeholder" : ""}`}
                        style={inputStyle}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '500' }}>
                        Short Description <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="Short_description"
                        value={formData.Short_description}
                        onChange={handleChange}
                        className={`py-2 ${theme === "dark" ? "dark-mode-placeholder" : ""}`}
                        style={inputStyle}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '500' }}>
                        Description <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        className={`py-2 ${theme === "dark" ? "dark-mode-placeholder" : ""}`}
                        style={inputStyle}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '500' }}>
                        Status <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`py-2 ${theme === "dark" ? "dark-mode-placeholder" : ""}`}
                        style={inputStyle}
                        required
                    >
                        <option value="Published">Published</option>
                        <option value="Unpublished">Unpublished</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className={`mb-4 ${theme === "dark" ? "dark-mode-placeholder" : ""}`} style={inputStyle}>
                    <Form.Label style={{ fontWeight: '500' }}>
                        News Image
                    </Form.Label>
                    <div className="d-flex align-items-center"
                        style={{
                            border: "1px solid #dee2e6",
                            borderRadius: "0.25rem",
                            overflow: "hidden",
                        }}>
                        <label
                            htmlFor="file-upload"
                            style={{
                                backgroundColor: "#4f46e5",
                                color: "white",
                                padding: "0.5rem 1rem",
                                margin: "0",
                                cursor: "pointer",
                                display: "inline-block",
                            }}>
                            Choose File
                        </label>
                        <span style={{
                            padding: "0.5rem 1rem",
                            color: "#6c757d",
                            backgroundColor: "white",
                            flex: 1,
                        }}>
                            {formData.Image ? formData.Image.name : 
                             formData.existingImage ? "Current image (click to change)" : "No file chosen"}
                        </span>
                        <Form.Control
                            id="file-upload"
                            type="file"
                            name="Image"
                            accept="image/*"
                            onChange={handleChange}
                            style={{ display: "none" }}
                        />
                    </div>
                    {formData.existingImage && !formData.Image && (
                        <div className="mt-2">
                            <img 
                                src={formData.existingImage} 
                                alt="Current news" 
                                style={{ maxWidth: '200px', maxHeight: '200px' }} 
                            />
                        </div>
                    )}
                </Form.Group>

                <Button
                    type="submit"
                    style={{
                        background: "var(--primary-gradient)",
                        border: "none",
                        padding: "10px 25px",
                        borderRadius: "0.375rem"
                    }}
                    className="fw-bold"
                    disabled={editMutation.isPending}
                >
                    {editMutation.isPending ? "Updating..." : "Update News"}
                </Button>
            </Form>
        </div>
    );
};

export default Editnews;