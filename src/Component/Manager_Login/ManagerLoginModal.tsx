import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faXmark } from '@fortawesome/free-solid-svg-icons';
import './ManagerLoginModal.css';
import { toast } from 'react-hot-toast';
import { useTheme } from "../../context/ThemeContext";

interface ManagerLoginModalProps {
  onClose: () => void;
}

const ManagerLoginModal: React.FC<ManagerLoginModalProps> = ({ onClose }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { theme } = useTheme();
  
  const managerLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('api/v1/manager/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      console.log(response);
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      onClose();
    },
    onError: (error) => {
      console.error('Manager login error:', error);
      toast.error(error.message);
    },
  });

  const handleLogin = () => {
    setIsLoggingIn(true);
    managerLoginMutation.mutate();
  };

  return (
    <div className="manager-login-modal-overlay">
      <div className={`manager-login-modal ${theme === "dark" ? "bg-black text-light" : ""}`}>
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        
        <div className="modal-header">
          <h3>Manager Login</h3>
        </div>
        
        <div className="modal-content">
          <p className='text-center'>Are you sure you want to login into manager?</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className={`cancel-btn ${theme === "dark" ? "bg-black text-light" : ""}`} 
            onClick={onClose}
            disabled={isLoggingIn}
          >
            Cancel
          </button>
          <button 
            className="login-btn"
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Logging in...' : (
              <>
                <FontAwesomeIcon icon={faRightToBracket} className="me-2" />
                Login
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginModal;