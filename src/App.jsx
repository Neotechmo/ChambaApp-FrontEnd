import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import { authApi, servicesApi } from "./services/api.js";
import { clearDatadogUser, setDatadogUser } from "./config/datadog.js";
import { useNavigationTracking } from "./hooks/useNavigationTracking.js";
import {
  trackLogin,
  trackLogout,
  trackRegister,
} from "./utils/analytics.js";
import { onlyDigits } from "./utils/forms.js";
import { setStable } from "./utils/state.js";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ClientHomePage from "./pages/ClientHomePage.jsx";
import ProviderHomePage from "./pages/ProviderHomePage.jsx";
import ClientSearchPage from "./pages/client/ClientSearchPage.jsx";
import ClientRequestsPage from "./pages/client/ClientRequestsPage.jsx";
import ClientMessagesPage from "./pages/client/ClientMessagesPage.jsx";
import ClientProfilePage from "./pages/client/ClientProfilePage.jsx";
import ClientFavoritesPage from "./pages/client/ClientFavoritesPage.jsx";
import ClientLayout from "./layouts/ClientLayout.jsx";
import ProviderRequestsPage from "./pages/provider/ProviderRequestsPage.jsx";
import ProviderJobsPage from "./pages/provider/ProviderJobsPage.jsx";
import ProviderMessagesPage from "./pages/provider/ProviderMessagesPage.jsx";
import ProviderProfilePage from "./pages/provider/ProviderProfilePage.jsx";
import ProviderCalendarPage from "./pages/provider/ProviderCalendarPage.jsx";
import ProviderEarningsPage from "./pages/provider/ProviderEarningsPage.jsx";
import ProviderReviewsPage from "./pages/provider/ProviderReviewsPage.jsx";
import ProviderServicesPage from "./pages/provider/ProviderServicesPage.jsx";
import ProviderLayout from "./layouts/ProviderLayout.jsx";

const initialLogin = {
  correo: "",
  password: "",
};

const initialRegister = {
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
  telefono: "",
  rol: "cliente",
};

function AppRoutes() {
  const navigate = useNavigate();
  useNavigationTracking();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("chamba_theme") === "dark";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("chamba_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("chamba_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      setDatadogUser(user);
      loadServices();
    } else {
      clearDatadogUser();
    }
  }, [user]);

  function toggleTheme() {
    setDarkMode((current) => !current);
  }

  async function loadServices() {
    setServicesLoading(true);
    try {
      const data = await servicesApi.getAll({ available: true });
      setStable(setServices, Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.warn(error.message);
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  }

  function updateLogin(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  }

  function updateRegister(event) {
    const { name, value } = event.target;
    setRegisterForm((current) => ({
      ...current,
      [name]: name === "telefono" ? onlyDigits(value) : value,
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const data = await authApi.login(loginForm);

      localStorage.setItem("chamba_token", data.access_token);
      localStorage.setItem("chamba_user", JSON.stringify(data.user));

      setUser(data.user);
      setDatadogUser(data.user);
      trackLogin(data.user);

      if (data.user?.rol === "prestador") {
        navigate("/provider");
      } else {
        navigate("/client");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await authApi.register(registerForm);
      trackRegister(registerForm.rol);

      setMessage("Cuenta creada correctamente");
      setRegisterForm(initialRegister);

      navigate("/login");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    trackLogout(user);
    localStorage.removeItem("chamba_token");
    localStorage.removeItem("chamba_user");
    clearDatadogUser();

    setUser(null);
    setLoginForm(initialLogin);

    navigate("/login");
  }

  function getHomePath() {
    if (!user) return "/login";
    return user.rol === "prestador" ? "/provider" : "/client";
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getHomePath()} replace />} />

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={getHomePath()} replace />
          ) : (
            <LoginPage
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              loginForm={loginForm}
              updateLogin={updateLogin}
              handleLogin={handleLogin}
              loading={loading}
              message={message}
              goToRegister={() => navigate("/register")}
            />
          )
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            <Navigate to={getHomePath()} replace />
          ) : (
            <RegisterPage
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              registerForm={registerForm}
              updateRegister={updateRegister}
              handleRegister={handleRegister}
              loading={loading}
              message={message}
              goToLogin={() => navigate("/login")}
            />
          )
        }
      />

      <Route
        path="/client"
        element={
          user ? (
            <ClientLayout
              user={user}
              logout={logout}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route
          index
          element={
            <ClientHomePage
              user={user}
              services={services}
              servicesLoading={servicesLoading}
              loadServices={loadServices}
              logout={logout}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          }
        />

        <Route path="search" element={<ClientSearchPage />} />
        <Route path="requests" element={<ClientRequestsPage />} />
        <Route path="messages" element={<ClientMessagesPage />} />
        <Route path="favorites" element={<ClientFavoritesPage />} />
        <Route path="profile" element={<ClientProfilePage />} />
      </Route>

      <Route
        path="/provider"
        element={
          user ? (
            <ProviderLayout
              user={user}
              logout={logout}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route
          index
          element={
            <ProviderHomePage
              user={user}
              logout={logout}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          }
        />

        <Route path="requests" element={<ProviderRequestsPage />} />
        <Route path="jobs" element={<ProviderJobsPage />} />
        <Route path="calendar" element={<ProviderCalendarPage />} />
        <Route path="messages" element={<ProviderMessagesPage />} />
        <Route path="earnings" element={<ProviderEarningsPage />} />
        <Route path="reviews" element={<ProviderReviewsPage />} />
        <Route path="profile" element={<ProviderProfilePage />} />
        <Route path="services" element={<ProviderServicesPage />} />
      </Route>

      <Route path="*" element={<Navigate to={getHomePath()} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
