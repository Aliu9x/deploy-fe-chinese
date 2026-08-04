import React from "react";
import { Avatar, Button, Divider, Dropdown, Space } from "antd";
import {
  BookOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentApp } from "components/context/app.context";
import { logoutApi } from "@/services/api";
import "./app.header.scss";

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useCurrentApp();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Nếu API logout lỗi, frontend vẫn xóa phiên đăng nhập cục bộ.
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
      navigate("/");
    }
  };

  const userMenuItems = [
    ...(user?.role === "ADMIN"
      ? [{ label: <Link to="/admin">Trang quản trị</Link>, key: "admin" }]
      : []),
    {
      label: <Link to="/account">Quản lý tài khoản</Link>,
      key: "account",
    },
    {
      label: (
        <button className="menu-action" type="button" onClick={handleLogout}>
          Đăng xuất
        </button>
      ),
      key: "logout",
    },
  ];

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar ?? ""
    }`;

  return (
    <header className="app-header">
      <div className="global-container header-inner">
        <button className="brand" type="button" onClick={() => navigate("/")}>
          <span className="brand-icon"><BookOutlined /></span>
          <span className="brand-content">
            <strong>Aliu Chinese</strong>
            <small>Học tiếng Trung mỗi ngày</small>
          </span>
        </button>

        <nav className="header-nav" aria-label="Điều hướng chính">
          <Link className="nav-link" to="/">Trang chủ</Link>

          <Dropdown
            menu={{
              items: [
                { label: <Link to="/hsk1">HSK 1 · Nhập môn</Link>, key: "hsk1" },
                { label: <Link to="/hsk2">HSK 2 · Cơ bản</Link>, key: "hsk2" },
                { label: <Link to="/hsk3">HSK 3 · Trung cấp</Link>, key: "hsk3" },
                { label: <Link to="/hsk4">HSK 4 · Trung cao cấp</Link>, key: "hsk4" },
                { label: <Link to="/hsk5">HSK 5 · Nâng cao</Link>, key: "hsk5" },
              ],
            }}
            trigger={["click"]}
          >
            <button className="nav-link nav-button nav-more" type="button">
              Khóa học <DownOutlined className="caret" />
            </button>
          </Dropdown>

          <a className="nav-link nav-optional" href="#features">Tính năng</a>
          <a className="nav-link nav-optional" href="#about">Giới thiệu</a>

          <Dropdown
            menu={{
              items: [
                { label: "Hướng dẫn học", key: "guide" },
                { label: "Liên hệ hỗ trợ", key: "contact" },
              ],
            }}
            trigger={["click"]}
          >
            <button className="nav-link nav-button nav-more" type="button">
              <QuestionCircleOutlined /> Hỗ trợ <DownOutlined className="caret" />
            </button>
          </Dropdown>

          <Divider type="vertical" className="divider-thin nav-more" />

          {!isAuthenticated ? (
            <div className="auth-actions">
              <Button
                icon={<UserOutlined />}
                onClick={() => navigate("/login")}
                className="btn-login"
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                onClick={() => navigate("/register")}
                className="btn-register"
              >
                Đăng ký
              </Button>
            </div>
          ) : (
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
              <Space className="user-trigger">
                <Avatar src={urlAvatar} size={40} icon={<UserOutlined />} />
                <span className="user-email">{user?.email}</span>
                <DownOutlined />
              </Space>
            </Dropdown>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
