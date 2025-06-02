import { useAuth } from "react-oidc-context";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const auth = useAuth();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const registerAndFetchDisplayName = async () => {
      if (auth.isAuthenticated) {
        const email = auth.user?.profile.email;
        try {
          // 1. Registrar usuario tras login con Cognito
          await axios.post(`${API_URL}/api/users/register`, { email });

          // 2. Consultar el display_name en tu backend
          const res = await axios.get(`${API_URL}/api/users/${email}/display-name`);
          if (res.data.display_name) {
            setUserName(res.data.display_name);
          } else {
            // Si no existe, pide el nombre y guárdalo
            const name = prompt("¿Cómo te gustaría que te llamemos?");
            if (name) {
              await axios.post(`${API_URL}/api/users/${email}/display-name`, { display_name: name });
              setUserName(name);
            }
          }

          // 3. Obtener el user_id
          const resId = await axios.get(`${API_URL}/api/users/${email}/id`);
          setUserId(resId.data.user_id);

        } catch (err) {
          setUserName(""); // O maneja el error como prefieras
          setUserId(null);
        }
      }
    };
    registerAndFetchDisplayName();
  }, [auth.isAuthenticated, auth.user]);

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <div className="mb-2">Bienvenido{userName ? `, ${userName}` : ""}!</div>
        <button onClick={handleLogout}>Cerrar sesión</button>
        {userId && <Dashboard userId={userId} />}
        {!userId && <div>Cargando usuario...</div>}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Iniciar sesión</button>
    </div>
  );
}

export default App;