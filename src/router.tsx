import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Login from "./auth/Login.tsx";
import Register from "./auth/Register.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import PublicRoute from "./auth/PublicRoute.tsx";
import MeetingRoomManagementChild from "./meetingroom/MeetingRoomManagementChild.tsx";
import RootLayout from "./components/RootLayout.tsx";
import DeviceManagement from "./device/DeviceManagement.tsx";
import DepartmentManagement from "./department/DepartmentManagement.tsx";

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
        path: "/meetingRoomManagementParent",
        children: [
          {
            path: "meetingRoomManagementChild",
            element: <ProtectedRoute><MeetingRoomManagementChild /></ProtectedRoute>,
          },
          {
            path: "deviceManagement",
            element: <ProtectedRoute><DeviceManagement /></ProtectedRoute>,
          }
        ]
      },
      {
        path: "/userManagement",
        children: [
          {
            path: "departmentManagement",
            element: <ProtectedRoute><DepartmentManagement /></ProtectedRoute>,
          }
        ]
      }
    ]
  }
]);
