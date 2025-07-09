import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAllNotifications, 
  markNotificationAsRead, 
  Notification
} from '../../api/notification/getNoti';
import './notifications.css';
import { useTheme } from "../../context/ThemeContext";
import { markNotificationRead } from '../../api/notification/readNoti';
import { deleteNotification } from '../../api/notification/deleteNoti';
import { toast } from 'react-hot-toast';

const Notifications = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'unread' | 'read'>('unread');
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const queryClient = useQueryClient();

  // Fetch notifications using the API service
  const { data: notifications = [], isLoading, error } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: fetchAllNotifications,
    refetchInterval: 60000, // Optional: refetch every 60 seconds
  });

  // Mutation for marking as read
  const { mutate: markAsRead } = useMutation({
    mutationFn: (id: number) => markNotificationRead({id}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setDropdownOpenId(null);
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
      // You could add a toast notification here if you want
    }
  });

  // Mutation for deleting
  // In your Notifications component
const { mutate: deleteNotif } = useMutation({
  mutationFn: (id: number) => deleteNotification({ id }), // Pass the ID as an object
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    setDropdownOpenId(null);
    // Optional: Add a success message/toast here
    toast.success("Notification deleted successfully!");
  },
  onError: (error) => {
    console.error("Error deleting notification:", error);
    toast.error("Error deleting notification:");
    // Optional: Add an error toast here
  }
});

  // Filter notifications based on read/unread status
  const filteredNotifications = notifications.filter(notif => 
    filter === 'unread' ? !notif.isSeen : notif.isSeen
  );

  const handleDropdownToggle = (id: number | null, event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    setDropdownOpenId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownOpenId !== null &&
        dropdownRefs.current[dropdownOpenId] &&
        event.target instanceof Node &&
        !dropdownRefs.current[dropdownOpenId]?.contains(event.target)
      ) {
        setDropdownOpenId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpenId]);

  if (isLoading) {
    return <div className='notifications-main'>Loading notifications...</div>;
  }

  if (error) {
    return <div className='notifications-main'>Error loading notifications</div>;
  }

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className={`notifications-main ${theme === "dark" ? "bg-black" : ""}`}>
      <div className='notifications-btns'>
        <Button
          type="button"
          className={`fw-bold px-4 me-2 ${filter === 'unread' ? 'active-btn' : ''}`}
          onClick={() => setFilter('unread')}
          style={{
            background: 'var(--primary-gradient)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            fontSize: '20px',
          }}
        >
          Unread
        </Button>

        <Button
          type="button"
          className={`fw-bold px-4 ${filter === 'read' ? 'active-btn' : ''}`}
          onClick={() => setFilter('read')}
          style={{
            background: 'var(--primary-gradient)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            fontSize: '20px',
          }}
        >
          Read
        </Button>
      </div>

      <div className="notifications-list mt-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div className={`notifications-content d-flex justify-content-between align-items-center ${theme === "dark" ? "bg-dark text-light" : ""}`} key={notif.id}>
              <div>
                <p className='mb-0 fw-bold'>{notif.title}</p>
                <p className='mb-0'>{notif.message}</p>
                <small className='text-muted'>
                  {new Date(notif.createdAt).toLocaleString()}
                </small>
              </div>
              <div 
                className="position-relative"
                ref={el => { dropdownRefs.current[notif.id] = el; }}
              >
                <FontAwesomeIcon
                  icon={faEllipsis}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => handleDropdownToggle(notif.id, e)}
                />

                {dropdownOpenId === notif.id && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      zIndex: 1000,
                      minWidth: '10rem',
                      padding: '0.75rem 0',
                      backgroundColor: '#fff',
                      borderRadius: '0.25rem',
                      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(0,0,0,.1)',
                      marginTop: '0.5rem'
                    }}
                  >
                    <button
                      className="dropdown-item"
                      style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: 500,
                        color: '#333',
                        backgroundColor: 'transparent',
                        border: 0,
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '14px',
                        borderBottom: '1px solid #eee'
                      }}
                      onClick={() => markAsRead(notif.id)}
                      disabled={notif.isSeen}
                    >
                      {notif.isSeen ? 'Already Read' : 'Mark as Read'}
                    </button>
                    <button
                      className="dropdown-item"
                      style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: 500,
                        color: '#333',
                        backgroundColor: 'transparent',
                        border: 0,
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '14px'
                      }}
                      onClick={() => deleteNotif(notif.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div> 
          ))
        ) : (
          <p className="text-muted">No {filter} messages found.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;