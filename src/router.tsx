import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Login from "./user/Login.tsx";
import Register from "./user/Register.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
