import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Login from "./auth/Login.tsx";
import Register from "./auth/Register.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import PublicRoute from "./auth/PublicRoute.tsx";
import MeetingRoomManagementChild from "./meetingroom/MeetingRoomManagementChild.tsx";
import RootLayout from "./components/RootLayout.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
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
      {
        path: "/meetingRoomManagementParent/meetingRoomManagementChild",
        element: <ProtectedRoute><MeetingRoomManagementChild /></ProtectedRoute>,
      }
    ]
  }
]);
