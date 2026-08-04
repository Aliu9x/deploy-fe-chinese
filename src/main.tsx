import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "@/layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "pages/client/auth/login";
import "styles/global.scss";
import { App, ConfigProvider } from "antd";
import { AppProvider } from "components/context/app.context";

import { RegisterPage } from "./pages/client/auth/register";
import viVN from "antd/locale/vi_VN";
import { ProtectedRoute } from "./components/auth";
import Hsk5LearningComponent from "./components/client/Hsk5LearningComponent";
import HomePage from "./pages/home/HomePage";
import CustomerListPage from "./components/admin/CustomerListPage";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import AdminDashboardPage from "./components/dashboard/AdminDashboardPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "hsk5",
        element: (
          <ProtectedRoute>
            <Hsk5LearningComponent />
          </ProtectedRoute>

        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      {
        path: "user/customer",
        element: (
          <ProtectedRoute>
            <CustomerListPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <ConfigProvider locale={viVN}>
        <App>
          <RouterProvider router={router} />
        </App>
      </ConfigProvider>
    </AppProvider>
  </StrictMode>
);
