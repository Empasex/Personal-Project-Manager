import { useAuth } from "react-oidc-context";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import DisplayNameModal from "./components/DisplayNameModal";
import ProjectForm from "./pages/ProjectForm";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const auth = useAuth();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    const registerAndFetchDisplayName = async () => {
      if (auth.isAuthenticated) {
        const email = auth.user?.profile.email;
        try {
          await axios.post(`${API_URL}/api/users/register`, { email });
          const res = await axios.get(`${API_URL}/api/users/${email}/display-name`);
          if (res.data.display_name) {
            setUserName(res.data.display_name);
          } else {
            setPendingEmail(email);
            setShowModal(true);
          }
          const resId = await axios.get(`${API_URL}/api/users/${email}/id`);
          setUserId(resId.data.user_id);
        } catch (err) {
          setUserName("");
          setUserId(null);
        }
      }
    };
    registerAndFetchDisplayName();
  }, [auth.isAuthenticated, auth.user]);

  const handleSaveDisplayName = async (name) => {
    if (!pendingEmail) return;
    await axios.post(`${API_URL}/api/users/${pendingEmail}/display-name`, { display_name: name });
    setUserName(name);
    setShowModal(false);
  };

  const handleLogout = () => {
    auth.removeUser(); // Limpia la sesión local
    const clientId = "430l854cf5agq8o7n5qt1q4fmn";
    const logoutUri = "https://d3ejww12j2glsc.cloudfront.net";
    const cognitoDomain = "https://us-east-2qswitslz5.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="login-bg">
      <div className="main-content">
        {auth.isAuthenticated ? (
          <Router>
            <DisplayNameModal show={showModal} onSave={handleSaveDisplayName} />
            <div className="header-bar">
              <div className="welcome-title">
                Bienvenido{userName ? `, ${userName}` : ""}!
              </div>
              <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </div>
            <Routes>
              <Route path="/" element={userId ? <Dashboard userId={userId} /> : <div>Cargando usuario...</div>} />
              <Route path="/crear-proyecto" element={<ProjectForm userId={userId} />} />
              <Route path="/editar-proyecto/:id" element={<ProjectForm userId={userId} />} />
            </Routes>
          </Router>
        ) : (
          <div className="login-form">
            <button onClick={() => auth.signinRedirect()} type="button">
              Iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;