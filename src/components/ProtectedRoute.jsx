// ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-database/config"; // your firebase config export

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/auth"); // redirect to login page
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return children; // render protected content if user is authenticated
};

export default ProtectedRoute;
