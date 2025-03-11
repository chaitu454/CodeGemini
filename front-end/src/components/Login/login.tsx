import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userServices";
import './login.css';

type propType = {
    onForgotPassword: () => void;
}

const LoginForm = ({ onForgotPassword }: propType) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            setError('Email must be a valid email address.');
            return;
        }
        setError('');
        setLoading(true);
        const user = { email, password };
        let response;
        try {
            response = await loginUser(user);
            const token = response.token;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('email', email)
                navigate("/home");
            } else {
                setError('Failed to retrieve token. Please try again.');
            }
        } catch (error) {
            setError((error as any).message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onRegister = () => {
        navigate("/register")
    }

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <p>
                <a href="#" onClick={onForgotPassword}>Forgot Password?</a>
            </p>
            <p>
                <a href="#" onClick={onRegister}>Register</a>
            </p>
        </form>
    );
};

export default LoginForm;
