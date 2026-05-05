import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [mode, setMode] = useState("signup");

  const [error, setError] = useState(null);

  const { signUp, login } = useAuth();

  const navigate = useNavigate();

  //~ React Hook Form Authentication Values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setError(null);

    let result;
    // If mode is signup, call the  signup function, else call login one:
    if (mode === "signup") {
      result = signUp(data.email, data.password);
    } else {
      result = login(data.email, data.password);
    }

    if (result.success) {
      // If login/signup is successful, send user to homepage:
      navigate("/");
    } else {
      setError(result.error);
    }
  };
  return (
    <div className="page">
      <div className="container">
        <div className="auth-container">
          <h1 className="page-title">
            {mode === "signup" ? "Sign Up" : "Login"}
          </h1>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {error && <div className="error-message">{error}</div>}

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className="form-input"
                id="email"
                //~ React Hook Form: Email Input Functionality
                {...register("email", { required: "Email is required." })}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                className="form-input"
                id="password"
                //~ React Hook Form: Password Input Functionality
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password should contain at least 6 characters.",
                  },
                  maxLength: {
                    value: 12,
                    message: "Password should contain at most 12 characters.",
                  },
                })}
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              {mode === "signup" ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="auth-switch">
            {mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <span onClick={() => setMode("login")} className="auth-link">
                  Login
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span onClick={() => setMode("signup")} className="auth-link">
                  Sign Up
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
