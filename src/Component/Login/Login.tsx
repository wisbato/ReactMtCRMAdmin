import "./login.css";
import logo1 from "../../assets/wealth-logo.svg";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/auth/loginApi";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const Login: React.FC = () => {
  const { theme } = useTheme();
  const [mode, setMode] = useState("signin");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth(); // Add setUser

  // TanStack Query Mutation for login
  const mutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return loginUser(credentials);
    },

    // In your login mutation's onSuccess, add more detailed logging
    onSuccess: (data) => {
      console.log("Full login response:", JSON.stringify(data, null, 2));
      console.log("User object:", data?.user);
      console.log("User role:", data?.user?.role);
      console.log("User menuPermissions:", data?.user?.menuPermissions); // ✅ Changed from menus to menuPermissions
      console.log("User groupPermissions:", data?.user?.groupPermissions);
      
      const userRole = data?.user?.role;
      
      if (!userRole) {
        toast.error("User role not found in response.");
        return;
      }
    
      // Store authentication state AND user data
      setIsAuthenticated(true);
      setUser(data.user);
      
      toast.success("Login successful!");
    
      // Navigate based on user role
      if (userRole === "admin" || userRole === "subadmin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
      setError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (mode !== "signin") {
      // Handle other modes (signup, forgot password) differently
      // For now, we'll just implement the signin functionality
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    mutation.mutate({ email, password });
  };

  // In your Login component
  useEffect(() => {
    // Ensure theme is initialized
    const savedTheme = localStorage.getItem("theme") || "green";
    const savedMode = localStorage.getItem("theme-mode") || "dark";

    document.documentElement.setAttribute("data-theme", savedTheme);
    document.body.setAttribute("data-mode", savedMode);
  }, []);

  const inputStyle = {
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className="login-container">
      <div className={`login ${theme === "dark" ? "bg-black" : ""}`}>
        <div className="logo-content">
          <img className="logo1" src={logo1} alt="Logo" />
        </div>

        <div className="logo-body">
          {/* Dynamic Title */}
          <h1>
            {mode === "signup"
              ? "SIGN UP"
              : mode === "forgot"
              ? "FORGOT PASSWORD"
              : mode === "verify"
              ? "VERIFY ACCOUNT"
              : "SIGN IN"}
          </h1>

          {/* Dynamic Subtitle */}
          <p>
            {mode === "signup"
              ? "Enter your email and password to register"
              : mode === "forgot"
              ? "Enter your email to reset your password"
              : mode === "verify"
              ? "Enter your verification details"
              : "Enter your email and password to login"}
          </p>

          {/* Display error message */}
          {error && (
            <div className="error-message" style={{ 
              color: 'red', 
              marginBottom: '15px', 
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            {/* Full Name - Only for Sign Up */}
            {mode === "signup" && (
              <div className="input1">
                <label>Name</label>
                <div className="input-container">
                  <img src="/svg/user.svg" alt="..." />
                  <input type="text" placeholder="Enter Full Name" />
                </div>
              </div>
            )}

            {/* Email - Always Visible */}
            <div className="input1">
              <label>Email</label>
              <div className={`input-container ${theme === "dark" ? "bg-dark dark-mode-placeholder" : ""}`}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    opacity="0.5"
                    d="M10.65 2.25H7.35C4.23873 2.25 2.6831 2.25 1.71655 3.23851C0.75 4.22703 0.75 5.81802 0.75 9C0.75 12.182 0.75 13.773 1.71655 14.7615C2.6831 15.75 4.23873 15.75 7.35 15.75H10.65C13.7613 15.75 15.3169 15.75 16.2835 14.7615C17.25 13.773 17.25 12.182 17.25 9C17.25 5.81802 17.25 4.22703 16.2835 3.23851C15.3169 2.25 13.7613 2.25 10.65 2.25Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M14.3465 6.02574C14.609 5.80698 14.6445 5.41681 14.4257 5.15429C14.207 4.89177 13.8168 4.8563 13.5543 5.07507L11.7732 6.55931C11.0035 7.20072 10.4691 7.6446 10.018 7.93476C9.58125 8.21564 9.28509 8.30993 9.00041 8.30993C8.71572 8.30993 8.41956 8.21564 7.98284 7.93476C7.53168 7.6446 6.9973 7.20072 6.22761 6.55931L4.44652 5.07507C4.184 4.8563 3.79384 4.89177 3.57507 5.15429C3.3563 5.41681 3.39177 5.80698 3.65429 6.02574L5.4664 7.53583C6.19764 8.14522 6.79033 8.63914 7.31343 8.97558C7.85834 9.32604 8.38902 9.54743 9.00041 9.54743C9.6118 9.54743 10.1425 9.32604 10.6874 8.97558C11.2105 8.63914 11.8032 8.14522 12.5344 7.53582L14.3465 6.02574Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  required
                />
              </div>
            </div>

            {/* Password - Only for Sign In & Sign Up */}
            {(mode === "signin" || mode === "signup") && (
              <div className="input1">
                <label>Password</label>
                <div className={`input-container ${theme === "dark" ? "bg-dark dark-mode-placeholder" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      opacity="0.5"
                      d="M1.5 12C1.5 9.87868 1.5 8.81802 2.15901 8.15901C2.81802 7.5 3.87868 7.5 6 7.5H12C14.1213 7.5 15.182 7.5 15.841 8.15901C16.5 8.81802 16.5 9.87868 16.5 12C16.5 14.1213 16.5 15.182 15.841 15.841C15.182 16.5 14.1213 16.5 12 16.5H6C3.87868 16.5 2.81802 16.5 2.15901 15.841C1.5 15.182 1.5 14.1213 1.5 12Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M6 12.75C6.41421 12.75 6.75 12.4142 6.75 12C6.75 11.5858 6.41421 11.25 6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12.75 12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C12.4142 11.25 12.75 11.5858 12.75 12Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M5.0625 6C5.0625 3.82538 6.82538 2.0625 9 2.0625C11.1746 2.0625 12.9375 3.82538 12.9375 6V7.50268C13.363 7.50665 13.7351 7.51651 14.0625 7.54096V6C14.0625 3.20406 11.7959 0.9375 9 0.9375C6.20406 0.9375 3.9375 3.20406 3.9375 6V7.54096C4.26488 7.51651 4.63698 7.50665 5.0625 7.50268V6Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    className={theme === "dark" ? "dark-mode-placeholder" : ""}
                    required
                  />
                </div>
              </div>
            )}

            {/* Confirm Password - Only for Sign Up */}
            {mode === "signup" && (
              <div className="input1">
                <label>Confirm Password</label>
                <div className="input-container">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      opacity="0.5"
                      d="M1.5 12C1.5 9.87868 1.5 8.81802 2.15901 8.15901C2.81802 7.5 3.87868 7.5 6 7.5H12C14.1213 7.5 15.182 7.5 15.841 8.15901C16.5 8.81802 16.5 9.87868 16.5 12C16.5 14.1213 16.5 15.182 15.841 15.841C15.182 16.5 14.1213 16.5 12 16.5H6C3.87868 16.5 2.81802 16.5 2.15901 15.841C1.5 15.182 1.5 14.1213 1.5 12Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M6 12.75C6.41421 12.75 6.75 12.4142 6.75 12C6.75 11.5858 6.41421 11.25 6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12.75 12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C12.4142 11.25 12.75 11.5858 12.75 12Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M5.0625 6C5.0625 3.82538 6.82538 2.0625 9 2.0625C11.1746 2.0625 12.9375 3.82538 12.9375 6V7.50268C13.363 7.50665 13.7351 7.51651 14.0625 7.54096V6C14.0625 3.20406 11.7959 0.9375 9 0.9375C6.20406 0.9375 3.9375 3.20406 3.9375 6V7.54096C4.26488 7.51651 4.63698 7.50665 5.0625 7.50268V6Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <input type="password" placeholder="Enter confirm Password" />
                </div>
              </div>
            )}

            {/* Country - Only for Sign Up */}
            {mode === "signup" && (
              <div className="input1">
                <label>Country</label>
                <select
                  className="selection-container"
                  style={{ border: "none" }}
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            )}

            {/* Mobile Number - Only for Sign Up */}
            {mode === "signup" && (
              <div className="input1">
                <label>Mobile</label>
                <div
                  className="input-container"
                  style={{ background: "#121E32" }}
                >
                  <PhoneInput
                    country={"us"} // Default country
                    value={phone}
                    placeholder="Enter Phone Number"
                    onChange={(value: any) => setPhone(value)}
                    inputStyle={{
                      width: "100%",
                      border: "none",
                      background: "#121E32", // Background color for input
                      color: "white", // ✅ Ensures the text inside input is white
                    }}
                    buttonStyle={{
                      background: "#121E32", // Background color for flag dropdown
                      color: "white",
                      border: "none",
                    }}
                    containerClass="phone-input-container"
                  />
                </div>
              </div>
            )}

            {/* Forgot Password Link - Only in Sign In */}
            {mode === "signin" && (
              <h3
                onClick={() => {
                  console.log("Forgot Password Clicked");
                  setMode("forgot");
                }}
                style={{ cursor: "pointer" }}
              >
                FORGOT PASSWORD
              </h3>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={mutation.isPending}>
              {mode === "signup"
                ? "Sign Up"
                : mode === "forgot"
                ? "Submit"
                : mode === "verify"
                ? "Submit"
                : mutation.isPending
                ? "Signing in..."
                : "Sign In"}
            </button>

            {/* OR Divider - Only in Sign In & Sign Up */}
            {/* {(mode === "signin" || mode === "signup") && (
              <div className="or-container">
                <div className="line"></div>
                <span className="or-text">OR</span>
                <div className="line"></div>
              </div>
            )} */}

            <div className="bottom-content">
              {/* Toggle Between Sign In & Sign Up */}
              {/* {(mode === "signin" || mode === "signup") && (
                <p>
                  {mode === "signup"
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <span
                    onClick={() => {
                      console.log("Sign Up/Sign In Toggled");
                      setMode(mode === "signup" ? "signin" : "signup");
                      setError(""); // Clear errors when switching modes
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {mode === "signup" ? "SIGN IN" : "SIGN UP"}
                  </span>
                </p>
              )} */}

              {/* Verify Account Link - Only in Sign In */}
              {mode === "signin" && (
                <h4 style={{ cursor: "pointer" , marginTop:"30px" }}>
                  Account Not Verified?{" "}
                  <span
                    onClick={() => {
                      console.log("Verify Clicked");
                      setMode("verify");
                    }}
                  >
                    Verify
                  </span>
                </h4>
              )}

              {/* Back to Sign In - Only in Forgot & Verify modes */}
              {(mode === "forgot" || mode === "verify") && (
                <p>
                  Remember your password?{" "}
                  <span
                    onClick={() => {
                      setMode("signin");
                      setError(""); // Clear errors when going back
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    SIGN IN
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;