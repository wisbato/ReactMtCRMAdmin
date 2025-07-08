import React, { useState, useEffect, useRef } from "react";
import "./header.css";
import logoimg from "../../assets/wealth-logo.svg";
import { useTheme } from "../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightToBracket,
  faRightFromBracket,
  faLock,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { fetchAllNotifications } from "../../api/notification/getNoti";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { socket, connectSocket, disconnectSocket } from "../../utils/socket";
import sound from "../../assets/notification.wav";
import ManagerLoginModal from "../Manager_Login/ManagerLoginModal";
import { useAuth } from "../../context/AuthContext";

interface Notification {
  id: number;
  userId: number;
  senderId: number;
  title: string;
  message: string;
  type: string;
  role: string;
  isSeen: boolean;
  metadata: {
    newUserId?: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showManagerLoginModal, setShowManagerLoginModal] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null); // Ref for click-outside detection
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Use a ref for the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useAuth();
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(sound);
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Fetch notifications using TanStack Query
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["header-notifications"],
    queryFn: fetchAllNotifications,
    select: (data) => data.slice(0, 5), // Show only the 5 most recent notifications
  });
  console.log("Notifications:", notifications);
  const unreadCount = notifications.filter((notif) => !notif.isSeen).length;

  // Socket.IO setup for real-time notifications
  useEffect(() => {
    // Connect socket when component mounts
    connectSocket();

    // Listen for new notifications
    const handleNewNotification = (newNotification: Notification) => {
      console.log("New notification received:", newNotification);

      // Play notification sound
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0; // Rewind to start
          audioRef.current.play().catch((e) => {
            console.log(
              "Audio play failed (user interaction may be required):",
              e
            );
          });
        } catch (e) {
          console.error("Audio error:", e);
        }
      }

      // Show visual indicator for new notification
      setHasNewNotification(true);

      // Update the notifications cache
      queryClient.setQueryData(
        ["header-notifications"],
        (oldData: Notification[] | undefined) => {
          if (!oldData) return [newNotification];

          // Add new notification to the beginning and keep only 5 most recent
          const updatedNotifications = [newNotification, ...oldData].slice(
            0,
            5
          );
          return updatedNotifications;
        }
      );

      // Also invalidate the main notifications query to update the notifications page
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // Optional: Show browser notification if user grants permission
      if (Notification.permission === "granted") {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: logoimg,
        });
      }

      // Auto-hide the new notification indicator after 3 seconds
      setTimeout(() => {
        setHasNewNotification(false);
      }, 3000);
    };

    // Set up socket listeners
    socket.on("new-notification", handleNewNotification);

    // Handle socket connection events
    socket.on("connect", () => {
      console.log("Socket connected for notifications");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Request notification permission on component mount
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Cleanup function
    return () => {
      socket.off("new-notification", handleNewNotification);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      // Note: Don't disconnect socket here if it's used elsewhere in the app
      // disconnectSocket();
    };
  }, [queryClient]);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
    setShowProfileDropdown(false);

    // Clear the new notification indicator when dropdown is opened
    if (!showNotification) {
      setHasNewNotification(false);
    }
  };

  // Click-outside detection for Notification & Profile Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setShowNotification(false);
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotification(false);
  };

  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  const handleViewAllNotifications = () => {
    navigate("/notifications");
    setShowNotification(false);
    setHasNewNotification(false);
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
    // Clear user data from context/local storage if needed
      localStorage.removeItem('token');
      // Clear TanStack Query cache
      queryClient.clear();
      disconnectSocket();
    
    // Force navigation
      window.location.href = '/';
      // Redirect to login
      navigate('/');
      
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Optionally show an error message to the user
    },
  });

  return (
    <header className={`header-container ${isSidebarOpen ? "expanded" : ""}`} ref={headerRef}>
      {/* Toggle menu button - visibility controlled by CSS */}
      <div
        className={`toggle-menu-btn ${isSidebarOpen ? "hidden" : ""}`}
        onClick={toggleSidebar}
      >
        <img
          className="sidebar-logo"
          src={logoimg}
          alt="logo"
          style={{ width: "50px", height: "50px" }}
        />
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Right-aligned items */}
      <div className="header-logo">
        <button
          onClick={toggleTheme}
          style={{ border: "none", background: "none" }}
          className="btn btn-outline-secondary me-3"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Notification Bell Icon */}
        <div className="notification-wrapper">
          <button
            onClick={toggleNotification}
            className={`notification-btn ${hasNewNotification ? "shake" : ""}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              animation: hasNewNotification ? "shake 0.5s ease-in-out" : "none",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 6V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {unreadCount > 0 && (
              <span
                className={`notification-badge ${
                  hasNewNotification ? "pulse" : ""
                }`}
                style={{
                  animation: hasNewNotification ? "pulse 1s infinite" : "none",
                }}
              >
                {unreadCount}
              </span>
            )}
            {hasNewNotification && (
              <span className="new-notification-dot"></span>
            )}
          </button>

          {showNotification && (
            <div className={`notification-dropdown ${theme === "dark" ? "bg-black text-light" : ""}`}>
              <h4 className={theme === "dark" ? "text-light" : ""}>Notifications</h4>
              <hr />
              {isLoading ? (
                <div className="notification-loading">
                  Loading notifications...
                </div>
              ) : notifications.length > 0 ? (
                <>
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          !notification.isSeen ? "unread" : ""
                        } ${theme === "dark" ? "bg-black text-light" : ""}`}
                      >
                        <div className="notification-content">
                          <strong>{notification.title}</strong>
                          <p>{notification.message}</p>
                        </div>
                        <div className="notification-date">
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr />
                  <button
                    className="read-all-btn"
                    onClick={handleViewAllNotifications}
                  >
                    View All Notifications
                  </button>
                </>
              ) : (
                <div className="notification-empty">No new notifications</div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-wrapper">
          <img
            className="logo-img"
            src={logoimg}
            alt="Logo"
            onClick={toggleProfileDropdown}
            style={{ cursor: "pointer" }}
          />

          {showProfileDropdown && (
            <div className={`profile-dropdown ${theme === "dark" ? "bg-black text-light" : ""}`}>
              <div className="profile-header">
                <img src={logoimg} alt="logo" className="dropdown-logo" />
                <div className="profile-info">
                  <strong>Wealth Way</strong>
                  <span className="admin-label">{user?.name}</span>
                </div>
              </div>
              <div className={`dropdown-item ${theme === "dark" ? "text-light dropdown-item-dark" : ""}`}>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Change Password
              </div>
              <Link to="/changetheme" className={`dropdown-item ${theme === "dark" ? "text-light dropdown-item-dark" : ""}`}>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Change Theme
              </Link>
              <div
                className={`dropdown-item ${theme === "dark" ? "text-light dropdown-item-dark" : ""}`}
                onClick={() => setShowManagerLoginModal(true)}
              >
                <FontAwesomeIcon icon={faRightToBracket} className="me-2" />
                Manager Login
              </div>
              <div 
  className={`dropdown-item signout ${theme === "dark" ? "dropdown-item-dark" : ""}`} 
  onClick={() => logoutMutation.mutate()}
>
  <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
  {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
</div>
            </div>
          )}
        </div>
      </div>
      {showManagerLoginModal && (
        <ManagerLoginModal onClose={() => setShowManagerLoginModal(false)} />
      )}
    </header>
  );
};

export default Header;
