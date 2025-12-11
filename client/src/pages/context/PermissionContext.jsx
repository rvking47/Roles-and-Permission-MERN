import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PermissionContext = createContext();
const base_url = "http://localhost:7001";

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true); // IMPORTANT
  const token = localStorage.getItem("token");


  const fetchUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${base_url}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPermissions(response.data.permissions || []);

      localStorage.setItem(
        "permissions",
        JSON.stringify(response.data.permissions || [])
      );

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // IMPORTANT
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <PermissionContext.Provider value={{ permissions, loading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);
