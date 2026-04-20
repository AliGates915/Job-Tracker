import { useEffect, useState } from "react";

interface User {
  _id: string;
  token: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const tokenStr = localStorage.getItem("token");
    setToken(tokenStr);
    console.log("User from localStorage:", userStr);
    
    if (userStr) {
      try {
        const userData: User = JSON.parse(userStr);
        setUser(userData);
        setUserId(userData._id);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUserId(null);
      }
    }
    setLoading(false);
  }, []);

  return { userId, user, isAuthenticated, loading, token };
};