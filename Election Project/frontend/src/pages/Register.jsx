import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { registerUser } from "../services/userService.js";
import { isValidPassword, isValidUserName } from "../services/validation.js";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const registerFields = useRef(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidUserName(username)) {
      setError("Username must be at least 5 characters and start with a letter.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const result = await registerUser({ username, password, confirmPassword });
      if (result) {
        setSuccess("Registration successful!");
        window.location.href = "/home";
      } else {
        setError("Username may already be taken.");
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  }, [confirmPassword, password, username]);

  useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        }
      };
    const element = registerFields.current;
    if (element) {
      element.addEventListener("keypress", handleKeyPress);
    }
    return () => {
      if (element) {
        element.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [handleSubmit]);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit} ref={registerFields} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Re-type password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <button type="submit" className="login-button">
            Register
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
