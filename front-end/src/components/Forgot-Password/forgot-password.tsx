import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSecurityQuestion } from "../../services/userServices"; // Assuming this service exists
import "./forgot-password.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required.");
            return;
        }
        try {
            const response = await getSecurityQuestion(email);
            if (response.security_question) {
                navigate("/reset-password", { state: { email, question: response.security_question } });
            }
        } catch (err) {
            setError("Email not found. Please try again.");
            console.error("Error during validation:", err);
        }
    };

    return (
        <div className="container">
            <button
                className="back-button"
                onClick={() => navigate("/")}
            >
                &#8592; Back
            </button>

            <h2>Forgot Password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ForgotPassword;