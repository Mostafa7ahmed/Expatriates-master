import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';
import api from "../Services/api";
import "./Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("Login");
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
      newErrors.email = t("form.email.required");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("form.email.invalid");
    }

    if (!formData.password) {
      newErrors.password = t("form.password.required");
    } else if (formData.password.length < 6) {
      newErrors.password = t("form.password.minLength");
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
        
        // Show success toast
        toast.success(t("messages.success.text"), {
          position: "top-right",
          autoClose: 2000,
        });
        
        console.log('Login successful, redirecting...');
        navigate("/");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show error toast
      toast.error(error.response?.data?.message || error.message || t("errors.general"), {
        position: "top-right",
        autoClose: 4000,
      });
      
      setErrors(prev => ({
        ...prev,
        general: error.response?.data?.message || error.message || t("errors.general")
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
            <img src="/assets/image.png" alt={t("accessibility.logo")} className="login-logo" />
            <h1>{t("title")}</h1>
            <p>{t("subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="error-banner">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">{t("form.email.label")}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("form.email.placeholder")}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">{t("form.password.label")}</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t("form.password.placeholder")}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={t("accessibility.togglePassword")}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                {t("form.rememberMe")}
              </label>
           
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={isLoading}
            >
              {isLoading ? t("form.signingIn") : t("form.signIn")}
            </button>

            {/* <div className="signup-section">
              <p>Don't have an account? <Link to="/register" className="signup-link">Sign up</Link></p>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 