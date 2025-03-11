import { Routes, Route, useNavigate } from "react-router-dom";
import RegistrationForm from "./components/Registration/registration";
import LoginForm from "./components/Login/login";
import HomeScreen from "./components/Home/home";
import ForgotPassword from "./components/Forgot-Password/forgot-password";
import ResetPassword from "./components/Reset-Password/reset-password";
import './App.css'

const App = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginForm
            onForgotPassword={() => navigate("/forgot-password")}
          />
        }
      />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />
    </Routes>
  );
};

export default App;
