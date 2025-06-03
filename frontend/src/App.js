import { useAuth } from "react-oidc-context";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import DisplayNameModal from "./components/DisplayNameModal";
import './App.css';

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
    auth.signoutRedirect();
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
        <div>
          <DisplayNameModal show={showModal} onSave={handleSaveDisplayName} />
          <div className="mb-2">Bienvenido{userName ? `, ${userName}` : ""}!</div>
          <button onClick={handleLogout}>Cerrar sesión</button>
          {userId && <Dashboard userId={userId} />}
          {!userId && <div>Cargando usuario...</div>}
        </div>
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