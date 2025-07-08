import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addReplay } from '../../../api/ticket/addReplay';
import { getReplay } from '../../../api/ticket/getReplay';
import './viewticket.css';
import { useTheme } from "../../../context/ThemeContext";

const Viewticket = () => {
    const location = useLocation();
    const { theme } = useTheme();
    const { ticket } = location.state || {};
    const [replyMessage, setReplyMessage] = useState('');
    const queryClient = useQueryClient();

    // useQuery hook for fetching replies with aggressive refetching
    const {
        data: repliesData,
        isLoading: repliesLoading,
        isError: repliesError,
        error: repliesErrorMessage,
        refetch: refetchReplies
    } = useQuery({
        queryKey: ['ticket-replies', ticket?.id],
        queryFn: () => getReplay(ticket.id),
        enabled: !!ticket?.id,
        staleTime: 0, // Always consider data stale for immediate refetch
        refetchOnWindowFocus: true, // Refetch when window gains focus
        refetchInterval: 10000, // Auto-refetch every 10 seconds
        refetchIntervalInBackground: true, // Continue refetching in background
    });

    // Real-time polling effect - more aggressive for real-time updates
    useEffect(() => {
        if (!ticket?.id) return;

        // Create an interval for frequent polling
        const pollInterval = setInterval(() => {
            console.log('Polling for new replies...');
            refetchReplies();
        }, 1000); // Poll every 5 seconds

        return () => clearInterval(pollInterval);
    }, [ticket?.id, refetchReplies]);

    // Listen for custom events and storage changes
    useEffect(() => {
        const handleCustomEvents = () => {
            console.log('Custom event detected, refetching replies...');
            refetchReplies();
        };

        const handleStorageChange = (e:any) => {
            // Listen for localStorage/sessionStorage changes that might indicate new replies
            if (e.key === 'newReply' || e.key === 'ticketUpdated') {
                console.log('Storage change detected, refetching replies...');
                refetchReplies();
            }
        };

        const handleVisibilityChange = () => {
            // Refetch when user returns to the tab
            if (!document.hidden) {
                console.log('Tab became visible, refetching replies...');
                refetchReplies();
            }
        };

        // Event listeners
        window.addEventListener('replyUploaded', handleCustomEvents);
        window.addEventListener('ticketUpdated', handleCustomEvents);
        window.addEventListener('newReplyAdded', handleCustomEvents);
        window.addEventListener('storage', handleStorageChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listen for file upload events globally
        const handleFileChange = () => {
            setTimeout(() => {
                console.log('File upload detected, refetching replies...');
                refetchReplies();
            }, 1000); // Small delay to allow upload to complete
        };

        document.addEventListener('change', (e) => {
            if ((e.target as Element).closest('.reply-form, .add-reply-container')) {
                handleFileChange();
            }
        });

        // Listen for form submissions that might be replies
        document.addEventListener('submit', (e) => {
            if ((e.target as Element).closest('.reply-form, .add-reply-container')) {
              setTimeout(() => {
                console.log('Form submission detected, refetching replies...');
                refetchReplies();
              }, 1000);
            }
          });

        return () => {
            window.removeEventListener('replyUploaded', handleCustomEvents);
            window.removeEventListener('ticketUpdated', handleCustomEvents);
            window.removeEventListener('newReplyAdded', handleCustomEvents);
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [refetchReplies]);

    // WebSocket-like effect using EventSource or similar
    useEffect(() => {
        if (!ticket?.id) return;
    }, [ticket?.id, refetchReplies]);

    // useMutation hook for adding reply
    const addReplyMutation = useMutation({
        mutationFn: (message: string) => addReplay(ticket.id, { message }),
        onSuccess: (data) => {
            console.log('Reply added successfully:', data);
            setReplyMessage('');
            
            // Multiple approaches to ensure data is fresh
            queryClient.invalidateQueries({ queryKey: ['ticket-replies', ticket.id] });
            queryClient.invalidateQueries({ queryKey: ['ticket', ticket?.id] });
            
            // Force immediate refetch
            setTimeout(() => refetchReplies(), 500);
            
            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('replyUploaded', { 
                detail: { ticketId: ticket.id, reply: data } 
            }));
            
            // Update localStorage to trigger cross-tab updates
            localStorage.setItem('newReply', JSON.stringify({ 
                ticketId: ticket.id, 
                timestamp: Date.now() 
            }));
        },
        onError: (error: any) => {
            console.error('Failed to add reply:', error);
        }
    });

    // Enhanced submit handler
    const handleSubmitReply = () => {
        if (replyMessage.trim()) {
            addReplyMutation.mutate(replyMessage);
        }
    };

    // Auto-refresh button for manual refresh

    if (!ticket) {
        return <div className="no-ticket">No ticket data found</div>;
    }

    const replies = repliesData?.data || [];
    const inputStyle = {
        backgroundColor: theme === "dark" ? "#000000" : "",
        color: theme === "dark" ? "#ffffff" : "",
        borderColor: theme === "dark" ? "#212529" : ""
      };

    return (
        <div className={`viewticket-container ${theme === "dark" ? "bg-black text-light" : ""}`}>
            <div className={`enquiry-card-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                <h2 className="card-title">{ticket.title}</h2>
                <p className={`card-subtitle ${theme === "dark" ? "text-light" : ""}`}>Category: {ticket.category}</p>
                <p className={`card-user mt-4 ${theme === "dark" ? "text-light" : ""}`}>
                    <p style={{ fontWeight: 'bold'}}>Username: {ticket.user.name}</p>
                    <strong>Priority: </strong>
                    <span className={`badge bg-${
                        ticket.priority === 'Critical' ? 'danger' :
                        ticket.priority === 'High' ? 'warning' :
                        ticket.priority === 'Medium' ? 'info' : 'secondary'
                    }`}>
                        {ticket.priority}
                    </span>
                </p>
                <p className={`card-description ${theme === "dark" ? "text-light" : ""}`}>
                    <strong>Description:</strong> {ticket.description}
                </p>
                <p className={`card-status ${theme === "dark" ? "text-light" : ""}`}>
                    <strong>Status: </strong>
                    <span className={`status-${ticket.status.toLowerCase().replace(/\s+/g, '')}`}>
                        {ticket.status}
                    </span>
                </p>
                <p className={`card-date ${theme === "dark" ? "text-light" : ""}`}>Created On: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                <p className={`card-date ${theme === "dark" ? "text-light" : ""}`}>Last Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</p>
            </div>

            <div className="ticket-reply-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="reply-section-title">Replies</h3>
                </div>
                
                {/* Auto-refresh indicator */}
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                    Auto-refreshing every 5 seconds • Last updated: {new Date().toLocaleTimeString()}
                </div>
                
                {/* Loading state for replies */}
                {repliesLoading && (
                    <div className="loading-message">Loading replies...</div>
                )}
                
                {/* Error state for replies */}
                {repliesError && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                        Failed to load replies: {repliesErrorMessage instanceof Error ? repliesErrorMessage.message : 'Unknown error'}
                    </div>
                )}
                
                {/* No replies message */}
                {!repliesLoading && !repliesError && replies.length === 0 && (
                    <div className="no-replies-message" style={{ color: '#666', fontStyle: 'italic' }}>
                        No replies yet. Be the first to reply!
                    </div>
                )}
                
                {/* Display replies */}
                {!repliesLoading && !repliesError && replies.length > 0 && (
                    <>
                        {replies.map((reply: any) => {
    const isAdmin = reply.senderRole === 'admin';

    return (
        <div
            key={reply.id}
            className={`ticket-reply ${isAdmin ? 'admin-reply' : 'user-reply'}`}
        >
            <div className={`reply-content ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
                <p className="admin-name fs-[5px]">
                    {isAdmin ? 'Admin' : reply.senderRole === 'user' ? `${ticket.user.name}` : reply.senderRole || 'Unknown'}
                </p>
                <p className="message" style={{ fontSize: '20px' }}>{reply.message}</p>
                <span className="timestamp">
                    {new Date(reply.createdAt).toLocaleDateString()} - {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
})}

                    </>
                )}
            </div>

            {/* Only show reply form if ticket is not closed */}
{ticket.status !== 'Closed' && (
    <div className={`add-reply-container ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
        <h3>Add Reply</h3>
        <div className="reply-form">
            <textarea 
                placeholder="Write your reply here..." 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                disabled={addReplyMutation.isPending}
                rows={4}
                style={{ 
                    width: '100%', 
                    marginBottom: '10px', 
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical',
                    backgroundColor: theme === "dark" ? "black" : "#fff",
                    color: theme === "dark" ? "#fff" : "#333"
                }}
            />
            <button 
                className="submit-button"
                onClick={handleSubmitReply}
                disabled={addReplyMutation.isPending || !replyMessage.trim()}
                style={{
                    opacity: (addReplyMutation.isPending || !replyMessage.trim()) ? 0.6 : 1,
                    cursor: (addReplyMutation.isPending || !replyMessage.trim()) ? 'not-allowed' : 'pointer',
                    marginRight: '10px',color: '#fff',background: 'var(--primary-background)'
                }}
            >
                {addReplyMutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
        </div>
        
        {/* Error display for adding reply */}
        {addReplyMutation.isError && (
            <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                {addReplyMutation.error instanceof Error 
                    ? addReplyMutation.error.message 
                    : 'Failed to add reply'}
            </div>
        )}
    </div>
)}
        </div>
    );
};

export default Viewticket;