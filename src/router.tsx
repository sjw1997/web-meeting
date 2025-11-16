import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Login from "./user/Login.tsx";
import Register from "./user/Register.tsx";
import ProtectedRoute from "./user/ProtectedRoute.tsx";
import PublicRoute from "./user/PublicRoute.tsx";

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
