import { useState } from 'react';
import './registration.css';
import { useNavigate } from 'react-router-dom';
import { RegisterUserReqType } from '../../services/types';
import { registerUser } from '../../services/userServices';

const RegistrationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isPasswordValid = (password: string) => /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(password);
    const isFormValid = email && password && confirmPassword && securityQuestion && securityAnswer && password === confirmPassword;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('Email is required.');
            return false;
        }

        if (!isValidEmail(email)) {
            setError('Email must be a valid email address.');
            return false;
        }

        if (!password) {
            setError('Password is required.');
            return false;
        }
        if (password.length < 8 || !isPasswordValid(password)) {
            setError('Password must be at least 8 characters long and alphanumeric.');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }

        if (!securityQuestion) {
            setError('Please select a security question.');
            return false;
        }
        if (!securityAnswer) {
            setError('Please provide an answer to the security question.');
            return false;
        }

        setError('');
        setLoading(true);

        const userData: RegisterUserReqType = {
            first_name: firstName,
            last_name: lastName,
            email,
            security_answer: securityAnswer,
            password,
            security_question: securityQuestion,
        };
        if (email && password && securityQuestion && securityAnswer) {
            try {
                await registerUser(userData);
                navigate('/');
            } catch (error) {
                setError('Registration failed. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Register</h2>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
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
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <select
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                required
            >
                <option value="">Select a Security Question</option>
                <option value="What is your pet's name?">What is your pet's name?</option>
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option value="What was your first car?">What was your first car?</option>
                <option value="What is your favorite color?">What is your favorite color?</option>
            </select>
            <input
                type="text"
                placeholder="Answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={!isFormValid || loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default RegistrationForm;
