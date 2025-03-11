import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../services/userServices"; // Assuming these services exist
import "./reset-password.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const securityQuestion = location.state?.question;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityAnswer || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const resetData = {
        email,
        security_answer: securityAnswer,
        new_password: newPassword,
      };
      const response = await resetPassword(resetData); 
      alert(response.message);
      navigate("/");
    } catch (err) {
      setError("Invalid security answer or failed to reset password.");
      console.error("Error during password reset:", err);
    }
  };

  return (
    <div className="resetcontainer">
      <button className="back-button" onClick={() => navigate("/forgot-password")}>
        &larr; Back
      </button>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} readOnly className="readonly-field" />
        </div>
        <div>
          <label>Security Question:</label>
          <input type="text" value={securityQuestion} readOnly className="readonly-field" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Answer to security question"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
