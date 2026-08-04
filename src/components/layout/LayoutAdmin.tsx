import React, { useEffect, useMemo, useState } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  HeartTwoTone,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Result,
  Space,
  Tag,
  type MenuProps,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import { logoutApi } from "@/services/api";
import "./layout.admin.scss";

type MenuItem = Required<MenuProps>["items"][number];
const { Content, Footer, Header, Sider } = Layout;
const { useBreakpoint } = Grid;

const getSelectedMenuKey = (pathname: string): string => {
  if (pathname.startsWith("/admin/user/customer")) return "users-customers";
  return "dashboard";
};

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith("/admin/user/customer")) return "Quản lý học viên";
  return "Tổng quan hệ thống";
};

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setIsAuthenticated, setUser, isAuthenticated } = useCurrentApp();

  const selectedMenuKey = useMemo(
    () => getSelectedMenuKey(location.pathname),
    [location.pathname]
  );

  const pageTitle = useMemo(
    () => getPageTitle(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Khoá scroll của body khi mở Drawer trên mobile để tránh scroll "xuyên" ra nội dung phía sau
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isMobile, mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      const res = await logoutApi();
      if (res.data) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: <Link to="/admin">Tổng quan</Link>,
      key: "dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: <span>Quản lý người dùng</span>,
      key: "users",
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/admin/user/customer">Học viên</Link>,
          key: "users-customers",
          icon: <TeamOutlined />,
        },
      ],
    },
    { type: "divider" },
    {
      label: "Các module Aliu Chinese",
      type: "group",
      children: [
        {
          label: "Quản lý khóa học (sẽ bổ sung)",
          key: "courses-coming-soon",
          icon: <BookOutlined />,
          disabled: true,
        },
        {
          label: "Quản lý từ vựng (sẽ bổ sung)",
          key: "vocabulary-coming-soon",
          icon: <ReadOutlined />,
          disabled: true,
        },
        {
          label: "Cấu hình hệ thống (sẽ bổ sung)",
          key: "settings-coming-soon",
          icon: <SettingOutlined />,
          disabled: true,
        },
      ],
    },
  ];

  const accountMenuItems: MenuProps["items"] = [
    { label: <Link to="/account">Quản lý tài khoản</Link>, key: "account" },
    { label: <Link to="/">Trang chủ</Link>, key: "home" },
    { type: "divider" },
    {
      label: (
        <button className="admin-account-menu__logout" type="button" onClick={handleLogout}>
          Đăng xuất
        </button>
      ),
      key: "logout",
      danger: true,
    },
  ];

  const avatarFileName = user?.avatar ?? "";
  const urlAvatar = avatarFileName
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${avatarFileName}`
    : undefined;

  const renderBrand = (compact = false) => (
    <button
      type="button"
      className={`admin-brand ${compact ? "admin-brand--collapsed" : ""}`}
      onClick={() => navigate("/admin")}
    >
      <span className="admin-brand__icon"><BookOutlined /></span>
      {!compact && (
        <span className="admin-brand__text">
          <strong>Aliu Admin</strong>
          <small>System Management</small>
        </span>
      )}
    </button>
  );

  const renderMenu = (mobile = false) => (
    <Menu
      className="admin-menu"
      mode="inline"
      selectedKeys={[selectedMenuKey]}
      defaultOpenKeys={["users"]}
      items={menuItems}
      inlineCollapsed={!mobile && collapsed}
      onClick={() => mobile && setMobileMenuOpen(false)}
    />
  );

  if (isAuthenticated === false) return <Outlet />;

  if (
    isAuthenticated === true &&
    location.pathname.includes("admin") &&
    user?.role === "CUSTOMER"
  ) {
    return (
      <div className="admin-forbidden-page">
        <Result
          status="403"
          title="403"
          subTitle="Xin lỗi! Bạn không có quyền truy cập trang này."
          extra={<Button type="primary" onClick={() => navigate("/")}>Về trang chủ</Button>}
        />
      </div>
    );
  }

  return (
    <Layout className="admin-layout">
      {!isMobile && (
        <Sider
          className="admin-sidebar"
          theme="light"
          width={272}
          collapsedWidth={84}
          collapsible
          trigger={null}
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          {renderBrand(collapsed)}
          <div className="admin-sidebar__label">
            {!collapsed && <span>MENU QUẢN TRỊ</span>}
          </div>
          {renderMenu(false)}
          {!collapsed && (
            <div className="admin-sidebar__support">
              <span className="admin-sidebar__support-icon"><BookOutlined /></span>
              <div>
                <strong>Aliu Chinese</strong>
                <small>Sẵn sàng mở rộng module HSK</small>
              </div>
            </div>
          )}
        </Sider>
      )}

      <Drawer
        className="admin-mobile-drawer"
        title={renderBrand(false)}
        placement="left"
        width="min(86vw, 310px)"
        open={isMobile && mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        destroyOnHidden
      >
        <div className="admin-mobile-drawer__label">MENU QUẢN TRỊ</div>
        {renderMenu(true)}
      </Drawer>

      <Layout className="admin-main-layout">
        <Header className="admin-header">
          <div className="admin-header__left">
            {isMobile ? (
              <Button
                type="text"
                className="admin-header__menu-button"
                icon={<MenuOutlined />}
                aria-label="Mở menu quản trị"
                onClick={() => setMobileMenuOpen(true)}
              />
            ) : (
              <Button
                type="text"
                className="admin-header__menu-button"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
                onClick={() => setCollapsed((value) => !value)}
              />
            )}

            <div className="admin-header__title">
              <span>Quản trị hệ thống</span>
              <strong>{pageTitle}</strong>
            </div>
          </div>

          <div className="admin-header__right">
            <Tag className="admin-header__role-tag" color="magenta">
              {user?.role ?? "ADMIN"}
            </Tag>
            <Dropdown menu={{ items: accountMenuItems }} trigger={["click"]}>
              <Space className="admin-account-trigger" size={10}>
                <Avatar
                  size={42}
                  src={urlAvatar}
                  icon={<UserOutlined />}
                  className="admin-account-trigger__avatar"
                />
                <span className="admin-account-trigger__info">
                  <strong>{user?.fullname || user?.email || "Administrator"}</strong>
                  <small>{user?.email || "Tài khoản quản trị"}</small>
                </span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content className="admin-content">
          <div className="admin-content__inner"><Outlet /></div>
        </Content>

        <Footer className="admin-footer">
          <span>Aliu Chinese System Management</span>
          <span>Phát triển với <HeartTwoTone twoToneColor="#ff5c8a" /></span>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;