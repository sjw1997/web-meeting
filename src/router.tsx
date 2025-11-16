import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Login from "./auth/Login.tsx";
import Register from "./auth/Register.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import PublicRoute from "./auth/PublicRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: "/register",
    element: <PublicRoute><Register /></PublicRoute>,
  },
]);