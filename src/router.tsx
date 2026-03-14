import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Login from "./auth/Login.tsx";
import Register from "./auth/Register.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import PublicRoute from "./auth/PublicRoute.tsx";
import Department from "./department/Department.tsx";
import RootLayout from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><RootLayout><App /></RootLayout></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <PublicRoute><RootLayout><Login /></RootLayout></PublicRoute>,
  },
  {
    path: "/register",
    element: <PublicRoute><RootLayout><Register /></RootLayout></PublicRoute>,
  },
  {
    path: "/department",
    element: <ProtectedRoute><RootLayout><Department /></RootLayout></ProtectedRoute>,
  }
]);
