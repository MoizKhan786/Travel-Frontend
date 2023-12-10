import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authToken = localStorage.getItem("token");

        if (!authToken) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/check-auth", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        // console.log(response);

        setAuthenticated(response.data === "OK");
      } catch (error) {
        console.error("Authentication check failed", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { authenticated, loading };
};

export default useAuth;
