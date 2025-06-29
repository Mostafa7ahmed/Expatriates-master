import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import api from "../Services/api";
import "./Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const savedLang = JSON.parse(localStorage.getItem("lang") || '{"code": "en"}');
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
        general: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    console.log('Login attempt with:', { email: formData.email });

    try {
      const response = await api.post("user/auth", {
        userNameOrEmail: formData.email,
        password: formData.password,
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        const { token } = response.data.result;
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", formData.email);
        
        // Trigger storage event to update header
        window.dispatchEvent(new Event('storage'));
        
        console.log('Login successful, redirecting...');
        navigate("/");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      setErrors(prev => ({
        ...prev,
        general: error.response?.data?.message || error.message || "Login failed. Please try again."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const isRTL = savedLang.code === "ar";

  return (
    <div className="login-page" dir={isRTL ? "rtl" : "ltr"}>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src="/src/assets/image.png" alt="Logo" className="login-logo" />
            <h1>Sign In</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="error-banner">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="signup-section">
              <p>Don't have an account? <Link to="/register" className="signup-link">Sign up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 